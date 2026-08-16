# MKT Automation 팩트 시트
저장소: MARKETING_SEO_AUTOMATION | 분석일: 2026-08-16

> 모든 항목은 실제 코드에서 확인한 내용이며, 각 항목에 근거 파일 경로를 붙였다.
> 경로는 저장소 루트 기준 상대 경로다.

---

## 1. 실제 파이프라인 단계

### 1-A. 네이버 블로그 자동화 파이프라인 (핵심 · 13단계)

#### 1단계 — 키워드 발굴과 수량화
네이버 검색광고 API로 연관 키워드를 최대 50개까지 수집하고, 각 키워드에 **추천 점수**를 매긴다.
점수 공식은 코드에 하드코딩되어 있다: `검색량 점수(log10 스케일 ×20, 상한 100) × 0.5 + 경쟁도 역점수(100−경쟁도) × 0.3 + CPC 역점수(100−CPC/100) × 0.2`.
API 키가 실패하면 다음 키로 로테이션하고, 그래도 실패하면 네이버 데이터랩(무료)으로 폴백한다.
- `naver_search_api.py:766-784` (`_calculate_recommendation_score`)
- `naver_search_api.py:168-212` (`_try_next_api_key`, `_make_request_with_fallback`)
- `naver_search_api.py:454-520` (`get_related_keywords`, max_results 기본 50)
- `config.py` NAVER_DATALAB_CONFIG (`'use_as_fallback': True`)
- `keyword_analyzer_service.py` (Gemini 기반 키워드 분석 보조)

#### 2단계 — 상위 노출 블로그 수집 (크롤링)
Selenium으로 네이버 통합검색 → 블로그 탭 → 상위 N개 포스트 링크를 수집하고, 각 포스트를 새 탭에서 연 뒤 본문을 추출한다.
네이버는 본문 드래그·복사를 막아두므로 **iframe / JavaScript / 클립보드 / DOM 4가지 추출 경로**를 순차 시도한다.
봇 탐지 회피를 위해 User-Agent 강화, 랜덤 지연, `simulate_human_behavior()`를 사용한다.
- `enhanced_naver_blog_crawler.py:390-485` (`get_blog_links`)
- `enhanced_naver_blog_crawler.py:720-1017` (`crawl_single_blog`)
- `enhanced_naver_blog_crawler.py:78-103` (`simulate_human_behavior`)
- `naver_blog_crawler.py` (3,058줄 — 원본 크롤러), `external_scraping_service.py` (ScrapFly/ScraperAPI/Bright Data/프록시 로테이션 폴백 체인)

#### 3단계 — 상위 블로그 역공학 (알고리즘 파악의 핵심)
수집한 상위 블로그를 **정량 통계로 환산**한다. 이 통계가 이후 모든 생성 단계의 제약 조건이 된다.
개별 블로그마다 계산하는 값:
- 본문 글자수 (`content_length`)
- **본문 이미지 개수** — `postfiles.pstatic.net` / `blogfiles.pstatic.net` 도메인 이미지만 카운트해 광고·프로필 이미지를 배제 (`enhanced_naver_blog_crawler.py:868-912`)
- 제목·본문 키워드 정확 매칭 횟수 — 띄어쓰기 변형은 허용하되 중간 삽입("오창노무사" vs "오창, 세종 노무사")은 불허하는 전용 매칭기 (`enhanced_naver_blog_crawler.py:570-604`, `_count_exact_keyword_matches`)
- 제목 내 키워드 위치 — 30% 이전이면 `front`, 70% 이후면 `back`, 나머지 `middle` (`enhanced_naver_blog_crawler.py:529-536`)
- 문체 — `{Formal|Informal|Mixed}-{Positive|Negative|Neutral}-{Long|Medium|Short}` 3축 조합 라벨. 평균 문장 길이 50자 초과 = Long, 25자 초과 = Medium (`enhanced_naver_blog_crawler.py:671-718`)
- 댓글 수 / 좋아요 수 (`enhanced_naver_blog_crawler.py:925-965`)

집계 통계:
- `avg_characters`, `avg_images`, `avg_keyword_mentions`, `keyword_density = (평균키워드횟수 × 키워드길이 / 평균글자수) × 100`, `dominant_style`, `dominant_tone` — `backend/api/routes/blog.py:408-474`
- 첫 문단 키워드 밀도 (첫 200자 기준) — `content_enhancer.py:3098-3128`
- 소제목 키워드 포함률 (%) — `content_enhancer.py:3130-3162`
- 제목 최적 길이 범위 (평균 ±5자, 10~50자로 클램프) — `content_enhancer.py:3238-3267`
- 제목 패턴 분류 5종 (질문형/방법제시형/추천형/후기형/정보전달형) — `backend/api/routes/blog.py:132-142`
- 효과적 키워드 조합 (키워드 앞뒤 단어 상위 3개) — `content_enhancer.py:3199-3236`
- 평균 해시태그 개수 (1~3개로 클램프) — `content_enhancer.py:3269-3301`

#### 4단계 — SEO 제목 생성 (데이터 기반)
`title prompt.txt`에 3단계에서 뽑은 **15개 변수**를 치환해 넣고 GPT로 제목 5개를 생성한다.
넣는 변수: `avg_keyword_count`, `position_korean`, `total_blogs`, `sample_titles`(상위 10개 실제 제목), `title_style_analysis`, `dominant_structure_pattern`, `top_emotional_trigger`, `optimal_title_length`, `proven_title_formula`, `missed_keyword_combinations`, `differentiation_points`, `market_opportunities`, `sentence_style_guide` 등.
- `backend/api/routes/blog.py:88-312` (`generate_seo_titles_with_prompt`), 변수 치환은 `:197-213`
- `title prompt.txt` — 출력 형식에 각 제목별 근거 메타(데이터 기반 / 키워드 위치 / 반복 횟수 / 스타일 매칭 / 후킹 요소)를 강제

#### 5단계 — 최신 정보 수집과 다중 소스 교차 검증
Perplexity(`sonar-pro`) · Tavily · Claude Web Search **3개 소스를 병렬(asyncio)로** 호출한다.
- `multi_source_collector.py:26-443` (PerplexityClient / TavilyClient / ClaudeWebSearchClient / MultiSourceCollector)
- `backend/services/google_blog/multi_source_info_collector.py:24-800` (구글 블로그용 동일 구조)
- 검색 프롬프트에 `"검색에서 실제로 찾은 정보만 포함하고, 추측하거나 만들어내지 마세요"`, `"최소 1500자 이상"`, `"최근 1년 이내"` 명시 — `perplexity_api.py:304-322`
- 수집된 출처는 키워드 관련성 필터를 거쳐 본문 하단 "참고한 정보 출처" 섹션으로 포맷 — `source_formatter.py:16-90`

