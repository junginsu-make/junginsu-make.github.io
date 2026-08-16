# Factto 팩트 시트
저장소: image-insight | 분석일: 2026-08-16

> 원칙: 아래 내용은 전부 저장소 코드에서 직접 확인한 것이다. 근거 파일 경로를 항목마다 붙였다.
> 추정·창작은 넣지 않았고, 확인되지 않은 항목은 "근거 없음"으로 표기했다.

---

## 1. 실제 파이프라인 단계

시스템은 3개다 — ① 이미지 분석(엔진), ② Image Blog(이미지 → 글), ③ Place Blog(플레이스 URL → 글).
②③ 모두 마지막에 ①을 부품으로 쓴다. (`README.md`)

프론트 위저드 단계 수는 코드로 확인된다: **Image Blog 6단계**(`web/app/blog/page.tsx:61-69` — source/keywords/collect/input/generate/result), **Place Blog 8단계**(`web/app/place/page.tsx:152-162` — source/collect/analyze/keywords/blogCollect/input/generate/result).

### 1-A. Image Blog 흐름 (백엔드 실제 처리 순서)

| # | 단계 | 코드가 실제로 하는 일 | 근거 |
|---|------|----------------------|------|
| 1 | 입력 정규화 (Stage 0) | URL이면 SSRF 검증(공개 IP만, loopback·사설·link-local·reserved 차단, IPv4-mapped IPv6 언래핑), 용량·픽셀 상한 검사, 장변 1536px 초과 시 LANCZOS 다운스케일, base64 재인코딩 | `image_insight/preprocessor.py:_validate_public_url`, `normalize` |
| 2 | Stage 1 — Gemini 비전 분석 | 이미지를 Gemini가 직접 보고 5관점(place/mood/ocr/objects/visual) + 도메인 + attributes를 JSON으로 산출 | `image_insight/stage1_gemini.py:analyze_all`, `prompts.py:GEMINI_PERSPECTIVE_PROMPT` |
| 3 | Stage 1b — Claude 비전 분석 (독립) | **같은 이미지를 Claude가 따로 본다.** Gemini와 완전히 동일한 프롬프트를 써서 결과를 비교 가능하게 만든다. 2·3은 `asyncio.gather`로 동시 실행 | `image_insight/stage1b_claude_vision.py` (모듈 독스트링: "교차검증용 두 번째 독립 시선"), `pipeline.py:analyze_images` |
| 4 | 코드 레벨 교차검증 | 두 결과를 이미지 index 기준으로 대조. 도메인 일치 여부 + 주요 피사체/OCR/속성라벨 Jaccard 유사도로 **신뢰도를 재계산** (모델 자기신고 신뢰도를 쓰지 않음) | `image_insight/consensus.py:reconcile`, `_reconcile_one` |
| 5 | Stage 2 — Claude 종합 | 두 모델의 원본 분석을 `{gemini_analysis, claude_analysis}` 쌍으로 묶어 LLM에 재투입, 의미 기준으로 대조·병합하고 근거 없는 항목은 비우게 한다 | `image_insight/pipeline.py` (dual payload 구성), `prompts.py:CLAUDE_SYNTHESIS_PROMPT` |
| 6 | 교차검증 마무리 | 실패 신호만 보수적으로 신뢰도 캡(전부 실패=0.0, 일부 실패=0.5 상한), 실패·low_confidence 플래그를 최상위로 노출 | `image_insight/pipeline.py:_finalize_cross` |
| 7 | 키워드 분류 | 사실에서 **글에 반드시 들어갈 키워드(must_include: 브랜드+제품명/플레이스명)** 와 **검색 수집용 키워드(collect_primary: 카테고리)** 를 분리 | `image_insight/blog/keywords.py:classify` |
| 8 | 네이버 상위 블로그 수집 | 검색 결과에서 서로 다른 계정의 게시물만 골라(계정 중복 제거) 개별 방문, 제목/본문/이미지 수를 읽어 **메트릭만 산출하고 본문 텍스트는 저장하지 않음** | `image_insight/blog/naver_crawler.py:_collect_links`, `_crawl_post` |
| 9 | 통계 집계·매핑 | 글자수 평균, 이미지 수 평균, 톤 분포, 제목 키워드 위치 최빈값 산출. 표본이 3건 미만이면 정확 키워드로 **재수집 폴백** | `naver_analysis.py:aggregate`, `naver_stats_mapper.py:map_crawler_result`, `naver_collector.py:collect_with_fallback` |
| 10 | 사용자 입력 수집 | 정식명칭·핵심내용·유의사항(금지표현)·푸터를 구조화 입력으로 받음 | `image_insight/blog/types.py:UserInput`, `web/components/blog/steps/input-step.tsx` |
| 11 | 프롬프트 조립 | 사실(JSON) + 상위블로그 통계(JSON) + 이미지 배치 계획 + SEO 작성규칙 + (옵션)법적 가드레일 블록을 조립 | `image_insight/blog/prompt_builder.py:build_messages` |
| 12 | 글 생성 | Claude를 tool_use 스키마(`emit_blog`)로 강제 호출 → 실패 시 재시도 → 그래도 실패하면 GPT 백업으로 failover | `image_insight/blog/generator.py:_generate_with_failover` |
| 13 | 출력 엄격 검증 + 후처리 | title_candidates/body_markdown 타입·공백 검증 실패 시 생성 실패로 간주. 문장 단위 줄바꿈 정돈, 푸터 자동 부착 | `generator.py:_to_draft`, `_format_sentences`, `_apply_footer` |
| 14 | 품질 자동 검사 | 7개 카테고리(markers/images/length/facts/guardrail/seo/footer 등) 규칙 검사 → error/warning + 점수 | `image_insight/blog/quality.py:evaluate_draft` |
| 15 | 조건부 자동 재작성 1회 | 점수가 임계 미만이면 **문제 목록을 프롬프트에 넣어 재생성**, 재검사해서 **점수가 올라간 경우에만 교체** | `api/routes/blog.py:_should_rewrite`, `generate_endpoint`, `blog/generator.py:revise` |
| 16 | 저장 | 초안 + 품질 리포트 + 재작성 시도 이력(`quality_attempts`) + 사용자 입력·옵션을 함께 저장 | `api/routes/blog.py:generate_endpoint` (stored dict) |
| 17 | (선택) AI 이미지 보충 | 이미지가 부족할 때만 슬롯 계획 → 생성 → **사람 승인** → 본문 합성 | `image_insight/ai_images/*` (§2 참조) |

