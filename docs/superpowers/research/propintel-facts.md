# PropIntel AI 팩트 시트
저장소: propintel-ai | 분석일: 2026-08-16

> 모든 항목은 클론한 저장소의 실제 코드에서 확인한 것만 기록했다. 추측·창작 없음.
> 파일 경로는 저장소 루트 기준.

---

## 1. 실제 파이프라인 단계

### A. 계약 사기 검증 파이프라인 (주소 진단 → 종합 위험도)

`propintel-api/app/services/contract/address_diagnosis_service.py`의 `AddressDiagnosisService.diagnose()`가
6단계를 순서대로 실행한다 (`diagnose()` 본문의 주석 번호 1~6과 일치).

| # | 단계 | 코드가 실제로 하는 일 | 근거 파일 |
|---|---|---|---|
| 1 | 등기부등본 조회 | 14자리 부동산 고유번호로 CODEF OAuth 토큰 발급 → `check_status()` 호출. 고유번호가 없거나 API 키 미설정이면 조회를 시도하지 않고 `{"available": false, "message": ...}`를 반환 | `contract/address_diagnosis_service.py:68-101`, `app/services/codef_service.py:145-187` |
| 2 | 시세 조회 | Supabase `apt_transactions`에서 주소 마지막 토큰으로 `dong LIKE` 검색, 최근 5건의 `deal_amount` 평균을 산출 | `contract/address_diagnosis_service.py:103-132` |
| 3 | 건축물대장 조회 | 주소 문자열 → 시군구코드(내장 매핑) → 법정동코드(외부 regcodes API) → 번지/지 정규식 추출 → 국토부 `BldRgstHubService/getBrTitleInfo` 호출 | `contract/building_check_service.py:27-151` |
| 4 | 위험 요소 자동 탐지 | 등기 `resPurpose` 문자열에서 압류/경매/신탁/가등기 키워드 매칭, 보증금÷시세로 전세가율 계산, 위반건축물 플래그 확인 → `detected_risks` dict 생성 | `contract/address_diagnosis_service.py:158-192` |
| 5 | 결정론적 스코어링 | `detected_risks`를 18개 감점 규칙표에 대입해 100점에서 차감, 4단계 등급 판정 (LLM 개입 없음) | `contract/risk_scoring_service.py:35-120` |
| 6 | LLM 3사 교차검증 분석 | OpenAI·Anthropic·Google 3개 프로바이더를 `asyncio.gather`로 동시 호출 → 결론 다수결 → 신뢰도(HIGH/MEDIUM/LOW) 산출 | `ai/llm_ensemble.py:13-17`, `ai/consensus.py:5-35` |
| 7 | 사용자 수동 확인 입력 → 재계산 | 세금 체납·선순위 임차인 수·소유자 신분증·중개사 자격·공제증서·보증보험 앱 결과 6개 입력을 위험 키로 변환 후 5단계 스코어러를 다시 실행 | `app/api/v1/contract.py:238-279` |
| 8 | 서류 파일 업로드 분석 (별도 진입점) | PDF/이미지 업로드 → 확장자·20MB 검증 → pdfplumber+EasyOCR 텍스트 추출 → 텍스트 앞 2000자 키워드 스코어로 서류 유형 자동 판별 → 유형별 전용 프롬프트로 LLM 분석 | `app/api/v1/contract.py:194-233`, `contract/document_analysis_service.py:116-207` |

### B. 등기 변경 모니터링 파이프라인 (L0 → L1 → L2 3계층)

`registry_tracker/src/registry_tracker/pipeline/orchestrator.py`의 `Orchestrator.run()` / `_scan_one_property()`.

| # | 계층 | 코드가 실제로 하는 일 | 근거 파일 |
|---|---|---|---|
| 1 | **L0 — 무료 신호 수집** | 법원경매·온비드·국토부 실거래(RTMS) 콜렉터에서 신호 수집. 콜렉터별 try/except로 격리해 하나가 죽어도 스캔 전체가 중단되지 않음 | `pipeline/orchestrator.py` `run()` L0 블록, `collectors/{court_auction,onbid,rtms}.py` |
| 2 | 신호–물건 주소 매칭 | 주소 정규화(서울특별시→서울 등) 후, 물건 주소의 2글자 이상 토큰 중 `max(2, 토큰수//2)` 이상이 신호 텍스트에 등장하면 매칭 | `pipeline/matcher.py` |
| 3 | 우선순위 스코어링 | 신호 종류별 가중치 합산 + 최근 미열람 보너스 → 0~100점 | `core/priority.py:12-34` |
| 4 | **L1 — 저비용 사건처리현황** | CODEF `aphandling-list`로 접수 사건 메타데이터만 조회 (본문 없음). 이전 스냅샷과 `(receipt_no, status)` 집합 차집합으로 신규 항목 판정 | `adapters/codef_case_status.py`, `pipeline/orchestrator.py` `_diff_new_entries()` |
| 5 | 변동 상세 생성 | 신규 entry의 receipt_no로 이전 스냅샷의 동일 사건을 찾아 status 비교. 매칭 실패 시 "완전 신규 사건"으로 분기. entries가 비면 "없음"(전건 정리)으로 판정 | `pipeline/orchestrator.py` `_build_change_detail()` |
| 6 | **L2 — 고비용 등기부등본 본문** | 변동이 감지된 물건에 대해서만 700원 열람 호출. `auto_call_l2=False`면 호출을 보류하고 `l2_status='pending'`으로 남겨 사용자 결정을 기다림 | `pipeline/orchestrator.py` `_scan_one_property()`, `adapters/base.py:23-34` |
| 7 | 스냅샷 저장 순서 제어 | 변동 없음 → 즉시 저장 / 변동 있음+L2 성공 → L2 후 저장 / 변동 있음+L2 실패 → **저장하지 않음**(다음 실행에 같은 변동 재감지) | `pipeline/orchestrator.py` `_scan_one_property()` docstring |
| 8 | AI 변경 이력 분석 | 이전·현재 등기부를 LLM에 넣어 소유권/채권부담/처분제한/임차인 변동 4축 + 종합 위험도(HIGH/MEDIUM/LOW) 산출 | `propintel-api/ai/prompts/registry_prompt.py` |

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것

