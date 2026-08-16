# Place Insight 팩트 시트
저장소: place-insight | 분석일: 2026-08-16

> 이 문서의 모든 항목은 저장소 코드에서 직접 확인한 것이다. 추정·창작은 넣지 않았고, 확인하지 못한 항목은 "근거 없음"으로 표기했다.
> 저장소는 두 개의 백엔드로 구성된다. `place_growth_ai` (네이버 플레이스 분석, :8100), `market_ai` (상권·부동산 분석, :8000). 프론트엔드는 빌드 없는 바닐라 ES모듈(`platform/`).

---

## 1. 실제 파이프라인 단계

네이버 플레이스 URL·키워드 입력 → 실행 카드(액션) 출력까지 코드가 실제로 밟는 순서.

### 1) 플레이스 ID 추출
입력 URL에서 네이버 플레이스 ID를 파싱한다. 실패하면 `ValueError("invalid_place_url")`로 즉시 중단하고 추정하지 않는다.
- 근거: `place_growth_ai/backend/app/collectors/naver_url.py` (`extract_naver_place_id`), `naver_public_collector.py::collect_place_snapshot`

### 2) 대상 플레이스 SSR 2탭 수집
`m.place.naver.com/place/{id}/home` 과 `/feed` 두 탭의 HTML을 받아 Apollo state(`__APOLLO_STATE__`)를 추출한다. 각 요청은 최대 3회 재시도하며, 429/5xx만 일시 오류로 보고 `Retry-After` 헤더를 존중해 대기한다(없으면 0.75초 × 시도횟수).
- 근거: `naver_public_collector.py::_collect_place_detail`, `_request_text`, `_is_transient_status`, `_sleep_before_retry`

### 3) 7개 영역으로 정규화
Apollo state를 `home / news / menu / review / map / payment / photos` 7개 섹션으로 분해하고, 추가로 `improvement_flags`를 만든다. 소개글(intro)은 SSR HTML에서 별도로 추출해 덮어쓴다.
- 근거: `place_growth_ai/backend/app/collectors/naver_parser.py::assemble_sections` (parse_home / parse_news / parse_menu / parse_review / parse_map / parse_payment / parse_photos / improvement_flags)

### 4) 비교 가능한 feature로 가공
7개 섹션을 비교 지표 7묶음(`info / news / review / photo / keyword / function / location`)으로 환산한다. 여기서 업종 판정(메뉴 지표 적용 여부), 소식 발행 주기(`cadence`, 날짜 간격 평균), 이모지 사용률, 정보 완성도(8개 플래그 충족 비율) 등이 계산된다.
- 근거: `place_growth_ai/backend/app/collectors/features.py::build_features`

### 5) 추적 키워드 결정
사용자 지정 키워드가 있으면 그것을 쓰고, 없으면 주소 3번째 토큰(동 단위) + 카테고리로 후보를 만든다. 후보 키워드에 네이버 검색광고 API(검색량·경쟁도)와 데이터랩 API(추세)를 붙여 기회 점수를 매기고 정렬한다. 키워드를 못 구하면 **문자열을 지어내지 않고 `None`으로 남긴다**(§2 참조).
- 근거: `naver_public_collector.py::_guess_keyword`, `place_growth_ai/backend/app/engines/keyword_engine.py::build_candidates` / `_opportunity_score`, `integrations/naver_searchad.py`, `integrations/naver_datalab.py`

### 6) 검색 목록 수집 + 광고 제외 + 내 순위 산출
`pcmap.place.naver.com/place/list?query=<키워드>` SSR을 파싱해 결과 목록을 얻고, **광고 항목을 걸러낸 뒤** 순위를 1부터 다시 매긴다. 그 목록에서 내 플레이스 ID를 찾아 현재 순위를 확정한다.
- 근거: `naver_parser.py::parse_search_list`, `_is_ad_search_item`, `naver_public_collector.py::_rank_widget`

### 7) 상위 10곳 경쟁점 전체 재수집
걸러진 상위 10곳 각각에 대해 **2)~4)와 완전히 같은 경로로 다시 수집**한다(같은 SSR 2탭, 같은 파서, 같은 feature 함수). 개별 경쟁점 수집이 실패하면 그 항목만 `collection_status: "failed"`로 남기고 나머지는 계속 진행한다. HTTP 응답은 요청 캐시로 공유해 중복 호출을 막는다.
- 근거: `naver_public_collector.py::_collect_top_place_snapshots`, `TextCache` / `_request_cache_key`

### 8) 벤치마크 산출 (또는 "벤치마크 불가" 선언)
지표별로 상위 10곳 중 **해당 지표가 실제로 적용되고 값이 존재하는 업체만** 골라 평균을 낸다. 자기 자신(`is_target`)은 표본에서 제외한다. 표본이 0건이면 기본값으로 메우지 않고 `label: "벤치마크 불가"`, `value: None`, `status: "unavailable"`을 반환한다.
- 근거: `place_growth_ai/backend/app/engines/benchmark_engine.py::benchmark_for`, `_top_place_values`, `benchmark_status`

### 9) 격차(gap) 계산
`gap_value = max(0, benchmark - current)`, `gap_score = gap_value / benchmark`. **벤치마크 status가 `available`이 아니거나 표본 수가 0이면 그 지표는 격차 목록에서 통째로 제외**된다(0점 처리하지 않음).
- 근거: `place_growth_ai/backend/app/engines/gap_engine.py::build_metric_gaps`

### 10) 우선순위 점수 산정 + 등급화
5개 요소를 곱해 점수를 낸다: `axis_weight × gap_score × data_confidence × action_feasibility × trackability`. 점수를 높음/중간/낮음/관찰 4단계로 잘라 라벨을 붙인다.
- 근거: `place_growth_ai/backend/app/engines/priority_engine.py::score_gap`, `priority_label`

### 11) 실행 카드 생성 + 정렬
지표별로 제목·요약·현재값·기준값·부족 수치·달성률·근거 문장·실행 단계·확인 주기(7일/14일)·후속 확인 지표를 담은 액션 객체를 만들고, 우선순위 점수 내림차순으로 정렬해 반환한다. 부족 지표가 여러 개면 액션도 여러 개 나온다(개수 고정 안 함).
- 근거: `place_growth_ai/backend/app/engines/action_engine.py::build_actions`