#### 6단계 — 본문 생성 (모델별 전용 프롬프트 + 29개 파라미터)
`content_enhancer.generate_blog_content_with_prompt_file()`은 **29개 인자**를 받아 프롬프트 템플릿에 치환한다. 인자 대부분이 3단계에서 계산한 경쟁사 통계다.
`PromptAdapter`가 선택 모델에 따라 다른 프롬프트 파일을 로드한다 (GPT → `gpt prompt.txt`, Claude → `claude prompt.txt`(XML 태그판), Gemini → `gemini prompt.txt`). 모델별로 이모지 허용/반복 허용/부정 지시 허용 여부까지 설정이 다르다.
- `content_enhancer.py:1218-1377` (함수 시그니처 `:1218-1238`, 치환 `:1270-1302`)
- `prompt_adapter.py:41-79` (파일 매핑 + 모델별 `model_configs`)
- 스타일이 "스토리"면 별도 스토리텔링 템플릿 사용 — `content_enhancer.py:1256-1263`

#### 7단계 — 후처리 (제목·서론 정책 강제)
`_post_process_content()`가 선택된 SEO 제목을 강제로 고정하고, 마크다운 헤딩을 제거하고, 첫 문단 경계를 찾아 서론 규칙을 적용한다.
- `content_enhancer.py:1603-1914`

#### 8단계 — 17개 절대 규칙 검증 및 자동 수정
생성 결과를 규칙별로 검사하고, **고칠 수 있는 것은 코드가 직접 고친다**. (상세는 §2)
- `content_enhancer.py:1915-2115` (`_validate_and_fix_content`)

#### 9단계 — 이미지 배치 규칙 강제
크롤링 평균 이미지 수를 목표로 삼되 최대 8개로 제한하고, 부족하면 규칙에 따라 삽입하고 초과하면 뒤에서부터 제거한다.
삽입 우선순위는 **① 서론 뒤 → ② 각 소제목 앞 → ③ 결론 앞**이며, 소제목 앞 3줄 이내에 이미 이미지가 있으면 건너뛴다.
- `content_enhancer.py:3303-3349` (`_enforce_image_placement_rules`)
- `content_enhancer.py:3380-3448` (`_add_missing_images`)
- `content_enhancer.py:3450-3486` (`_remove_excess_images`)
- `content_enhancer.py:3488-3537` (`_ensure_conclusion_image`)
- `content_enhancer.py:3539-3572` (`_add_images_to_long_paragraphs` — 800자 넘는 문단은 반으로 갈라 중간에 이미지 삽입)

#### 10단계 — 이미지 컨텍스트 추출 (본문↔이미지 일치의 실체)
각 `[이미지]` 마커마다 **주변 본문을 실제로 읽어** 컨텍스트를 만든다:
- 바로 위 소제목 (`[소제목]` 또는 `##`/`###` 패턴, 역순 탐색)
- 직전 본문 최대 15줄, 500자까지
- 직후 본문 최대 10줄, 300자까지
- 마커 문법(`[B]`, `[/B]`, `[H]`, `[/H]`, `[소제목]`, `#`)을 제거한 순수 텍스트만 남김
결과: `"[소제목: …] [이전 내용: …] [다음 내용: …]"` 형태의 컨텍스트 문자열
- `naver_posting_logic.py:60-118` (`parse_image_contexts`)
- 회귀 테스트 존재: `backend/tests/test_naver_posting_logic.py:35-49`

#### 11단계 — 이미지 프롬프트 최적화 및 생성
10단계 컨텍스트를 `image prompt.md` 템플릿에 넣어 영어 이미지 프롬프트로 변환한 뒤, Nano-Banana 계열로 생성한다.
스타일 일관성: **첫 이미지에서 스타일 키워드를 추출해 세션 스타일 가이드로 저장**하고, 두 번째 이미지부터 그 가이드를 프롬프트에 이어 붙인다.
- `backend/api/routes/image.py:451-600` (컨텍스트별 루프 생성)
- `image_prompt_optimizer.py:176-478` (Gemini/OpenAI 이중 최적화 + 검증 + 폴백 프롬프트)
- `nano_banana_generator.py:747-800` (`apply_style_consistency`, `_extract_style_keywords` — 30여 개 스타일 키워드 사전)
- 폴백 체인: FAL.ai(180초) → Gemini(120초) → Replicate(90초) — `backend/services/google_blog/image_generator.py:355-477`

#### 12단계 — 종합 채점 (6영역 가중 평균)
`BlogContentValidator`가 글자수 / 키워드 / 이미지 배치 / 구조 / 해시태그 / SEO 최적화 6영역을 채점하고 **종합 80점 이상만 통과**로 표시한다. (상세는 §2·§3)
- `blog_content_validator.py:24-87`, 가중치 `:423-`

#### 13단계 — 자동 포스팅 및 기록
Selenium으로 네이버 블로그 에디터를 조작한다. 단순 붙여넣기가 아니라:
- `[소제목]` / `##` 마커를 감지해 **텍스트 입력 → 길이만큼 Shift+←로 정확히 선택 → 소제목 서식 + 폰트 24 + 굵게 적용**
- "내용 요약 정리" 소제목은 추가로 가운데 정렬 + 파란색 적용
- 본문은 `natural_typing`으로 **글자 단위 타이핑**(기본 `character_by_character`, 글자당 0.06초 + 50~150% 랜덤 편차)
- 포스팅 후 구글 드라이브 "Naver Blog automation" 폴더의 네이버 ID별 스프레드시트에 날짜·제목·URL 자동 기록
- `naver_blog_auto_v2.py:1684-1790` (소제목 감지·서식 적용), `:1479` (`focus_editor_bottom_for_trailing_text`)
- `natural_typing.py:13-95`, `typing_speed_config.py:1-47`
- `blog_posting_tracker.py:23-60`

### 1-B. 구글 블로그(Blogger) 파이프라인 — 간략

SerpApi 키워드 분석(연관검색어·PAA·상위결과·지식그래프) → 다중 소스 최신정보 수집 → `backend/prompts/google_seo_prompt_kr*.txt`(6종 디자인 변형) 기반 HTML 본문 생성 → 본문 안의 `src="(이미지 URL)"` 플레이스홀더를 정규식으로 찾아 이미지 채워 넣기 → 구글 드라이브 업로드(2회 재시도) → Blogger API 자동 포스팅.
- `backend/api/routes/google_keyword.py`, `backend/services/google_blog/content_generator.py:262-390`
- `backend/services/google_blog/image_generator.py:144-237` (플레이스홀더 파싱), `:899-1064` (본문 재삽입)
- `backend/api/routes/google_posting.py`

### 1-C. 그 밖의 흐름 — 간략