| # | 규칙 | 코드 근거 | 왜 필요한지 |
|---|---|---|---|
| 1 | **데이터 없으면 "없음"으로 명시 반환** — 등기·시세·건축물대장 조회 실패 시 `{"available": False, "message": "..."}`를 돌려주고, 그 필드는 위험 탐지 루프에서 통째로 건너뛴다 | `contract/address_diagnosis_service.py:71,98,101,129,132,145,156` / `_detect_risks()`가 `if registry.get("available")`, `if market.get("available")`로 가드 | 조회 실패를 "위험 없음"으로 오독하면 위험한 매물이 안전으로 표시된다 |
| 2 | **위험 판정은 LLM이 아니라 결정론적 점수표가 한다** — LLM 응답은 `ai_analysis`/`tips` 필드로만 들어가고 `risk_score`/`risk_grade`는 `calculate_risk_score()` 결과가 그대로 쓰인다 | `contract/address_diagnosis_service.py:44-58` (5단계 결과가 최종 응답의 score/grade) | LLM 환각으로 등급이 흔들리면 재현 불가능한 판정이 된다 |
| 3 | **"즉시차단"은 감지된 팩터가 실제로 있을 때만 부여** — 점수가 0점이어도 즉시차단 카테고리 팩터가 없으면 고위험으로 내려간다 | `contract/risk_scoring_service.py:96-104` (`has_blocking_factor` 체크, 주석: "즉시차단은 해당 카테고리 팩터가 실제로 감지된 경우에만 부여") | 경미한 감점이 여러 개 쌓였다고 "절대 계약 금지"를 띄우면 오탐이다 |
| 4 | **LLM 3사 합의 필터** — 3개 동의 → HIGH, 2개 → MEDIUM, 1개 → LOW. 예외로 죽은 프로바이더는 `isinstance(r, LLMResult)`로 걸러내고 살아남은 결과만 집계 | `ai/consensus.py:22-27`, `ai/llm_ensemble.py:15-16` | 단일 모델 환각을 사용자에게 그대로 전달하지 않기 위해. 불일치 사실 자체를 사용자에게 표시한다 |
| 5 | **LLM JSON 파싱 실패 폴백** — `json.JSONDecodeError`/`TypeError`를 잡아 원문 텍스트로 대체하고, 팁이 비면 하드코딩된 6개 필수 팁을 사용 | `contract/address_diagnosis_service.py:234-258`, `_DIAGNOSIS_FALLBACK_TIPS` (13-20행) | AI가 죽어도 사용자에게 "등기 2번 확인", "전세가율 80%" 같은 최소 안전 지침은 반드시 나가야 한다 |
| 6 | **API 키 없으면 起動 거부** — `USE_MOCKS=false`인데 LLM 키가 하나도 없으면 `ValueError` raise. CODEF 유료 호출에 결제 정보 없으면 호출 전에 `ValueError` | `ai/llm_ensemble.py:31-32`, `codef_service.py:199-202` | 조용히 Mock으로 폴백해 가짜 데이터를 실데이터처럼 보여주는 사고를 막는다 |
| 7 | **일별 비용 한도 초과 시 429 거부** — 오늘(KST 자정 기준) `l2_status='fetched'`인 변동의 `700 × (1 + regenerated_count)` 합계 + 이번 호출 비용이 물건별 `daily_cost_limit_won`을 넘으면 호출 자체를 거부 | `app/api/v1/properties.py:358-405` | 스케줄러 버그나 재시도 폭주가 실제 현금 차감으로 이어지는 것을 막는다 |
| 8 | **동시 호출 낙관적 잠금** — `UPDATE ... WHERE id=:eid AND l2_status='pending'`의 `rowcount==0`이면 409 반환 | `app/api/v1/properties.py:600-615` | 같은 변동 건에 두 요청이 겹치면 700원이 두 번 나간다 |
| 9 | **결제 성공 후에는 절대 롤백하지 않음** — CODEF 호출 실패 시에만 `in_progress → pending`으로 보상 롤백. 성공하면 즉시 `fetched`로 전이하고 이후 S3 업로드가 실패해도 `fetched`를 유지 | `app/api/v1/properties.py:617-700` (주석: "성공한 시점부터는 700원 차감 사실 → 절대 재호출되지 않도록 바로 fetched 로 전이") | 후처리 실패로 재시도가 걸리면 이미 낸 돈을 또 낸다 |
| 10 | **PDF 없이 성공 처리 금지** — 실 차감 모드(`CODEF_MODE != "sandbox"`)에서 `pdf_base64`가 비어 오면 `RuntimeError`를 던져 실패로 간주하고 pending 롤백 | `app/api/v1/properties.py:645-650` | 돈만 나가고 문서가 없는 상태를 "완료"로 기록하지 않는다 |
| 11 | **스캔 중 개별 실패 격리** — 한 물건의 스캔 예외가 전체 스캔을 중단시키지 않고 다음 물건으로 넘어감. 단, L2가 raise하면 `scanned_property_ids`에 추가되지 않아 스케줄러가 잘못된 status로 `last_status`를 덮어쓰지 못함 | `pipeline/orchestrator.py` `run()` 내부 try/except + `_scan_one_property()` 주석 | 실패한 조회 결과로 DB의 마지막 상태를 오염시키면 다음 변동 감지가 틀어진다 |
| 12 | **업로드 입력 검증** — 확장자 화이트리스트(xlsx/xls/csv, pdf/jpg/jpeg/png), 크기 상한(엑셀 10MB / 서류 20MB), 빈 파일·헤더 없음 거부, 고유번호 컬럼 미발견 시 400 | `app/api/v1/properties.py:204-245`, `app/api/v1/contract.py:204-223` | |
| 13 | **고유번호 14자리 정규식 검증** — 숫자만 추출 후 `^\d{14}$`에 맞지 않으면 `None` 반환해 등록 거부 | `app/api/v1/properties.py:160-172` | 오타 고유번호로 엉뚱한 물건에 700원을 쓰는 것을 막는다 |
| 14 | **텍스트 추출 실패 시 AI에 넘기지 않음** — OCR 결과가 공백이면 422 반환 | `app/api/v1/contract.py:222-223` | 빈 입력으로 LLM이 그럴듯한 분석을 지어내는 것을 차단 |
| 15 | **참고 자료 고지 다중 배치** — 계약 위험분석 탭, 랜딩 페이지 3곳, 이메일 알림 하단, AI 챗 프롬프트 규칙에 각각 "참고 자료 / 전문가 확인 필요" 문구 | `propintel-web/src/app/dashboard/contract/page.tsx:272`, `propintel-web/src/app/page.tsx:800,888,1021`, `app/services/email_service.py:67`, `app/services/ai_chat_service.py:38` | 법률·투자 자문으로 오해되는 것을 방지 |
| 16 | **외부 공유 전 보안 리뷰 기록** — 64개 파일(Python 58 + HTML/JS/CSS 6) 대상 CRITICAL 0 / HIGH 4(길이) / MEDIUM 2 판정 문서가 저장소에 커밋되어 있음 | `.reports/code-review-2026-05-07.md` | |

