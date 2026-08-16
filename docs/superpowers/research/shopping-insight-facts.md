# Naver Shopping Insight 팩트 시트
저장소: naver-shopping-insight | 분석일: 2026-08-16

> 근거 파일 경로는 모두 저장소 루트 기준. 인용한 주석·상수·함수명은 원문 그대로.
> 이 문서의 모든 항목은 실제 코드에서 확인한 것만 기록했다.

---

## 1. 실제 파이프라인 단계

URL 또는 제품명 입력부터 대시보드 출력까지 12단계. 서버(NestJS API) · 워커 · 사용자 Chrome 확장 3개 실행 주체가 큐(`CollectionJob`)로 물려 있다.

### 1단계 — 입력 → 브라우저 검색 작업 큐잉
사용자가 `스타벅스 텀블러` 같은 검색어나 상품 URL을 넣으면 서버가 곧바로 조회하지 않고 **확장이 실행할 작업을 큐에 넣는다**. 광고 제외 상위 몇 개를 볼지가 서버 상수로 고정된다(상품 등록 경로 12개, MARKET EXPLORER 20개).
- 근거: `apps/api/src/products/products.service.ts` `SEARCH_CANDIDATE_LIMIT = 12` (L30), `apps/api/src/market/market.service.ts` `MARKET_PRODUCT_LIMIT = 20` (L36), `apps/api/src/collector/browser-search.service.ts` `start()`

### 2단계 — Chrome 확장이 작업을 집어감 (폴링·페어링)
확장은 `chrome.alarms`로 30초(`periodInMinutes: 0.5`)마다 `GET /v1/collector/jobs`를 폴링하고, 하트비트를 보낸다. 서버는 확장이 **선언한 capability**에 없는 작업 타입은 아예 내려보내지 않는다(구버전 확장이 모르는 잡을 상품 수집으로 오인 처리하는 것을 막음).
- 근거: `apps/collector-extension/src/background.ts` L14–16, `sendHeartbeat` capabilities 배열 L48
- 근거: `apps/api/src/collector/collector.service.ts` `nextJob()` L152–169 (`unsupportedTypes` 필터), `claimedByTokenId` 원자적 클레임

### 3단계 — 실제 네이버 검색 화면에서 후보 수집
확장이 `search.shopping.naver.com/search/all`을 백그라운드 탭으로 열고 `__NEXT_DATA__`를 파싱한다. CAPTCHA·로그인 페이지로 리다이렉트되면 **우회하지 않고** 탭을 사용자에게 띄운 뒤 작업을 `user_verification_required`로 실패시킨다.
- 근거: `apps/collector-extension/src/background.ts` `runSearchCandidatesJob()` L103–146, `extractRankFromSearchPage()` L375–609
- 근거: 광고 제외 + 판매처 종류 판별 후보 생성 `apps/collector-extension/src/rank-result.ts` `buildSearchCandidatesResult()`

### 4단계 — 상품 페이지 상세 수집
후보 선택 시 `BROWSER_PRODUCT_REFRESH` 잡이 상품 페이지를 열어 `window.__PRELOADED_STATE__`에서 상품명·상품ID·가격·판매자·카테고리·브랜드·이미지(최대 6)·판매처 오퍼(최대 100)·리뷰 집계·리뷰 원문(최대 200) 및 `seoInfo.sellerTags`를 추출한다. 리뷰 원문은 9개 토픽(배송/포장/디자인·색상/품질·내구성/크기·용량/사용성/가격/보온·보냉/밀폐·누수)으로 감성 집계된다.
- 근거: `apps/collector-extension/src/background.ts` `extractPageData()` L163–282, `summarizeReviewTopics()` L261–280

### 5단계 — 추천(분석용) 키워드 도출
상품명을 그냥 자르지 않는다. 사용자 입력 검색어 → 카테고리 말단어 → 상위 카테고리 → 제품명 의미 명사 + 카테고리 조합 → 순수 명사 → 모델명 후보 순으로 우선순위를 매기고 **최대 6개**만 등록한다(순위 수집 비용 억제).
- 근거: `apps/api/src/products/keyword-derivation.ts` `deriveMarketKeywords()` — 우선순위 상수 2 / 1.5 / 1.35 / 1.2 / 1.1 / 1 / 0.95 / 0.7, `out.slice(0, 6)`

### 6단계 — 후속 작업 자동 체이닝
상품 수집이 끝나면 서버가 스스로 다음 3종을 큐에 건다: 실측 순위(`BROWSER_RANK_REFRESH`), 수요 신호(`INITIAL_SIGNAL_COLLECTION`), 시장 트렌드(`MARKET_INSIGHT_REFRESH`, 상품당 1회). 큐 전송이 실패하면 조용히 넘어가지 않고 잡을 `FAILED`로 표시한다.
- 근거: `apps/api/src/collector/collector.service.ts` `enqueueProductFollowups()` L448–491, `upsertFollowupJob()` L493–517

### 7단계 — 검색 수요 수집 (SearchAd + DataLab)
워커가 네이버 검색광고 `keywordstool`(HMAC 서명)에서 월간 PC·모바일 검색량·클릭수·클릭률·경쟁도를, DataLab에서 30일 일별·12개월 월별 클릭 추이를 받는다. **일별과 월별은 정규화 기준이 달라 한 시계열에 섞지 않는다.**
- 근거: `packages/naver-api/src/providers.ts` `fetchSearchAdKeywordMetrics()`, `fetchLegacyShoppingKeywordTrends(category, keywords, {timeUnit})`
- 근거: `apps/api/src/products/keyword-analysis.ts` `DAILY_TREND_UNIT = "date"`, `ofUnit()`

### 8단계 — PC·모바일 실측 순위 수집
확장이 키워드당 PC(`search.shopping.naver.com`)·모바일(`msearch.shopping.naver.com`) 두 면을 각각 연다. 키워드 최대 30개. 요청 사이에 무작위 지연을 넣는다.
- 근거: `apps/collector-extension/src/background.ts` `runRankJob()` L284–349 (`.slice(0, 30)`, surfaces 배열)
- 근거: `apps/collector-extension/src/rank-pacing.ts` `SURFACE_GAP_MS = {min:1200, max:2800}`, `KEYWORD_GAP_MS = {min:2500, max:5000}`

### 9단계 — SERP 부가정보 파싱 (경쟁상품 원천)
같은 검색 결과에서 최대 60행을 파싱해 제목·URL·이미지·가격·판매자·브랜드·제조사·카테고리·카탈로그ID·리뷰수·리뷰점수·구매수·광고여부를 뽑는다. 미발견 회차에는 무엇과 대조했는지(`comparedIds`) 진단 원본을 함께 남긴다.
- 근거: `apps/collector-extension/src/serp-parser.ts` `parseSerpEntries()` (`rawEntries.slice(0, 60)`)
- 근거: `apps/collector-extension/src/rank-result.ts` `buildRankCompletionPayload()` — `matchDiagnostics`, `pickDiagnosticEntries()`

### 10단계 — 서버 수집·검증·저장
zod 계약으로 검증하고, 기대한 키워드×표면 조합이 빠지면 `PARTIAL` 상태로 저장한다. 경쟁상품은 `Competitor` 테이블에 upsert(광고·내 상품 제외). 진단 원본은 7일 뒤 자동 만료.
- 근거: `apps/api/src/collector/collector.service.ts` `complete()` L171–222, `completionWarnings()` L224–236, `ingestSearchResults()` L289–322, `persistRawArtifact()` (`RAW_RETENTION_DAYS ?? 7`)