| 흐름 | 내용 | 근거 |
|---|---|---|
| 마케팅 인텔리전스 | 9단계 워크플로 DAG(수집→분석→전문분석→경쟁채널→SNS→전략→보고서→검증→문서생성). 단계 내부는 `asyncio.gather` 병렬, 단계 간은 순차 의존 | `backend/marketing/agents/workflow/workflow_designer.py:31-65`, `backend/marketing/agents/main_agent.py:146-316` |
| 광고 카피 | 8개 다양성 모드 × 3개 전략(focused/comprehensive/maximum). GPT·Gemini·Claude 3개 모델 동시 생성 후 리랭킹 | `backend/services/ad_copy/copy_generation.py:103-133`, `copy_reranking.py` |
| 비주얼 자산 | 인스타 카드뉴스(다양성/일관성 점수 검사 포함), 썸네일, 상세페이지, 레이어 편집, 영상(Cinema/Veo) | `instagram_cardnews_generator.py`, `instagram_cardnews_quality_checker.py:125-254`, `backend/services/{thumbnail,detail_page,cinema,qwen_layered}/` |
| 딥 리서치 | 3개 LLM 앙상블 → 합의 점수 → 불일치 항목 4차 Claude 중재 | `backend/services/deep_research/ensemble_verifier.py:303-747` |

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것

### 2-1. 17개 절대 규칙 검증기 (본문 생성 직후)
`content_enhancer.py:1915-2115`. 오류(errors)면 `passed=False`, 경고(warnings)는 통과시키되 기록, 수정 가능한 항목은 코드가 직접 고친다(fixes_applied).

| # | 규칙 | 임계값 | 위반 시 |
|---|---|---|---|
| 1 | `[이미지]` 태그 개수 = 목표치 | 크롤링 평균 | 경고 |
| 2 | `[이미지]`는 반드시 독립된 줄 | — | **자동 분리 수정** |
| 3 | `[이미지]` 연속 배치 금지 | — | **오류(실패)** |
| 4 | `[이미지]` 앞뒤 빈 줄 정확히 1줄 | — | **자동 삽입 수정** |
| 5 | `[소제목]` 마커 존재 | ≥1개 | **오류(실패)** |
| 6 | `[B]` 강조 마커 | 최소 5개 | 경고 |
| 7 | `[B]`/`[H]` 여닫이 쌍 일치 | — | **오류(실패)** |
| 8 | 닫는 괄호 누락(`[/B` → `[/B]`) | — | **정규식 자동 수정** |
| 9 | 서론 첫 문장 메타 설명 금지 | 금지어 6종: 정리합니다·알아보겠습니다·살펴보겠습니다·다룹니다·알아볼게요·살펴볼게요 | **오류(실패)** |
| 10 | 키워드 반복 횟수 | 크롤링 평균 ±2회 | 경고 |
| 11 | 글자수 범위 | 크롤링 평균의 70~130% | 경고 |
| 12 | 같은 종결어미 3회 연속 금지 | 3연속 | 경고 |
| 13 | 나열식 표현 금지 | "첫째, 둘째, 셋째" 등 6종 | 경고 |
| 14 | 결론 뒤 요약 섹션 존재 | 5종 마커 중 하나 | 경고 |

**왜 필요한가**: 9·12·13번은 "AI가 쓴 티"를 없애기 위한 규칙이다. LLM은 놔두면 "~에 대해 알아보겠습니다"로 시작하고 "첫째, 둘째"로 나열하며 "~입니다"를 반복한다. 이 세 가지가 사람 눈에 가장 먼저 걸리는 AI 문체 신호이며, 코드는 그것을 명시적으로 잡아낸다.

### 2-2. 종합 채점 게이트 (6영역 가중 평균)
`blog_content_validator.py:24-87`. **종합 80점 이상만 통과**, 각 영역은 개별로 70점 이상이어야 통과 처리.
- 글자수 15% / 키워드 25% / 이미지 배치 · 구조 · 해시태그 · SEO 최적화 나머지 (`:423-`)
- 글자수: 2,000~5,000자 범위 밖이면 **0점**, 범위 안이면 목표치(3,000자)와의 차이만큼 감점 (`:88-111`)
- 이미지 배치: 개수 40점 + 필수 위치 60점(위반 1건당 −15점). 검사 항목 = 서론 뒤 이미지, 결론 앞 이미지, 소제목 앞 이미지 개수, 태그 앞뒤 줄바꿈 오류 (`:170-251`)
- 구조: 소제목 3개 이상 30점 / 문단 8개 이상 40점 / 해시태그 정확히 2개 30점 (`:253-300`)

### 2-3. 키워드 개수 정확 일치 검증기
`keyword_validator.py:16-72`. 목표 횟수와 **정확히 일치**해야 통과(`is_valid = 실제 == 기대`).
초과하면 유사 키워드로 치환하는 수정안을 자동 생성하고, 부족하면 수동 검토 대상으로 표시한다 (`:348-391`).

### 2-4. 다중 소스 팩트 교차 검증
`fact_checker.py:25` — `min_sources_for_verification = 2`.
본문에서 숫자·통계·퍼센트·연도를 정규식으로 뽑아, **2개 이상의 독립 소스에서 같은 값이 확인돼야 `verified_facts`로 승격**한다. 3개 이상이면 confidence "high", 2개면 "medium".
1개 소스에만 있는 수치는 `unverified_facts`(confidence "low")로 **분리 보관**되어 본문에 사실처럼 섞이지 않는다.
- `backend/services/google_blog/multi_source_info_collector.py:441-528` (`cross_verify_facts`)
- 소스가 2개 미만이면 `cross_verification_possible: False`를 반환하고 교차검증을 아예 하지 않는다 (`:449-457`)
- 신뢰도 점수 = 성공 소스 수(최대 30) + 인용 수(최대 20) + 교차검증(최대 30) + 콘텐츠 길이(최대 20), 상한 100 (`:533-575`)

**왜 필요한가**: 마케팅 글에서 "전환율 30% 상승" 같은 숫자는 근거 없이 쓰면 그대로 허위 정보가 된다. 소스 2개 규칙은 LLM이 지어낸 숫자를 걸러내는 최소 장치다.

### 2-5. 마케팅 보고서 사실성 검증기
`backend/marketing/agents/pool/verification/fact_checker.py`
- 근거 없는 구체 수치 탐지 — 조회수·전환율·ROI·매출 수치가 "범위/참고/업계 평균" 없이 단정적으로 쓰이면 위반 처리 (`:165-206`)
- 콘텐츠 기획 개수 검증 — 네이버블로그/구글블로그/인스타그램/유튜브쇼츠 **4채널 × 12개 = 정확히 48개**여야 통과 (`:255-317`, `expected_total = 48`, `expected_per_channel = 12`)
- 위반이 하나라도 있으면 `is_valid = False`, 보고서에 `status: "FAILED"` 표기. **보고서를 버리지 않고 "검증 실패"를 명시한 채로 반환**한다 (`:129-133`)