---

## 3. 도메인 판단이 박혀 있는 지점 (부동산·계약 실무 노하우) ★중요★

### 3-1. 18개 감점 규칙 — 가중치가 사기 유형별 치명도를 반영

`propintel-api/app/services/contract/risk_scoring_service.py:35-55`

| 카테고리 | 항목 | 감점 |
|---|---|---|
| 즉시차단 (100점) | 소유자 불일치 / 신탁 구조 미확인 / 압류·경매 존재 / 소유자 신분증 불일치 | 각 100 |
| 고위험 (20~30점) | 전세가율 80% 초과 30 · 임대인 세금 체납 30 · 근저당 > 시세 60% 25 · 중개사 자격·등록 문제 25 · 보증보험 가입 거절 25 · 보증보험 가입 불가 20 · 선순위 임차인 과다 20 · 선순위 임차인 존재(전입세대열람) 20 | |
| 주의 (10~15점) | 대리계약 서류 미흡 15 · 중개사 공제증서 미보유 15 · 계약 직전 등기 미재확인 10 · 특약 누락 10 | |
| 안내 (5점) | 입주 후 절차 미이행 가능성 5 · 보증보험 신청기한 임박 5 | |

**판단 포인트**: 4개 항목만 100점 만점 감점(=단독으로 즉시차단)이다. 넷 다 "이 사람이 이 집을 임대할 권한이 있는가"를 묻는 항목이고,
금액·비율 문제(전세가율, 근저당)는 아무리 나빠도 단독으로는 차단하지 않는다. 등급 판정 함수도 점수와 별개로
`has_blocking_factor`를 따로 확인한다(`risk_scoring_service.py:97-104`).
**세금 체납 30점 > 근저당 25점**인 것도 실무 판단이다 — 조세채권이 임차인 보증금보다 우선 변제되기 때문
(근거: `manual_checklist_service.py:44-57`의 `risk_if_missed` "국세 체납 → 경매 시 조세채권이 보증금보다 우선 변제").

### 3-2. 등급 컷 — 0/40/70/100

`risk_scoring_service.py:57-62, 102-110`: `score <= 40` 고위험, `<= 70` 주의, 그 위 안전.
전세가율 80% 초과(30점) 하나만으로 70점 → "주의"에 걸리고, 여기에 근저당 과다(25점)가 더해지면 45점,
보증보험 불가(20점)까지 겹치면 25점 → "고위험"이 된다. 즉 **단일 항목 정상이어도 조합이 위험하면 고위험**
(`risk_scoring_service.py:4` docstring에 그대로 명시).

### 3-3. 전세가율 3단계 임계값과 공식