### 11단계 — 노출 사실 판정 (표면·출처 분리)
저장된 원시 순위 행을 **PC / 모바일 / API 세 버킷으로 나누고, 버킷별 가장 최근 1건만** 현재값으로 인정한다. 각 행은 `found` / `not_found` / `invalid` 중 하나로 판정된다.
- 근거: `packages/analytics/src/keyword-exposure.ts` `buildKeywordExposures()`, `packages/analytics/src/rank-observation.ts` `structuralRankState()`

### 12단계 — 분석·전망·대시보드 출력
황금 키워드 점수, 상품명 SEO 진단, 상위 상품명 패턴 벤치마크, 우선 실행 액션, 프리미엄 전망(`NSI-RF-1.1`), AI 판매 전략(모순 검사 포함), 홈 알림이 각각 계산되어 화면에 나간다.
- 근거: `packages/analytics/src/golden-keyword.ts`, `title-seo.ts`, `title-pattern.ts`
- 근거: `apps/worker/src/action-keyword.ts`, `packages/analytics/src/index.ts` `buildPremiumForecast()`
- 근거: `apps/api/src/dashboard/best-rank.ts`, `apps/api/src/dashboard/home-alerts.ts`

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것 ★가장 중요★

이 시스템의 설계 중심은 **"모르는 것을 아는 척하지 않는다"**이다. 코드 주석 대부분이 "예전에는 이렇게 틀렸다 → 그래서 이렇게 바꿨다" 형식의 실패 기록으로 남아 있다.

### 2-1. 순위로 매출을 역산하는 것을 거부한다
- **규칙**: 표시 금액은 매출이 아니라 `opportunity_proxy`(추정 거래 기회). 사용자가 관측 기간·주문 수·순매출을 직접 입력해야만 부분 보정하고, 그 입력값도 **저장하지 않는다**.
- 근거: `packages/analytics/src/index.ts` `buildPremiumForecast()` → `mode: "opportunity_proxy"`, `measurement.revenueLabel: "추정 거래 기회"`, `calibration.mode: salesOrders > 0 ? "partial" : "none"`
- 근거: `formula` 항목 `"추정 거래액"` 설명 — *"실제 매출이 아니라 현재 외부 신호가 유지될 때의 거래 기회 범위입니다."*
- 근거: `cautions` — *"실제 주문·취소·반품·광고비 데이터가 없어 표시 금액은 매출 확정값이 아닌 추정 거래 기회 범위입니다."*
- **왜**: 검색 순위와 매출 사이의 전환율은 관측되지 않은 값이다. 곱하는 순간 숫자는 근거를 잃는다.

### 2-2. 방향성(상승·하락)에는 판매 데이터를 절대 반영하지 않는다
- **규칙**: 사용자가 넣은 주문 데이터는 **금액 쪽(전환율·평균 주문금액·불확실성 폭)에만** 반영되고, 30일 변화율 계산에는 들어가지 않는다.
- 근거: `packages/analytics/src/index.ts` L641–644 — *"방향성은 외부 신호로만 계산한다. 판매 관측값은 단일 집계(기간·주문수·순매출)라 '추이'가 존재하지 않는다 — 시계열이 아니므로 변화율을 뽑을 수 없다."* → `const momentum30 = proxyMomentum30;`
- 근거 테스트: `packages/analytics/test/forecast-claims.test.ts` — `it("방향성(30일 변화율)은 판매 데이터로 바뀌지 않는다 — 외부 신호만 쓴다")`, `it("그러므로 어떤 설명도 '주문 추이'를 반영한다고 말해서는 안 된다")`
- **왜**: 한 시점의 합계는 추세가 아니다. 한 점으로 기울기를 그리면 거짓이다.

### 2-3. 출처 없는 전환율 상수를 지우고, 상수 없이 잴 수 있는 하한을 쓴다
- **규칙**: 리뷰는 구매해야 쓸 수 있으므로 **리뷰 증가량 = 실제 구매의 하한선**. "최소 N건"이라고만 말하고 실제 판매량을 추정하지 않는다. 리뷰가 줄어들면(삭제·숨김) 하한을 만들지 않는다. 가격을 모르면 건수만 알린다.
- 근거: `packages/analytics/src/measured-floor.ts` `measuredPurchaseFloor()` — *"매출 추정은 출처 없는 전환율 상수에 기대고 있었다. 그것을 지우기 전에, 상수 없이 잴 수 있는 것을 먼저 쓴다"*, `if (reviewGrowth <= 0) return null;`
- 근거 테스트: `packages/analytics/test/measured-floor.test.ts` — `it("리뷰가 줄면 구매 하한을 만들지 않는다 — 삭제된 리뷰는 구매의 증거가 아니다")`, `it("가격을 모르면 건수만 알린다 — 없는 금액을 만들지 않는다")`

### 2-4. '수집 실패'와 '측정했는데 미노출'과 '측정한 적 없음'을 3분(三分)한다
- **규칙**: 순위 행은 `found`(노출) / `not_found`(충분히 확인했는데 미노출) / `invalid`(결과를 읽지 못함) / `stale`(30일 초과) / `unmeasured`(측정 이력 없음) 5상태로 갈린다. 화면 문구도 각각 다르다.
- 근거: `packages/analytics/src/rank-observation.ts` `structuralRankState()` — 미노출로 인정하려면 검색결과를 최소 `MIN_VALID_SERP_RESULT_COUNT = 40`개 읽었어야 한다
- 근거: `packages/analytics/src/index.ts` `CurrentRankState`, `currentRankObservation()`, `RANK_OBSERVATION_WINDOW_DAYS = 30`
- 근거 화면: `apps/web/src/components/ProductDetailView.tsx` L555 — `rank != null ? "N위" : invalid ? "결과를 읽지 못함" : measured ? "수집 범위 미노출" : "미측정"`
- 근거 화면: `apps/web/src/components/PremiumForecastView.tsx` L74 — `case "rank_not_found": return "40개 확인·미노출";`
- **왜**: 세 상태에서 사용자가 할 일이 각각 다르다. 뭉개면 "왜 안 팔리는가"의 원인 진단 자체가 불가능해진다.

### 2-5. "100위 밖"이라고 단정하지 않는다
- **규칙**: 확장은 검색결과 한 페이지(약 40~45개)만 훑으므로, 못 찾았을 때 재보지도 않은 범위를 단정하지 않고 **훑은 개수를 그대로 말한다**.
- 근거: `apps/web/src/components/ProductDetailView.tsx` L96–97 — *"확장은 검색결과 한 페이지(약 40~45개)만 훑는다. 못 찾았다고 '100위 밖'이라고 쓰면 재보지도 않은 범위를 단정하는 것이다. 훑은 개수를 그대로 말한다."*

### 2-6. 저검색량(`< 10`)을 0이나 수집 실패로 바꾸지 않는다
- **규칙**: SearchAd가 `"< 10"` 문자열을 반환하면 **원문 상태를 보존**해 `lowVolume` 플래그로 저장하고, 화면에 `10회 미만`으로 표기한다. 이때 클릭 추이가 비어도 "수집 실패"나 "수요 0"으로 단정하지 않고 `수집 완료 · 저검색량`으로 구분 안내한다.
- 근거: `packages/naver-api/src/providers.ts` `parseMetricQueryCount()` — `lowVolume: typeof value === "string" && /^\s*</.test(value)`
- 근거: `apps/web/src/lib/product-detail-normalizer.ts` `queryVolumeLabel()` — `lowVolume ? "N회 미만" : "N회"`
- 근거: `apps/web/src/components/ProductDetailView.tsx` L570 — `source={... selectedIsLowVolume ? "수집 완료 · 저검색량" : searchMetricsReady ? "수집 완료 · 추이 미제공" : "쇼핑 클릭 지표 수집 필요"}`, 안내문 *"상품 수요가 0이라는 뜻은 아닙니다."*