### 1-B. Place Blog 흐름 (1~9가 다르고 이후는 동일)

| # | 단계 | 코드가 실제로 하는 일 | 근거 |
|---|------|----------------------|------|
| 1 | URL 검증 | 허용 호스트 화이트리스트(`m.place.naver.com`, `map.naver.com`, `pcmap.place.naver.com`, `naver.me`)만 통과 | `image_insight/place/collector.py:ALLOWED_HOSTS`, `validate_place_url` |
| 2 | place_id 추출 | 문자열 파싱으로 먼저 시도하고, 단축 URL이면 리다이렉트를 따라가 최종 URL에서 재추출 | `collector.py:extract_place_id`, `resolve_place_id` |
| 3 | 캐시 확인 | `place_collections`에서 TTL(기본 24시간) 내 데이터가 있으면 재수집 없이 사용, 오래되면 stale 표시 | `image_insight/place/cache.py:load_cached_place` |
| 4 | 공개 데이터 수집 | 헤드리스 브라우저 없이 pcmap GraphQL 공개 응답 + SSR `__APOLLO_STATE__`만 파싱. 업종별로 쿼리를 바꿔 씀(restaurant/place/accommodation) | `collector.py:GRAPHQL_URL`, `CATEGORY_QUERIES`, `_extract_apollo_state`, `place_info`, `place_overview` |
| 5 | 리뷰 사실 요약 | 최근 90일 방문 리뷰만 골라 **재방문율(%)** 과 표본 수 산출, 방문 동행/목적 코드를 한국어 라벨로 집계, 투표 키워드 상위 8개 집계 | `collector.py:_summarize_review_facts`, `VISIT_COMPANION`, `VISIT_PURPOSE` |
| 6 | 이미지 목록 구성 | **사용자 이미지를 먼저 채우고**, 남은 자리를 플레이스 공개 사진으로 cap까지 보충 | `image_insight/place/image_source.py:build_image_list` |
| 7 | 이미지 분석 | 위 목록을 시스템①(2~6단계)에 그대로 태움 | `api/routes/place.py:analyze_endpoint` |
| 8 | 병합 어댑터 | 플레이스 데이터 + 이미지 인사이트를 소스 비종속 `SourceFacts`로 합치고, 리뷰에서 **안전 신호만** 추출해 실음 | `image_insight/place/source_adapter.py:place_to_source`, `place/review_signals.py` |
| 9 | 키워드 | "지역 + 업종"(1.0) > "상호 + 업종"(0.95) > 업종(0.9) > 대표메뉴(0.7) > 플레이스 키워드(0.6) > 이미지 태그(0.55) 순위로 수집 키워드 후보 생성 | `image_insight/place/keywords.py:place_keywords` |
| 10~ | 이하 동일 | Image Blog의 8~17단계와 같은 경로 | `api/routes/blog.py` |

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것 ★

### 2-1. 할루시네이션 차단 (프롬프트 레벨)

| 규칙 | 코드 근거 | 왜 필요한가 |
|---|---|---|
| **근거 없으면 빈 값을 강제** — "근거가 없으면 반드시 비워라(빈 문자열 "" / 빈 배열 []). 절대 지어내지 마라" | `image_insight/prompts.py:_GROUNDING_RULES` | LLM은 빈칸을 채우려는 성향이 있어서, "모르면 비워라"를 명시하지 않으면 그럴듯한 거짓을 만든다 |
| **장소 환각 금지 규칙이 사례까지 명시** — 제품 단독 사진·음식 접시·스크린샷·흰 배경 촬영에서는 place의 모든 값을 비운다. "접시 위 생고기를 '음식점'으로, 흰 배경 제품을 '스튜디오'로 단정하는 것은 금지" | `prompts.py:_GROUNDING_RULES` | 실제 검증에서 발견된 결함에 대응한 규칙(주석에 "검증에서 발견된 결함 대응"이라 적혀 있음) |
| **시간대·계절 추측 금지** — `mood.visit_time`, `mood.season`은 이미지에 명확한 단서가 있을 때만 | 같음 | 사진 한 장으로 계절을 단정하는 것이 가장 흔한 환각 유형 |
| **모델명·SKU 추측 금지** — 명확히 읽히는 텍스트만 그대로. 불확실하면 일반 표현을 쓰거나 비운다 | 같음 | 제품 글에서 잘못된 모델명은 치명적 오류 |
| **신뢰도 자체에 규칙을 건다** — "직접 보이는 분석이 대부분이면 0.85~0.98, 추론·불확실이 섞이면 0.5~0.75. 환각을 0.9로 단정하지 마라" | 같음 | 신뢰도까지 환각하면 검증 장치가 무력화된다 |
| **Stage 2가 앞 단계의 환각을 되돌린다** — "개별 분석에 들어있는 추측성·근거 없는 맥락은 비워서 정정하고 flags에 사유를 남긴다" | `prompts.py:CLAUDE_SYNTHESIS_PROMPT` | 1차 분석이 실수해도 종합 단계에서 잡아낸다 |
| **OCR 원문 보존 / 번역 금지** — 간판·메뉴·가격 텍스트는 이미지에 있는 글자 그대로 | `prompts.py:_LANGUAGE_RULES` | 번역·의역이 곧 사실 왜곡 |

### 2-2. 교차검증 불일치 처리 (코드 레벨, LLM 호출 없음)

`image_insight/consensus.py`는 순수 함수다. 즉 **모델이 뭐라 하든 코드가 독립적으로 판정한다.**