### 12) LLM 문구 생성 (선택)
액션 객체를 그대로 넘겨 광고주용 제안 문구를 3문단으로 만든다. LLM에는 "입력에 없는 수치는 만들지 말 것", "단위 없는 숫자에 단위를 붙이지 말 것", "순위 상승을 보장한다고 말하지 말 것"이 시스템 지시로 박혀 있다.
- 근거: `place_growth_ai/backend/app/llm/provider.py::_system_instructions`, `_user_input`

### 13) 저장 + 슬롯 갱신 (스케줄 실행 시)
수집 작업 기록, 플레이스 스냅샷, 순위 스냅샷, 분석 실행, 액션 목록, 슬롯 업데이트를 한 번의 트랜잭션 묶음(`persist_collection_bundle`)으로 저장한다. 전일 순위가 없으면 저장소에서 직전 스냅샷을 찾아 변화량을 채운다.
- 근거: `place_growth_ai/backend/app/workers/daily_collection.py::_collect_slot`, `repositories/postgres.py::persist_collection_bundle`, `get_previous_keyword_rank_snapshot`

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것 ★가장 중요★

### 2-1. 경쟁점 표본이 없으면 벤치마크를 만들지 않는다
- **규칙**: 상위 10곳에서 그 지표의 실측값을 하나도 못 얻으면 기본 기준값(예: 메뉴 사진 75%)을 쓰지 않고 `"벤치마크 불가"` / `value: None` / `source: "benchmark_unavailable"` / `sample_count: 0`을 반환한다.
- **코드**: `engines/benchmark_engine.py::benchmark_for` — 표본 없을 때의 반환 딕셔너리.
- **연쇄 효과**: `gap_engine.py::build_metric_gaps`가 `benchmark.get("status") != "available"`인 지표를 `continue`로 건너뛰므로, 벤치마크 없는 지표는 액션 카드 자체가 생성되지 않는다. 테스트 `test_action_engine_skips_default_benchmarks_without_top10_samples`는 `actions == []`를 단언한다.
- **왜**: 카탈로그에 `benchmark_value=75` 같은 기본값이 정의돼 있으므로, 그냥 두면 경쟁점을 못 구한 날에도 그럴듯한 "75% 대비 50% 부족" 카드가 매일 나온다. 그 숫자는 이 매장의 실제 경쟁 상황과 무관하다.
- **근거 테스트**: `tests/test_place_growth_ai_engines.py::test_benchmark_engine_marks_missing_competitor_samples_as_unavailable`

### 2-2. 일부만 벤치마크 가능하면 그 사실을 별도로 표기한다
- **규칙**: 관측된 지표 전체가 불가면 `unavailable`, 일부만 불가면 `partial`, 해당 없으면 `not_applicable`. 불가 지표의 `metric_id` 목록을 그대로 붙여 내려보낸다.
- **코드**: `benchmark_engine.py::benchmark_status` → `daily_collection.py::_quality_with_benchmark_status`가 `data_quality`에 `benchmark_status`, `benchmark_unavailable_metric_ids`, `warnings: ["benchmark_unavailable"]`을 채운다.
- **왜**: "액션 0개"가 "완벽한 상태"인지 "비교할 데이터가 없는 상태"인지 구분해야 한다. 요약 문구도 갈린다 — `_analysis_summary`는 액션이 없을 때 benchmark_state가 `unavailable`/`partial`이면 "경쟁점 데이터가 없어 벤치마크를 계산할 수 없습니다.", 아니면 "현재 우선 실행할 부족 항목이 없습니다."를 쓴다.

### 2-3. 키워드를 못 구하면 자리표시자 문자열을 지어내지 않는다
- **규칙**: `_guess_keyword`가 실패하면 `None`을 반환한다. 과거에는 `"메인 키워드 확인 필요"` 같은 문자열을 넣었다.
- **코드**: `collectors/naver_public_collector.py` — `collect_place_snapshot` 안에 이 결정의 이유가 주석으로 박혀 있다: *"키워드를 못 구하면 자리표시자 문자열을 지어내지 않는다. 지어내면 그 문자열이 실제 검색 키워드가 되고 워커가 슬롯의 primary_keyword 로 저장해(daily_collection.py) 다음 날부터 영구히 그 문자열로 조회하게 된다(복구 경로 없음)."*
- **왜**: 가짜 값이 저장 계층까지 흘러가면 자기 복제한다. `None`으로 두면 상위 계층이 기존 키워드를 보존하고 SSR이 회복되면 다음 실행에서 자연 복구된다.
- **근거 테스트**: `tests/test_place_growth_ai_collector.py::test_empty_home_ssr_does_not_invent_a_placeholder_keyword`, `test_user_keyword_survives_empty_home_ssr`

### 2-4. "순위권 밖"과 "수집 장애"를 절대 같은 신호로 뭉치지 않는다 (오탐 방지)
- **규칙**: 내 순위를 못 찾았을 때 상위 목록(`top10`)이 **비어 있으면** `rank_list_empty`(수집 장애), **채워져 있으면** `rank_not_found`(정상, 순위권 밖).
- **코드**: `naver_public_collector.py::collect_place_snapshot` — 주석: *"검색 목록이 통째로 비었으면 '순위권 밖'이 아니라 수집 장애다(차단·구조변경). 실제 키워드는 항상 결과를 반환하므로 0건은 정상 상태가 아니며, 재시도 대상이다. 둘을 같은 경고로 뭉뚱그리면 매일 조용히 빈 채로 성공 처리된다."*
- **왜**: 두 상태의 대응이 정반대다. 순위권 밖은 재시도해도 무의미하고, 목록 자체가 빈 것은 재시도·경보 대상이다.
- **근거 테스트**: `tests/test_place_growth_ai_collector.py::test_empty_search_list_is_distinguished_from_being_out_of_rank`, `test_out_of_rank_reports_rank_not_found_without_list_empty`

### 2-5. 특정 경고는 "부분 성공"이 아니라 "실패"로 승격한다
- **규칙**: 상수 `_COLLECTION_FAILURE_WARNINGS = ("rank_list_empty", "home_ssr_empty")`에 해당하는 경고가 있으면 `partial`로 기록하지 않고 수집 작업을 `failed`로 확정한다.
- **코드**: `workers/daily_collection.py` 상단 상수 + `_collect_slot`의 `failure_warning` 분기. 주석: *"partial 로 기록하면 next_attempt_at 이 null 이라 재시도도 경보도 없이 매일 조용히 빈 채로 성공 처리된다. (…) home_ssr_empty 는 장소 기본정보 자체를 못 구한 것이라 스냅샷 전체가 무의미하고, place.name 자리표시자('플레이스 {id}')가 truthy 라 슬롯의 실상호까지 덮어쓴다."*
- 반대로 `rank_not_found`는 **의도적으로 이 목록에서 제외**되어 있다(정상 상태이므로 재시도 무의미).
- **왜**: 실패로 승격되어야 재시도 큐에 들어가고 텔레그램 경보가 나간다.