`ai/prompts/contract_prompts.py:29-33`
- 안전 60% 이하 / 주의 60~80% / 위험 80% 초과(깡통전세 경계)
- 공식: `(선순위채권 + 보증금) / 매매시세 × 100` — 보증금만이 아니라 **선순위 채권을 더한다**
- 코드 구현에서는 시세 대비 60% 초과 시 `excessive_mortgage`("근저당 합산 시 위험 가능"), 80% 초과 시 `high_jeonse_ratio`를 동시에 붙인다 (`address_diagnosis_service.py:177-185`)

### 3-4. 전세사기 5대 유형이 프롬프트에 상수로 박혀 있음

`ai/prompts/contract_prompts.py:35-40` — 깡통전세 / 이중계약 / 신탁부동산 사기 / 대항력 악용(전입 당일 담보 설정) / 바뀐 집주인.
`ADDRESS_DIAGNOSIS_PROMPT`는 6번 분석 항목으로 "5대 사기 유형 중 해당 패턴이 있는지"를 강제하고,
응답 JSON에 `fraud_pattern` 필드를 요구한다(`contract_prompts.py:67, 85`).

### 3-5. 등기부 갑구/을구/표제부별 위험 신호 분해

`ai/prompts/contract_prompts.py:21-27` 및 `document_analysis_service.py:15-44`
- 갑구: 가압류·가처분·압류 → 소유권 분쟁/채무 / 가등기 → **즉시 차단** / 신탁 → 수탁자만 처분 가능, 일반 임대인과 계약 금지
- 을구: 근저당 채권최고액 > 시세 60% → 위험 / 전세권 설정 → 선순위 전세 존재 가능
- 표제부: 용도 위반·위반건축물 확인 필수

코드의 자동 탐지는 `resPurpose` 문자열에서 "압류"·"경매"·"신탁"·"가등기"를 매칭한다(`address_diagnosis_service.py:167-174`).

### 3-6. "계약 직전 등기 재확인" — 전날 밤 근저당 설정을 노린 항목

`manual_checklist_service.py:99-104`: 계약 당일 오전 등기 열람(700원)을 필수 항목으로 두고
`risk_if_missed`에 "계약 전날 밤에 근저당 추가 설정 가능 → 선순위 채권 변동"이라고 근거를 적었다.
같은 판단이 폴백 팁("등기부등본은 집 보러 갔을 때 한 번, 계약 직전 한 번 — 최소 2번", `address_diagnosis_service.py:14,17`)과
`missing_special_clauses`/`no_recheck_before_contract` 감점 항목으로도 반복된다.

### 3-7. API로 못 가져오는 것을 수동 체크리스트로 분리

`manual_checklist_service.py` — 계약 전 9개(매매 시 10개) + 계약 당일 5개 항목. 각 항목이 `how`(어디서 어떻게 발급)와
`risk_if_missed`(놓치면 무슨 일이 나는지)를 함께 갖는다. 대표 예:
- 전입세대열람내역서: "주민센터 발급, **임대인 동의 없이 가능 (2025.5.27 시행)**"
- 미납국세 열람: "세무서에서 신청, **임대인 동의 불필요, 임대차계약서 지참**"
- 인감증명서: "**3개월 이내 발급분**"
- 중개사: 자격증·개설등록증 **게시** 확인 + **공제증서** 보유 확인, "없으면 거래 거부 권장"
- "실제 사무소가 아닌 다른 장소에서 계약을 유도하면 의심"

이 항목들이 그대로 프론트 6개 드롭다운 입력이 되고, `POST /contract/manual-input`에서 위험 키로 변환되어 점수가 재계산된다
(`app/api/v1/contract.py:44-55, 252-266`).

### 3-8. 보증보험 3사 실제 요율표·한도

`contract/guarantee_service.py:10-24`
- HUG 보증료율 (주택유형 × 보증금 구간): 아파트 0.115~0.128% / 주거용오피스텔 0.128~0.140% / 다세대·연립·단독·다가구 0.140~0.154%
- 구간 분기점: 보증금 3억 이하면 `low`, 초과면 `high` (`guarantee_service.py:44`)
- 한도: HUG 수도권 7억 / 비수도권 5억, SGI 아파트 무제한·비아파트 10억, HF 3억
- 보증료 공식: `보증금 × 요율 × (개월수 × 30) / 365`, `math.ceil` 올림 (`guarantee_service.py:26-28`)
- HUG 할인: 모바일 3% + 일시납 3% = 6% (`guarantee_service.py:49-50`, 프롬프트에도 동일 명시)
- 신청 마감: **잔금일과 전입신고일 중 늦은 날부터 계약기간 1/2 경과 전** (`contract_prompts.py:46`), 구현은 `계약개월수 × 30 ÷ 2`일 (`guarantee_service.py:140-149`)
- 추천 로직: 가입 가능한 곳 중 **보증료 최저**를 선택 (`guarantee_service.py:115-118`)
- 판단 한 줄: "**보증보험 가입 거절 = 물건의 구조적 위험 간접 신호**" (`contract_prompts.py:47`, `154`) — 그래서 `guarantee_rejected`에 25점 감점을 준다

### 3-9. 계약서 위험 문구 5종 / 필수 특약 7종