- **신뢰도의 정의를 바꿔놨다.** 모듈 독스트링: "신뢰도(confidence)는 모델의 자기신고가 아니라 '두 모델의 일치도'로 산출한다." (`consensus.py` 독스트링)
- **불일치 유형별 플래그**: 도메인 불일치 시 `"도메인 불일치(Gemini=... / Claude=...)"`, 주요 피사체 Jaccard < 0.5면 `"주요 피사체 불일치"`, OCR Jaccard < 0.5면 `"OCR 텍스트 불일치"` (`_reconcile_one`)
- **양쪽 실패 = 신뢰도 0.0** + `"교차검증 불가(양쪽 모델 분석 실패)"`. 한쪽만 실패 = 신뢰도 **0.5 상한** + `"교차검증 불가(한 모델 실패) — 단일 모델 결과"` (`_reconcile_one`). 주석: "실패를 '합의'로 오인해 신뢰도가 부풀지 않게 한다"
- **짝이 없는 이미지**도 `"교차검증 불가(짝 없음)"`으로 표시 (`reconcile`)
- **빈 필드를 합의로 세지 않는다.** 양쪽 다 비어 있는 필드는 합의 계산에서 제외하고, 비교할 항목이 하나도 없으면 신뢰도 0.0 + `"분석 내용 부족 — 신뢰도 낮음"` (`_reconcile_one`)
- **짧은 토큰 오탐 방지**: 도메인 비교에서 2글자 이하는 부분일치를 인정하지 않고 정확 일치만 (`_domain_agree`)
- **과소평가도 막는다**: 어휘 차이("조종기"="리모컨")로 신뢰도를 깎지 않도록, 최종 신뢰도는 의미 판단을 하는 Stage 2 결과를 쓰고 **코드 레벨 글자 비교로는 깎지 않는다.** 다만 명백한 분석 실패만 캡 (`pipeline.py:_finalize_cross` 독스트링)

### 2-3. 생성 글에 대한 자동 품질검사 (`image_insight/blog/quality.py`)

`evaluate_draft`가 error/warning을 매기고 **error가 1건이라도 있으면 `passed=False`**. 점수는 `1.0 - error×0.34 - warning×0.08`.

**error(치명) 판정 항목**
| 규칙 | 근거 | 왜 |
|---|---|---|
| `[B]`/`[/B]`, `[H]`/`[/H]` 마커 짝이 안 맞으면 error | `evaluate_draft` 마커 균형 블록 | 네이버 에디터에 붙였을 때 서식이 깨진다 |
| **보유 이미지가 0장인데 `[이미지#n]` 마커가 있으면 error** | 같은 함수 images 블록 | 없는 이미지를 넣으라고 지시하는 글 = 사용 불가 |
| 마커 개수 ≠ 실제 삽입 가능 이미지 수 → error | 같음 | 이미지 수와 본문이 어긋나면 수동 보정 비용이 생긴다 |
| 마커 번호가 1..N 순서가 아니면 error | 같음 | 순서가 뒤엉키면 사진과 문맥이 어긋난다 |
| 가드레일 ON일 때 고위험 표현 발견 시 error — 차단 목록: `완치`, `치료합니다`, `치료해`, `100% 효과`, `부작용이 없`, `부작용 없음`, `질병을 예방`, `병이 낫` | `quality.py:_RISK_TERMS` | 건강기능식품·화장품 광고는 표현 하나로 법적 문제가 된다 |
| **사용자가 "쓰지 말라"고 적은 표현이 결과에 들어가면 error** | `evaluate_draft` cautions 블록 | 사용자 금지어는 하드 제약이다 |

**warning 판정 항목**
- **없는 가격 창작 의심**: 원본 사실(`ocr_data.prices`)에 가격이 없는데 본문에 `29,000원`/`₩29000`/`1만원` 같은 패턴이 나오면 경고 (`_PRICE_RE`, facts 체크)
- 본문 길이가 상위 블로그 평균 대비 ±30%를 벗어나면 경고
- 사용자 정식명칭이 제목·본문에 없으면 경고
- **사용자 핵심 내용 반영 검사**: 단순 문자열 포함이 아니라 핵심어를 토큰화해 조사·어미(`입니다/합니다/에서/으로/은/는/이/가`…)를 벗기고, 불용어를 걸러낸 뒤 **항목 길이에 따라 요구 커버리지를 다르게 적용**(3개 이하는 전부, 4~8개는 60%, 9개 이상은 35%·최소 6개). 미반영 핵심어까지 메시지에 찍어준다 (`_brief_terms`, `_brief_coverage`)
- 푸터 문구·URL이 본문에 안 들어갔으면 경고
- SEO 항목 전반 (§3)

### 2-4. 재작성 루프 — "한 번 더, 그러나 나빠지면 버린다"

`api/routes/blog.py`:
- 재작성 트리거: **검사 불통과이거나 점수 < 0.95** (`_REWRITE_SCORE_THRESHOLD`, env 조정 가능)
- **재작성으로 고칠 수 없는 항목은 트리거에서 제외**: `image_shortage`(사용자가 사진을 더 줘야 해결되는 문제)는 `_NON_REWRITE_CHECKS`로 빠진다 → LLM에게 못 고치는 걸 시키지 않는다
- 재작성 프롬프트에는 **원 초안 + 품질검사 문제 목록 + 수정 규칙**이 들어가고, 수정 규칙에 `"사실 데이터에 없는 정보, 가격, 후기, 효능은 새로 만들지 않습니다"`가 명시돼 있다 (`prompt_builder.py:build_revision_messages`)
- **채택 조건**: 재작성본 점수가 원본보다 높거나, 원본은 불통과인데 재작성본이 통과한 경우에만 교체. 아니면 원본 유지
- 재작성이 예외로 실패해도 원본 초안을 살려서 반환 (`except` → `logger.warning` 후 진행)
- 시도 이력을 `quality_attempts`로 전부 저장 → 사후 검증 가능

### 2-5. 표절 방지 — 경쟁 블로그를 '읽되 베끼지 않는' 구조

이게 이 저장소에서 가장 구조적으로 확실한 부분이다. **경쟁 블로그 본문이 애초에 시스템 안으로 들어오지 않는다.**

- 크롤러 모듈 독스트링: **"산출물은 메트릭만(본문 텍스트 미저장)"** (`image_insight/blog/naver_crawler.py`)
- 분석 모듈 독스트링: **"본문 텍스트는 저장하지 않으며, 메트릭(글자수·키워드·이미지수·톤)만 산출한다"** (`image_insight/blog/naver_analysis.py`)
- 매퍼 파일명 주석: **"크롤러 반환 dict → NaverStats (본문 제외, 메트릭만)"** (`naver_stats_mapper.py`)
- 타입에도 못 박혀 있다: `NaverBlogMetric` 필드는 `title_length / title_keyword_count / title_keyword_position / content_length / content_keyword_count / content_keyword_frequency / image_count / tone_analysis / comprehensive_style` — **본문을 담을 필드가 존재하지 않는다** (`blog/types.py`)
- 결과적으로 글 생성 프롬프트에 경쟁 글의 문장이 단 한 줄도 전달되지 않는다. 전달되는 건 숫자와 분포뿐 (`prompt_builder.py:_metrics_summary`)