### 2-6. 수집 실패 시 운영자에게 즉시 알린다
- **규칙**: 수집 실패마다 매장명·키워드·사유·상세를 담은 텔레그램 알림을 보낸다. 알림 실패가 수집 처리를 막지 않도록 이중으로 감싼다.
- **코드**: `workers/daily_collection.py::_alert_collection_failure`, `notifications/telegram.py`. 서버 기동 실패도 마찬가지 — `main.py::create_app`은 fail-closed로 죽기 전에 `startup_failure` 알림을 먼저 보낸다.

### 2-7. 프로덕션에서 메모리 저장소·목(mock) 수집기로 뜨는 것을 원천 차단한다 (fail-closed)
- **규칙**: `runtime_profile == "service"`이면 다음 셋 중 하나라도 걸리면 **서버가 아예 기동하지 않는다**.
  - `repository_mode == "memory"` → `RuntimeError("service_runtime_requires_durable_repository")`
  - `auth_required == False` → `RuntimeError("service_runtime_requires_authentication")`
  - `collector_mode == "mock"` → `RuntimeError("service_runtime_disallows_mock_collector")`
- **코드**: `place_growth_ai/backend/app/main.py::_validate_runtime_safety`
- **왜**: 운영에서 목 수집기가 돌면 화면에는 정상적으로 보이지만 전부 가짜다. 조용한 오작동보다 기동 실패가 낫다는 판단.
- **추가**: `/health/ready`는 같은 조건에 더해 프로덕션에서 와일드카드 CORS, CAPTCHA 미설정, 인증 백엔드 미설정, 게시판 스토리지 미준비를 각각 `issues` 배열에 담고 **503**을 반환한다 (`main.py::ready_payload`).

### 2-8. 근거 축이 2개 미만이면 종합 점수를 내지 않는다 — "판단 보류" (상권 분석)
- **규칙**: 각 축 점수에 `value_kind` 를 `"calculated"`(실데이터) 또는 `"scenario"`(샘플/시나리오)로 표시한다. `calculated`인 축이 **2개 미만이면 종합 점수를 `None`으로, 등급을 `"판단 보류"`로** 반환하고 `missing_data`에 `score_evidence_insufficient`를 추가한다.
- **코드**: `market_ai/backend/app/services/scoring.py::ScoringEngine.calculate` (`evidence_scores` 필터 → `if len(evidence_scores) < 2: return active_scores, None, "판단 보류"`)
- **왜**: 샘플 데이터로 계산한 점수를 실측 점수와 같은 화면에 같은 폰트로 띄우면 이용자는 구분할 방법이 없다. 점수를 0으로 주는 것도 거짓(0점은 "나쁜 입지"라는 정보를 준다) — 아예 안 내는 쪽을 택했다.
- **근거 테스트**: `market_ai/backend/tests/test_data_truth.py::test_incomplete_or_sample_evidence_returns_judgment_hold_not_zero` (테스트 이름 자체가 "0점이 아니라 판단 보류").

### 2-9. 자동 매출 예측을 아예 제공하지 않는다
- **규칙**: `RevenueEstimator.estimate`는 입력이 무엇이든 `low=None, high=None, value_kind="unavailable"`과 경고 `"검증된 매출 근거가 없어 자동 예측을 제공하지 않습니다."`를 반환한다.
- **코드**: `market_ai/backend/app/services/revenue.py` — 주석: *"실제 매출은 업종별 객단가·회전율·영업시간·면적·비용 등 사용자 입력과 검증된 근거 없이는 자동 산출하지 않는다."*
- **왜**: 업종 프로파일(`upjong.json`)에 객단가·방문빈도 근사값이 실제로 들어 있으므로 산식을 돌리면 숫자는 나온다. 나오는데도 내보내지 않기로 한 결정.
- **근거 테스트**: `market_ai/backend/tests/test_data_truth.py::test_backend_does_not_generate_automatic_revenue_prediction`

### 2-10. 외부 API가 실패하면 샘플로 갈아끼우지 않는다
- **규칙**: 실서비스 모드(`allow_sample_fallback=False`)에서 상가정보 API가 죽으면 빈 목록 + `meta.quality = "failed"`를 반환하고 라이선스 메모에 "샘플"이라는 단어조차 넣지 않는다. 지오코딩도 "키 미설정"과 "검색 결과 없음"을 다른 경고로 구분한다(`kakao_geocoding_not_found`).
- **코드**: `market_ai/backend/app/collectors/store.py`, `services/geocoding.py`
- **근거 테스트**: `market_ai/backend/tests/test_no_sample_fallback.py::test_actual_mode_never_replaces_failed_store_api_with_sample`, `test_configured_kakao_with_no_match_is_not_reported_as_missing_key`

### 2-11. 부분 실패한 통계에서 결측 항목을 합성하지 않는다
- **규칙**: SGIS 인구 API가 일부만 응답하면 성별 분포·연령 분포를 추정으로 채우지 않고 **빈 딕셔너리 `{}` + quality `"partial"`**로 남긴다.
- **코드**: `market_ai/backend/app/collectors/population.py::_gender_dist`, `_age_dist`
- **근거 테스트**: `market_ai/backend/tests/test_data_truth.py::test_partial_sgis_details_never_insert_synthetic_gender_or_age`

### 2-12. 데이터 사용 권리가 확인 안 된 출처는 리포트에서 배제한다 (권리 게이트)
- **규칙**: 출처별 `rights_status`가 `allowed` 또는 `allowed_if_license_confirmed`일 때만 리포트에 쓴다. 아니면 `missing_data`에 `rights_not_cleared:<source_id>`를 남기고 그 출처를 제외한다.
- **코드**: `market_ai/backend/app/services/data_rights.py::CollectorGate.require_allowed`, `ALLOWED_FOR_REPORT`, `DataRightsRegistry.status_for` (**미등록 출처는 기본값 `review_required`** — 화이트리스트 방식)
- 제외가 발생하면 현장 점검 체크리스트에 "사용 조건이 확인되지 않은 외부 자료는 제외했으므로 필요 시 공식 사용 조건을 재확인" 항목이 자동으로 추가된다 (`services/orchestrator.py::_field_checklist`).