### 2-7. 측정하지 않은 키워드가 클릭·금액을 만들어내지 못하게 막는다
- **규칙**: 순위가 `null`이거나 범위 밖이면 클릭 점유율은 **정확히 0**. 과거에는 100위와 같은 0.0005를 돌려줘, 한 번도 재지 않은 키워드가 "아주 조금 팔리는 상품"처럼 금액을 만들어냈다.
- 근거: `packages/analytics/src/index.ts` `rankClickShare()` L222–232 — *"측정하지 않은 것은 나쁜 순위가 아니라 모르는 것이다."*
- 근거 테스트: `packages/analytics/test/forecast-rank-truth.test.ts` — `it("한 번도 재지 않은 키워드는 클릭 기회를 만들지 않는다")`, `it("유효 현재 순위가 없으면 보수 순위·Top10·기회지수가 모두 null이다")`

### 2-8. 광고를 제외하되, 정상 상품을 광고로 오인하지 않는다
- **규칙**: `type` 문자열을 단어 단위로 쪼개 정확히 광고 토큰(`ad`, `sponsored`, `powerlink` 등)일 때만 광고로 본다. `headline`·`upgrade`·`broadcast`처럼 'ad' 두 글자가 우연히 든 항목을 버리지 않는다. `"0"`·`"N"`·`"false"` 같은 빈 표시도 광고로 보지 않는다.
- 근거: `apps/collector-extension/src/serp-parser.ts` `looksAdType()`, `NEGATIVE_FLAGS`, `AD_TOKENS`, `truthyFlag()`, `isAdvertised()` — *"광고 표시가 없는 값(0, N, false 등)까지 광고로 보면 정상 상품이 조용히 사라진다."*
- 근거: `ispmax` 필드는 정체가 확인되지 않아 **참/거짓으로 온 경우만** 인정

### 2-9. "없다"는 주장과 "있다"는 주장에 서로 다른 근거 요건을 건다
- **규칙**: 리뷰 50개 미만 상품이 1페이지에 "있다"는 한 건만 봐도 참이지만, "없다"는 최소 5개(`MIN_REVIEW_SAMPLE_FOR_ABSENCE = 5`)를 실제로 측정했을 때만 말한다. 그 미만이면 `null`(미측정)로 남기고 표본 규모를 함께 노출한다.
- 근거: `packages/analytics/src/golden-keyword.ts` `MIN_REVIEW_SAMPLE_FOR_ABSENCE = 5`, `buildChecklist()`, `reviewMeasured` 필드
- 근거: `apps/api/src/products/keyword-analysis.ts` `preserveUnknownReviews()`
- **왜**: 네이버는 SERP 항목 대부분에 `reviewCount`를 싣지 않는다. 표본 1개로 "기회 있음"을 단정하는 것을 구조적으로 막는다.

### 2-10. 표본이 모자라면 판정 자체를 하지 않는다
- **규칙**: 수요 급등은 추이 표본 7개 이상, 시즌성은 12개월 중 8개월 이상일 때만 판정한다. 미달이면 `satisfied: null`(미측정)이고 화면에 "N개로는 판단 불가(M개 이상 필요)"라고 이유를 적는다. 상품명 패턴 벤치마크는 경쟁 상품명 표본 5개 미만이면 아예 판단하지 않는다.
- 근거: `packages/analytics/src/golden-keyword.ts` `MIN_TREND_POINTS_FOR_SPIKE = 7`, `MIN_MONTHS_FOR_SEASONALITY = 8`
- 근거: `packages/analytics/src/title-pattern.ts` `if (sampleCount < 5) return {... caution: INSUFFICIENT_CAUTION }` — `"표본 부족(5개 미만): 상품명 패턴을 판단하지 않습니다."`
- 근거: 기회 판정은 5개 체크리스트 중 3개 이상이 측정됐을 때만 — `opportunity: measuredCount < 3 ? null : satisfiedCount >= 3`

### 2-11. "모르는 것"을 "나쁜 것"으로 취급하지 않는다
- **규칙**: 경쟁가를 모르면 가격 계수는 중립 1(0.92 같은 페널티를 곱하지 않는다). 평점을 모르면 평점 계수도 중립 1(낮은 평점처럼 취급하지 않는다).
- 근거: `packages/analytics/src/index.ts` L541 — *"경쟁가를 모르면 중립(1). 0.92 를 곱하면 '모름'이 '약간 불리함'이라는 없는 정보가 된다."*, L548 — *"평점을 모르면 중립(1). 낮은 평점처럼 취급하지 않는다."*
- 근거 테스트: `packages/analytics/test/forecast-honesty.test.ts` — `it("평점을 모르는 것이 평점 4.5보다 나쁘게 취급되면 안 된다")`, `it("경쟁가를 모르는 것이 경쟁가와 같은 것보다 나쁘게 취급되면 안 된다")`

### 2-12. "수집을 더 돌렸다"는 이유로 전망이 나빠지지 않게 한다
- **규칙**: 경쟁 압력을 경쟁가 수집 **행 수**가 아니라 **나보다 싼 경쟁 상품의 비율**로 계산한다. 절반이 싸면 압력 0이 기준.
- 근거: `packages/analytics/src/index.ts` L625–631 — *"예전에는 경쟁가 행이 20건 넘으면 -3% 였고, 같은 시장에서 수집을 더 돌렸다는 이유로 전망이 나빠졌다."*
- 근거 테스트: `it("경쟁가를 더 많이 수집했다는 이유로 전망이 나빠지지 않는다")`

### 2-13. 전 기간 최솟값(과거 반짝 성적)을 오늘의 사실로 쓰지 않는다
- **규칙**: 표면·출처 조합마다 **가장 최근 1건만** 남긴다. 이전 구현은 전 기간·전 표면·전 출처 최솟값을 "현재 최고 N위"로 표시했고, 그 결과 PC 1위·모바일 14위인 상품이 "최고 1위" 한 줄로 뭉개져 모바일 약점이 사라졌다(2026-07-30 실측).
- 근거: `packages/analytics/src/keyword-exposure.ts` 파일 상단 주석 + `buildKeywordExposures()`, `bestLatestPcRank()`
- 근거: `apps/api/src/dashboard/best-rank.ts` — 규칙을 `@nsi/analytics` 한 곳에만 두어 홈·비교·액션이 같은 값을 보게 함

### 2-14. 부분 배치로 상품 전체 지표를 덮어쓰지 않는다
- **규칙**: 이번 수집이 추적 키워드 **전체**를 커버할 때만 상품 레벨의 가시성 점수·Top10 비율을 갱신한다. 일부만 오면 개별 순위 스냅샷만 저장한다.
- 근거: `apps/api/src/collector/collector.service.ts` `updateVisibilityFromRanks()` L375–404 — `const coversAllTracked = keywords.every(...)`
- **왜**: 측정 안 된 키워드가 분모에서 빠지면 진입률·가시성이 과대평가된다.

### 2-15. 네이버가 페이지를 안 준 회차를 관측으로 세지 않는다
- **규칙**: `resultCount === 0`인 행은 저장·상태판정·가시성 재계산 이전에 걸러낸다.
- 근거: `apps/api/src/collector/collector.service.ts` `isObservedRank()` L17–19 + `complete()` L198–200