### 2-6. 품질 점수기 (5차원 가중)
`backend/marketing/agents/pool/verification/quality_scorer.py:29-37, 90-117`
완전성 25% / 정확성 25% / 관련성 20% / 명료성 15% / 전문성 15% → 0~100점.
등급: A+ ≥90, A ≥80, B ≥70, C ≥60, 그 외 D (`:227-238`). 어느 차원이든 **70점 미만이면 개선 제안을 자동 생성**한다 (`:245`).

### 2-7. 3-LLM 앙상블 합의 검증
`backend/services/deep_research/ensemble_verifier.py`, `backend/marketing/agents/pool/analysis/ensemble_analyzer.py`
- 같은 질문을 Claude·GPT·Gemini에 동시에 던지고 답변 간 합의 점수를 계산 (`asyncio.gather`, `ensemble_verifier.py:425,481`)
- **합의 점수 0.6 이상**이면 고신뢰 인사이트, 미만이면 `needs_review`로 분류 (`:517-542`)
- 불일치 항목은 **4차 Claude 호출로 중재**하고, 중재 후 신뢰도 0.7 미만이면 `verified_facts`로 승격하지 않는다 (`:669-747`, `:303`)
- 답변 간 텍스트 유사도 0.4 초과만 "동의"로 카운트 (`:561, 639`)

### 2-8. 이미지 프롬프트 안전 키워드 강제
생성된 영어 프롬프트에 사실감 키워드(`photorealistic`, `natural lighting`, `looks like real photograph`)가 없으면 강제로 덧붙이고, 금지 네거티브 문자열(`no split screen, no collage, no grid, no multi-panel, text-free image, no watermarks, no artificial perfection, no AI-generated appearance`)을 항상 부착한다.
- `backend/services/google_blog/image_generator.py:329-349` (`_ensure_safe_keywords`)
- `backend/prompts/image_prompt.md:116-135`

### 2-9. 스톡 이미지 URL 하드 금지
SEO 프롬프트에 `★★★★★ 절대 금지 - 위반 시 전체 콘텐츠 무효 ★★★★★`로 unsplash·pexels·pixabay·shutterstock URL 사용을 금지하고, 파서 쪽에서도 해당 도메인이 들어간 `<img>`는 플레이스홀더로 간주해 교체 대상으로 처리한다.
- `backend/prompts/google_seo_prompt_kr.txt:300-304`
- `backend/services/google_blog/image_generator.py:188-202` (`is_external_stock`)

### 2-10. 실패 격리 및 폴백 체인
- 에이전트 단위 예외는 `AgentOutput(success=False, error=...)`로 감싸 반환 (`backend/marketing/agents/base.py:74-114`)
- 병렬 단계는 `asyncio.gather(..., return_exceptions=True)`로 한 에이전트 실패가 나머지를 죽이지 않게 격리 (`backend/marketing/agents/main_agent.py:300-309`)
- LLM 제공자 폴백: OpenAI 실패 → Gemini 자동 전환 (`multi_llm_manager.py:101-157`), Gemini 쿼터 초과 시 키 로테이션 후 재시도 (`:264-277`)
- API 키 누락 시 에이전트를 조용히 껍데기로 만들지 않고 `RuntimeError`로 누락 키 목록을 명시 (`backend/marketing/agents/pool/agent_pool.py:71-87`)
- 저장소 전체에서 재시도 로직 참조 파일 26개, 폴백 로직 참조 파일 54개

---

## 3. 도메인 판단이 박혀 있는 지점 (SEO·마케팅 노하우) ★가장 중요★

### 3-1. "상위 노출 알고리즘 파악"의 실체 — 경쟁사 통계를 생성 제약으로 바꾸는 구조

이 시스템의 핵심 발상은 **SEO 규칙을 사람이 정하지 않는다**는 것이다. 키워드마다 상위 블로그를 크롤링해 통계를 뽑고, 그 통계를 그대로 생성 프롬프트의 목표값으로 주입한다. 같은 시스템이 "노무사" 키워드와 "다이어트" 키워드에 서로 다른 글자수·이미지 수·문체를 적용한다.

| 항목 | 어떻게 정해지나 | 근거 |
|---|---|---|
| 목표 글자수 | 상위 블로그 평균 글자수, 허용 범위 ±30% | `content_enhancer.py:2051-2056`, `gemini prompt.txt:5` |
| 목표 이미지 수 | 상위 블로그 평균 이미지 수, **상한 8개** | `content_enhancer.py:3315-3317, 3351-3378` |
| 목표 키워드 반복 | 상위 블로그 평균, 허용 ±2회 | `content_enhancer.py:2043-2049`, `gemini prompt.txt:7` |
| 목표 제목 길이 | 상위 블로그 제목 평균 길이 (없으면 40자) | `backend/api/routes/blog.py:153` |
| 제목 내 키워드 위치 | 상위 블로그에서 **최빈 위치**를 채택 | `backend/api/routes/blog.py:152` |
| 문체·톤 | 상위 블로그의 최빈 `Formality-Tone-SentenceLength` 조합 | `backend/api/routes/blog.py:426-448` |
| 해시태그 개수 | 상위 블로그 평균, 1~3개로 클램프 | `content_enhancer.py:3269-3301` |
| 소제목 개수 | `이미지 수 − 2` 공식 | `gemini prompt.txt:210-217` |

### 3-2. 구체 수치 임계값 목록 (코드·프롬프트에서 확인)

**분량**
- 네이버: 크롤링 평균 ±30% (70~130%) — `content_enhancer.py:2053-2054`
- 네이버 채점 기준 절대 범위: 2,000~5,000자, 목표 3,000자 — `blog_content_validator.py:91-93`
- 구글: **2,500~3,000 단어**, H2 섹션당 **400~500 단어** — `backend/prompts/google_seo_prompt_kr.txt:16, 31`
- 문단 = 3~5문장 — `gemini prompt.txt:365, 393`
- 서론 = 전체의 약 15%, 결론 = 약 10% — `gemini prompt.txt:228, 273`
- 800자 넘는 문단은 반으로 갈라 중간에 이미지 — `content_enhancer.py:3549`