### 2-13. LLM 출력에서 단정·보장 표현을 사후 치환한다
- **규칙**: 생성된 리포트 텍스트에서 `BLOCKED_PHRASES = ["성공 보장", "확실히 성공", "반드시 성공", "예측됩니다", "무조건", "대박"]`을 전부 `"참고 판단"`으로 치환한다. 프롬프트 규칙만 믿지 않고 출력단에서 한 번 더 거른다.
- **코드**: `market_ai/backend/app/services/llm.py` (`BLOCKED_PHRASES`, `_sanitize`), SYSTEM_PROMPT 규칙 1·2·4·5번
- 프롬프트 규칙 원문: *"JSON에 없는 수치·통계·지명·브랜드·상호를 지어내지 마라"*, *"종합 점수가 없으면 판단을 보류하고, 임의 점수나 매출 범위를 만들지 마라"*, *"시나리오 데이터와 계산값을 실측값처럼 표현하지 말고, 누락된 데이터의 한계를 반드시 짚어라"*.

### 2-14. 미확인 입력을 "안전"으로 계산하지 않는다 (계약 위험 점검, 3진 논리)
- **규칙**: 계약 위험 체크 입력은 `True / False / None` 3진값이다. `False`(위험 확인)는 감점 규칙을 만들고, **`None`(미확인)은 `unknown_checks` 배열에 쌓아 별도 표시**하며 점수에서 `min(len(unknown) × 3, 18)`만큼 추가 차감한다. `None`을 통과로 취급하지 않는다.
- **코드**: `market_ai/backend/app/property/contract.py::ContractRiskService.evaluate`, `_check`
- 위험 신호가 하나도 없어도 `"입력 항목에서 즉시 중단 신호 없음"`이라는 low 등급 항목을 강제로 넣고 권고 문구는 *"확인하지 않은 항목과 원본 증빙을 모두 확인한 뒤 판단하세요."*다. "안전합니다"라고 말하지 않는다.
- 응답에 `excluded: ["유료 권리조회 자동화", "신용·개인정보 조회", "법률 판단 자동화"]`로 **이 도구가 하지 않는 일**을 명시한다.
- 보증 가입 판정도 `eligible_hint`는 blocker와 unknown이 **둘 다** 0일 때만 `True`이며, `disclaimer: "보증기관의 실제 심사를 대신하지 않으며, 승인 여부를 보장하지 않습니다."`가 항상 붙는다.

### 2-15. 순위 스냅샷 2건 미만이면 추세를 말하지 않는다 (프론트엔드)
- **규칙**: 실제 순위 스냅샷이 2건 미만이면 "상승/하락" 문구 대신 `"실제 순위 스냅샷이 N건이라 추세 판단을 보류합니다."`를 출력하고, 섹션 제목도 "순위 추이" → "현재 순위"로 바꾼다.
- **코드**: `platform/place/app.js` (`rankSampleCount` 계산부와 `aiReportBodyMarkup`의 `rankSentence`)

### 2-16. 메뉴 없음과 메뉴 사진 0장을 구분한다
- **규칙**: `menu_photo_rate`는 메뉴가 있고 업종이 메뉴 지표 대상일 때만 계산하고, 아니면 `None`. 코드 주석: *"No menu is not the same thing as a menu with zero photos."*
- **코드**: `collectors/features.py::_photo_features`

---

## 3. 도메인 판단이 박혀 있는 지점 (플레이스·로컬 마케팅 노하우) ★가장 중요★

### 3-1. 벤치마크 표본 = 광고 제외 상위 10곳
- **무엇**: 기준값을 업계 평균이나 고정 수치가 아니라 **그 키워드로 지금 검색했을 때 실제로 상위에 뜨는 10곳**의 평균으로 잡는다.
- **왜 광고 제외인가 (코드)**: `_is_ad_search_item`이 10개 플래그 키(`ad`, `isAd`, `isAdvertisement`, `advertisement`, `hasAd`, `isPaid`, `adType`, `adLabel`, `adInfo`, `adId`)와 6개 문자열 값(`ad`, `ads`, `advertisement`, `paid`, `sponsored`, `powerlink`)을 검사한다. 필드명이 여러 개인 이유는 네이버 응답 구조가 일정하지 않기 때문. 광고를 뺀 뒤 순위를 1부터 **다시 매긴다**.
- **판단의 실질**: 광고로 올라온 업체는 "돈을 얼마나 썼는가"의 결과이지 "플레이스를 얼마나 잘 관리했는가"의 결과가 아니다. 광고를 섞으면 사장님이 따라 할 수 없는 기준이 된다.
- **왜 상위 10곳인가**: 설계 문서에 명시 — *"숫자 지표: 상위 10개 평균값을 기본으로 사용한다"*, *"불리언 지표: 상위 10개 중 60% 이상이 보유하면 `required_by_competition=true`"*.
- **근거**: `collectors/naver_parser.py::_is_ad_search_item`, `parse_search_list`, `docs/OPTIMIZATION_SIGNAL_MODEL.md` "기준값" 표

### 3-2. 자기 자신을 표본에서 뺀다
- **무엇**: 상위 10곳에 내 매장이 포함돼 있으면 평균 계산에서 제외한다 (`if snapshot.get("is_target"): continue`).
- **왜**: 내 값이 평균에 들어가면 격차가 축소된다. 이미 5위인 매장은 "부족하지 않다"는 결론이 나온다.
- **근거**: `engines/benchmark_engine.py::_top_place_values`

### 3-3. 업종별 지표 자동 분리 — 메뉴 지표를 쓸 업종과 안 쓸 업종
- **무엇**: 네이버는 유료 상품·이용권·룸·서비스를 모두 같은 `Menu` 객체로 노출한다. 코드 주석: *"Only food-service categories should receive menu-photo recommendations. Everything else is evaluated using owner/business photos."*
- **제외 목록 (27개, `_MENU_EXCLUDED_CATEGORY_TERMS`)**: 스터디카페, 장소대여, 공간대여, 공유오피스, 병원, 의원, 학원, 교육, 미용, 헤어, 네일, 숙박, 호텔, 모텔, 펜션, 부동산, 사진관, 체육관, 헬스장, 필라테스, 요가, 세차, 정비, 웨딩, 장례, 법률, 세무
- **포함 목록 (25개, `_MENU_CATEGORY_TERMS`)**: 음식, 식당, 레스토랑, 카페, 베이커리, 빵집, 디저트, 치킨, 피자, 분식, 국수, 고기, 한식, 중식, 일식, 양식, 주점, 술집, 바, 뷔페, 김밥, 햄버거, 족발, 보쌈, 샤브샤브
- **판정 순서**: 제외 목록이 **먼저** 걸린다. "스터디카페"는 "카페"를 포함하지만 제외 목록에 먼저 걸려 메뉴 지표 대상이 아니다. 공백을 제거하고 부분 문자열로 매칭한다.
- **결과 분기**: `photo_metric_mode`가 `"menu"`면 메뉴 사진 등록률·등록 메뉴 수 액션이 나가고, `"business_photo"`면 업체 대표사진 액션이 나간다. 두 액션은 `applicability` 필드로 상호 배타적으로 적용된다.
- **근거**: `collectors/features.py::_is_menu_category`, `_photo_features`, `engines/signal_catalog.py::signal_is_applicable`, 테스트 `tests/test_place_growth_ai_engines.py::test_non_menu_categories_use_business_photo_action_and_skip_menu_actions`