### 2-16. 데이터랩 추이로 '관측 기간'을 부풀리지 않는다
- **규칙**: 관측 기간은 **우리가 실제로 수집한 것**(브라우저 순위·가격 스냅샷·리뷰)만으로 센다. 네이버는 등록 시점과 무관하게 과거 구간을 통째로 주기 때문.
- 근거: `packages/analytics/src/index.ts` L402–410 — *"오늘 등록해 순위를 한 번 잰 상품도 '관측 31일'이 되고 충분도 점수를 만점으로 받았다."*
- 근거 테스트: `it("구조적으로 invalid인 오래된 행은 관측 기간을 늘리지 않는다")`

### 2-17. AI 출력이 관측 데이터와 모순되면 경고를 붙인다 (지우지 않는다)
- **규칙**: AI 전략 결과에 ① 이미 PC 상위권인 키워드에 "순위를 올리라"거나 ② 이미 상품명에 있는 키워드를 "상품명에 넣으라"거나 ③ 수집하지도 않는 판매량을 원인으로 드는 대목이 있으면 **경고를 덧붙인다**. 부정문("올리지 마세요")과 유지 지시는 오탐하지 않도록 정규식으로 걸러낸다.
- 근거: `apps/worker/src/ai-contradictions.ts` `detectStrategyContradictions()` — *"프롬프트에 '근거 없는 내용을 만들지 말라'는 지시는 있지만 출력 검증기는 없었다."*, *"여기서 결과를 지우거나 고치지 않는다. … 지우면 왜 사라졌는지 아무도 모른다."*
- 근거: `apps/worker/src/ai-strategy.ts` `withContradictionCautions()` → `aiStrategyReportSchema.parse()` 재검증

### 2-18. AI가 매출·전환율·브랜드 경쟁력을 지어내지 못하게 프롬프트로 막는다
- **규칙**: 시스템 프롬프트가 명시적으로 금지한다 — *"주문·매출·환불·광고비가 없으면 실제 금액이나 판매량을 추정하지 말고 데이터 부족으로 명시하세요. 근거가 없는 브랜드 경쟁력, 고객 비율, 전환율, 매출 상승률을 만들어내지 마세요."*, *"시장 데이터의 상대 클릭 지수를 매출·주문·시장점유율로 해석하지 마세요."*
- 근거: `apps/worker/src/ai-strategy.ts` `systemPrompt` (프롬프트 버전 `sales-strategy-v6`)
- 보조 장치: 소수점 정밀도를 프롬프트로 지시하지 않고 **입력 데이터 자체를 반올림해서 넘긴다** — `apps/worker/src/snapshot-rounding.ts` `roundRatio()`: *"넘기지 않은 정밀도는 쓸 수 없다."*

### 2-19. 신뢰도 0% 막대를 그리지 않는다
- **규칙**: 신뢰도가 0이거나 범위 밖이면 `null`을 돌려 호출부가 막대를 그리지 않게 한다. 0% 막대는 "신뢰도 0"이라는 관측되지 않은 주장이기 때문.
- 근거: `apps/web/src/lib/confidence-scale.ts` `confidencePercent()`

### 2-20. 상품명 SEO 진단이 "네이버 공식 기준"인 척하지 않는다
- **규칙**: 모든 진단에 고정 주의문을 붙인다 — *"이 진단은 수집된 상품명의 문자열 구성만 확인하며 네이버 공식 발표가 아닙니다. 점수는 규칙 충족률이지 노출 순위 예측이 아닙니다."* 복합어와 띄어쓴 형태의 가중치 차이에 대해서도 *"공식 근거는 없습니다"*라고 명시한다.
- 근거: `packages/analytics/src/title-seo.ts` `CAUTION`, `keywordFinding()` compound 분기
- 근거: `packages/analytics/src/title-pattern.ts` `CAUTION` — *"네이버의 공식 노출 기준이나 복사 권고가 아닙니다."*
- 근거: `packages/analytics/src/golden-keyword.ts` `CAUTION` — *"경쟁도·기회 점수는 수집 시점의 공개 신호 기반 추정이며 판매를 보장하지 않습니다."*

### 2-21. 우리 판정이 못 찾았다는 이유로 "없다"고 단정하지 않는다
- **규칙**: 상품명 문자열에는 키워드가 없어도 **그 키워드로 실제 노출된 순위가 관측되면**, 네이버는 매칭한다는 뜻이므로 "상품명에 없습니다"(fail)로 판정하지 않고 사실만 알린다(warn).
- 근거: `packages/analytics/src/title-seo.ts` `keywordFinding()` — `observedRank != null` 분기
- 근거: `packages/analytics/src/keyword-title-match.ts` — *"'생닭가슴살 생 닭안심살 …' 이 '닭가슴살' 을 미포함으로 판정했다. 정작 그 상품은 그 키워드로 PC 1위였다 — 네이버는 매칭하는데 우리만 못 봤다(2026-07-30 실측)."*

### 2-22. 진단 원본을 잘라도 정작 필요한 필드를 잃지 않게 한다
- **규칙**: 큰 SERP 항목을 저장할 때 앞부분을 자르지 않는다. 키가 알파벳순이라 앞에서 자르면 `mallPcUrl`·`productParameters` 같은 뒤쪽 키가 통째로 날아가기 때문. 관심 키만 정규식으로 추리고, 무엇이 잘렸는지 알 수 있도록 **전체 키 목록**을 함께 남긴다. 진단 샘플도 광고 1개 + 비광고 2개를 섞어 담는다(검색결과 앞자리가 항상 광고라 비광고 항목의 키 구성을 영영 못 보는 문제).
- 근거: `apps/collector-extension/src/rank-result.ts` `boundArtifactEntry()`, `DIAGNOSTIC_KEY_PATTERN`, `pickDiagnosticEntries()`
- 근거: `apps/collector-extension/src/background.ts` `boundedCopy()` — `budget = 12_000`

### 2-23. 이상치를 조용히 버리지 않고 버린 개수를 보고한다
- **규칙**: 경쟁 가격 중앙값 대비 20% 미만·5배 초과를 이상치로 제외하되, **제외한 개수(`excludedOutlierCount`)를 결과에 함께 담는다.** 다 제외되면 원본으로 되돌린다.
- 근거: `packages/analytics/src/index.ts` `computePeerStats()` L101–110 — *"극단 이상치만 느슨히 제외하고 그 수를 함께 보고한다(정직성)."* + `caution: "상품 구성·용량 차이는 보정하지 않았습니다. 최저 노출가 기준 비교입니다."`

### 2-24. 비교(compare)가 신선도 조건을 못 맞추면 비교를 막는다
- **규칙**: 두 상품의 수집 시점 차이가 3일을 넘거나, 더 오래된 관측이 7일을 넘으면 `blocksComparison: true`.
- 근거: `apps/web/src/lib/compare-basis.ts` `MAX_COLLECTION_GAP_DAYS = 3`, `MAX_OBSERVATION_AGE_DAYS = 7`

### 2-25. PC/모바일 격차를 서로 다른 날짜 값으로 비교하지 않는다
- **규칙**: PC·모바일 수집 시각이 10분 넘게 벌어지면 "표면 격차"로 판정하지 않는다.
- 근거: `apps/worker/src/action-keyword.ts` `MAX_SURFACE_SKEW_MS = 10 * 60 * 1000`, `surfacesAligned()`