`ai/prompts/contract_prompts.py:100-118`
- 위험 문구: "현 상태 그대로 인수"(숨은 하자 전가) / "보증보험 미가입 책임은 임차인" / "선순위 권리 있음" / "전입신고 지연"(대항력 방해) / "원상복구 전액 부담"(자연 마모까지)
- 누락 판정 대상 특약 7종: 전세대출 불가 시 해지 · 보증보험 불가 시 해지 · 잔금 전 추가 담보권 설정 금지 · 세금 체납 확인/상환 · 전입신고·확정일자 협조 · 수리 책임 구분(월세) · 관리비 범위(월세)

### 3-10. 특약 템플릿 16종 — 실제 문안이 통째로 들어 있음

`contract/contract_verification_service.py:12-200` — 전세 8종 + 월세 8종. 조문 수준의 완성 문장이며 실무 판단이 문안에 반영되어 있다:
- 권리변동 금지 특약의 유효 기간을 "계약일 ~ **잔금 지급 및 전입신고·확정일자 취득이 모두 완료되는 날**"로 못 박음 (`:44-49`)
- 월세 수리 책임을 "전등·수도꼭지·문고리 = 임차인 / 보일러·배관·배수·누수·창호·전기배선 = 임대인"으로 열거 (`:129-135`)
- 관리비를 "공용관리비·청소비·경비비·승강기유지비 = 임차인 / **장기수선충당금·건물보험료·수선유지비 = 임대인**"으로 분리 (`:140-146`)
- 원상복구를 "고의·과실 훼손분만, **벽지 변색·바닥 긁힘·가구 자국 등 자연 마모 제외**"로 한정 (`:161-167`)
- 월세 연체 해지 기준을 "**2기 이상 연속**"으로 명시 (`:120-125`)
- 중도해지 위약금을 "월세 1개월분, 단 **보증보험 가입 불가·중대한 하자로 인한 해제는 적용 제외**" (`:103-110`)

### 3-11. 임대인 위험 신호 — 서울시 AI 보고서 24종 기반 수치

`ai/prompts/contract_prompts.py:253-259`
- 사기 임대인 평균 신용점수 591점 (일반 대비 300점 낮음)
- 사기 임대인 중 신용불량자 비율 27%
- 다주택 보유 + 다수 근저당 = 전형적 사기 패턴
- 최근 3년 내 휴대전화 번호 잦은 변경 = 위험 신호
- 보증금 미반환 이력 = 즉시 차단

### 3-12. 입주 후 절차 순서와 기한

`contract/movein_service.py` — 입주일 하나만 받아 7개 일정을 자동 생성한다.
잔금 지급(당일, 등기상 소유자 명의 계좌 확인·현금 수수 금지) → 전입신고(당일 즉시) → 확정일자(같은 날) →
임대차 신고(30일 이내, 미신고 과태료) → 보증보험(계약기간 1/2 경과 전) → **등기부등본 재확인(입주 후 7일)** →
중개대상물 확인·설명서 수령.
2026 개정 반영: "전입신고 **처리 시점부터** 바로 대항력 인정" (`movein_service.py:4, 38`), 계약갱신청구권 2+2년 (`contract_prompts.py:18`).

### 3-13. 비용 계층 설계 — 무료 신호로 유료 호출을 걸러낸다

`registry_tracker/src/registry_tracker/adapters/`
- L0 신호(경매·온비드·실거래) = 0원 → L1 사건처리현황 = 0~10원 → L2 등기부등본 본문 = **700원**
- `codef_case_status.py:12-16, 45`: CODEF `aphandling-list` 엔드포인트를 **실제로 호출해 전자민원캐시 잔액 변화가 0원인 것을 확인**하고
  `cost_per_call_won = 0`으로 못 박은 뒤 "700원 등본과 별개의 **무료 사전 필터**"로 사용한다. 코드 주석에 검증 사실이 남아 있다.
- `tilko.py:45`는 대안 L1으로 10원
- 우선순위 가중치 (`core/priority.py:12-18`): 경매개시 50 · 압류 50 · 소유권이전 25 · 인허가 15 · 전세 10, 30일 이상 미열람 시 최대 +20 보너스
- 임계값 (`core/priority.py:6-9`): 80점 이상 즉시 L1 / 50~79 다음 배치 / 50 미만 L0 신호 없으면 스킵.
  docstring에 "**운영 데이터로 보정 필요**"라고 튜닝 미완 상태를 스스로 명시해 두었다.
- `OrchestratorConfig.auto_call_l2=False` 옵션: 변동을 감지해도 700원을 자동으로 쓰지 않고 `pending`으로 두어 사용자가 결정하게 한다

### 3-14. CODEF 3-모드 분리 — 실 차감을 실수로 발생시키지 않기 위한 구조

`app/services/codef_service.py:96-143`
- `sandbox`(sandbox.codef.io) 가짜 JSON·차감 없음 / `demo`(development.codef.io) 실 인프라·실 차감 / `prod`(api.codef.io)
- 인증: 인터넷등기소 비밀번호와 4자리 PIN을 **RSA PKCS1_v1_5 공개키로 암호화 후 Base64**로 전송 (`codef_service.py:14-25, 204`)
- 열람(700원)과 발급(1,000원)을 `issueType` 파라미터로 분기 (`codef_service.py:214`, README 기재)
- 응답이 URL 인코딩된 JSON 안에 또 문자열 JSON으로 중첩되어 있어 `unquote_plus` 2단 파싱 (`codef_service.py:228-233`)
- 정상 코드로 `CF-00000`뿐 아니라 `CF-94002`도 허용 (`codef_service.py:236, 436`)