### 3-4. 우선순위는 "격차 크기"가 아니라 5개 요소의 곱
- **산식**: `axis_weight × gap_score × data_confidence × action_feasibility × trackability`
- **각 요소의 의미** (설계 문서 표):
  - `axis_weight` — 알고리즘 축 비중 (제품 내부 가중치, 네이버 실제 점수 아님)
  - `gap_score` — 상위권 대비 부족 정도
  - `data_confidence` — 수집 성공률과 확인 가능 여부
  - **`action_feasibility` — "사장님이 오늘/이번 주 실행 가능한 정도"**
  - **`trackability` — "실행 후 7일/14일 뒤 같은 지표로 확인 가능한 정도"**
- **판단의 실질**: 뒤의 두 요소가 마케터 판단이다. 격차가 아무리 커도 사장님이 실행할 수 없거나(예: 리뷰 200건 확보) 실행 후 확인할 수 없으면 우선순위가 내려간다. 실제로 리뷰 지표는 축 비중이 가장 높은데도(0.11) `action_feasibility`가 가장 낮게(0.65) 설정돼 있어 최우선으로 올라오지 않는다.
- **근거**: `engines/priority_engine.py::score_gap`, `docs/OPTIMIZATION_SIGNAL_MODEL.md` "우선순위 계산"

### 3-5. 우선순위 등급 임계값
| 점수 | 라벨 | 표시 |
|---|---|---|
| ≥ 0.04 | `high` | 높음 |
| ≥ 0.02 | `medium` | 중간 |
| > 0 | `low` | 낮음 |
| = 0 | `monitor` | 관찰 |
- 액션 배열은 `priority_score` 내림차순으로 정렬해 반환한다.
- **근거**: `engines/priority_engine.py::priority_label`, `engines/action_engine.py::build_actions` 말미의 `sorted(...)`

### 3-6. 지표별 실행 난이도·추적성 수치 (마케터가 손으로 매긴 값)
| metric_id | 축 | 축 비중 | 실행 난이도 | 추적성 |
|---|---|---:|---:|---:|
| `review.visitor_total` | 리뷰 신뢰도 | 0.11 | 0.65 | 0.8 |
| `menu.photo_rate` | 활성도·최신성 | 0.10 | 0.9 | 0.9 |
| `photo.business_count` | 활성도·최신성 | 0.10 | 0.9 | 0.9 |
| `menu.menu_count` | 적합도 | 0.08 | 0.8 | 0.9 |
| `news.count` | 활성도·최신성 | 0.07 | 0.75 | 0.8 |
| `function.channels` | 기능 활용 | 0.06 | 0.7 | 0.7 |
- **근거**: `engines/signal_catalog.py::SIGNALS`

### 3-7. 지표 채택 기준 — 4개 조건을 모두 만족해야 액션 근거가 된다
설계 문서가 정한 게이트: **수집 가능**(공개 페이지·SSR·검색광고 API에서 얻을 수 있음) + **비교 가능**(상위 10개를 같은 방식으로 수집 가능) + **추적 가능**(7일/14일 뒤 재수집해 변화 확인 가능) + **액션 연결 가능**(부족을 채울 구체적 실행 방법 존재).

**의도적으로 배제한 지표와 이유**:
| 제외 데이터 | 이유 |
|---|---|
| 실제 CTR | 공개 데이터로 직접 수집 불가 |
| 체류시간, 스크롤 깊이 | 공개 데이터로 직접 수집 불가 |
| 전화 클릭 수, 길찾기 실행 수 | 계정 연동 없이는 수집 불가 |
| 예약·주문 전환율 | 계정 연동 없이는 수집 불가 |
| 로그인 기반 재방문 데이터 | 계정 연동 없이는 수집 불가 |
| 혜택알림받기 구독자 수 | 공개 비교 수집 불가 |

핵심 원칙 원문: *"네이버 공식 알고리즘을 단정하지 않는다. 알고리즘 가설은 우선순위 가중치로만 사용한다. 수집할 수 없는 데이터는 액션 산정 근거에서 제외한다."* 그리고 *"수집 불가능한 데이터는 없는 것으로 단정하지 않는다"* — 상세 화면에서 `unobservable` / `account_required`로 표시할 수는 있지만 점수 계산에는 넣지 않는다.
- **근거**: `docs/OPTIMIZATION_SIGNAL_MODEL.md`, `docs/naverplace_algorithms/README.md`

### 3-8. 7개 수집 영역의 구성
`home`(기본정보·소개글·링크·영업시간·예약/스마트콜) / `news`(소식) / `menu`(메뉴) / `review`(방문자·블로그 리뷰, 평점, 리뷰 키워드) / `map`(지하철 도보시간·주차) / `payment`(결제 수단) / `photos`(유형별 사진 수). 여기서 파생되는 feature 묶음도 7개(`info / news / review / photo / keyword / function / location`).
- 각 영역이 액션으로 연결되는 통로가 실제로 존재한다: photo→메뉴사진·대표사진, news→소식 수, review→방문자 리뷰, home/links→연결 기능 수.
- **근거**: `collectors/naver_parser.py::assemble_sections`, `collectors/features.py::build_features`

### 3-9. 확인 시점 = 7일 / 14일
모든 액션 카드에 `check_after_days: [7, 14]`가 고정으로 붙고, 지표별 `follow_up_metrics`(다시 볼 지표 2개)가 함께 나간다. LLM 문구도 세 번째 문단에 "실행 후 7일 기준으로 확인할 변화"를 쓰도록 지시받는다.
- 순위 지표는 전일/7일/14일 변화량을 함께 본다(설계 문서).
- **근거**: `engines/action_engine.py::build_actions`, `engines/signal_catalog.py`의 `follow_up_metrics`, `llm/provider.py::_system_instructions`, `docs/OPTIMIZATION_SIGNAL_MODEL.md`