**키워드**
- 구글: 본문 전체 **15~20회**, 키워드 밀도 **1.5~2.5%**, H2 섹션당 3~4회 — `google_seo_prompt_kr.txt:20-21`
- 키워드 필수 배치 위치: 서론 첫 문단 · 각 H2 제목 · 각 섹션 첫 문장 · 결론 — `google_seo_prompt_kr.txt:22`
- 소제목 중 **50% 이상**에 키워드 포함 — `gemini prompt.txt:158`
- 채점 시 소제목 키워드 포함률 60% 이상 = 만점(40점), 40% 이상 30점, 20% 이상 20점 — `blog_content_validator.py:388-394`
- 키워드 문단 분포 50% 이상 = 만점(30점) — `blog_content_validator.py:396-402`
- **조사 변형 사용 검사** — "키워드+의/을/를/에/으로/와/과" 8종 변형이 5개 이상 쓰였는지 점수화. 조사 없이 명사만 반복하는 어색한 키워드 스터핑을 잡아낸다 — `blog_content_validator.py:372-384, 404-410`
- 제목 내 키워드 위치 판정 경계: 30% / 70% — `enhanced_naver_blog_crawler.py:531-534`
- 첫 문단 키워드 밀도 기본값 2.5% — `content_enhancer.py:3123`
- 소제목 키워드 포함률 기본값 60% — `content_enhancer.py:3158`

**제목**
- 15~25자 (검색엔진 최적화) — `title prompt.txt:72`
- 데이터 기반 최적 범위: 평균 ±5자, 10~50자 클램프 — `content_enhancer.py:3258-3261`
- **제목에 구체적 숫자(3가지, 5가지, 10개) 사용 금지** — `title prompt.txt:65`
- **대괄호·소괄호·따옴표 사용 금지** (`!`, `?`, `~`, `-`는 허용) — `title prompt.txt:67`
- 크롤링 데이터 맹목적 복사 금지 — 패턴·스타일만 참조 — `title prompt.txt:69`

**구조**
- 구글: H2 최소 5개, 각 H2 아래 H3 최소 2개, `<h1>` 절대 사용 금지 — `google_seo_prompt_kr.txt:28-30`
- 구글: FAQ 최소 5쌍, 메타 설명 150자 내외 — `google_seo_prompt_kr.txt:152, 189`
- 구글: 출력 순서 고정 = SEO주석/Schema → 메인제목 → 목차 → 메인이미지 → 서론 → 본문섹션 → 결론 → FAQ — `google_seo_prompt_kr.txt:172-177`
- Article Schema + FAQPage JSON-LD 삽입 필수 — `google_seo_prompt_kr.txt:206-250`
- 네이버 채점: 소제목 3개 이상 만점, 문단 8개 이상 만점, 해시태그 정확히 2개 만점 — `blog_content_validator.py:270-291`
- 결론 뒤 "내용 요약 정리" 섹션 고정 (제목 변경 불가) — `gemini prompt.txt:226-283`, `naver_posting_logic.py:28-38`

**가독성**
- 구글: 문장마다 `<br>` 줄바꿈, **2~3문장마다 새 `<p>` 태그**, 문단 간 `margin-bottom:35px`, `line-height:1.9em` — `google_seo_prompt_kr.txt:44-48`
- 네이버: 소제목과 본문 사이 정확히 1줄 — `gemini prompt.txt:372`
- 구글: 격식체(`~습니다`, `~됩니다`) **전체의 30% 이하로 제한**, 친근한 종결어미 우선 — `google_seo_prompt_kr.txt:92-95`
- 네이버: 격식체 **20% 이하** — `gemini prompt.txt:335`
- 같은 종결어미 2회(구글) / 3회(네이버) 연속 금지, 문단마다 종결어미 3종 이상 — `google_seo_prompt_kr.txt:103,105`, `content_enhancer.py:2074-2078`
- 아이콘은 섹션당 최대 2~3개, 밑줄 강조 용어는 섹션당 2~3개 — `google_seo_prompt_kr.txt:87, 132-145`
- 매거진 스타일 변형은 **이모지·아이콘 전면 금지**, 서론 첫 글자 드롭캡 필수 — `google_seo_prompt_kr_magazine.txt:91-94, 169-171`

**서론**
- 첫 문장 메타 설명 금지 (금지 표현 9종 명시), 대신 대화체로 시작하는 예시 6종 제시 — `gemini prompt.txt:25-27, 231-253`
- 코드에서도 동일 규칙을 재검사 — `content_enhancer.py:2036-2041`

### 3-3. 이미지 삽입 위치 결정 로직

**네이버 (마커 기반, 코드가 위치를 계산)**
1. 우선순위: ① 서론 뒤 → ② 각 소제목 앞 → ③ 결론 앞 — `gemini prompt.txt:210-217`, `content_enhancer.py:3400-3423`
2. 소제목 앞 3줄 이내에 이미 이미지가 있으면 중복 삽입하지 않음 — `content_enhancer.py:3412-3414`
3. `[이미지]`로 글을 끝맺지 않음 — `gemini prompt.txt:223`
4. 연속 `[이미지]` 금지, 앞뒤 빈 줄 정확히 1줄 — `gemini prompt.txt:16, 28`
5. 800자 초과 문단은 중간 지점을 계산해 분할 삽입 — `content_enhancer.py:3549-3554`
6. 개수 초과 시 **뒤에서부터** 제거 (앞쪽 이미지가 이탈률에 더 중요하다는 판단) — `content_enhancer.py:3457`

**구글 (HTML 플레이스홀더 기반, LLM이 위치를 잡고 코드가 채움)**
- 메인 이미지 1장은 목차 바로 아래(서론 시작 전), 섹션 이미지는 각 H2 소제목 바로 아래 1장씩, 총 5~6장 — `google_seo_prompt_kr.txt:328-331`
- 코드 폴백: 플레이스홀더가 3개 미만이면 `<h2>` 헤딩을 스캔해 최대 6개까지 자동 보충 — `backend/services/google_blog/image_generator.py:214-225`

### 3-4. 이미지 내용을 본문과 일치시키는 로직

**네이버** — `parse_image_contexts()`가 각 마커마다 **직전 소제목 + 이전 본문 500자 + 다음 본문 300자**를 실제로 읽어 컨텍스트를 만든다. 즉 "무슨 이미지를 넣을지"를 그 자리의 글 내용이 결정한다. (`naver_posting_logic.py:60-118`)

**구글** — 프롬프트가 LLM에게 `alt` 텍스트를 **최소 20단어 이상**, "키워드 + 상황 + 환경 + 행동/상태를 모두 포함"해 쓰게 강제하고("다이어트젤리 이미지" → "한국 가정의 식탁 위에 놓인 다양한 무설탕 다이어트 젤리 제품들과 건강한 간식을 즐기는 모습"), 그 alt 텍스트를 이미지 생성 프롬프트의 입력으로 쓴다. (`google_seo_prompt_kr.txt:66-71, 316-317`)