### 2-26. 진행 중인 것과 고장난 것을 구분한다
- **규칙**: 확장이 잡을 집어가야만 `RUNNING`(정말 수집 중), 그 전에는 `QUEUED`(수집기 응답 대기). 온라인 수집기 없이 60초가 지나면 서버가 자동 중단시킨다. 홈 알림은 10분 미만이면 "진행 중"(info), 이상이면 "응답하지 않음"(warn)으로 갈린다. 알릴 게 없으면 아예 아무것도 그리지 않는다.
- 근거: `apps/api/src/collector/job-sweeper.ts` `NO_COLLECTOR_TIMEOUT_MS = 60_000`, `QUEUED_TIMEOUT_MS = 30분`, `RUNNING_TIMEOUT_MS = 20분`
- 근거: `apps/api/src/dashboard/home-alerts.ts` `COLLECTOR_IDLE_MINUTES = 10` — *"'수집 중 0 · 대기 0'을 항상 띄우면 정작 확장이 멈췄을 때 그 변화가 묻힌다."*

### 2-27. "Top 10 진입률 0%"처럼 오해를 부르는 표시를 없앤다
- **규칙**: 0%는 "고장난 것"처럼 읽히고 13위와 100위를 같은 0%로 만든다. 대신 "N개 중 M개 · 가장 높은 순위 K위"로 표시한다.
- 근거: `apps/web/src/lib/top10-summary.ts` `top10Summary()`
- 근거: `apps/api/src/dashboard/best-rank.ts` — *"'남자'·'캐주얼' 처럼 상품과 무관한 넓은 키워드까지 분모에 넣어 13위라는 멀쩡한 성적을 0%로 뭉갠다."*

### 2-28. 판매처 종류를 확인할 수 없으면 적지 않는다
- **규칙**: 도메인으로 스마트스토어/브랜드스토어/가격비교를 판별할 수 없으면 순위만 말한다. *"확인할 수 없는 도메인에 스마트스토어라고 적으면 거짓말이 되므로."*
- 근거: `apps/web/src/lib/candidate-rank-label.ts` `sellerKind()`

### 2-29. 종료된 API의 과거 기록을 현재 값으로 재사용하지 않는다
- **규칙**: 종료된 Shopping Search API로 받은 전체 상품 수를 현재 경쟁도처럼 쓰지 않는다(`totalProducts: null`). DB의 기존 행은 "과거 추적 이력"으로만 구분 표시한다. 자동 추적 스케줄러도 공용 `lastRankCollectedAt` 대신 브라우저 순위 행의 존재를 직접 확인한다.
- 근거: `apps/api/src/products/keyword-analysis.ts` `buildKeywordAnalysis()` 주석 + `totalProducts: null`
- 근거: `apps/worker/src/scheduled-tracking.ts` `scheduledBrowserRankWhere()`

### 2-30. 로그·에러 메시지에서 비밀값을 지운다
- **규칙**: 토큰 프리픽스(`sbp_`, `sk-`, `ghp_`, `eyJ`), `Bearer` 토큰, URL 자격증명, Postgres DSN을 정규식으로 마스킹한 뒤에만 로그에 남긴다.
- 근거: `packages/contracts/src/redact.ts` `redactSecrets()`, 호출부 `apps/api/src/collector/collector.service.ts` `fail()`, `apps/worker/src/ai-strategy.ts`

### 2-31. 사용자가 볼 오류 메시지를 원문 그대로 노출하지 않는다
- **규칙**: 23종 에러 코드를 화이트리스트로 두고 한국어 안내문으로 매핑한다. 목록에 없는 코드는 `internal_error`로 강등된다.
- 근거: `packages/contracts/src/job-errors.ts` `jobErrorCodes`(23개), `jobErrorMessage()`, `collectionErrorCautions()`

### 2-32. 자동화 탐지를 회피하지 않는다 (CAPTCHA·로그인)
- **규칙**: CAPTCHA나 네이버 로그인 페이지를 만나면 우회를 시도하지 않고 탭을 사용자에게 띄운 뒤 작업을 `user_verification_required`로 끝낸다.
- 근거: `apps/collector-extension/src/background.ts` `runJob()` L79–83, `runSearchCandidatesJob()` L117–123, `runRankJob()` L310–316, `extractPageData()` L165–166

---

## 3. 도메인 판단이 박혀 있는 지점 (쇼핑·이커머스 실무 노하우) ★중요★

### 3-1. 순위별 클릭 점유율 곡선 (자체 정의)
- **무엇**: 네이버 내부 CTR이 공개되지 않으므로 보수적인 감쇠 곡선을 직접 정의.
- **수치**: 1~10위 `[0.30, 0.18, 0.13, 0.10, 0.08, 0.065, 0.055, 0.047, 0.041, 0.036]`, 11~20위 `0.032 → 0.012` 선형, 21~40위 `0.010 → 0.003` 선형, 41~100위 `0.0025 → 0.0005`(하한 0.0005), 101위 이상·미측정은 **0**.
- 근거: `packages/analytics/src/index.ts` `rankClickShare()`
- **설계 판단**: 기회지수(`opportunityIndex`)는 같은 곡선으로 "모든 키워드 1위일 때"를 100으로 두는 비율이라 **곡선의 절대 수준이 약분된다.** 즉 곡선 값 자체의 정확도에 의존하지 않고 단조감소 성질만 쓴다. — `packages/analytics/src/measured-floor.ts` `opportunityIndex()`

### 3-2. 황금 키워드 점수 — 가중치 합 100
| 신호 | 가중치 | 정규화 |
|---|---|---|
| 월간 검색량 | 30 | `log10(volume+1)/5` |
| 공급/수요비(검색량÷상품수) | 30 | `log10(1 + ratio×100)` |
| 경쟁도(낮음/중간/높음) | 15 | 1 / 0.5 / 0 |
| 평균 클릭률 | 10 | `ctrPct / 5` |
| 1페이지 광고 비율 | 15 | `1 - adRatioPct/100` |
- 측정된 신호의 가중치 합으로 나눈다(빠진 신호가 점수를 낮추지 않음). 검색량·상품수가 둘 다 없으면 `null`.
- 근거: `packages/analytics/src/golden-keyword.ts` `calculateScore()`, `competitionSignal()`

### 3-3. 황금 키워드 5개 체크리스트와 임계값
| 항목 | 판정 기준 |
|---|---|
| 월간 검색량 확인됨 | `monthlyVolume > 0`, `lowVolume`이면 "월간 검색량 10회 미만 구간" |
| 검색 추이 확인됨 | `trendPointCount > 0` |
| 1페이지에 리뷰 50개 미만 상품 존재 | 리뷰 50 미만 1건이라도 있으면 참 / 없다고 하려면 최소 5개 측정 |
| 최근 수요 급등(약 30일) | 최고치 ÷ 중앙값 ≥ **1.8**, 추이 표본 ≥ **7** |
| 시즌성 있음(12개월) | 최고치 ÷ 중앙값 ≥ **2.0**, 관측 ≥ **8개월**, 성수기 달 함께 표시 |
- **도메인 판단**: 시즌성 임계값(2.0)을 일별 급등(1.8)보다 **높게** 잡은 이유가 코드에 명시돼 있다 — *"월 단위는 노이즈가 평활화돼 같은 배수라도 의미가 더 크고, 반대로 낮게 잡으면 완만한 우상향도 시즌성으로 오판된다."*
- 근거: `packages/analytics/src/golden-keyword.ts` 상수 4종 + `buildChecklist()`