### 3-10. 키워드 기회 점수 — 일반명사에 페널티
100점 만점을 6개 성분으로 합산하고 2종 페널티를 뺀다.
| 성분 | 배점 | 산식 |
|---|---:|---|
| 적합도(fit) | 55 | 지역·카테고리·메뉴·리뷰어 매칭 가산 |
| 검색량(volume) | 15 | `min(log10(v+1)/5, 1) × 15` (로그 스케일) |
| 모바일 비중 | 5 | `mobile/total × 5` |
| 경쟁도 | +10 ~ -8 | low +10 / mid +5 / high **-8** |
| 추세 | +10 ~ -8 | up +10 / flat +3 / down **-8** |
| 계절성 | 5 | 0~1 정규화 × 5 |
| **페널티: 일반 키워드** | **-8** | 아래 12개 목록에 해당 시 |
| **페널티: 상호명 키워드** | **-10** | 키워드가 업체명 자체일 때 |
- **일반 키워드 목록 (12개)**: 맛집, 카페, 음식점, 병원, 피부과, 피부관리, 미용실, 네일, 파스타, 한식, 일식, 중식
- **판단의 실질**: "맛집"처럼 검색량은 크지만 지역 수식어가 없는 키워드는 로컬 사업자가 잡을 수 없다. 상호명 키워드는 이미 1위라 추적해도 배울 게 없다. 둘 다 검색량 만점(15)보다 큰 감점(-8, -10)을 받아 상위로 올라오지 못한다.
- **적합도 가산 세부**: 메뉴명 매칭 +0.12 (가장 큼), 지역명 +0.08, 카테고리 +0.08, 리뷰 키워드 +0.05, 사용자 지정 +0.08. 상·하한 0.35~0.98로 클램프.
- **근거**: `engines/keyword_engine.py::_opportunity_score`, `_keyword_penalty`, `_generic_keywords`, `_fit_score`

### 3-11. 폴백 키워드 = 주소의 동 단위 + 카테고리
`address.split()[2]`(3번째 토큰 = 동/읍/면)와 카테고리 첫 항목을 조합한다. 시·도나 전체 주소를 쓰지 않는 이유는 플레이스 검색이 동 단위로 일어나기 때문. 조합이 불가능하면 카테고리만, 그것도 없으면 `None`.
- **근거**: `collectors/naver_public_collector.py::_guess_keyword`

### 3-12. 매일 07시(KST) 수집 — 중복 실행 방지 설계
- 스케줄 시각은 `hour=7, minute=0`, 타임존 `Asia/Seoul` 고정. `next_run_at`이 다음 실행 시각을 계산하고, 30초 단위로 쪼개 대기한다(프로세스 종료 신호에 빠르게 반응하기 위함).
- **여러 API 인스턴스가 동시에 떠 있어도 같은 매장을 두 번 수집하지 않는다**: DB 큐에서 `FOR UPDATE SKIP LOCKED`로 작업을 클레임한다. 워커 ID는 `호스트명-PID-랜덤8자`.
- 서버가 07시에 죽어 있었어도 복구된다: 현재 시각이 07:00을 지났으면 `startup_recovery` 사유로 그날 작업을 큐에 넣고, 멈춘 작업은 `recover_stale_daily_collection_runs`로 회수한다.
- 실패한 슬롯 하나가 전체를 멈추지 않는다: 슬롯별로 예외를 잡아 `worker_exception`으로 기록하고 다음 슬롯으로 넘어간다.
- **근거**: `workers/daily_scheduler.py::DailyCollectionScheduler` (`run_queue_cycle`, `_process_claimed_run`, `next_run_at`), `workers/daily_collection.py::run_once`

### 3-13. 업종별 상권 기준값 11종 (상권 분석)
업종마다 목표 연령 비중·포화 밀도·객단가·월 방문수·상권 포착률이 다르게 정의돼 있다.
| 업종 | 20~30대 기준 비중 | 포화 밀도 기준(인구 1천명당) | 객단가 | 월 방문수 |
|---|---:|---:|---:|---:|
| 스터디카페 | 40% | 0.5 | 8,000원 | 6회 |
| 카페 | 38% | 0.9 | 5,500원 | 5회 |
| 제과점 | 32% | 0.6 | 7,000원 | 4회 |
| 치킨 | 32% | 0.5 | 20,000원 | 1.5회 |
| 피자 | 32% | 0.4 | 22,000원 | 1.2회 |
| 분식 | 32% | 0.7 | 8,000원 | 3회 |
| 한식(백반) | 30% | 1.0 | 9,000원 | 4회 |
| 고깃집 | 32% | 0.6 | 30,000원 | 1회 |
| 편의점 | 28% | 1.5 | 6,000원 | 12회 |
| 미용실 | 30% | 0.8 | 25,000원 | 0.8회 |
| 약국 | 26% | 0.5 | 12,000원 | 1.5회 |
- 업종 소분류 코드(예: `R10202` 스터디카페, `I21201` 카페) 11개가 프로파일에 매핑돼 있고, 매핑에 없으면 기본 프로파일(`cafe`)로 떨어진다.
- 파일 메타에 `"status": "experimental"`과 *"공개 통계와 업종 평균을 참고한 근사 초기값이다(실측 아님, 참고용)"*가 명시돼 있다.
- **근거**: `market_ai/backend/app/profiles/upjong.json`, `services/profiles.py::get_profile`, `resolve_profile_id`

### 3-14. 계약 유형별 위험 규칙과 감점 폭 (부동산)
| 위험 | 등급 | 감점 |
|---|---|---:|
| 계약 상대방 권한 불일치 | critical | 32 |
| 보증금·선순위 금액 과다 (시세 대비 ≥ 90%) | critical | 32 |
| 위반건축물 확인 | high | 22 |
| 건축물 용도 불일치 | high | 20 |
| 전입신고 제약 (전세·월세) | high | 20 |
| 보증금 회수 여력 주의 (시세 대비 ≥ 70%) | high | 20 |
| 확정일자 취득 제약 (전세·월세) | high | 18 |
| 체납 확인 미완료 | medium | 10 |
| 중개사 등록 상태 확인 필요 | medium | 10 |
- 최종 등급: 80점 이상 `low`, 60점 이상 `caution`, 미만 `high`.
- 전입신고·확정일자 규칙은 **전세·월세일 때만** 적용된다(상가 임대차·매매에는 대항력 개념이 다르므로).
- 계약 유형 4종(상가 임대차 / 전세 / 월세 / 매매) × 3구간(확인 서류 5개 / 특약 4개 / 계약 후 할 일 4개)의 체크리스트가 하드코딩돼 있다.
- **근거**: `market_ai/backend/app/property/contract.py::SUPPORT_CONTENT`, `ContractRiskService.evaluate`