### 2-6. 리뷰 표절·왜곡 방지 (Place Blog)

`image_insight/place/review_signals.py` 모듈 독스트링: "The generator should not copy review text wholesale."

- **부정 리뷰가 하나라도 섞인 리뷰는 통째로 제외**: `_NEGATIVE_TERMS`(불친절/별로/아쉽/최악/실망/비싸/냄새…) 포함 시 `continue`
- **긍정 표현과 정보성 표현이 둘 다 있는 리뷰만 채택**: `if not positive_hits or not info_hits: continue`
- **원문 카운트가 아니라 문서 빈도(document frequency)** 로 센다 — 한 리뷰가 "맛있"를 5번 써도 1로 센다 (`positive_counts.update(set(positive_hits))`, 독스트링 명시)
- **반복 임계**: 표본 2건 이상이면 최소 2회 반복된 신호만 채택 (`minimum = 2 if len(texts) >= 2 else 1`)
- **신뢰도 3단계**: `repeated`(2건 이상 반복) / `single_sample`(표본 1건) / `none`
- **인용 길이 제한**: 근거 스니펫은 90자로 잘리고 최대 4개 (`_compact_snippet(max_chars=90)`, `limit_snippets=4`)
- **프롬프트에 사용 조건을 명시**: "confidence가 single_sample이면 '많은 방문자가' 같은 다수/반복 표현을 쓰지 말고 참고 신호로만 다룬다. **confidence가 none이면 리뷰 내용을 근거로 새 평가를 만들지 않는다**" (`prompt_builder.py:targets["리뷰_활용_규칙"]`)

### 2-7. 이미지 승인 게이트 + 사용자 이미지 우선

- **AI 이미지는 기본 꺼져 있다**: `AI_IMAGE_ENABLED` 미설정 시 비활성, provider가 fal이 아니거나 `FAL_KEY`가 없어도 비활성 (`ai_images/policy.py:is_enabled` → `disabled_by_admin` / `provider_not_supported` / `missing_fal_key`)
- **승인 필수가 API 응답에 상수로 박혀 있다**: `CapabilityResponse(requires_approval=True)` (`policy.py:capability`)
- **승인된 것만 본문에 들어간다**: 합성 시 `asset.status == "approved"` **그리고** 요청에 명시된 asset id인 것만 통과 (`ai_images/composer.py:compose`의 `approved_by_id`)
- **삽입 순서는 user → ai_generated**: 사용자 이미지가 `[이미지#1]`부터 번호를 먼저 가져가고, AI 이미지는 그 뒤 번호부터 (`composer.compose`의 `start_index = user_count + existing_ai_count + 1`)
- **Place 사진은 분석에만 쓰고 본문에 넣지 않는다**: `image_policy.py` 모듈 독스트링 — "Analysis images and insertable blog images are intentionally separate. Place photos can inform the writing, but only user-provided images should become `[이미지#n]` markers." 프롬프트에도 `reference_only` 역할로 명시 (`prompt_builder.py:_analysis_image_plan`)
- **비용 오폭 방지**: 생성 시작 시 클라이언트가 보낸 예상 크레딧과 서버 계산값이 다르면 거부 (`ai_images/service.py:start_jobs` → `estimated_credits_mismatch`), 같은 plan이 이미 실행 중이면 중복 거부(`job_already_running`)
- 쿼터: 요청당 최대 4장(상한 12), 일 20장 / 월 200장 (`policy.py:max_images_per_request`, `daily_quota`, `monthly_quota`)

### 2-8. 생성 실패·열화 처리

- **출력 스키마 강제**: Claude는 tool_use(`emit_blog`) + JSON Schema로, OpenAI는 `response_format={"type":"json_object"}`로 강제 (`generator.py`)
- **부실 출력은 성공으로 치지 않는다**: `title_candidates`가 비었거나 문자열 배열이 아니면, `body_markdown`이 빈 문자열이면 → `BlogGenerationError`로 실패 처리하고 재시도/failover 경로로 보낸다 (`generator.py:_to_draft`)
- **2단 failover**: Claude 재시도 → 전부 실패 시 GPT 백업 → 그것도 실패하면 명시적 에러 (`_generate_with_failover`)
- **Stage 2 실패 시 열화 동작**: Claude 종합이 죽어도 Stage 1 결과만으로 인사이트를 구성하되 `stage2_failed` 플래그를 남기고, 신뢰도 0.5 미만이면 `low_confidence`를 추가 (`stage2_claude.py:_degrade`)
- **수집 부분 실패 허용**: 플레이스 수집은 실패 항목을 `warnings`에 기록하고 진행 (`place/types.py:PlaceData.warnings`)
- **통계 표본 수를 메타데이터가 아니라 실제 파싱된 건수로 신뢰**: 주석 — "메타데이터만 믿으면 스키마 드리프트 시 허수 통계로 폴백이 건너뛰어질 수 있음" (`naver_stats_mapper.py:map_crawler_result`)
- **빈 키워드로 크롤러를 호출하지 않는다** (`naver_collector.py:collect_with_fallback` 독스트링: "carbage 검색 방지")

### 2-9. 보안 게이트

- SSRF 방어: scheme 화이트리스트 + DNS 해석 후 IP 검사, 리다이렉트 미추종(`follow_redirects=False`) (`preprocessor.py`)
- 디컴프레션 밤 방어: 픽셀 수 상한 + 스트리밍 중 누적 바이트 초과 시 중단 (`preprocessor.py:normalize`, `_decode_source`)
- 로컬 파일 입력 기본 차단 + 허용 시에도 base 디렉터리 밖 경로 거부 (`preprocessor.py`)
- 에러 응답에 원본 예외를 노출하지 않고 상관 ID만 반환 (`api/routes/blog.py:_fail`)
- 수집 동시 실행 세마포어(기본 2), job 개수 상한(500) 초과 시 오래된 것부터 제거, insight 페이로드 2MB 초과 시 413 (`api/routes/blog.py`)