### 3-4. 키워드 추천(도출) 우선순위
`seedKeyword`(사용자 검색어, 우선순위 **2**) > 카테고리 말단어(**1.5**) > 상위 카테고리(**1.35**) > 제품명 첫 명사+카테고리 조합(**1.2**) > 제품명 명사 1·2·3(**1.1 / 1 / 0.95**) > 모델명 후보(**0.7**)
- **도메인 판단**: 모델명 추정 토큰은 **제거하지 않고 최하위로 강등만** 한다(오탐 시 손실 최소화). 브랜드/제조사 토큰·순수 숫자·숫자+단위·판촉어는 제외.
- 근거: `apps/api/src/products/keyword-derivation.ts` — 파일 상단에 실패 사례 기록: *"상품명을 잘라 맨 앞(브랜드+모델) + 맨 뒤(용량/포장) 조각만 키워드로 써서 (예: '헬시오 히치웨이', '1.5kg 1통') 검색량 0의 무의미한 키워드가 나왔고, 사용자가 입력한 검색어('프로틴')는 버려졌다."*
- 근거 사전: `packages/analytics/src/korean-tokens.ts` — `UNIT_TOKENS` 30종(kg/g/ml/통/포/정/매/장/팩/세트/캡슐/스틱/봉/개입 등), `STOPWORDS` 19종(정품/무료배송/당일발송/공식/본품/리필/증정/사은품/할인/특가/베스트/국내산 등). 순수 영숫자어(B12, 4K, 3CE)는 남긴다.

### 3-5. 우선 실행 액션 선정 순서 (5단계 standing)
`mobile_gap` → `improvable` → `unproven` → `absent` → `top_hold`
| standing | 조건 |
|---|---|
| mobile_gap | PC ≤ **3위** 이고 모바일 − PC ≥ **10계단**, 두 표면 수집 시각 차 ≤ 10분 |
| improvable | PC 순위 존재 & > 3위 |
| unproven | PC를 한 번도 측정 안 함 |
| absent | 측정했는데 미노출 (다음 목표 키워드를 함께 제시) |
| top_hold | 전부 상위권 — "지금 손댈 것이 없습니다. 상품명을 바꾸면 오히려 순위가 흔들릴 수 있습니다." |
- **도메인 판단 ①**: 미측정(`unproven`)을 미노출(`absent`)보다 **앞에** 둔다 — *"측정한 적 없는 것을 '노출 안 됨'으로 단정하면 거짓이고, 그러면 광역 키워드가 다시 1순위로 올라온다."*
- **도메인 판단 ②**: 액션 문구가 상품명 상태(`exact_phrase` / `compound` / `partial_token` / `absent`)와 **상품명 길이 50자**를 함께 보고 갈린다. 50자 이상이면 "덧붙이지 말고 관련성 낮은 문구와 교체할 수 있는지 먼저 검토하세요".
- 근거: `apps/worker/src/action-keyword.ts` `MOBILE_GAP_THRESHOLD = 10`, `TOP_RANK = 3`, `MAX_SURFACE_SKEW_MS`, `pickActionKeyword()`, `titleStep()`

### 3-6. 상품명 SEO 7개 규칙
| 규칙 | 기준 |
|---|---|
| 길이 | **40~50자** pass / 50자 초과 fail / 40자 미만 warn(키워드 여지) |
| 키워드 위치 | 앞 **2개 토큰** 안 pass / 중간 이후 warn |
| 중복 토큰 | 의미 토큰 반복 시 fail |
| 특수문자 | 0~1개 pass / 2~3개 warn / **4개 이상** fail |
| 판촉 표현 | `STOPWORDS` 포함 시 fail |
| 브랜드 단독 | 브랜드 외 의미 토큰 **2개 미만**이면 fail |
| 판매자 태그 | **정확히 10개** pass / 1~9개 warn / 0개·11개 이상 fail |
- 점수 = 측정된 규칙만의 충족률(pass 100 / warn 50 / fail 0). 등급: 80↑ 좋음, 55↑ 보통, 미만 개선 필요.
- 광고 미리보기 제목은 앞 **25자**로 자름(`adPreviewTitle`).
- 근거: `packages/analytics/src/title-seo.ts`

### 3-7. 상위 상품명 패턴 벤치마크
- 경쟁 상품명 표본 **5개 이상**일 때만 판정. 상위 **20개**(내 상품 제외, 순위순)를 대상으로 등장률 **30% 이상** 토큰만 공통 패턴으로 인정, 상위 **12개** 노출. 내 상품명에 없는 것을 `missingTokens`로 표시.
- 근거: `packages/analytics/src/title-pattern.ts` `buildTitlePatternBenchmark()`, `apps/api/src/products/keyword-analysis.ts` `buildTitleSeoSection()` (`.slice(0, 20)`)

### 3-8. 순위 매칭 규칙 (카탈로그 ID · 판매자 상품 ID · URL 경로 ID)
- **ID 우선순위**: `mallProductId`(채널상품번호 = 스마트스토어 URL의 숫자) → `chnl_prod_no` → `item.productParameters.mallProductId` → … → `stdGroupId` → `id`.
- **핵심 도메인 지식이 코드 주석에 남아 있음**: *"네이버 검색결과 항목에는 상품번호가 두 체계로 실린다: mallProductId = 채널상품번호(우리가 대조하는 값), id = 네이버 상품번호(다른 체계). mallProductId 를 앞에 두는 것이 중요하다. id 를 먼저 집으면 영영 일치하지 않는다."* + 2026-07-20 잘린 샘플만 보고 내린 오판을 2026-07-21 전체 키 확인으로 정정한 기록.
- **URL 경로 매칭**: id가 경계(`/`, `?`, `#`, 끝)로 끝나는 세그먼트일 때만 매칭 — 긴 숫자 id가 다른 링크에 우연히 substring으로 포함돼 오매칭되는 것을 방지.
- **대조 대상**: `externalProductId`(판매자 상품 ID) + `catalogId`(가격비교 카탈로그 ID) + URL 경로에서 뽑은 ID 3종 전부.
- 근거: `apps/collector-extension/src/background.ts` `extractId()` L526–544, `packages/analytics/src/index.ts` `pathContainsId()` L79–83
- 근거: `apps/api/src/collector/collector.service.ts` `enqueueProductFollowups()` targetIds 구성, `apps/worker/src/scheduled-tracking.ts` `rankTargetIds()` (두 경로가 같은 규칙을 쓰도록 명시)

### 3-9. 경쟁상품 선정 기준
- 앵커 키워드 **1개**의 상위 검색 결과만 입력으로 받는다 — *"서로 다른 검색 의도를 한 중앙값에 섞지 않음."*
- 광고 제외, 내 상품 제외(ID 일치 + URL 경로 ID 일치), 동일 상품 중복 제거.
- 가격 기준은 **최저 노출가**(`priceBasis: "listed_low_price"`), 이상치는 중앙값 대비 **20% 미만 · 5배 초과** 제외.
- AI 전략 입력의 경쟁사는 최근 **30일 내 관측된**(`lastSeenAt`) 것만, 순위순 최대 30개.
- 근거: `packages/analytics/src/index.ts` `computePeerStats()`, `apps/worker/src/ai-strategy.ts` competitors include 절

### 3-10. SERP 가격 파싱 키 우선순위 (실측 기반)
`price` → `lowPrice` → `salePrice` → `pcDiscountedSalePrice` → `dlvryLowPrice` → `mbrDlvryLowPrice` → `formattedListPrice`
- **도메인 판단**: *"뒤쪽 3개는 2026-07-20 실측 원본 기준이다. price 키가 없고 배송 최저가/정가만 실린 항목이 흔해, 앞의 4개만 보면 1페이지 가격이 대부분 빈 값이 된다. 우선순위는 실제 판매가에 가까운 순서(실판매가 → 배송 최저가 → 회원가 → 정가)로 둔다."*
- 근거: `apps/collector-extension/src/serp-parser.ts` `PRICE_PATHS`