### 3-15. 공공데이터 출처별 권리 상태를 개별 판정
10개 출처 각각에 `rights_status`, `license_type`, `attribution_text`, `can_store_summary` / `can_display_report` / `can_use_commercially` 3개 플래그, 검토 메모, 검토 일자가 붙어 있다. 판단이 출처마다 다르다:
- 프랜차이즈 평균매출(`franchise_api`) → `review_required` + 3개 플래그 전부 `False`. 메모: *"가명정보 승인 여부와 재가공/리포트 판매 가능 여부 확인 전 제외"*
- VWorld(`vworld`) → 메모: *"사용조건 확정 전 PNU와 좌표는 저장하지 않음"* (`can_store_summary: False`)
- 청약홈(`subscription`) → 메모: *"청약 경쟁률은 매매·임대 가격 예측값으로 사용하지 않음"*
- 건축HUB(`building_hub`) → 메모: *"원문 대장을 저장하지 않고 조회 결과의 기본 항목만 표시"*
- 실거래가(`molit_trade`) → 메모: *"법정동 5자리와 계약년월 기준의 신고자료이며 시세·감정가가 아님"*
- **근거**: `market_ai/backend/app/repositories/data_rights.py::DEFAULT_RIGHTS`

---

## 4. 검증 가능한 숫자

| 항목 | 값 | 근거 |
|---|---:|---|
| 플레이스 수집 영역 | **7개** (home / news / menu / review / map / payment / photos) | `naver_parser.py::assemble_sections` |
| 파생 feature 묶음 | **7개** (info / news / review / photo / keyword / function / location) | `features.py::build_features` |
| 벤치마크 표본 | **광고 제외 상위 10곳** (자기 자신 제외) | `naver_public_collector.py::_collect_top_place_snapshots`, `benchmark_engine.py::_top_place_values` |
| 광고 판별 플래그 키 | **10개** / 광고 문자열 값 **6개** | `naver_parser.py::_is_ad_search_item` |
| 최적화 지표(SIGNALS) | **6개** | `engines/signal_catalog.py` |
| 우선순위 등급 | **4단계** (높음 ≥0.04 / 중간 ≥0.02 / 낮음 >0 / 관찰 =0) | `engines/priority_engine.py::priority_label` |
| 우선순위 산식 요소 | **5개 곱** | `engines/priority_engine.py::score_gap` |
| 업종 메뉴지표 제외 키워드 | **27개** | `features.py::_MENU_EXCLUDED_CATEGORY_TERMS` |
| 업종 메뉴지표 포함 키워드 | **25개** | `features.py::_MENU_CATEGORY_TERMS` |
| 키워드 페널티 대상 일반명사 | **12개** (-8점), 상호명 키워드 -10점 | `keyword_engine.py::_generic_keywords`, `_keyword_penalty` |
| 키워드 후보 최대 개수 | **5개** | `keyword_engine.py::build_candidates` |
| 수집 주기 | **매일 07:00 KST** (Asia/Seoul) | `workers/daily_scheduler.py` (`hour=7, minute=0`) |
| 액션 확인 시점 | **7일 / 14일** | `engines/action_engine.py` (`check_after_days: [7, 14]`) |
| SSR 요청 재시도 | **최대 3회** (429·5xx만, Retry-After 존중) | `naver_public_collector.py::_request_text` |
| 데이터 신뢰도 값 | 정상 **0.88** / 경고 있음 **0.72** | `naver_public_collector.py::collect_place_snapshot` |
| 공공데이터 권리 등록 출처 | **10개** (실외부 9 + 샘플 1) | `repositories/data_rights.py::DEFAULT_RIGHTS` |
| 국토부 실거래 엔드포인트 | **7개** (아파트 매매/전월세, 연립·다세대, 단독·다가구, 오피스텔 매매/전월세, 상업·업무용) | `property/sources.py::MOLIT_ENDPOINTS` |
| 상권 업종 프로파일 | **11종** + 업종코드 매핑 11개 | `profiles/upjong.json` |
| 상권 종합점수 성립 조건 | 실측 근거 축 **2개 이상** | `services/scoring.py` |
| 상권 등급 구간 | 우수 ≥80 / 양호 ≥65 / 보통 ≥50 / 주의 <50 / **판단 보류(근거 부족)** | `services/scoring.py::grade_for` |
| 계약 유형 | **4종** × 서류 5 · 특약 4 · 사후 4 항목 | `property/contract.py::SUPPORT_CONTENT` |
| 계약 위험 규칙 | **9개** (critical 2 / high 4 / medium 2 / low 1) | `property/contract.py::evaluate` |
| LLM 금지 표현 사후 치환 | **6개 구** | `market_ai/.../services/llm.py::BLOCKED_PHRASES` |
| 프로덕션 기동 차단 조건 | **3개** (memory 저장소 / 인증 off / mock 수집기) | `place_growth_ai/.../main.py::_validate_runtime_safety` |
| 순위 추세 판단 최소 스냅샷 | **2건** | `platform/place/app.js` |

---

## 5. 일반 접근과의 대조

**"플레이스 순위를 일반 순위 조회 도구로 보면" — 3단계**
1. 키워드를 입력한다.
2. 검색 결과에서 내 업체 순위를 찾는다.
3. 몇 위인지 기록한다.

→ 나오는 결과: 숫자 하나("12위"). 광고가 섞여 있어도 그대로 세고, 왜 12위인지는 알 수 없고, 무엇을 해야 하는지도 모른다. 어제와 비교할 기준도 없다.

**"Place Insight는" — 13단계** (§1 참조)