### 2-10. 정확도 자체를 측정하는 하네스

`eval/run_eval.py` + `eval/ground_truth.json` — 사람이 이미지를 직접 보고 만든 정답표로 AI 결과를 채점한다.

- 채점 항목: **도메인 / 핵심엔티티 누락 / OCR 누락 / 장소환각없음 / 장소추출됨** (`score_one`)
- `place_should_be_empty`: 제품·식재료 사진에서 place가 채워지면 **환각으로 감점**
- `place_should_have_content`: 진짜 카페 사진인데 place가 비면 감점 — 주석: "실제 장소는 place가 채워져야 함 — **과도한 억제 방지** 검증"
- **일관성(재현성) 측정**: 같은 이미지를 N회(기본 2회) 돌려 도메인 동일 여부 + 피사체 겹침 + 속성라벨 겹침 평균으로 안정성 점수를 내고, 0.8 미만이면 "불안정 — 실행마다 결과 변동"으로 출력 (`_consistency`)

---

## 3. 도메인 판단이 박혀 있는 지점 (SEO·블로그 마케팅 노하우) ★

핵심 설계 사상: **SEO 규칙을 개발자가 하드코딩하지 않고, 그 키워드의 상위 노출 글에서 실측해 목표값으로 삼는다.** 고정 상수는 실측이 없을 때의 폴백으로만 쓴다.

### 3-1. 상위 노출 글에서 실제로 뽑는 지표

`prompt_builder.py:_metrics_summary`가 LLM에 넘기는 통계 목록:

| 지표 | 설명 |
|---|---|
| 표본수 | 실제 분석에 성공한 상위 글 수 |
| 평균_제목길이 | 글자 수 |
| 제목_키워드포함률 | 상위 글 중 제목에 키워드가 든 비율 |
| 제목_키워드위치_분포 | front / middle / back 분포 |
| 평균_본문키워드반복 | 본문 내 키워드 등장 횟수 |
| 평균_본문키워드빈도 | 100자당 밀도 |
| 평균_제목키워드반복 | |
| 글스타일_분포 | `격식-톤-문장길이` 조합 |
| 톤_분포_표본 | Positive / Negative / Neutral |
| (별도) 평균 이미지 수 | `NaverStats.avg_images` |
| (별도) 평균 글자수 | `NaverStats.average_characters` |

### 3-2. 키워드 위치 판정 로직 (도메인 지식이 코드가 된 곳)

`image_insight/blog/naver_analysis.py:analyze_title` — 제목 안 키워드 위치를 3구간으로 나눈다:
- 첫 등장 위치가 제목 길이의 **30% 이하 → `front`**
- **70% 이상 → `back`**
- 그 사이 → `middle`

그리고 한국어 검색 키워드의 실제 표기 흔들림을 3단계로 흡수한다:
1. 정확 일치
2. 공백 제거 후 일치 → 위치를 원문 비율로 환산해 복원
3. 그래도 없으면 **키워드를 의미 단위로 쪼개서** 부분 일치 시도. 쪼개는 기준이 블로그 마케팅 도메인 지식이다 — 행동 접미사 목록 `추천 / 후기 / 방법 / 효과 / 정보 / 가격 / 사용법 / 리뷰 / 내돈내산` (`_ACTION_SUFFIXES`, `split_keyword_into_meaningful_parts`)

키워드 카운팅도 한국어를 고려한다: "김포 카페"처럼 띄어쓴 키워드는 붙여쓴 형태도 세고, 붙여쓴 키워드는 모든 분리 지점에 대해 공백 삽입 정규식을 만들어 센다 (`count_exact_keyword_matches`).

문체 분석 사전도 직접 만들었다: 긍정 10개(`좋은/훌륭한/완벽한/최고/추천/만족/성공/도움/유용/좋아`), 부정 8개, 격식체 5개(`입니다/습니다/였습니다/하겠습니다/드립니다`), 비격식체 6개(`해요/예요/이에요/거예요/에요/아요`). 문장 평균 길이 **50자 초과 Long / 25자 초과 Medium / 이하 Short** → `격식-톤-문장길이` 종합 스타일 문자열 (`analyze_writing_style`).

### 3-3. 검사기가 적용하는 SEO 임계값 (`quality.py:_add_seo_issues`)

| 항목 | 규칙 | 근거 |
|---|---|---|
| 제목 길이 | 수집 평균의 **0.7배 ~ 1.3배**(하한 8자, 상한은 최소 하한+4자). 표본이 없으면 폴백 **15~30자** | `_title_length_target`, `_TITLE_FALLBACK_MIN/MAX` |
| 제목 키워드 포함 | 상위 표본의 **50% 이상**이 제목에 키워드를 넣었으면 우리도 필수 | `_title_keyword_presence_ratio`, `require_title_keyword` |
| 제목 키워드 위치 | 표본 최빈값이 `front`면 제목이 키워드로 **시작**해야 함 | `_recommended_title_position` |
| 첫 문단 키워드 | 상위 평균 본문 키워드 반복이 **1회 이상**이면 첫 문단에 키워드 필수 | `content_target >= 1` 분기 |
| 소제목 최소 개수 | 본문 **800자 이상**이면 소제목 **최소 2개** | `len(headings) < 2 and len(visible_body) >= 800` |
| 소제목 키워드 반영 | 상위 평균 본문 키워드 반복이 **2회 이상**이면 소제목의 **절반 이상**(`ceil(n*0.5)`)에 키워드 | heading_hits / required 계산 |
| 연관 키워드 | 상위 5개 중 **최소 `min(3, ceil(n*0.6))`개**를 본문에 반영 | `_top_related_keywords`, `required_related` |
| 본문 키워드 반복량 | 상위 평균이 2회 이상이면 최소 그 **절반**은 반복 | `target_repeats` 블록 |
| 글자수 | 상위 평균 **±30%** | `evaluate_draft` length 블록 |

**중요한 디테일**: 경고 메시지에 판정 근거를 함께 찍는다 — 예 `"제목 후보에 수집 키워드 'X'가 직접 포함되지 않았습니다(수집 표본 제목 키워드 포함률 67%)"`. 실측 기반인지 폴백 기준인지 사용자가 구분할 수 있다.

### 3-4. 프롬프트에 명시된 SEO·작성 지식