### 3-15. 서류 유형 자동 판별 — 키워드 스코어링

`contract/document_analysis_service.py:116-134`: 텍스트 앞 2000자에서 유형별 키워드 히트 수를 세어 최다 득점 유형을 선택.
- 등기부등본 8개 키워드: 등기부등본·표제부·갑구·을구·소유권·근저당·전세권·대법원
- 전입세대열람 4개: 전입세대·전입일·세대주·전입신고
- 건축물대장 6개: 건축물대장·건축허가·사용승인·주용도·건폐율·용적률
- 히트 0이면 "기타" 프롬프트로 폴백

전입세대열람 전용 프롬프트에는 실무 위험 신호가 들어 있다 — "전입일자가 매우 최근 → **집주인이 보증금 받고 바로 다른 세입자 넣은 패턴**" (`document_analysis_service.py:55`).
건축물대장 프롬프트에는 "위반건축물 표시 → **보증보험 가입 불가**, 경매 시 불이익", "용도가 주거용이 아닌데 전세 계약 → **주택임대차보호법 미적용**" (`:80-83`).

### 3-16. 뉴스 수집 키워드 설계

`app/services/news_service.py:18-25` — 6개 카테고리 23개 키워드. 정책_규제 4(분양가 상한제·재건축 규제·토지거래허가구역 등) /
시장_동향 5 / 공급_택지 4(3기 신도시·LH 택지 등) / 정비_사업 4 / 금리_금융 3(기준금리·주담대 금리·DSR 규제) / 건설사_동향 3.
수집 시 article id로 중복 제거 (`news_service.py:38-47`).

---

## 4. 검증 가능한 숫자

코드에서 직접 센 값만 기재.

| 항목 | 값 | 근거 |
|---|---|---|
| 위험도 감점 규칙 | **18개** | `contract/risk_scoring_service.py:35-55` |
| 위험도 등급 | 4단계 (즉시차단/고위험/주의/안전), 컷 0/40/70 | `risk_scoring_service.py:57-62, 102-110` |
| 계약 검증 탭 | **5개** (주소 진단·서류 확인·특약 검증·보증보험·입주 보호) | `propintel-web/src/app/dashboard/contract/page.tsx:280-284` |
| 계약 검증 API 엔드포인트 | **12개** | `app/api/v1/contract.py` (`@router.` 12개) |
| 전체 API 엔드포인트 | **75개** | `app/api/v1/*.py` `@router.` 합계 |
| 사용자 수동 입력 항목 | **6개** (세금 체납·선순위 임차인 수·소유자 신분증·중개사 자격·공제증서·보증보험 앱 결과) | `app/api/v1/contract.py:44-55` |
| 계약 전 수동 체크리스트 | **9개** (매매는 10개) | `manual_checklist_service.py:10-92` |
| 계약 당일 체크리스트 | **5개** | `manual_checklist_service.py:96-129` |
| 입주 후 자동 생성 일정 | **6~7개** (보증금 있으면 7) | `movein_service.py` |
| 특약 템플릿 | **전세 8종 + 월세 8종 = 16종** | `contract_verification_service.py:12-200` |
| 계약서 위험 문구 탐지 패턴 | **5종** | `contract_prompts.py:102-107` |
| 필수 특약 누락 판정 항목 | **7종** | `contract_prompts.py:112-118` |
| 전세사기 유형 | **5대 유형** | `contract_prompts.py:35-40` |
| 서류 자동 판별 유형 | **3종 + 기타 = 4개 프롬프트**, 키워드 18개 | `document_analysis_service.py:14-120` |
| LLM 프로바이더 | **3사** (OpenAI·Anthropic·Google) 동시 호출 + 다수결 | `ai/llm_ensemble.py:20-33`, `ai/consensus.py` |
| 신뢰도 등급 | 3단계 (3사 동의 HIGH / 2사 MEDIUM / 1사 LOW) | `ai/consensus.py:22-27` |
| LLM 프롬프트 파일 | **4개**, 도메인 프롬프트 6종 (주소진단·특약·보증보험·입주보호·위험스코어링·임대인분석) | `ai/prompts/` |
| 보증보험사 | **3사** (HUG/SGI/HF), 주택유형 6종 요율표 | `guarantee_service.py:10-24` |
| 시장 데이터 탭 | **9개** (아파트 매매·전월세·연립다세대·청약 경쟁률·미분양·상권·가격지수·금리·종합 분석) | `propintel-web/src/app/dashboard/market/page.tsx:509-517` |
| 종합 AI 교차분석 | **3종** (실거래가×상권 / 분양가 적정선 / 개발 가능성) | `ai/prompts/cross_analysis_prompt.py` |
| 데이터 저장소 탭 | **17개** | `propintel-web/src/app/dashboard/datastore/page.tsx:59-77` |
| 뉴스 카테고리 / 키워드 | **6개 카테고리 / 23개 키워드** | `news_service.py:18-25` |
| 뉴스 중요도 분류 | 3단계 (HIGH/MEDIUM/LOW) | `news_service.py` |
| 경영진 브리핑 분류 | 3단계 (즉시검토/모니터링중/참고) | `briefing_service.py:125-139` |
| 데이터 수집기 | **13개** | `data_collector/collectors/` (`__init__.py` 제외) |
| 서울 시군구 코드 내장 | **25개 구 전부** | `building_check_service.py:14-24` |
| 등기 모니터링 비용 계층 | **3계층** (L0 0원 / L1 0~10원 / L2 700원) | `registry_tracker/src/registry_tracker/adapters/` |
| L0 신호 가중치 | 경매개시 50·압류 50·소유권이전 25·인허가 15·전세 10, 최근성 보너스 최대 +20 | `core/priority.py:12-34` |
| 프론트 대시보드 페이지 | **16개** (+ 로그인·랜딩 = 18) | `propintel-web/src/app/**/page.tsx` |
| 테스트 함수 | **281개** (propintel-api 180 / registry_tracker 71 / data_collector 17 / registry_tracker_demo 13), 테스트 파일 53개 | `find -name "test_*.py"` + `def test_` 카운트 |