**공통 이미지 프롬프트 규칙** (`backend/prompts/image_prompt.md`)
- 0단계에서 소제목이 아니라 **본문 전체 맥락**을 5개 질문으로 먼저 분석 (`:65-74`)
- 이미지 유형 6종 분류 체계: A 사물/제품 · B 개념/프로세스 · C 데이터/결과 · D 환경/공간 · E 인물+행동 · F 은유/상징 (`:77-111`)
- 주제별 시각화 가이드 8종(음식·여행·건강·패션·인테리어·교육·기술·자연) — 각각 권장 키워드와 "인물 불필요" 플래그 (`:154-197`)
- 인물이 나오면 반드시 `Korean person, Korean ethnicity` 명시 (그냥 "Asian" 불가) (`:23-26`)
- **"인물+노트북" 클리셰 회피** 명시 (`:28-31`)
- 콜라주·그리드·멀티패널 금지 — 한국 블로그 본문 이미지는 단일 컷이어야 함 (`:18-21`)
- 금지 키워드: `perfect`, `flawless`, `stunning`, `epic`, `8K`, `HDR`, `dramatic lighting`, `vibrant colors` 등 — "AI가 만든 티"가 나는 과장 표현 배제 (`:123-127`)
- 필수 키워드: `natural lighting`, `subtle imperfections`, `candid moment`, `looks like real photograph taken by DSLR camera` (`:116-121`)
- 최종 출력은 영어 한 줄, **250~400자 이내** (`:146-149`)
- 이미지 파일명 = `{키워드}_{순번}_{타임스탬프}.jpg`, alt는 `{키워드} - {설명}` 형태로 200자에서 절단 — `backend/services/image_generation/filename_utils.py:65-79`, `image_generator.py:928, 989-992`

### 3-5. 프롬프트에 명시된 SEO·마케팅 업계 지식

- **E-E-A-T**(경험·전문성·권위·신뢰성) 원칙 명시 — `google_seo_prompt_kr.txt:4`
- "검색 순위 조작이 아닌, 사용자에게 실질적으로 유용하고 신뢰할 수 있는 가치를 제공"이 최우선 목표 — `:11`
- 요약 카드를 넣는 이유로 **Featured Snippet 선정 가능성**을 명시 — `:164`
- LSI 키워드/연관 엔티티 포함 요구 — `:23`
- 외부 링크 최소 2개, **내부 링크와 "관련 문서" 박스는 금지** — `:286, 293-296`
- 참조 번호(`[1]`, `[2]`) 사용 금지 — `:124` (Perplexity 응답의 각주를 지우는 `_clean_perplexity_references()`가 코드로도 존재 — `content_enhancer.py:805-819`)
- 고유명사 첫 등장 시 노란 하이라이트, 핵심 용어는 굵게+밑줄 — `:132-145`

### 3-6. 카피라이팅 이론이 코드 상수로 들어가 있음

`backend/services/ad_copy/copywriting_theory.py` — 광고 카피 생성이 "잘 써줘"가 아니라 이론 선택 문제로 모델링되어 있다.
- **카피라이팅 공식 8종**: AIDA, PAS, FAB, 4U's, QUEST, STAR, Before-After-Bridge, Star-Story-Solution (`:40-110`)
- **심리 트리거 12종**: 희소성, 긴급성, 사회적 증거, 권위, 신뢰, FOMO, 상호성, 독점성, 호기심, 단순함, 감성, 새로움 (`:144-250`)
- **카피라이터 스타일 8종**: David Ogilvy, Gary Halbert, Eugene Schwartz, Claude Hopkins 외 (`:286-370`)
- 입력 상황에 따라 공식·트리거·스타일을 추천하고 프롬프트를 증강하는 서비스 (`:373-538`, `recommend_formula` / `recommend_triggers` / `recommend_style` / `get_full_strategy`)
- 생성 다양성 모드 8종에 이론 출처가 붙어 있음: `"data_driven": "숫자와 데이터 기반의 (David Ogilvy 스타일)"`, `"emotional": "... (Gary Halbert 스타일)"`, `"direct": "... (4U's 공식)"` (`copy_generation.py:103-112`)

### 3-7. 한국어·네이버 플랫폼 특수 처리

- **키워드 정확 매칭기** — 띄어쓰기 변형("오창노무사" ↔ "오창 노무사")은 같은 것으로 세되, 중간 삽입("오창, 세종 노무사")은 다른 것으로 센다. 한글 키워드를 한 글자씩 분리해 가능한 띄어쓰기 조합을 정규식으로 생성한다 — `enhanced_naver_blog_crawler.py:570-604`
- **세무/법무 키워드 분해 사전** — 종합소득세·부가가치세·법인세·소득세·재산세·상속세·증여세 + 행동어(신고/조회/확인/검색/분석/정보/가이드/방법/팁/후기)의 결합 규칙 — `enhanced_naver_blog_crawler.py:606-669`
- **네이버 본문 이미지만 카운트** — `postfiles.pstatic.net` / `blogfiles.pstatic.net` 도메인 필터로 광고·프로필·위젯 이미지 제외 — `enhanced_naver_blog_crawler.py:874-897`
- **네이버 에디터 서식 조작** — 소제목 텍스트 입력 후 길이만큼 Shift+←로 정확히 선택 → 소제목 서식 + 폰트 24 + 굵게. 요약 섹션 소제목은 추가로 가운데 정렬 + 파란색 — `naver_blog_auto_v2.py:1717-1790`
- **해시태그 블록 분리** — 인용 스타일이 해시태그까지 먹지 않도록 본문 끝 해시태그 줄을 떼어냄 — `naver_posting_logic.py:40-57`
- **글자 단위 타이핑** — 자동화 티를 줄이기 위해 글자당 0.06초 + 50~150% 랜덤 편차, 문장부호 0.15초, 엔터 0.3초 별도 지연 — `natural_typing.py:56-70`, `typing_speed_config.py:11-47`
- **해시태그 안전망** — LLM이 해시태그를 빠뜨리면 시스템이 `#{키워드}`를 강제로 붙임 — `content_enhancer.py:1358-1363`

### 3-8. 창작·허위 정보 금지 규칙 (프롬프트 레벨)

- **개인 경험담 완전 금지** — "제가", "저는", "직접 해봤는데" — `google_seo_prompt_kr.txt:79`
- **가상 인물/사례 창작 완전 금지** — `:81`, `gemini prompt.txt:386`
- **추가 정보가 없을 때 임의의 업체명·브랜드명 생성 금지** — `gemini prompt.txt:292`
- **다른 기업/서비스 비판·비방 금지** — `gemini prompt.txt:296`
- **경쟁사 블로그 제목 그대로 사용 금지** — `gemini prompt.txt:386`
- 사용자가 제공한 업체·상품 정보는 반드시 `[H]...[/H]`로 **문장 전체**를 감싸 표시 (단어만 감싸는 것 불가) — `gemini prompt.txt:18-21, 405`

---

## 4. 검증 가능한 숫자