`prompt_builder.py:targets["SEO_작성규칙"]` (원문):
> 제목 길이, 제목 키워드 위치, 본문 키워드 반복은 상위블로그_상세통계의 평균과 분포를 우선 따릅니다. 제목_키워드위치_분포에서 front가 우세하면 최소 1개 제목은 수집 키워드로 시작합니다. 평균_본문키워드반복이 1 이상이면 첫 문단에 수집 키워드를 자연스럽게 1회 포함합니다. 평균_본문키워드반복이 2 이상이면 소제목의 절반 이상에 수집 키워드 또는 핵심 표현을 넣습니다. **연관키워드는 상위 3개 이상을 본문에 자연스럽게 분산하되 키워드 나열 문장으로 만들지 않습니다.** 이미지가 부족할 때는 소제목 구조, FAQ/요약성 문단, 정보 밀도로 보완합니다.

### 3-5. 이미지 배치 규칙 (`prompt_builder.py:targets["이미지_배치_규칙"]`)

- 기본 레이아웃은 **"각 소제목 앞(섹션 시작)에 이미지 1장"** — `[이미지#n]`을 해당 `[소제목]` 바로 앞 줄에 둔다
- 첫 대표 이미지는 **도입부 뒤**
- **이미지 수 < 소제목 수**면 앞쪽 주요 소제목부터 우선 배치하고 나머지는 정보 밀도로 보완
- "이미지를 소제목 앞이 아닌 문단 중간에 흩뿌리지 않는다"
- `insertable_image_count == 0`이면 마커를 아예 쓰지 않는다
- 마커 세부 규칙(`prompts/mode_*.txt`): `[이미지#n]`은 독립된 줄에 단독, 앞뒤 빈 줄 정확히 1개, **연속 배치 금지 — 사이에 소제목 + 본문 3문장 이상**

### 3-6. 문체 규칙 (블로그 글이 'AI 티' 나지 않게)

`image_insight/blog/prompts/mode_a_review.txt`, `mode_b_factual.txt`:
- **종결어미 다양화**: `~거든요/~잖아요/~더라고요/~네요/~할 수 있어요`, **`~합니다`는 20% 이하**
- **같은 종결어미 3문장 연속 금지**
- **"첫째/둘째" 나열식 금지**, 짧은 문장과 긴 문장 섞기
- **서론 첫 문장에 메타 설명 금지** — "~를 정리합니다/알아보겠습니다" 금지, 독자 경험·감정에 공감하는 톤으로
- `[B]` 강조는 글 전체 최소 5개, 각 소제목 본문에 1~2개
- `[H]`는 사용자 입력 정보가 든 **문장 전체**에 적용(단어 단위 금지)
- 구조 템플릿: 서론(대화체) → `[이미지#1]` → `[소제목]`본문 → `[이미지#2]` → … → 결론 → `[소제목]`내용 요약 정리 → 요약(3~5문장)
- 제목 후보 **3개, 각 15~25자**, 수집 키워드 포함 + 후킹 요소
- 마크다운 문법 사용 금지(네이버 에디터가 마크다운을 안 받으므로 순수 텍스트 + 자체 마커)
- **가독성 후처리는 코드가 한다**: 프롬프트에 "줄바꿈 형식은 신경 쓰지 말고 글의 완성도에만 집중하라"고 하고, 실제로 `generator.py:_format_sentences`가 문장 끝(`.!?` + 닫음표) 뒤 공백을 줄바꿈으로 바꿔 **한 문장 = 한 줄**로 정돈한다. 소수점 숫자는 뒤에 공백이 없어 보호된다

### 3-7. 두 가지 작성 모드의 경계 (마케팅 판단)

| | 모드 A 리뷰형 | 모드 B 정보형 (기본값) |
|---|---|---|
| 1인칭 경험·감정 | **창작 허용** ("써보니~", "고민이었는데~") 단, 제공된 사실을 벗어나면 안 됨 | **금지** — 가상 인물·경험을 만들지 않음 |
| 창작 허용 범위 | 경험·상황 묘사까지 | **"읽기 좋게 잇는 문장 연결·구성"까지만** |
| 공통 | 브랜드·제품명·성분·효능 표기·용량·인증은 정확히 유지, 가격 등 빈 값은 지어내지 않음 | 동일 |

### 3-8. CTA·푸터 배치 규칙

`prompt_builder.py:targets["푸터_배치_규칙"]`: "footer.text 또는 footer.url이 있으면 **글 맨 아래 안내 문단**에 배치합니다. 푸터는 **본문 중간 광고 문구로 섞지 말고** 마지막에 독자가 확인할 수 있게 둡니다."
LLM이 빠뜨리면 코드가 `[소제목]안내` 섹션을 만들어 강제 부착한다 (`generator.py:_apply_footer`).

### 3-9. 법적 가드레일 (광고 심의 도메인 지식)

`image_insight/blog/guardrails.py:_BASE_RULES` — 옵션 ON일 때 프롬프트에 삽입되는 5개 규칙:
1. 질병의 예방·치료 효능을 단정하거나 암시하지 말 것
2. 효능·효과는 제공된 사실(인증 문구 등)을 넘어서 과장하지 말 것
3. 인증·표시 문구는 입력된 값 그대로만 사용할 것(예: '식약처 인정')
4. 체험·후기 톤은 객관적 사실을 왜곡하지 않는 범위로 제한할 것
5. 필요 시 '개인차가 있을 수 있습니다' 등 주의/면책 문구를 포함할 것
+ 사용자가 추가한 주의사항은 `(사용자 지정)` 접두로 덧붙는다.

### 3-10. 키워드 전략 (검색용 vs 본문용 분리)

- **글에 반드시 들어갈 이름**(브랜드+제품명, 플레이스명)과 **검색량을 볼 수집 키워드**(카테고리)를 분리한다 — 상호명으로 검색하면 경쟁 표본이 안 나오기 때문 (`blog/keywords.py` 모듈 독스트링)
- 효능 키워드는 **첫 구절만** 잘라 짧은 검색어로 만든다 (긴 효능 문구는 검색어가 아니므로)
- Place는 **"지역 + 업종"을 1순위**로 둔다 (`place/keywords.py:place_keywords`, score 1.0). 지역은 도로명 주소의 3번째(없으면 2번째) 토큰으로 추출 → 시/도가 아닌 읍·면·동 단위
- 수집 표본이 3건 미만이면 정확 상호명으로 재수집 (`collect_with_fallback`)
- 수집 건수는 **5~10건으로 강제 클램프** (`blog/config.py:clamp_collect_count`)