### 3-11. 한글 검색어 정규화 — 공백 처리
- 네이버는 검색에서 공백을 무시한다("휴대폰 거치대" = "휴대폰거치대"). 정규화 키로만 매칭하면 공백 있는 쪽이 **영구 미수집**으로 남는 버그가 있었다. 지금은 ① 제목 완전 일치 미할당 입력 → ② 정규화 일치 미할당 → ③ 제목 완전 일치 순으로 찾고, 같은 질의를 가리키는 입력 키워드 **전부**에 같은 응답 행을 연결한다.
- 근거: `packages/naver-api/src/providers.ts` `fetchLegacyShoppingKeywordTrends()`, `fetchSearchAdKeywordMetrics()`(`wanted` Map)

### 3-12. 복합어 매칭의 최소 의미 길이
- 한글은 **2글자 이상**, 영숫자는 **3글자 이상**일 때만 substring 포함으로 인정. *"'반'→'일반상품', 'AS'→'CASE' 같은 무관한 문자열까지 포함으로 오판한다."* 정확 토큰 일치는 길이 무관 허용.
- 근거: `packages/analytics/src/keyword-title-match.ts` `safeForContainedMatch()`

### 3-13. 데이터 충분도(quality) 점수 — 가중치 합 100
| 항목 | 배점 |
|---|---|
| 검색량 메트릭 커버리지 | 20 |
| 추이 커버리지(키워드당 7포인트 이상) | 20 |
| 유효 실측 순위 커버리지 | **25** |
| 경쟁 가격(10건 기준) | 10 |
| 리뷰 수집 여부 | 8 |
| 리뷰 이력 축적(6회 기준) | 5 |
| 관측 기간(30일 기준) | 12 |
- 라벨: 70↑ 높음 / 45↑ 보통 / 미만 낮음. 45 미만이면 *"금액보다 방향성과 부족한 근거를 우선 확인하세요"* 주의문 추가.
- 근거: `packages/analytics/src/index.ts` `qualityScore` 계산부 L416–428

### 3-14. 30일 방향성 가중치
`0.50 × 수요변화 + 0.35 × 순위변화 + 0.10 × 리뷰변화 + 0.05 × 가격변화 + 경쟁압력` (clamp −0.45 ~ +0.55)
- 순위 모멘텀은 −0.60 ~ +0.60으로 제한. 이전에 노출됐다가 최신 관측이 미노출이면 **−0.60 고정**.
- 수요 모멘텀은 −0.35 ~ +0.35. 경쟁압력은 −0.03 ~ +0.03.
- 근거: `packages/analytics/src/index.ts` `proxyMomentum30`, `rankMomentum()`, `trendMomentum()`

### 3-15. 기타 도메인 상수
| 항목 | 값 | 근거 |
|---|---|---|
| 모바일 수요 보정 | PC 효과의 **65%** (`clickDemand = pc + mobile × 0.65`) | `packages/analytics/src/index.ts` |
| 키워드 중복 보정 | 메트릭 키워드 1개 초과당 −4%, 하한 **72%** | `overlapDiscount` |
| 기준 전환율 | `0.018 × 가격계수 × 리뷰계수 × 평점계수`, clamp **0.4%~5%** | `proxyConversionBase` |
| 관측 전환율 상한 | 실제 클릭 수 입력 시 **50%**, 없으면 **5%** (잘리면 화면에 고지) | `observedYieldMax`, `observedYieldCapped` |
| 판매 데이터 혼합 가중 | `주문수/(주문수+30) × min(1, 관측일/30) × 0.75`, 최대 **75%** | `salesBlendWeight` |
| 미노출 키워드의 보수 순위 | **41위**로 고정 계산 | `censoredRank` |
| 불확실성 축소 계수 | `sqrt(n/(n+4))` — *"k=4는 관측된 상수가 아니라 n=4에서 분산의 절반을 인정하는 정책값"* | `clickShareBand()` |
| 가격 변화 관측 창 | 최근 **30일** 스냅샷만 | `priceWindowStart` |
| 자동 추적 실행 시각 | KST **08시**, 이후 당일 미실행분 보충 | `apps/worker/src/scheduled-tracking.ts` |
| 확장 온라인 판정 창 | **150초** 무응답 시 오프라인 | `COLLECTOR_ONLINE_WINDOW_MS` |
| 네이버 API 일일 상한 | **20,000회** (문서상 25,000의 20% 예비 확보) | `packages/naver-api/src/quota.ts` `DEFAULT_NAVER_DAILY_REQUEST_CAP` |
| SearchAd 서킷브레이커 | 5분 창 안 실패 **2회**면 차단 | `NAVER_SEARCH_AD_BREAKER_THRESHOLD` |
| 페어링 코드 | 6자리, **10분** 만료, 1회용, 실패 10회 시 5분 잠금 | `apps/api/src/collector/collector.service.ts` |
| 진단 원본 보존 | **7일** 후 자동 만료 | `RAW_RETENTION_DAYS ?? 7` |

---

## 4. 검증 가능한 숫자

| 항목 | 값 | 근거 |
|---|---|---|
| 상품 등록 검색 후보 | 광고 제외 상위 **12개** | `products.service.ts` `SEARCH_CANDIDATE_LIMIT = 12` |
| MARKET EXPLORER 후보 | 광고 제외 상위 **20개** | `market.service.ts` `MARKET_PRODUCT_LIMIT = 20` |
| 후보 전송 계약 상한 | **40개** | `packages/contracts/src/index.ts` `BROWSER_SEARCH_CANDIDATE_TRANSPORT_LIMIT = 40` |
| SERP 파싱 행 | 최대 **60행** | `serp-parser.ts` `rawEntries.slice(0, 60)` |
| 저장되는 경쟁상품(키워드당) | 상위 **20개** (PC, 광고 제외) | `rank-result.ts` `buildRankCompletionPayload()` |
| 한 회차 저장 SERP 행 상한 | **600행** | `rank-result.ts` `searchResults.slice(0, 600)` |
| 순위 수집 키워드 | 최대 **30개** × PC·모바일 **2면** | `background.ts` `runRankJob()` |
| 등록 시 자동 도출 키워드 | 최대 **6개** | `keyword-derivation.ts` `out.slice(0, 6)` |
| 미노출 인정 최소 결과 깊이 | **40개** | `rank-observation.ts` `MIN_VALID_SERP_RESULT_COUNT = 40` |
| 순위 유효 기간 | **30일** | `index.ts` `RANK_OBSERVATION_WINDOW_DAYS = 30` |
| 순위 이력 전달 상한 | 키워드당 최근 **60건** | `products.service.ts` `PREMIUM_FORECAST_HISTORY_LIMIT = 60` |
| 클릭 추이 전달 상한 | **90건**(일별) | `PREMIUM_FORECAST_TREND_LIMIT = 90` |
| DataLab 수집 기간 | 일별 **30일** + 월별 **12개월** (시장 카테고리 12개월, 키워드 주별 90일) | `providers.ts` |
| 리뷰 감성 토픽 | **9종** | `background.ts` `summarizeReviewTopics()` |
| 황금 키워드 체크리스트 | **5개** 항목 | `golden-keyword.ts` |
| 상품명 SEO 규칙 | **7개** | `title-seo.ts` |
| 전망 모델 버전 | **NSI-RF-1.1** | `index.ts` `modelVersion` |
| AI 프롬프트 버전 | **sales-strategy-v6** | `ai-strategy.ts` `PROMPT_VERSION` |
| 작업 에러 코드 | **23종**(한국어 안내문 매핑) | `job-errors.ts` |
| 확장 폴링 주기 | **30초** | `background.ts` `periodInMinutes: 0.5` |
| CSV 일괄 등록 상한 | **100행** | `products.service.ts` L869 |
| 구독 티어 | **3종** — FREE(상품 3 / 키워드 10 / 수집 50 / 전망 50 / AI 0), PRO(20 / 30 / 300 / 200 / 50), BUSINESS(100 / 30 / 1,500 / 1,000 / 300) | `apps/api/src/billing/entitlement.service.ts` `planConfigs` |
| Chrome 확장 capability | **9종** 선언 | `background.ts` `sendHeartbeat()` |