| 항목 | 수치 | 근거 |
|---|---|---|
| Python 파일 수 | 289개 | `find . -name "*.py"` (node_modules 제외) |
| Python 코드 라인 | 139,288줄 | `wc -l` 합계 |
| 소스 파일 총계 | 868개 (이미지 자산 포함, node_modules 제외) | `find` |
| 커밋 수 | 63 | GitHub API `commits?per_page=1` Link 헤더 last=63 |
| 저장 기간 | 2026-01-13 생성 ~ 2026-06-25 최종 갱신 | GitHub API repo 메타 |
| 언어 구성(바이트) | Python 5.62MB, JavaScript 1.71MB, HTML 0.70MB, CSS 0.49MB, TypeScript 0.35MB, Shell/PLpgSQL/Batch | GitHub API `/languages` |
| 백엔드 API 라우터 파일 | 35개 | `ls backend/api/routes` |
| 백엔드 서비스 도메인 | 15개 (ad_copy, cinema, deep_research, detail_page, google, google_blog, image_analysis, image_canvas, image_generation, neighbor, qwen_layered, seo, spider, thumbnail, youtube) | `ls backend/services` |
| 마케팅 에이전트 수 | **31개** / 7개 카테고리 (crawling 3, collection 3, search 3, analysis 10, verification 2, strategy 4, document 6) | `backend/marketing/agents/pool/agent_pool.py:89-244` |
| 마케팅 워크플로 단계 | 프리미엄 9단계 / 스탠다드 7단계 | `workflow_designer.py:31-65, 153-175` |
| 텍스트 LLM 제공자 | 3개 (OpenAI GPT-5.4 / Anthropic Claude Sonnet 4.6 / Google Gemini 3.1 Pro) | `backend/core/llm_models.py:21-40`, `multi_llm_manager.py:10-13` |
| 모델별 전용 프롬프트 파일 | 3개 (`gpt prompt.txt`, `claude prompt.txt`, `gemini prompt.txt`) + `title prompt.txt` + `image prompt.md` | `prompt_adapter.py:41-49` |
| 구글 SEO 프롬프트 변형 | 7개 (kr, kr_card, kr_line, kr_magazine, kr_minimal, kr_modern, kr_professional) + 영문 1개 = 8개 파일, 총 약 254KB | `ls backend/prompts` |
| 이미지 생성 제공자 | 3개 폴백 체인 (FAL.ai → Gemini → Replicate) | `backend/services/google_blog/image_generator.py:355-477` |
| 이미지 모델 티어 | 3개 (nano-banana, nano-banana-pro-2k, nano-banana-pro-4k) | `image_generator.py:54-55` |
| 외부 연동 API 키 종류 | 20종 이상 (OpenAI, Anthropic, Gemini, Perplexity, Tavily, SerpApi, Replicate, FAL, Apify, Firecrawl, Spider, Naver 검색광고, Naver 데이터랩, YouTube, Google Ads, Kling, Supabase, MinIO, AWS 등) | `os.getenv` 스캔 결과 |
| 콘텐츠 기획 SNS 채널 | 4개 (naver_blog, google_blog, instagram, youtube_shorts) × 12개 = **48개** 강제 검증 | `backend/marketing/agents/pool/verification/fact_checker.py:276-288` |
| 본문 생성 함수 파라미터 | 29개 | `content_enhancer.py:1218-1238` |
| 본문 검증 절대 규칙 | 17개 (그중 4개는 자동 수정) | `content_enhancer.py:1917` 및 `:1941-2091` |
| 종합 채점 영역 | 6개 / 통과 기준 80점 | `blog_content_validator.py:50-79` |
| 카피라이팅 공식 | 8개 | `copywriting_theory.py` (`CopywritingFormula(` 8회) |
| 심리 트리거 | 12개 | `copywriting_theory.py` (`PsychologicalTrigger(` 12회) |
| 카피라이터 스타일 | 8개 | `copywriting_theory.py` (`CopywriterStyle(` 8회) |
| 광고 카피 다양성 모드 / 전략 | 8개 모드 × 3개 전략(focused 3종/comprehensive 5종/maximum 8종) | `copy_generation.py:103-133` |
| DB 마이그레이션 SQL | 10개 | `backend/supabase_migrations/`, `sql/` |
| 병렬 실행 호출 지점 | `asyncio.gather(..., return_exceptions=True)` 30개소 | 저장소 전체 grep |

> **주의**: 브리핑에 있던 "48+ 에이전트"는 코드와 맞지 않는다. 실제 등록 에이전트는 **31개**이고, **48**은 4채널 × 12개 = 48개 콘텐츠 기획 개수 검증 상수다. 포트폴리오에는 "31개 에이전트", "48개 콘텐츠 기획 강제 검증"으로 나눠 쓰는 것이 정확하다.
> "3 copy modes" 역시 정확히는 **8개 다양성 모드 × 3개 프롬프트 전략**이다.

---

## 5. 일반 접근과의 대조

### "블로그 글을 ChatGPT로 쓰면" — 3단계

1. 키워드를 생각한다
2. ChatGPT에 "○○에 대한 블로그 글 써줘"라고 넣는다
3. 결과를 복사해 블로그에 붙여넣고, 이미지는 무료 스톡에서 아무거나 골라 넣는다

여기에는 **경쟁사 데이터가 없고, 검증이 없고, 이미지와 본문의 연결이 없다.** 글자수·이미지 수·키워드 반복은 모델이 마음대로 정하고, 사람이 눈으로 훑고 끝난다.

### "이 시스템은" — 13단계, 그중 5단계가 검증 단계

| # | 단계 | ChatGPT 방식에 있는가 |
|---|---|---|
| 1 | 키워드 발굴 + 검색량·경쟁도·CPC 가중 점수화 | ✗ |
| 2 | 상위 노출 블로그 크롤링 (4가지 본문 추출 경로) | ✗ |
| 3 | **상위 블로그 역공학** — 글자수·이미지수·키워드 위치·문체·제목 길이·해시태그 수 통계화 | ✗ |
| 4 | 통계 15개 변수를 주입한 데이터 기반 제목 5안 생성 | ✗ |
| 5 | 3개 검색 소스 병렬 수집 + 2소스 교차검증 팩트체크 | ✗ |
| 6 | 통계 29개 파라미터 + 모델별 전용 프롬프트로 본문 생성 | ✗ |
| 7 | 후처리 (제목 고정, 서론 정책, 마크다운 제거) | ✗ |
| 8 | **17개 절대 규칙 검증 + 자동 수정** | ✗ |
| 9 | 이미지 배치 규칙 강제 (부족분 삽입 / 초과분 제거) | ✗ |
| 10 | **이미지별 주변 본문 컨텍스트 추출** (소제목 + 앞 500자 + 뒤 300자) | ✗ |
| 11 | 컨텍스트 → 영어 프롬프트 최적화 → 이미지 생성 (3중 폴백 + 스타일 일관성) | ✗ |
| 12 | 6영역 가중 채점, 80점 미만 미통과 | ✗ |
| 13 | 에디터 서식 자동 적용 + 글자 단위 타이핑 포스팅 + 기록 | ✗ |