---

## 5. 일반 접근과의 대조

### "전세 계약 위험을 ChatGPT에 물어보면" — 3단계

1. 사용자가 등기부등본 PDF를 열어 눈으로 읽고 요약해 붙여넣는다 (또는 주소만 말한다)
2. LLM 1개가 그 텍스트만 보고 "위험해 보인다 / 괜찮아 보인다"를 문장으로 답한다
3. 사용자가 그 답을 믿을지 말지 스스로 판단한다

**한계**: 시세를 모르므로 전세가율을 계산할 수 없다. 전입세대열람·세금 체납·중개사 자격 같은
등기부에 없는 정보는 애초에 입력되지 않는다. 답이 매번 달라져도 확인할 방법이 없다.
숫자 등급이 없으니 "이 집 계약해도 되나"에 대한 재현 가능한 답이 나오지 않는다.

### "이 시스템은" — 8단계 (§1-A) + 백그라운드 3계층 감시 (§1-B)

1. 고유번호 14자리 형식 검증 → CODEF OAuth → 등기 사건 조회 (실패는 "없음"으로 명시)
2. Supabase 실거래가 DB에서 같은 동 최근 5건 평균 시세 조회
3. 주소 → 시군구코드 → 법정동코드 → 번지 파싱 → 국토부 건축물대장 API 조회
4. 등기 목적 문자열 키워드 매칭 + 전세가율 계산 + 위반건축물 플래그로 위험 요소 자동 탐지
5. **18개 규칙표에 대입해 0~100점 결정론적 산출** + 즉시차단 팩터 별도 확인
6. OpenAI·Anthropic·Google 3사 동시 호출 → 결론 다수결 → 신뢰도 표기 (불일치 사실을 사용자에게 노출)
7. API로 못 가져오는 6개 항목(세금 체납·전입세대·신분증·중개사 자격·공제증서·보증보험 앱)을 사용자 입력으로 받아 **점수 재계산**
8. 서류 PDF 업로드 시 OCR → 유형 자동 판별 → 유형별 전용 프롬프트로 재분석

동시에 백그라운드에서: 무료 L0 신호(경매·압류·실거래) 수집 → 주소 토큰 매칭 → 우선순위 점수 →
0원 L1 사건처리현황 조회 → **변동이 있을 때만** 700원 L2 등기부등본 열람 → 이전 스냅샷과 비교해 변경 타임라인 생성 →
LLM으로 소유권/채권/처분제한/임차인 4축 변동 분석 → 이메일 알림.
여기에 일별 비용 한도, 동시 호출 잠금, 결제 후 재차감 방지 로직이 붙는다.

**차이의 핵심**: 튜토리얼로 만들 수 있는 것은 6번(LLM 호출)뿐이다.
1~5번은 어떤 데이터를 어디서 가져올지, 7번은 API가 없는 정보를 어떻게 사람에게 물을지,
백그라운드 3계층은 700원짜리 호출을 언제 아끼고 언제 쓸지 — 전부 부동산 실무와 과금 구조를 알아야 나오는 설계다.

---

## 6. 규모 지표

| 항목 | 값 |
|---|---|
| 파일 수 (git 추적, node_modules/.next 제외) | **603개** |
| 주요 언어 | Python 251 파일 · TypeScript/TSX 137 파일 (tsx 111 + ts 26) · SQL 9 · Markdown 27 · PNG 118 |
| 코드 라인 수 | **약 44,700줄** (Python 21,866 + TS/TSX 22,363 + SQL) — 문서·이미지 제외 |
| 커밋 수 | **117개** (GitHub API `commits?per_page=1` 페이지네이션 last=117) |
| 병합된 PR | **13개** |
| 개발 기간 | 2026-04-14 생성 ~ 2026-05-08 최종 갱신 (**약 24일**) |
| 저장소 크기 | 13,679 KB |
| 서브 프로젝트 | 5개 — `propintel-api`(FastAPI 백엔드) · `propintel-web`(Next.js 16 프론트) · `data_collector`(13개 수집기) · `registry_tracker`(재사용 가능한 SDK+MCP 서버 패키지) · `RealestatMonitoringSystem`(독립 배포용 패키지) + `registry_tracker_demo` |
| 테스트 | 53개 파일 / **281개 테스트 함수** |
| 문서 | `docs/` 27개 md + PRD·LLD·시스템개요 PDF/HTML + `docs/superpowers/plans/` 9개 구현 계획서 + `.reports/` 보안 리뷰 1건 |

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

### 7-1. 저장소에 커밋된 실 비밀키 (⚠️ 노출 상태, 회수 필요)