> 주의: README에는 Free 월 수집 30회 / Pro 300회 / Business 1,500회로 적혀 있으나, **코드의 실제 값**은 Free 50 / Pro 300 / Business 1,500이다(`entitlement.service.ts`). 포트폴리오에는 코드 값을 쓴다.

---

## 5. 일반 접근과의 대조

**일반 순위 조회 도구로 "왜 안 팔리는지"를 보면 — 3단계**
1. 키워드를 입력한다
2. 내 상품 순위를 조회한다
3. 순위 숫자를 본다 (미발견이면 그냥 "미노출")

**이 시스템은 — 12단계**
검색 후보 수집 → 상품 상세 수집 → 키워드 도출(6개) → 후속 작업 자동 체이닝 → 수요 수집(SearchAd + DataLab 일별·월별) → PC·모바일 실측 순위 수집 → SERP 부가정보 60행 파싱 → 서버 검증·부분수집 판정·저장 → 표면·출처별 상태 판정(5상태) → 황금 키워드·상품명 SEO·패턴 벤치마크 분석 → 우선 실행 액션 선정(5 standing) → 전망(NSI-RF-1.1) + AI 전략 + 모순 검사 → 대시보드

**결정적 차이는 단계 수가 아니라 '판정의 해상도'다.**
일반 도구에서 "미노출" 한 단어로 끝나는 상태가, 이 시스템에서는 다섯 갈래로 갈린다 — 40개를 확인했는데 없었다(`not_found`) / 결과를 읽지 못했다(`invalid`) / 30일이 지난 값이다(`stale`) / 한 번도 재지 않았다(`unmeasured`) / 노출됐다(`found`). 사용자가 할 일이 각각 다르기 때문이다. 여기에 PC·모바일 표면 분리가 얹히면, 일반 도구가 "1위"로 뭉개는 상태에서 **"PC 1위인데 모바일 14위 — 상품명이 아니라 모바일 노출 요소 문제"**라는 진단이 나온다.

---

## 6. 규모 지표

| 항목 | 값 |
|---|---|
| 추적 파일 수 | **462개** |
| 주요 언어 | TypeScript **1,602,919 bytes** (98.0%) · JavaScript 19,963 · PowerShell 14,103 · HTML 5,930 |
| TypeScript 총 라인 | **27,498줄** (`.ts` + `.tsx`) |
| 프로덕션 코드 | **18,160줄** (테스트 제외) |
| 테스트 코드 | **9,338줄** / **98개 파일** / **692개 케이스** |
| 커밋 수 | **488개** |
| 병합된 PR | **205개** |
| DB 마이그레이션 | Prisma **27개** + Supabase RLS **10개** (SQL 파일 37개) |
| Prisma 모델 | **35개** |
| 설계·운영 문서 | **45개** (`docs/*.md`) |
| 구조 | pnpm 모노레포 — 앱 4개(`api`/`web`/`worker`/`collector-extension`) + 패키지 5개(`analytics`/`contracts`/`database`/`naver-api`) |
| 스택 | Next.js(web) · NestJS(api) · pg-boss 워커 · Prisma + Supabase Postgres(RLS) · Chrome MV3 확장 · OpenAI 구조화 출력 |
| 운영 | AWS EC2 t3.micro(서울) + Nginx + pm2 + Let's Encrypt, Supabase Auth/DB. Chrome Web Store 게시(NSI Shopping Collector 0.5.7) |

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

### 실명·개인정보
- **`9843ohs@gmail.com`** — 최고관리자 계정이 소스에 하드코딩돼 있다(`apps/api/src/auth/auth.service.ts` `MASTER_ADMIN_EMAIL`). 절대 인용 금지.
- **`support@naver-shopping-insight.com`** — `.env.example`의 지원 메일. 인용 불필요.

### 제3자 브랜드 (고객사 아님, 그러나 인용 주의)
- 데모·픽스처에 **스타벅스 / 스탠리** 실제 상품명·판매자명·상품ID가 들어 있다(`packages/contracts/src/fixtures.ts`, README 예시). 이들은 이 서비스의 고객사가 아니라 공개 검색 예시일 뿐이지만, 포트폴리오 화면 캡처나 문구에 브랜드명을 노출하면 **실제 고객사로 오해될 수 있으므로** 쓰지 않는다.
- 코드 주석에 등장하는 `헬시오 히치웨이`, `하림형·피르모형`, `닭가슴살`, `레인부츠` 등은 실패 사례 기록용 예시다. 포트폴리오에 그대로 옮기지 않는다.

### 인프라 식별자 (비밀키는 아니나 비공개 유지)
- Supabase 프로젝트 ref `betxdsfkthpobkukslgu`, EC2 IP `13.209.170.25`(`13-209-170-25.sslip.io`), 로컬 DB 비밀번호 `NsiLocal2026!`(`.env.example`, 로컬 전용). 전부 공개 금지.
- 실제 API 키는 저장소에 없다(`.env.example`은 전부 빈 값). ✔

### 네이버 약관 관련 — 표현 주의
- 수집은 **사용자 본인의 Chrome에서, 본인이 설치·동의한 확장으로** 이뤄진다. 서버가 네이버를 크롤링하지 않는다. 포트폴리오에서는 "서버 크롤러"나 "우회"라는 표현을 쓰지 않는다.
- CAPTCHA·로그인은 **우회하지 않고 사용자에게 넘긴다**(`user_verification_required`). 요청 간 무작위 지연(1.2~5초)과 네이버 API 일일 상한(20,000)·서킷브레이커를 둔다. 이 점은 **오히려 강조할 만한 설계 판단**이다.
- 종료된 Shopping Search API는 **호출하지 않으며** 기존 DB 행은 과거 기록으로만 표시한다.

### 미완성·과장 금지 항목
- **결제 공급자·웹훅·자동 청구 미연동.** 관리자가 수동으로 요금제를 변경한다. "SaaS 구독 매출"로 표현하면 사실과 다르다.
- **프리미엄 금액은 `opportunity_proxy`**(추정 거래 기회). "매출 예측"이라고 쓰면 이 시스템이 명시적으로 거부하는 주장을 하는 셈이 된다. `추정 거래 기회`로 쓴다.
- **백테스트 미완료.** 코드에 *"백테스트 전에는 실매출 보정 모델로 승격하지 않습니다"*가 반복 명시돼 있다.
- **팀 기능(`TEAM_MEMBERS`)은 전 등급 false**, 이메일 초대 기능 없음. README의 "Business 팀 10명"은 코드와 불일치(`teamMembers: 1`).
- **NAVER API HUB 전환 예정** — 현재 legacy DataLab을 임시 사용 중.
- **Vercel은 운영에 사용하지 않는다**(2026-07-18 EC2 단독 이전). 남아 있는 `naver-shopping-insight.vercel.app`은 옛 빌드이며 운영 API 접근이 차단돼 있다.
- README의 "Free 월 수집 30회"는 코드(50회)와 다르다. §4 주의 참조.