**한 문장 요약**: ChatGPT 방식은 "무엇을 쓸지"를 모델에게 맡긴다. 이 시스템은 **상위 노출 블로그를 먼저 뜯어서 "이 키워드에서 통하는 규격"을 숫자로 뽑고, 그 숫자를 모델의 제약 조건으로 강제한 뒤, 결과가 그 규격을 지켰는지 코드로 다시 검사한다.** 생성은 13단계 중 1단계일 뿐이고, 나머지 12단계가 마케터의 판단이다.

**보조 대조 — "이미지 넣기"**
- 일반: 무료 스톡에서 대충 고른다 → 본문과 무관
- 이 시스템: 마커 위치 결정(경쟁사 평균 개수 기준) → 그 자리의 소제목+앞뒤 800자를 읽어 컨텍스트 생성 → 한국인 명시·클리셰 회피·AI티 금지 키워드가 박힌 템플릿으로 영어 프롬프트 변환 → 첫 이미지 스타일을 세션 가이드로 잡아 나머지 이미지에 일관 적용 → 스톡 사이트 URL은 코드가 아예 거부

---

## 6. 규모 지표

- **파일 수**: 868개 (node_modules·.git 제외). 이 중 Python 289개, 이미지 자산 437개, Markdown 문서 36개, JS 31개
- **주요 언어**: Python (백엔드·자동화 전체), JavaScript (web_interface 프론트엔드, `app.js` 단일 파일 556KB), TypeScript/React (image_canvas 서브앱), HTML/CSS, PL/pgSQL (Supabase)
- **코드 라인**: Python 기준 **139,288줄**. GitHub 언어 통계 기준 총 8.9MB (Python 5.62MB / JS 1.71MB / HTML 0.70MB / CSS 0.49MB / TS 0.35MB)
- **최대 파일**: `content_enhancer.py` 3,828줄, `naver_blog_auto_v2.py` 3,519줄, `google_integration.py` 3,397줄, `naver_blog_crawler.py` 3,058줄
- **커밋 수**: 63
- **기간**: 2026-01-13 ~ 2026-06-25 (약 5개월)
- **인프라**: FastAPI 백엔드 + Supabase(Postgres, 마이그레이션 10개) + AWS EC2 배포 (`deploy/`, `update_ec2.sh`, `start_production.sh`, systemd `.service` 파일)
- **테스트**: `backend/tests/` 존재 (cinema E2E 832줄, marketing, deep_research, `test_naver_posting_logic.py`, `test_keyword_image_filename.py` 등)

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

### 7-1. 노출된 비밀키 (⚠️ 즉시 폐기 필요)
- `perplexity_api.py:496` — 테스트 함수 `test_perplexity_api()` 안에 **Perplexity API 키가 하드코딩**되어 있다 (`api_key = "pplx-..."`). 저장소가 private이라 해도 유효한 키라면 즉시 회수·재발급해야 한다. 포트폴리오에는 당연히 노출 금지.
- `docs/Supabase_데이터베이스_설정_가이드_20251206.md:17` — Supabase JWT 키가 잘린 형태(`eyJhbGciOi...`)로 문서에 예시로 적혀 있다. 실제 키인지 예시인지 확인 필요.
- 그 외 계정 정보는 모두 `os.getenv` 기반이며 `env_ec2_template.txt`는 플레이스홀더만 담고 있다 — 문제 없음.

### 7-2. 실명 노출
- **고객사 실명은 발견되지 않았다.** `주식회사`, `(주)`, `법무법인` 등의 문자열은 전부 **회사명 추출용 정규식 패턴**이거나 산업 분류 예시일 뿐이다 (`competitor_discovery.py:1914-1915`, `pdf_parser.py:405-429`).
- 단 `OAuth_인증_가이드.md:56`에 개발 PC 경로로 `C:\Users\팔레트 주식회사\Desktop\...`가 들어 있다. 고객사가 아니라 사용자 계정명으로 보이지만, **스크린샷·코드 인용 시 이 경로가 화면에 나오지 않게** 주의.
- 크롤링 대상 예시 키워드로 `종합소득세`, `오창노무사` 등이 코드에 있으나 특정 고객 식별 정보는 아니다.

### 7-3. 미완성·주의 기능
- `TODO` 7건 — 블로그 결과 조회·내보내기(Excel/CSV/JSON), 키워드 히스토리 DB 조회, 썸네일 Supabase 기록 (`backend/api/routes/blog.py:576,755`, `keyword.py:232`, `thumbnail.py:397`, `instagram_cardnews_generator.py:1940`). **"결과 내보내기" 기능을 완성 기능으로 소개하지 말 것.**
- 죽은 코드 2건 — 구글 블로그 쪽 `session_style_guide` / `session_base_style` / `style_consistency_enabled`는 선언만 되고 사용되지 않으며(`backend/services/google_blog/image_generator.py:88-90`), `_generate_fallback_image()`도 호출부가 없다(`:717-762`). **스타일 일관성은 네이버 파이프라인(`nano_banana_generator.py:747-777`)에서만 실제로 동작**하므로, 그 근거로만 인용할 것.
- `[IMAGE_PLACEHOLDER:]` 파싱 경로도 현재 프롬프트에서 생성되지 않는 레거시다 (`image_generator.py:153`). 실제 동작 경로는 `src="(이미지 URL)"` 플레이스홀더다.
- `blog_backup.py`, `apify_channel_collector_legacy.py`, `naver_blog_crawler_no_login.py` 등 레거시/백업 파일이 남아 있다.
- **표절 검사(plagiarism detection)는 코드에 없다.** README에 "80% 이상 유사 콘텐츠 자동 탐지 / 독창성 점수 0-100"이 적혀 있으나(`naver_blog_crawler.py`의 유사도 분석 엔진), 생성 결과를 상위 블로그와 대조해 반려하는 게이트는 확인되지 않았다. **"표절 방지 기능"으로 소개하지 말 것.** 대신 "프롬프트 레벨의 창작·복사 금지 규칙"과 "다중 소스 교차검증"으로 서술해야 정확하다.
- 크롤링은 Selenium 기반으로 네이버 봇 탐지를 우회하는 로직을 포함한다. 포트폴리오에서 "봇 탐지 우회"를 전면에 내세우기보다 **"네이버가 본문 복사를 막아둔 환경에서 데이터를 확보하기 위한 다중 추출 경로"** 정도로 기술적 난이도를 설명하는 편이 안전하다.