핵심 차이 5가지:
1. **경쟁점을 같은 깊이로 재수집한다** — 상위 10곳 각각에 대해 내 매장과 동일한 SSR 2탭 수집 + 동일 파서 + 동일 feature 함수를 돌린다. 순위 목록만 긁는 것과 근본적으로 다르다 (§1-7).
2. **광고를 걸러내고 순위를 다시 매긴다** — 10개 플래그 키를 검사한다. 광고 포함 순위는 따라 할 수 없는 기준이기 때문 (§3-1).
3. **비교할 데이터가 없으면 카드를 만들지 않는다** — 기본 벤치마크 값이 코드에 정의돼 있는데도 표본 없으면 쓰지 않는다. 그냥 만들면 매일 그럴듯한 카드가 나온다 (§2-1).
4. **업종을 보고 어떤 지표를 적용할지 갈아 끼운다** — 스터디카페에 "메뉴 사진을 찍으세요"를 보내지 않는다 (§3-3).
5. **우선순위에 실행 가능성과 추적 가능성을 곱한다** — 격차가 가장 큰 항목이 아니라, 사장님이 이번 주에 실제로 할 수 있고 7일 뒤 확인할 수 있는 항목이 위로 온다 (§3-4).

---

## 6. 규모 지표

| 항목 | 값 |
|---|---|
| 커밋 수 | **183** (GitHub API 페이지네이션 기준) |
| 추적 파일 수 | **355** |
| 전체 코드·문서 라인 | **78,564** |
| Python | 170파일 / **31,908줄** (백엔드 2종) |
| Markdown 문서 | 63파일 / **18,412줄** |
| JavaScript | 37파일 / **10,193줄** (빌드 없는 바닐라 ES모듈 프론트엔드) |
| CSS | 11파일 / **9,112줄** |
| SQL | 12파일 / **3,082줄** (Supabase 마이그레이션 12개) |
| 테스트 파일 | **58개** / 테스트 함수 **474개** |
| GitHub 언어 비중 | Python 1,351,709 B · JavaScript 420,383 B · CSS 206,180 B · PLpgSQL 133,279 B · HTML 51,949 B · PowerShell 14,844 B · Shell 6,247 B · Dockerfile 1,623 B |
| 저장소 생성 → 최종 푸시 | 2026-07-08 → 2026-07-21 (**13일**) |
| 주 언어 | Python (FastAPI, 백엔드 2개) |
| CI | GitHub Actions 4잡 — `test`(memory/auth-off) · `a1-regression`(보안 게이트) · `a3-postgres-auth`(실 Postgres로 격리·quota·rollback 검증) · `containers`(이미지 빌드). 근거: `.github/workflows/ci.yml`, `CLAUDE.md` |

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

**실제 고객사·업체명**: 없음. 코드·테스트 픽스처의 업체명은 전부 가상(`연남 생면파스타`, `경쟁 파스타`)이거나 데모용(`platform/demo/demo.js`의 `@place-insight.demo` 계정)이다.

**비밀키**: 저장소에 커밋된 키·토큰·비밀번호는 **없음**. `.env.example` 계열 3개만 추적되고 실제 `.env`는 gitignore. `CLAUDE.md`가 "이 파일에 실제 값을 절대 넣지 않는다"고 명시하며 키 이름만 나열한다.

**개인정보 (본문 사용 금지)**:
- 소유자 개인 이메일 `9843ohs@gmail.com` — `CLAUDE.md`, 여러 HANDOFF 문서, `tests/test_migrate_supabase_master.py`에 마스터 계정으로 등장.
- 별도 계정 이메일 1건이 `docs/HANDOFF_2026-07-17_DEPLOY_STATE_VERIFICATION.md`에 등장.
- 발신 주소 `noreply@tickpoint.co.kr` (AWS SES).

**인프라 식별자 (본문 사용 금지)**: EC2 탄력적 IP `43.201.222.22`, Supabase 프로젝트 ref `osxpvgeeewzfaaiarxea`, SSH 키 경로 `C:/Users/PC/Downloads/fixup-insight-prod.pem`. 전부 `CLAUDE.md`에 있다. 공개 도메인 `place.mktinsight.kr`은 공개 정보이므로 사용 가능.

**네이버 약관 민감 사항** — 표현에 주의가 필요한 부분:
- 수집 경로가 네이버 공개 SSR 페이지(`m.place.naver.com`, `pcmap.place.naver.com`)를 브라우저 User-Agent로 요청해 `__APOLLO_STATE__`를 파싱하는 방식이다. "크롤링/스크래핑" 표현보다 저장소가 쓰는 용어("공개 페이지 수집", `NaverPublicCollector`)를 그대로 쓰는 편이 안전하다.
- **네이버 공식 알고리즘을 재현했다고 절대 쓰면 안 된다.** 저장소 자체가 이를 명시적으로 금지한다: *"네이버 공식 알고리즘을 단정하지 않는다. 알고리즘 가설은 우선순위 가중치로만 사용한다"*, *"알고리즘 비중은 네이버의 실제 점수를 재현하기 위한 값이 아니라 (…) 제품 내부 가중치로 사용합니다"* (`docs/OPTIMIZATION_SIGNAL_MODEL.md`, `docs/naverplace_algorithms/README.md`).
- 순위 상승 보장 문구 금지가 LLM 프롬프트에 명시돼 있다. 포트폴리오 카피도 같은 선을 지켜야 한다.

**미완성·실험 상태로 표시된 기능** (확정 사실처럼 쓰면 안 됨):
- 업종 프로파일: `"status": "experimental"`, `"실측 아님, 참고용"` (`profiles/upjong.json`).
- 상권 분석 축: 가중치 표에는 `demand_supply`·`foot_traffic`·`stability` 3축이 정의돼 있으나 `ScoringEngine.calculate`는 `population_fit`·`competition` 2축만 계산한다. 테스트가 나머지 3축 부재를 명시적으로 단언한다. **"5축 채점"이라고 쓰면 안 된다.**
- 자동 매출 예측: 의도적으로 미제공 (`revenue.py`).
- 공개 가입: 2026-07-20 시점 CLOSED (`PLACE_INSIGHT_SIGNUP_ENABLED=0`). "누구나 가입 가능한 서비스"로 쓰면 안 된다.
- 데이터 권리: 대부분의 출처가 `allowed_if_license_confirmed`(조건 확인 필요) 상태이고 프랜차이즈 평균매출은 `review_required`로 배제 중이다. "공공데이터 N종 전면 활용"이 아니라 "권리 검토를 거쳐 선별 활용"이 정확하다.
- README의 Vercel 데모 URL(`place-insight-live.vercel.app`)은 **더 이상 존재하지 않는다** — Vercel 프로젝트는 2026-07-20 삭제됐고 현재 유효한 주소는 `https://place.mktinsight.kr` 하나뿐이다 (`CLAUDE.md`). README가 이 변경을 반영하지 못한 상태이니 README의 URL을 인용하면 안 된다.