포트폴리오에 인용 금지이며, **키 폐기·재발급을 별도로 권고**한다.

- `docs/외부_API_발급_가이드.md:439, 480` — Google Maps API 키 실값이 평문으로 들어 있음
- `docs/superpowers/plans/2026-04-15-supabase-database-system.md:630, 784` — Supabase anon JWT 실값 (프로젝트 ref 포함)
- `docs/LLD_PropIntel_AI.md`, `docs/PRD_PropIntel_AI.md` — DB 접속 문자열 형식 (placeholder이나 구조 노출)

> 참고: `.reports/code-review-2026-05-07.md`는 "하드코딩된 API 키 없음"으로 판정했지만, 그 리뷰 범위는
> `registry_tracker`/`registry_tracker_demo` 64개 파일이었고 `docs/`는 범위 밖이었다.

### 7-2. 계정 자격증명 평문 노출

- `README.md` "접근 정책" 절 — 마스터 계정 **이메일 + 비밀번호가 평문으로 기재**되어 있고 개발자 실명 이니셜이 붙어 있다
- `README.md` "빠른 시작" 절 — 별도 테스트 계정 이메일/비밀번호 평문
- 두 곳 모두 포트폴리오·스크린샷·발췌 인용에서 **완전히 제외**할 것

### 7-3. 법률 자문 오해 소지

- `ai/prompts/contract_prompts.py:95` 프롬프트가 AI 역할을 "부동산 계약서 검토 **전문 변호사**"로 지정한다.
  포트폴리오에서 "AI 변호사", "법률 검토", "법적 판단" 같은 표현으로 소개하면 변호사법 이슈가 될 수 있다.
- 프롬프트에 "'~일 수 있습니다' 같은 모호한 표현 대신 **단정적으로 안내**하세요"(`contract_prompts.py:73`)라는
  지시가 있어, 결과물 문체가 확정적으로 보인다. 소개 문구에서 "참고 자료 / 최종 판단은 전문가 확인" 고지를
  반드시 함께 쓸 것 (제품 자체는 §2-15처럼 6곳에 고지를 넣어두었으므로 그 사실을 근거로 쓰면 된다).
- 특약 템플릿 16종은 조문 수준의 완성 문안이다. "법률 문서 자동 생성"이 아니라 "체크리스트·초안 제공"으로 표현할 것.

### 7-4. 미완성·튜닝 미완 기능 (성과로 소개하면 안 되는 것)

- `registry_tracker/src/registry_tracker/core/priority.py:6` — 임계값 80/50에 대해 코드 스스로 "**운영 데이터로 보정 필요**"라고 적어둠. "검증된 임계값"으로 소개 금지
- `app/api/v1/properties.py` `_properties_store` — 물건 목록 일부가 **인메모리 dict** 기반. `news_service.py:27`의 `_news_store`도 "DB 연동 시 교체" 주석이 달린 인메모리 저장소
- `adapters/codef_case_status.py` — 호출 메서드 이름이 `_legacy_aphandling_list_unused`이고, `codef_service.py:171-172` 주석은 "별도의 `/aphandling-list` 처리현황 엔드포인트는 등기소 계정이 있을 때만 쓸 수 있어 여기서는 쓰지 않음"이라고 적혀 있다. **L0/L1/L2 3계층 절감 구조는 `registry_tracker` 패키지에서 구현되어 있으나, 메인 `propintel-api`의 주소 진단 경로는 곧바로 700원 유료 조회(`check_status` → `_paid_register_status`)를 탄다.** 3계층 절감을 메인 제품의 동작으로 소개하면 부정확하다
- `contract/address_diagnosis_service.py:112-118` — 시세 조회가 `dong LIKE '%주소 마지막 토큰%'` 단순 매칭이다. 정밀 시세 매칭으로 소개하지 말 것
- `RealestatMonitoringSystem/`에는 테스트가 0개다 (`test_*.py` 없음)
- `news_service.py:52-61`, `ai_chat_service.py:53-55` — Mock 응답에 실제 단지명(아크로리버파크·래미안원베일리 등)과 구체 금액이 하드코딩된 샘플 데이터가 있다. **README의 "Mock 전면 제거" 서술과 상충**하므로 "Mock 없음"을 그대로 인용하지 말 것

### 7-5. 개인정보·실 고객사

- 실제 등기부등본 데이터나 특정인의 주소·소유자명은 저장소 코드에서 발견되지 않았다 (샘플/Mock 데이터의 단지명은 공개 정보)
- 고객사·클라이언트 회사명은 **없음**
- `.gitignore`로 `.env` 계열은 제외되어 있고, 실제 `.env`가 커밋된 흔적은 없다 (`.env.example` 5개만 추적됨)

---

## 부록 — 검증에 쓴 명령

```
gh repo clone junginsu-make/propintel-ai --depth 1
git -c core.longpaths=true -c core.protectNTFS=false restore --source=HEAD :/   # 한글 경로 checkout 실패 복구
find . -type f -not -path "./.git/*" | wc -l                                     # 603
find . -name "*.py" -exec cat {} + | wc -l                                       # 21,866
grep -rn "def test_" --include="test_*.py" . | wc -l                             # 281
gh api "repos/junginsu-make/propintel-ai/commits?per_page=1" --include | grep Link  # last=117
gh pr list -R junginsu-make/propintel-ai --state all --limit 100                 # 13
```