### 3-11. 플레이스 리뷰 해석 규칙

- **최근 90일 방문 리뷰만** 재방문율 계산에 쓴다 (`collector.py:_summarize_review_facts`, `timedelta(days=90)`) — 오래된 리뷰로 현재 상태를 말하지 않기 위해
- 방문 동행 코드 8종·방문 목적 5종을 한국어 라벨로 매핑 (혼자 / 연인·배우자 / 친구 / 지인 / 가족 / 부모님 / 친척 / 기타, 데이트 / 친목·모임 / 일상 / 나들이 / 여행)
- 리뷰 본문은 최대 20건까지만 취급

---

## 4. 검증 가능한 숫자

| 항목 | 값 | 근거 |
|---|---|---|
| 시스템 수 | 3 (이미지 분석 / Image Blog / Place Blog) | `README.md` |
| Image Blog 위저드 단계 | **6단계** | `web/app/blog/page.tsx:61-69` |
| Place Blog 위저드 단계 | **8단계** | `web/app/place/page.tsx:152-162` |
| 이미지를 직접 보는 비전 AI | **2개** (Gemini + Claude, 독립 병렬) | `pipeline.py:analyze_images` |
| LLM 단계 수 (이미지 분석) | **3** (Stage 1 / 1b / 2) | `pipeline.py` |
| 글 생성 LLM | 메인 1 + 백업 1 (failover) | `blog/generator.py` |
| 이미지 분석 관점 | **5** (place/mood/ocr/objects/visual) + 도메인 적응형 attributes 6~10개 | `prompts.py` |
| 품질검사 카테고리 | 10종 (markers, images, image_shortage, length, facts, guardrail, seo, target, brief, cautions, footer, keyword) | `quality.py:QualityIssue.check` 사용처 |
| 차단 고위험 표현 | 8개 | `quality.py:_RISK_TERMS` |
| 법적 가드레일 기본 규칙 | 5개 | `guardrails.py:_BASE_RULES` |
| 리뷰 필터 사전 | 긍정 25개 / 부정 15개 / 정보성 39개 | `place/review_signals.py` |
| 문체 분석 사전 | 긍정 10 / 부정 8 / 격식 5 / 비격식 6 | `blog/naver_analysis.py` |
| 자동 재작성 | 최대 1회, 점수 개선 시에만 채택 | `api/routes/blog.py` |
| 재작성 트리거 점수 | < 0.95 | `_REWRITE_SCORE_THRESHOLD` |
| 경쟁 블로그 수집 | 5~10건(클램프), 최소 표본 3건 미만 시 폴백 재수집 | `blog/config.py`, `naver_collector.py` |
| 글자수 허용 오차 | ±30% | `quality.py` |
| 이미지 장변 상한 | 1536px (256~8192 조정 가능) | `config.py` |
| 배치당 최대 이미지 | 20장, 파일당 20MB | `config.py` |
| 플레이스 캐시 TTL | 24시간 | `README.md`, `place/cache.py` |
| 플레이스 이미지 cap | 8 (env 기본) / 라우트 기본 10 | `README.md`, `api/routes/place.py:_IMAGE_CAP` |
| AI 이미지 쿼터 | 요청당 4장(최대 12), 일 20 / 월 200 | `ai_images/policy.py` |
| 재방문율 산정 기간 | 최근 90일 | `place/collector.py` |
| 테스트 함수 수 | **215개** (README 기준 221 passed, 3 skipped) | `image_insight/tests`, `api/tests` grep |
| 커밋 수 | **126** | GitHub API |
| 추적 파일 수 | **282** | `git ls-files` |
| Python 코드 | 약 **11,800줄** | `wc -l` |
| TypeScript/TSX 코드 | 약 **16,500줄** | `wc -l` (node_modules 제외) |
| 개발 기간 | 2026-06-26 최초 커밋 ~ 2026-07-01 최종 갱신 | GitHub API `created_at` / `updated_at` |

---

## 5. 일반 접근과의 대조

**"ChatGPT로 블로그 글 쓰기" — 상식선 3단계**
1. "○○ 카페 블로그 글 써줘"라고 프롬프트를 넣는다
2. 나온 글을 복사한다
3. 어색한 데를 손으로 고친다

여기서 검증되는 것은 아무것도 없다. 가격도, 메뉴도, 분위기도 모델이 지어낸 것인지 알 방법이 없고, 그 키워드의 상위 노출 글이 몇 자짜리인지도 모른 채 쓴다.

**Factto — Place Blog 기준 8단계 위저드 / 백엔드 17개 처리 단계** (§1 표)

같은 "블로그 글 한 편"을 만드는 데 이 시스템이 추가로 하는 일:

| 일반 접근 | Factto |
|---|---|
| 모델 1개가 사진을 본다 (또는 안 본다) | **Gemini와 Claude가 같은 사진을 따로 보고**, 코드가 Jaccard로 일치도를 계산해 신뢰도를 매기고, 한쪽이 실패하면 신뢰도 상한을 0.5로 깎는다 (`consensus.py`) |
| 신뢰도는 모델이 스스로 말한 숫자 | 신뢰도는 **두 모델의 일치도** — "모델의 자기신고가 아니라"라고 코드 독스트링에 명시 (`consensus.py`) |
| 없는 정보는 그럴듯하게 채워진다 | "근거 없으면 비워라"가 프롬프트 규칙이고, **사실에 가격이 없는데 본문에 가격 표현이 나오면 검사기가 경고**한다 (`quality.py:_PRICE_RE`) |
| 상위 노출 글은 눈으로 몇 개 훑어본다 | 상위 글 5~10편을 자동 방문해 **제목 길이·키워드 위치(front/middle/back)·본문 키워드 밀도·이미지 수·톤·문장 길이**를 실측해 목표값으로 삼는다 (`naver_analysis.py`) |
| 상위 글을 참고한다 = 문장을 베낀다 | **본문 텍스트가 시스템에 저장조차 되지 않는다.** `NaverBlogMetric` 타입에 본문 필드가 없다 (`blog/types.py`) |
| SEO 규칙은 "제목은 30자 정도" 같은 통설 | 임계값을 **그 키워드의 실측 평균에서 계산**한다(제목 길이 = 평균 ×0.7~×1.3). 실측이 없을 때만 15~30자 폴백 (`quality.py:_title_length_target`) |
| 다 쓰고 나면 끝 | **자동 품질검사 10종** → 문제가 있으면 문제 목록을 넣어 1회 재작성 → **점수가 올라갔을 때만 교체**, 시도 이력 전부 저장 (`quality.py`, `api/routes/blog.py`) |
| 이미지는 알아서 끼워 넣는다 | 마커 개수가 실제 보유 이미지 수와 다르면 **error로 불통과**. AI 생성 이미지는 **사람이 승인한 것만** 본문에 들어가고, 순서는 항상 사용자 사진이 먼저 (`quality.py`, `ai_images/composer.py`) |
| 리뷰를 붙여넣어 요약시킨다 | 부정 리뷰 섞인 건 제외, **문서 빈도 2회 이상 반복된 신호만** 채택, 표본 1건이면 "많은 방문자가" 같은 표현을 금지, 인용은 90자 컷 (`place/review_signals.py`) |
| 정확한지는 알 수 없다 | 사람이 만든 정답표로 **도메인·핵심엔티티·OCR·장소환각**을 채점하고, 같은 이미지를 N회 돌려 **재현성**까지 측정한다 (`eval/run_eval.py`) |

한 줄로: **일반 접근은 "생성"에서 끝나고, 이 시스템은 생성 이후에 검사·재작성·승인이라는 3개의 관문이 더 있다.** 그리고 그 관문의 통과 기준은 개발자의 취향이 아니라 그 키워드로 실제 상위 노출된 글에서 뽑은 숫자다.

---

## 6. 규모 지표

| 항목 | 값 |
|---|---|
| 추적 파일 수 | 282개 (`git ls-files`) |
| 주요 언어 | Python(백엔드 라이브러리·API) + TypeScript/React(프론트) — GitHub 분류 언어는 TypeScript |
| Python 코드 | 약 11,800줄 (테스트 포함) |
| TypeScript/TSX | 약 16,500줄 (node_modules 제외) |
| 백엔드 모듈 코드 | 약 7,170줄 (`image_insight/**`, `api/routes/**`, 프롬프트 텍스트 포함, 테스트 제외) |
| 테스트 | 215개 테스트 함수 (README: 221 passed, 3 skipped, 외부 호출 모킹으로 비용 0) |
| 커밋 수 | 126 |
| 기술 스택 | FastAPI, Pydantic, httpx, aiohttp, Playwright, Pillow, Supabase/Postgres / Next.js 16, React 19, Tailwind 4, shadcn/ui |
| 외부 AI | Gemini(비전 1차), Claude(비전 2차 + 종합 + 글 생성), OpenAI(글 생성 백업), fal.ai(이미지 생성, 선택) |
| 저장소 상태 | Private, 2026-06-26 생성 |

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

**7-1. 시크릿 (가장 중요)**
`.env`가 **실제 API 키가 담긴 채로 커밋되어 있다**. `.gitignore` 1행에 "개인 비공개 백업 저장소 — 시크릿(.env/superbase/.mcp.json)도 의도적으로 커밋함"이라고 적혀 있다. 포함된 키: `GEMINI_API_KEY`, `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_DB_PASSWORD`, `SUPABASE_SECRET_KEY`, `FAL_KEY`, `AUTH_JWT_SECRET`, `AUTH_MASTER_EMAILS`.
→ **저장소를 공개하거나 파일 트리·스크린샷을 포트폴리오에 노출하면 안 된다.** 별도로 키 로테이션을 권한다.

**7-2. 실명이 노출된 자산 (본문에 절대 인용 금지)**
- `web/lib/demo/place.json` — 실제 상호명·전화번호·도로명 주소가 담긴 데모 데이터
- `eval/ground_truth.json` — 실제 카페 상호명이 정답표 라벨로 들어 있음
- `web/public/demo/*.png`, `image test/*` — 실제 브랜드·제품 이미지와 제품명(정답표에도 기재)
→ 포트폴리오 스크린샷을 쓸 경우 상호명·전화번호·주소·브랜드명을 반드시 가려야 한다.

**7-3. 개인 경로 노출**
`image_insight/place/collector.py` 모듈 독스트링에 개인 PC의 로컬 절대 경로가 원천 출처로 적혀 있다. 코드 스니펫을 인용할 때 이 줄은 제외할 것.

**7-4. 표현에 주의가 필요한 기능**
- `blog/naver_crawler.py`에 봇 감지 회피용 브라우저 인자와 stealth 스크립트(`navigator.webdriver` 위장 등)가 있다. 포트폴리오에서는 "수집 안정화" 수준으로만 언급하고 회피 기법 자체를 강조하지 않는 편이 안전하다.
- 네이버 플레이스·블로그 수집은 **비공식 공개 엔드포인트** 의존이라고 README에 명시돼 있다. "공식 API 연동"으로 표현하면 사실과 다르다.

**7-5. 미완성·제약 (성과로 과장 금지)**
- `api/routes/blog.py` 상단 주석: 상태가 프로세스 인메모리라 **단일 워커로만 배포**해야 하며, 해당 라우터에는 **인증·레이트리밋이 없다**(별도 `api/routes/auth.py`는 존재).
- `naver_analysis.py:aggregate`가 반환하는 `similar_keywords`는 항상 빈 dict다. 즉 §3-3의 **연관 키워드 검사 로직은 구현돼 있으나 현재 크롤러 경로에서는 데이터가 채워지지 않는다.** "연관 키워드 자동 반영"을 완성 기능으로 소개하면 안 된다.
- `preprocessor.py` 주석: DNS-rebinding TOCTOU는 **MVP 잔여 위험으로 수용**한다고 명시.
- AI 이미지 생성은 **기본 비활성**(`AI_IMAGE_ENABLED` 필요)이며 fal.ai 키가 있어야 동작한다.
- `pipeline.py:analyze_images`의 `options` 인자는 현재 MVP에서 적용되지 않는 예약 매개변수다(독스트링 명시).

**7-6. 그 외** — 위 항목 외에 포트폴리오 사용을 막는 요소는 발견되지 않았다.
