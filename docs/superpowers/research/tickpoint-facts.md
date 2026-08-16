# Tickpoint 팩트 시트
저장소: stock-training | 분석일: 2026-08-16

> 모든 항목은 저장소 HEAD(`53ce47e`)의 실제 코드에서 확인한 것만 기록한다.
> 경로는 저장소 루트 기준 상대 경로. 확인하지 못한 것은 "근거 없음"으로 표기했다.

---

## 1. 실제 파이프라인 단계

이 시스템의 하루는 "수집 → 후보 압축 → 점수 → LLM 반론 → 조건부 판단 → 장중 검증 → 모의 체결 → 성과 측정"의 10단계로 돈다.
핵심 단계(3~10)는 대부분 `app/recommenders/unified_recommender.py::recommend()` 한 함수 안에서 순서대로 확인된다.

### 1단계. 외부 데이터 수집 (KST 05:30~07:45)
- 하는 일: KRX/pykrx 시세·수급, DART 공시·재무, 네이버 뉴스, SNS(Twitter/YouTube), Yahoo 글로벌 지수, FRED(미국 거시), ECOS(한국 거시), Fear&Greed, Tavily/Perplexity 웹검색을 각각 별도 수집기로 적재한다.
- 근거: `app/collectors/` (38개 `.py` 파일), `app/scheduler/collection_jobs.py`, `README.md` 「데이터 수집기(Collectors)」 표
- 스케줄 정의: `app/scheduler/scheduler.py` (21,622줄, `add_job` 호출 194회 / 고유 job id 190개)

### 2단계. 거래일 확정 및 "부분 수집일" 회피
- 하는 일: 추천 기준일을 오늘로 가정하지 않는다. `stock_prices` 의 당일 행 수가 `min_count=1200` 에 못 미치면 직전 완전 거래일로 자동 후퇴한다. 후퇴했다는 사실을 `partial_day_avoided` 플래그로 응답에 남긴다.
- 근거: `app/recommenders/unified_recommender.py:145-156`, `app/utils/trading_calendar.py::last_complete_trading_day`
- 코드 주석에 실측 근거가 박혀 있다: 라이브 2026-05-11 기준 `today_count=924/2000` → 부분 수집일 선택 위험 차단. 임계값을 2000에서 1200으로 낮춘 이유도 "운영 평균 1500의 약 80%"로 명시.

### 3단계. 3트랙 후보군 구성
- 하는 일: 거래대금 상위(기본 300종목)를 포함한 복수 소스에서 후보를 모으고, 같은 종목이 여러 소스에서 잡히면 `sources` 집합으로 합치며 트랙(`event`/`defensive`/일반)을 우선순위 규칙으로 승격한다.
- 근거: `app/recommenders/candidate_filter.py::build_three_track_universe`
- 후보 상한은 `max_candidates = max(40, min(150, limit*8))` 로 요청 크기에 연동 (`unified_recommender.py:160`)

### 4단계. 하드 위험 게이트 (거절 단계)
- 하는 일: 후보를 점수 매기기 **전에** 잘라낸다. 가격 행 없음(`missing_price`) / 거래대금 1억 원 미만(`low_liquidity`) / 장중 변동성 18% 초과(`high_volatility`) / 관리·경고·거래정지 플래그(`high_risk_flag`)를 각각 사유와 함께 탈락시킨다.
- 근거: `app/recommenders/candidate_filter.py::apply_hard_risk_gate`
- 기본값: `min_trading_value=100,000,000`, `max_intraday_volatility_pct=18.0` (`config_loader` 의 `risk_gate` 설정)

### 5단계. 시장 국면 판정 후 국면별 가중치 적용
- 하는 일: `determine_market_regime(ref_date)` 로 국면을 정하고, 국면별 가중치 세트를 불러와 점수 가중치를 바꾼다. 가중치의 출처(`weights_source`)·적용일·클램프 여부를 응답 메타에 남긴다.
- 근거: `app/recommenders/unified_recommender.py:162-176`, `app/recommenders/signal_determiner.py`, `app/analyzers/kr_market_gate.py`

### 6단계. 7차원 점수 계산
- 하는 일: `market_context / quality / momentum / smart_money / catalyst / sentiment / activity` 7개 차원으로 점수를 만든다. 자본잠식·관리종목·거래정지 정보를 quality 점수에 주입한다(데이터 없으면 fail-safe).
- 근거: `app/recommenders/score_builder.py` (3,469줄), 차원 목록은 `unified_recommender.py:307-315` 의 `dimensions_internal`
- 이어서 `_apply_kr_market_overlays` → `_finalize_and_rank` → (플래그 ON 시) `_apply_supply_demand_post_filter`

### 7단계. LLM은 "판단자"가 아니라 "반론자"로만 개입
- 하는 일: LLM 호출은 상위 후보에만, 일일 호출 상한(`llm_cap = max(5, min(cap, 50))`) 안에서 이뤄진다. LLM이 낼 수 있는 것은 점수 자체가 아니라 **가감점 `qualitative_adjustment` 하나**이고, 이 값의 허용 범위는 **±5점**(0~100 점수 기준)이다. 적용 후 최종 점수는 0~100으로 강제 clamp하고, clamp가 발동했는지(`score_cap_applied`)를 기록한다.
- 근거: `app/recommenders/unified_recommender.py::_apply_llm_layer`, 정책 메타 `"llm_policy": {"mode": "challenger_only", "adjustment_bound": 5}` (`unified_recommender.py:299-304`)
- 즉, LLM이 오작동해도 종목 순위가 뒤집히지 않도록 영향력을 구조적으로 5점으로 묶어두었다.

### 8단계. Forward Judgment 객체 생성 (조건부 판단)
- 하는 일: "지금 사라"가 아니라 "이 조건이 장중에 충족되면 매수, 이 조건이 깨지면 무효"라는 구조화된 판단 객체를 만들어 붙인다. 진입 조건·무효화 조건이 `metric / operator / threshold / window / required` 로 구조화되어 기계가 검증 가능하다.
- 근거: `app/schemas/judgment.py` (`JudgmentObject`, `JudgmentCondition`), `app/recommenders/unified_recommender.py::_attach_forward_judgments`
- 결정값 9종(`STRONG_BUY/BUY/CONDITIONAL_BUY/WATCH_STRONG/WATCH/HOLD/AVOID/SELL/INVALIDATED`), 데이터 품질값 6종(`PRIOR_DAY_ONLY/OVERNIGHT_GROUNDED/OPENING_SNAPSHOT/INTRADAY_PARTIAL/LIVE_VALIDATED/STALE_OR_INVALID`)

### 9단계. 장중 실시간 검증 (KST 09:05 / 09:30 / 10:00)
- 하는 일: 장 전 조건부 판단을 장중 실시간 시세로 검증해야만 BUY로 승격된다. 라이브 모드에서는 **당일 EOD 행을 아예 읽지 않는다**(09:30에 종가를 읽는 것이 곧 미래 정보이므로). 전일 종가·20일 거래량 평균만 DB에서 가져오고, 현재가는 KIS 배치 조회로 받아 **저장하지 않고** 쓴다.
- 근거: `app/services/intraday_quote.py::fetch_intraday_quotes`, `intraday_validator._build_metrics_snapshot`, `run_validation_window_with_live_quotes()`
- 시세 확보율이 `INTRADAY_VALIDATION_QUOTE_MIN_COVERAGE`(0.5) 미만이면 운영자에게 통지 — 시세를 못 받으면 조용히 전부 '확인 불가'가 되어 BUY 0건이 되기 때문

### 10단계. 모의 체결 → 성과 측정 → 운영자 알림
- 하는 일: 각 섹션(recommendation / surge / issue_stock / my_stocks / vcp / closing_bet / chart_expert / forward_judgment)의 BUY 결정을 **자체 필터 없이 그대로** paper position으로 변환해 원천 신호 품질을 측정한다. 그 다음 outcome을 갱신하고 KPI·알파를 산출한다.
- 근거: `app/services/paper_simulation/` (`executor.py` / `outcome_updater.py` / `cohort_stats.py` / `validation_metrics.py` 등 4,252줄), `app/recommenders/performance_tracker.py::build_kpi_snapshot`
- 체결 규칙: BUY 1건당 1억 원(`DEFAULT_VIRTUAL_CASH_KRW`), `quantity=floor(1억/entry_price)`, 진입가는 신호일 종가, 종목당 소스별 OPEN 포지션 1개(`single_open_position_per_stock`)

---

## 2. 품질 보증·검증 장치 — 이 시스템이 '거부'하는 것

### 2-1. 데이터가 오래됐으면 스키마 레벨에서 BUY 자체를 만들 수 없다
- 규칙: `data_quality != LIVE_VALIDATED` 면 `BUY`·`STRONG_BUY` 생성 불가. `STALE_OR_INVALID` 면 `CONDITIONAL_BUY` 까지 차단. 전일 데이터만 있으면 `SELL` 도 차단(방어 의도는 `AVOID` 로 정규화). `CONDITIONAL_BUY` 는 진입 조건과 무효화 조건이 **둘 다** 있어야 한다.
- 코드 근거: `app/schemas/judgment.py:175-210` `_enforce_forward_judgment_honesty` (Pydantic `model_validator`, 위반 시 `ValueError`)
- 왜 필요한가: 이것은 화면 경고나 로그가 아니라 **객체 생성 실패**다. 어떤 코드 경로로 우회하든 낡은 데이터로 매수 신호를 만들 수 없다. 대부분의 시스템은 "오래된 데이터입니다" 배지를 띄우고 신호는 그대로 내보낸다.

### 2-2. 범주형 지표에 산술 비교를 못 쓰게 막는다
- 규칙: `market_gate` / `candle_state` / `chart_signal` 은 분류값이므로 `GTE/LTE/GT/LT` 연산자를 금지하고 `EQ`/`IN` 만 허용한다.
- 코드 근거: `app/schemas/judgment.py:105-124` `_validate_categorical_metric_operator`
- 왜 필요한가: "market_gate >= YELLOW" 같은 무의미한 조건이 자동매매 진입 판정에 들어가면 조용히 오작동한다. 주석에 목적이 명시돼 있다 — "자동매매 진입 결정의 오판을 막기 위해 schema 레벨에서 차단".

### 2-3. LLM이 스스로 매긴 데이터 품질 점수를 믿지 않는다
- 규칙: 입력 데이터 완성도를 **코드가 직접 0~100으로 계산**한다. 기술(최대 40) / 펀더멘털(15) / 미국시장(15) / 거시(15) / 뉴스(10) / 웹검색(5) / 차트(보너스 5)로 배점하고, 빠진 항목을 `missing` 리스트로 전부 반환한다.
- 코드 근거: `app/llm/orchestrator.py:619-794` `_compute_input_quality`
- 함수 docstring이 목적을 그대로 적고 있다: "LLM이 임의로 data_quality_score를 높게 주는 문제를 완화하기 위한 품질 게이트. 점수는 '모델 신뢰도'가 아니라 '입력 데이터 충실도'입니다."
- 그리고 이 점수로 LLM 신뢰도를 깎는다: `gated = confidence × (0.5 + 0.5 × quality/100)` (`orchestrator.py:139-148` `_apply_weighted_quality_gate`)

### 2-4. LLM 응답 파싱 실패는 조용히 넘어가지 않고 HOLD로 떨어진다
- 규칙: 응답에서 JSON을 3단계(코드블록 → `raw_decode` 스캔 최대 50회 → 전문 파싱)로 추출하고, `decision` 이 `BUY/SELL/HOLD` 가 아니거나 `confidence` 가 0~100을 벗어나면 실패 처리한다. 실패 시 반환값은 `success=False` + `decision='HOLD'` + `confidence=0`.
- 코드 근거: `app/llm/prompt_template.py:733-875` `DataValidator.validate_and_parse_response`
- 왜 필요한가: 파싱 실패의 기본값이 매수가 아니라 관망이다. 오류가 "행동"으로 번역되지 않는다.

### 2-5. 모델 합의가 안 되면 결론을 내지 않는다
- 규칙: 모델 다수결로 결정하되 **합의율 67% 미만이면 `NO_CONSENSUS` 로 확정하고 신뢰도를 0으로 만든다**. 100% 일치는 `STRONG`, 67% 이상은 `MODERATE` 이지만 신뢰도에 0.8을 곱한다. 단일 모델만 성공한 경우는 `STRONG` 이 아니라 `SINGLE_MODEL` 로 별도 표기한다. 반대 의견을 낸 모델의 신뢰도가 높으면 합의 신뢰도에서 최대 20점을 추가 감점한다.
- 코드 근거: `app/llm/orchestrator.py:1058-1154` `_calculate_consensus`
- 왜 필요한가: 모델 하나만 응답에 성공했을 때 그것을 "만장일치"로 표기하면 신뢰도가 부풀려진다. 실제로 이 `SINGLE_MODEL` 분기는 사후 감사에서 잡혀 추가된 것으로 CLAUDE.md에 기록돼 있다("`orchestrator` 단일모델 consensus STRONG→SINGLE_MODEL", PR #391).

### 2-6. 표본이 없으면 알파를 0이 아니라 "모름(None)"으로 낸다
- 규칙: 전략 표본과 벤치마크 표본이 **둘 다** 있을 때만 알파를 계산한다. 한쪽이라도 0건이면 `None`.
- 코드 근거: `app/recommenders/performance_tracker.py::build_kpi_snapshot` 내 `_alpha()`
- 코드 주석에 실사고가 그대로 남아 있다: "예전 가드로는 알파가 `0 - 벤치마크` 가 됐다. 시장이 빠질수록 우리가 잘한 것처럼 보인다 — 2026-07-12 구간에서 1M 표본 0건에 +20.8% 가 나왔다. 모르는 것은 0 이 아니라 모른다(None)."
- 기본 payload에도 같은 원칙이 적혀 있다: "표본이 없는 구간의 알파는 0% 가 아니라 모른다"

### 2-7. 알파에 통계적 유의성 검정을 붙인다
- 규칙: 초과수익 표본으로 t통계량과 p값을 계산하고, `significant_95` 는 `p < 0.05 이고 평균 알파 > 0` 일 때만 True.
- 코드 근거: `app/recommenders/performance_tracker.py:676-724` `_significance_payload` (`t_stat = mean/(std/√n)`, `p_value = erfc(|t|/√2)`)
- 왜 필요한가: "지난달 수익률 +3%"는 표본 6건이면 아무 의미가 없다. 유의성을 같이 내보내야 그 숫자를 믿을지 판단할 수 있다.

### 2-8. 자동매매 실주문은 2단 성과 게이트를 통과해야 한다
- 규칙 (모의 허용 `dry_run_eligible`): 표본 ≥ 12 AND 승률 ≥ 45% AND 평균손익 > 0 AND profit factor ≥ 1.05 AND 보류비율 < 40%
- 규칙 (실거래 후보 `live_ready_candidate`): 표본 ≥ 20 AND 승률 ≥ 50% AND 평균손익 ≥ 0.5% AND profit factor ≥ 1.15 AND 평균 MAE > −8%
- 코드 근거: `app/services/paper_simulation/validation_metrics.py::_dry_run_gate` / `_live_gate`, 상수 `AGGRESSIVE_MIN_SAMPLE = 12` / `LIVE_MIN_SAMPLE = 20`
- 왜 필요한가: 상수 바로 위 주석에 임계값을 12로 올린 이유가 적혀 있다 — "5건 closed positions 만으로 활성화 시 우연히 5/5 수익 → win_rate=1.0 / profit_factor=999 통과 → 약한 신호로 dry-run 진입 다발". 즉 우연한 연승이 게이트를 통과하는 구멍을 실제로 막은 흔적이다.

### 2-9. 모의 시뮬레이션이 실주문 코드에 닿는지 테스트가 감시한다
- 규칙: paper simulation 모듈에서 `app.autotrading.*` / `app.collectors.kis*` / `kis_order_gateway` import 0건을 강제한다. 정적 import뿐 아니라 **동적 `import_module` 문자열까지 AST(`ast.Constant`)로 스캔**해 차단한다.
- 코드 근거: `tests/test_paper_simulation_dry_run_isolation.py`
- 왜 필요한가: "실주문은 안 나갑니다"를 말이 아니라 회귀 테스트로 증명한다. 문자열로 우회하는 동적 import까지 막는 수준.

### 2-10. 데이터에 없는 값을 지어내지 않고 "확인 불가"로 남긴다
- 가격 상태를 6단계로 구분한다: `FRESH_VERIFIED / FRESH_UNVERIFIED / STALE_VERIFIED / STALE_UNVERIFIED / LOW_COVERAGE / NO_VALID_PRICE` (`app/services/my_stocks_service.py::get_price_snapshots`)
- 가격이 비-FRESH면 낙폭을 단정하지 않고 `price_unreliable` 이벤트로 대체한다 — 없는 사건을 만들지 않기 위해 (`app/services/holding_invalidation.py`)
- `stocks` 마스터에 행이 없으면 "위험 없음"이 아니라 **"모름"**(`risk_flags_known=False`)으로 표시한다. 상장폐지 종목이 여기 걸린다.
- 뉴스 수집에서 Perplexity fallback이 `published_at` 을 `now()` 로 위장하던 것을 제거하고 `None` 으로 바꿨다 (`news_collector`, PR #391)

### 2-11. 정상 0건과 실제 장애를 구분한다 (거짓 경보 차단)
- VCP 신선도 판정에서 `insufficient_price_bars` / `no_price_data` / `analysis_candidates_zero` 는 제외해, **정상적으로 0건이 나온 스캔은 fresh, 가격봉 부족 같은 실장애는 stale** 로 남긴다.
- 코드 근거: `app/services/data_freshness.py`, `app/scheduler/vcp_jobs.py`, `app/services/vcp_signal_health.py::_refine_vcp_source_status`
- 왜 필요한가: 정상 0건을 장애로 알리면 알림이 소음이 되어 진짜 장애를 놓친다. 반대로 실장애를 0건으로 덮으면 8일간 반쪽 데이터를 모른 채 쌓게 된다(§3-9 참조).

### 2-12. 백테스트 표본을 오염시키는 "유령 거래일"을 지우지 않고 격리 표시한다
- `stock_prices` 에 비거래일 행 52,220건(전체 5.5%)이 확인됐다. 종가·거래량이 직전 거래일 복사본이라 기존 OHLCV 품질 가드를 통과한다.
- 대응: `trading_calendar.filter_kr_trading_days()` 로 조회 후 인덱싱 **전에** 거른다. 마이그레이션 215로 `stock_prices.quarantine_reason` 표시(`non_trading_weekend` 41,526 / `non_trading_holiday` 10,694).
- **삭제하지 않는다** — 되돌릴 수 없고 백테스트 표본을 또 바꾸기 때문. 헬퍼는 해석 불가한 값을 조용히 버리지 않고 `TypeError` 를 낸다.
- 코드 근거: `app/utils/trading_calendar.py`, `scripts/migrations/215_*.sql`, 회귀 `tests/test_trading_session_counting.py` (14건)

### 2-13. 투자 유도 표현을 사전에 걸러낸다
- 키워드 집계에서 "추천 / 권장 / 유망 / 기회 / 주목 / 예상 / 예측 / 강력 / 확실 / 대박"을 `STOP_WORDS` 로 제외한다.
- 코드 근거: `app/services/advanced_analytics/hot_keywords.py:88-89` (주석: "금지 표현 (투자 유도 가능)")
- 모든 고급분석 API 응답에 면책 문구를 붙인다: `app/api/v1/routers/advanced_analytics.py:45` `DISCLAIMER = "본 정보는 투자 권유가 아닙니다. 과거 데이터가 미래를 보장하지 않습니다. 투자 결정 및 책임은 본인에게 있습니다."` — 지표별로 문구를 덧붙인다("언급량과 주가는 무관할 수 있습니다", "미국 장과 한국 장의 연동은 보장되지 않습니다" 등)

### 2-14. 저장 성공 여부를 4단계로 쪼개 정직하게 보고한다
- `_persist_outputs` 가 `{scores, insights, forward_judgments, legacy_sync}` 각각의 bool을 반환하고, 응답에 `persistence_status` + `persistence_all_ok` 를 실어보낸다.
- 코드 근거: `app/recommenders/unified_recommender.py:236-241, 1004`
- 왜 필요한가: 일부만 저장돼도 "성공"으로 보고하면 다음날 화면이 비어 있는 이유를 못 찾는다. 실제로 이 저장소는 "뉴스 INSERT 0건이 `success`/`records_collected 1` 로 17시간 보고된" 사고를 겪고 `save_failure_reason()` 을 추가했다(2026-08-13).

---

## 3. 도메인 판단이 박혀 있는 지점 (투자·시장 도메인 노하우)

### 3-1. VCP(변동성 수축 패턴) — 마크 미너비니 원전 조건을 코드로 옮겼다
`app/analyzers/vcp_analyzer.py::detect_vcp_pattern` 은 6개 조건을 **모두** 만족해야 VCP로 인정한다(`is_vcp = near_high AND near_52w_high AND is_contracting AND has_min_cycles AND is_uptrend AND ma_condition`):

| 조건 | 코드상 규칙 | 기본값 (`app/config.py`) |
|---|---|---|
| 변동성 수축 | 후반부 가격범위 ÷ 전반부 가격범위 ≤ 임계값 | `VCP_CONTRACTION_THRESHOLD=0.6` |
| 최근 고점 근접 | 현재가 ≥ 최근 고점 × 비율 | `VCP_NEAR_HIGH_PCT=0.95` |
| 52주 고점 근접 | 현재가 ≥ 52주 고점 × 비율 (고점 대비 −15% 이내) | `VCP_52W_HIGH_PCT=0.85` |
| 수축 사이클 | 구간을 4버킷으로 나눠 직전 대비 90% 이하로 줄어든 횟수 ≥ N | `VCP_MIN_CONTRACTION_CYCLES=3` |
| 상승 추세 | 현재가 > 구간 시작가 × 0.98 | (하드코딩) |
| 이평선 정배열 | 150MA > 200MA AND 현재가 > 150MA AND 200MA 상승 중 | `VCP_MA_MID_PERIOD=150`, `VCP_MA_LONG_PERIOD=200`, `VCP_REQUIRE_MA_ALIGNMENT=True` |

- 52주 고점은 달력 1년이 아니라 **거래일 252봉** 기준 (`VCP_TRADING_DAYS_PER_YEAR=252`)
- **이력이 부족하면 통과시키지 않는다**: 52주/MA 데이터가 없으면 `insufficient_history=True` 로 표기하고 조건을 만족한 것으로 치지 않는다 (`vcp_analyzer.py:238-260`). 데이터가 없다는 이유로 신호가 쉽게 나오는 것을 막는 판단.

### 3-2. VCP 점수 배분 (0~20점) — 수축이 깊을수록 가점
- 수축비율: ≤0.3 → 10점 / ≤0.5 → 7점 / ≤0.7 → 4점 / ≤0.8 → 2점
- 고점 이격: ≤3% → 5점 / ≤5% → 4점 / ≤8% → 2점
- 52주 고점 이격: ≤10% → 2점 / ≤20% → 1점
- 상승추세 2점, 수축사이클 3회↑ 2점(2회 1점), 이평선 정배열+200MA 상승 1점
- 근거: `app/analyzers/vcp_analyzer.py:350-410` `calculate_vcp_score`

### 3-3. VCP 최종 점수 가중치와 시가총액 편향 보정
- 가중치: 기술적(VCP) **0.40** / 수급지수 **0.30** / 외국인 **0.18** / 기관 **0.12** — 합이 1이 아니면 자동 정규화
- 근거: `app/config.py:1408-1411`, `vcp_analyzer.py:137-153` `_normalize_weights`
- **대형주 편향 보정**: 수급 임계값을 시가총액의 제곱근으로 스케일한다. 기준 시총 10조 원, 스케일 하한 0.5 / 상한 2.5로 클램프.
  - 근거: `vcp_analyzer.py:412-425` `_market_cap_scale` (`raw_scale = √(market_cap / 10조)`), `VCP_INSTITUTIONAL_REF_MARKET_CAP=10_000_000_000_000`
  - 도메인 판단: 외국인 순매수 5억 원은 삼성전자에서는 노이즈지만 시총 2천억 종목에서는 사건이다. 절대 주수만 보면 대형주만 걸린다.
- 절대 점수와 상대 점수를 섞는 비율도 명시: `VCP_INSTITUTIONAL_ABS_WEIGHT=0.55`

### 3-4. VCP 포지션 규칙과 Dual AI 검증 조건
- 손절 −7% / 목표 +10% / 최대 보유 5영업일 (`VCP_STOP_LOSS_PCT=7.0`, `VCP_TARGET_PROFIT_PCT=10.0`, `VCP_MAX_HOLD_DAYS=5`)
- 최소 신호 점수 55점, 최소 수급지수 65점 (`VCP_MIN_SCORE=55.0`, `VCP_MIN_SUPPLY_DEMAND_INDEX=65.0`)
- Dual AI 검증은 **아무 종목에나 걸지 않는다**: 규칙 기반 점수 80점 이상 + 상위 3개 + AI 신뢰도 75 이상일 때만 반영하고, 반영 비중도 0.2로 제한 (`VCP_DUAL_AI_MIN_RULE_SCORE=80.0`, `VCP_DUAL_AI_TOP_N=3`, `VCP_DUAL_AI_MIN_CONFIDENCE=75`, `VCP_DUAL_AI_WEIGHT=0.2`)
- Market Gate가 RED면 VCP 신규 신호를 아예 차단 (`VCP_MARKET_GATE_BLOCK_ON_RED=True`) — 미너비니의 "M(Market)" 원칙, 즉 시장이 나쁠 때는 개별 종목이 좋아도 사지 않는다는 규칙의 구현

### 3-5. LLM 시스템 프롬프트에 CANSLIM 체계가 명시돼 있다
`app/llm/prompt_template.py:208-248` `get_unified_system_prompt()` 는 William O'Neil의 CANSLIM을 방법론으로 지정하고 다음을 못박는다:

- **팩터 가중치(합 100%)**: 기술적 25% / 펀더멘털 25% / 뉴스·심리 20% / 매크로 15% / 차트 전문가 15%
- **증거 위계**: ① 하드데이터(실적·공시·거래량·가격) 최고 가중 → ② 소프트데이터(뉴스 감성·애널리스트·SNS) 보조 → ③ 추론(트렌드 외삽) 최저, 반드시 조건부 표현
- **의사결정 품질 원칙**(그대로 인용): "확신 없는 매수보다 높은 확신의 관망(HOLD)이 낫다" / "매수 근거 3개 미만이면 HOLD, 매도 근거 3개 미만이면 HOLD" / "데이터 소스 간 충돌 시 하드데이터 기준으로 판단, 충돌 사유 명시" / "데이터 품질이 낮으면 신뢰도를 하향 조정 (품질 50 이하 → 최대 신뢰도 60)"
- **CANSLIM 체크리스트 7항목**: C(최근 분기 EPS 성장률 25%+) / A(연간 EPS 5년 추세) / N(신제품·신경영·신고가) / S(수급·거래량 급증) / L(업종 내 상대강도 상위 20%) / I(기관·외국인 순매수 추세) / M(시장 방향 — 상승장에서만 공격적 매수)

### 3-6. Market Gate — 시장 전체를 100점으로 점수화한 뒤 신호를 통제
`app/analyzers/kr_market_gate.py::calculate_enhanced_score` 의 배점:

| 항목 | 배점 | 세부 규칙 |
|---|---|---|
| 추세 정렬 | 25 | 현재가>MA20>MA60 → 25 / 현재가>MA20 → 15 / 현재가>MA60 → 10 |
| RSI(14) | 25 | 50~70 → 25(최적) / 30~40 → 20(과매도 반등) / 40~50 → 15 / <30 → 10 / **>70 → 0점(과매수)** |
| MACD | 20 | BULLISH → 20 |
| 거래량 | 15 | 20일 평균 대비 >1.2배 → 15 / >0.8배 → 10 |
| 상대강도 | 15 | KOSPI 대비 >+2% → 15 / >0% → 10 / >−2% → 5 |

- 게이트 판정: **70점 이상 GREEN(공격적 매수 가능) / 40~69 YELLOW(신중) / 40 미만 RED(방어)** (`kr_market_gate.py:176-179, 461-466`)
- 데이터가 60봉 미만이면 점수 계산을 포기하고 중립 50/NEUTRAL을 반환 (`kr_market_gate.py:387-388`)
- **RSI 70 초과에 0점을 주는 것**과 **RSI 30~40에 15점이 아니라 20점을 주는 것**이 도메인 판단이다. 단순 "높을수록 좋다"가 아니라 과매수는 감점, 과매도는 반등 기대로 가점하는 비선형 배점.
- VIX 오버레이(`MARKET_GATE_VIX_ENABLED`): VIX > 40 → −20점, > 30 → −10점, < 15 → +5점 (`kr_market_gate.py:234-266`)

### 3-7. 종가베팅 — 12점 만점 스코어링과 등급별 포지션 크기
`app/analyzers/closing_bet/scorer.py` 의 배점 (총 12점):
- 뉴스/재료 0~3점 (LLM 감성 분석, **부정 키워드가 하나라도 있으면 0점**)
- 거래대금 0~3점 (1조 → 3점 / 5천억 → 2점 / 1천억 → 1점)
- 차트패턴 0~2점 (52주 고가 대비 95% 이상 1점 + 현재가>20일선>60일선 1점)
- 캔들형태 0~1점 (장대양봉)
- 기간조정 0~1점 (20일 변동성 < 10%)
- 수급 0~2점 (외국인+기관 동시 매수)

등급과 포지션 크기 (`app/config.py:1448-1473`, `app/analyzers/closing_bet/config.py`):
- **S등급**: 10점 이상 + 거래대금 1조 이상 → R 배수 **1.5**
- **A등급**: 8점 이상 + 5천억 이상 → R 배수 **1.0**
- **B등급**: 6점 이상 + 1천억 이상 → R 배수 **0.5**
- C등급: 제외 대상
- 공통: 손절 −3% / 목표 +5% / 1R = 자본의 0.5% / **최대 동시 포지션 2개**

후보 필터 (`CLOSING_BET_*`): 최소 거래대금 100억 / 등락률 5.0~29.9% / 주가 1,000~500,000원 / 시총 500억 이상 / 거래량 급증 2배 이상
- **제외 종목명 키워드**: 스팩·SPAC, ETF·ETN, 리츠·REIT, 우선주(우B·우C·1우·2우·3우), 인버스, 레버리지, 선물, 채권
- **ETF 접두어 별도 차단**: KODEX, TIGER, KOSEF, KINDEX, KBSTAR, ARIRANG, HANARO, ACE, SOL, TIMEFOLIO (`closing_bet/config.py:14-24`)
- 도메인 판단: 점수와 별개로 **등급마다 베팅 크기를 다르게 하고 최대 2포지션으로 묶은 것**이 리스크 관리다. 점수가 높다고 몰빵하지 않는다.

### 3-8. 익절·손절 규칙을 실측으로 반증했다 (측정 전용 트랙)
`app/services/paper_simulation/exit_rule_shadow.py` 가 매일 별도 트랙으로 "익절 X% / 손절 Y%" 조합의 결과를 기록한다. 2026-07-27 실측(종결 398건):

- 현행 −6.99% → (+5/−5) gross −2.42% → (+10/−5) −1.69% → (+10/−8) −3.47%
- **승률은 26.6~26.9%로 불변** → "손절은 잃는 폭을 줄이지만 맞히는 능력은 못 바꾼다"
- 핵심 실측: 승자는 반납하지 않는다(평균 MFE +13.48% vs 최종 +13.43%, 반납 0.05%p). 패자는 애초에 오르지도 않는다(패자 평균 MFE +0.07%).
- 결론: **익절 상한은 순손해**. 상한없음+손절−5% → +0.04%, 상한없음+손절−3% → **+1.41%** (처음으로 플러스)
- −5% 도달 261건 중 회복해 플러스 마감한 것은 **1건(0.4%)** → 이 표본에서 "버티기"는 거의 항상 틀렸다. 이 실측이 조기 경고선 −5%(`MY_STOCKS_INVALIDATION_EARLY_DRAWDOWN_PCT`)의 근거다.
- **정직성 장치 3개**를 같이 넣었다: ① MFE/MAE에 순서 정보가 없어 익절·손절 둘 다 밟은 건은 `ambiguous_order` 로 보수적(손절) 처리 ② `stop_loss_recovered_count` = 손절이 잘라버린 승자 수를 별도 노출(숨기면 손절이 공짜로 보인다) ③ `net_avg_pnl_pct` 로 수수료·슬리피지 반영
- 스스로 한계도 적어둔다: 표본의 96%가 백테스트라 "라이브 적용 근거로는 아직 약하다"

### 3-9. KRX 데이터 수집 — 시장 인프라의 실제 제약에 맞춘 설계
2026-08 KRX IP 차단 사고 대응 (`app/scheduler/vcp_jobs.py::collect_institutional_data`, `app/utils/krx_login_guard.py`):
- 종목당 1회씩 500종목을 조회하던 것을 `get_market_net_purchases_of_equities_by_ticker(market='ALL')` 배치로 바꿔 **거래일당 9회**로 줄였다. 실측 500회 → 9회, 커버리지 487/500.
- **하한이 9회인 이유가 도메인 지식이다**: 이 API는 투자자 분류를 1개씩만 받는다. `기관합계`(7050) 하나로 줄일 수 있지만 그러면 기존과 같은 9개 분류(외국인·기타외국인 + 기관 7종)가 아니게 되어 `inst_net` 과 비율 분모의 **동일성 증명이 필요해진다**. 그래서 일부러 9회를 유지한다.
- **합집합으로 병합해야 하는 이유**: "배치에 없다 = 그 투자자 순매수 0"이지 데이터 없음이 아니다. 은행은 전 시장에서 **112종목**만 거래한다. 9개 배치의 **교집합**을 요구하면 500종목이 **58종목**으로 줄어든다(실측). 반드시 합집합 + `.get(ticker, 0)`.
- 요청 예산 강제: `KRX_DAILY_REQUEST_BUDGET`(기본 10) + 요청 간 2초 대기

### 3-10. 재무 데이터의 한국적 함정을 코드가 알고 있다
`app/services/holding_invalidation.py` 의 분기 적자 판정:
- DART는 분기/누적이 혼재하므로 `financials.quarter IS NOT NULL` 2행의 **부호만** 비교한다(금액 크기 비교 금지)
- **분기 인접성 가드**: 최근 2행이 `_MAX_QUARTER_GAP`(2분기)를 넘게 떨어져 있으면 적자 전환 판정을 보류한다 — 종목당 분기 행이 평균 4.3개뿐이라 결손이 흔하고, 그대로 두면 7년 전 분기를 '직전 분기'라 부르게 된다
- 알려진 한계까지 명시: `quarter=4` 행은 DART `11011`(사업보고서) = **연간 누적**이라 "Q4 분기 적자 전환"이 실제로는 연간 의미

### 3-11. 그 밖에 코드에 박힌 시장 상식
- **`institutional_trends` 의 단위는 금액이 아니라 주(株) 수** — 시장 합산 시 `stock_prices.close` 를 JOIN해 수량×종가로 환산해야 한다 (CLAUDE.md 「Important Patterns」)
- **일별 수집 테이블의 가장 최근 날짜는 부분 상태일 수 있다** — `HAVING COUNT(*) >= 400` 임계값으로 회피
- **매수가는 전 포트폴리오 수량 가중평균**으로 계산 — 한쪽 계좌 평단만 보면 이탈 판정이 틀린다 (`holding_invalidation`)
- **보유의 60% 이상이 동시에 가격 미상이면 종목별 알림이 아니라 수집 장애로 처리**(`_PRICE_OUTAGE_RATIO`) — '전부 일치'로 판정하면 15종목 중 12종목 부분 장애가 알림 12건이 된다
- **전날 미국 시장 국면을 다음날 한국 추천에 반영** — 검증 근거: 미국 약세 후 1주 추천성과 −1.49% vs 강세 후 −0.52%. `^GSPC + ^IXIC` 결합으로 한쪽만 stale일 때 가려지는 것을 차단 (`overnight_us_signal`, PR #379/#380)
- **`change_rate` 단위를 값 크기로 추측하지 않는다**: 과거 `abs(number) <= 1` 이면 비율로 간주해 100배 저장하던 버그로 6,757건이 오염됐다(pykrx `등락률`은 이미 퍼센트라 **1% 미만으로 움직인 종목만** 깨져 한 달간 눈에 안 띄었다). 현재는 호출부가 단위를 명시하고 모르는 단위는 `ValueError` (`vcp_price_backfill_service._coerce_change_rate(v, unit=...)`)

---

## 4. 검증 가능한 숫자

모두 저장소 HEAD에서 직접 측정하거나 코드/설정에서 확인한 값이다.

### 코드 규모
| 항목 | 값 | 확인 방법 |
|---|---|---|
| 추적 파일 수 | **3,110개** | `git ls-files \| wc -l` |
| Python 파일 | **2,057개** | `git ls-files '*.py'` |
| Python 총 라인 | **568,620줄** | `git ls-files '*.py' \| xargs wc -l` |
| └ 애플리케이션 코드(`app/`) | **350,815줄 / 786파일** | 동일 |
| └ 테스트 코드(`tests/`) | **189,167줄 / 1,106파일** | 동일 |
| TypeScript/TSX (모바일 SPA) | **10,176줄 / 157파일** | `git ls-files '*.ts' '*.tsx'` |
| SQL | **13,310줄 / 235파일** | `git ls-files '*.sql'` |
| 마크다운 설계·기록 문서 | **462개** | `git ls-files '*.md'` |
| 커밋 수 | **1,729개** | GitHub API `commits?per_page=1` Link 헤더 |
| 병합된 PR 포함 PR 수 | **597개** | GitHub API `pulls?state=all` Link 헤더 |
| 개발 기간 | **2025-11-23 ~ 2026-08-16 (약 9개월)** | 저장소 `created_at` / `pushed_at` |

### 구성 요소 개수
| 항목 | 값 | 근거 |
|---|---|---|
| 테스트 함수 | **8,448개** | `grep -rhoE "def test_" tests/ \| wc -l` |
| 테스트 파일 | **1,106개** | `git ls-files 'tests/*.py'` |
| DB 마이그레이션 | **227개** (최신 220_stock_news_links) | `scripts/migrations/*.sql` |
| API 라우터 파일 | **66개** | `app/api/v1/routers/*.py` |
| DB 모델 파일 | **81개** (~50 테이블) | `app/models/*.py` |
| 서비스 모듈 | **141개** | `app/services/*.py` |
| 데이터 수집기 | **38개** | `app/collectors/*.py` |
| 환경변수 설정 항목 | **944개** | `app/config.py` (4,103줄) 내 `KEY:` 패턴 |
| 스케줄러 총 라인 | **39,117줄** (`scheduler.py` 단일 파일 21,622줄) | `wc -l app/scheduler/*.py` |
| 등록된 스케줄 작업 | **고유 job id 190개** / `add_job` 호출 194회 | `app/scheduler/scheduler.py` |

### 도메인 임계값 (기본값)
| 항목 | 값 |
|---|---|
| LLM 가감점 허용 범위 | **±5점** (0~100 점수 기준), `mode: challenger_only` |
| LLM 일일 호출 상한 | 5~50회 (`llm_cap`), 기본 `max_llm_calls=25` |
| 추천 점수 차원 | **7개** (market_context / quality / momentum / smart_money / catalyst / sentiment / activity) |
| Forward Judgment 결정값 | **9종** / 데이터 품질값 **6종** / 가격 상태 **6단계** |
| 활성 LLM 프로바이더 | **2개** (Gemini 주 + GPT-5.4 mini 백업, `LLM_PRIMARY_PROVIDER`/`LLM_BACKUP_PROVIDER`) |
| LLM 합의 임계값 | 100% = STRONG / 67% 이상 = MODERATE(×0.8) / 미만 = NO_CONSENSUS |
| 거래일 확정 최소 행 수 | 1,200행 (운영 평균 ~1,500의 80%) |
| 하드 위험 게이트 | 거래대금 1억 미만 / 장중 변동성 18% 초과 탈락 |
| VCP | 수축 0.6 / 고점근접 0.95 / 52주 0.85 / 사이클 3회 / 150·200MA 정배열 / 최소점수 55 |
| Market Gate | GREEN ≥70 / YELLOW 40~69 / RED <40 (100점 만점) |
| 종가베팅 | 12점 만점, S≥10점 & 1조 / A≥8점 & 5천억 / B≥6점 & 1천억, 손절 −3% 목표 +5%, 최대 2포지션 |
| 자동매매 모의 게이트 | 표본 ≥12, 승률 ≥45%, PF ≥1.05, 보류 <40% |
| 자동매매 실거래 게이트 | 표본 ≥20, 승률 ≥50%, 평균손익 ≥0.5%, PF ≥1.15, 평균 MAE >−8% |
| 모의 투자 단위 | BUY 1건당 **1억 원** (`DEFAULT_VIRTUAL_CASH_KRW`) |

### 측정된 운영 실측치 (코드 주석·CLAUDE.md 기록)
- 익절/손절 shadow 종결 표본 **398건** → 상한없음+손절−3%가 유일하게 플러스(+1.41%)
- −5% 도달 261건 중 회복해 플러스 마감 **1건(0.4%)**
- 승자 평균 MFE +13.48% vs 최종 +13.43% (반납 0.05%p) / 패자 평균 MFE +0.07%
- KRX 수급 수집 요청 수: 거래일당 **500회 → 9회**, 커버리지 487/500
- 9개 투자자 분류 교집합 요구 시 대상 종목 **500 → 58종목**으로 축소 (합집합 필요성의 실측 근거)
- `stock_prices` 비거래일(유령) 행 **52,220건 (전체 5.5%)** 격리 표시
- `change_rate` 100배 오염 행 **6,757건** 백필 대상

> ⚠️ 미검증: 서비스의 실제 사용자 수, 트래픽, 매출은 이 저장소에서 확인할 수 없다. **근거 없음.**
> ⚠️ 미검증: "추천 성과가 시장을 이겼다"는 주장은 코드가 오히려 반대로 기록하고 있다(§7 참조).

---

## 5. 일반 접근과의 대조

### "ChatGPT에게 물어보면" — 대략 3단계
1. 종목명을 입력한다
2. 모델이 학습 데이터와(있다면) 웹검색 결과로 답한다
3. 답을 읽는다

이 경로에는 **기준일 확정이 없고, 거절 조건이 없고, 사후 측정이 없다.** 어제 데이터로 답했는지 3개월 전 데이터로 답했는지 사용자가 알 방법이 없고, 그 답이 맞았는지 나중에 채점되지도 않는다.

### "일반 주식 앱"에서는 — 대략 3단계
1. 조건 검색식을 만든다 (예: RSI < 30, 거래량 2배)
2. 결과 목록을 본다
3. 판단은 사용자가 한다

조건에 맞는 목록은 나오지만, **그 조건이 실제로 돈을 벌었는지는 앱이 알려주지 않는다.**

### Tickpoint에서는 — 10단계 + 5겹의 거절 장치

| 구간 | 단계 |
|---|---|
| 수집 | ① 9개 이상 외부 소스를 별도 수집기로 적재 |
| 방어 | ② 부분 수집일 자동 회피(1,200행 미달 시 직전 거래일로 후퇴) |
| 압축 | ③ 3트랙 후보군 구성 → ④ 하드 위험 게이트(4가지 사유별 탈락) |
| 채점 | ⑤ 국면 판정 + 국면별 가중치 → ⑥ 7차원 점수 |
| 반론 | ⑦ LLM은 **±5점 가감만** 가능 (challenger_only) |
| 판단 | ⑧ 조건부 판단 객체 생성 (진입 조건 + 무효화 조건 필수) |
| 검증 | ⑨ 장중 3회(09:05/09:30/10:00) 실시간 시세로 검증해야 BUY 승격 |
| 측정 | ⑩ 모의 체결 → outcome → KPI·알파(+통계적 유의성) → 운영자 알림 |

**핵심 차이는 단계 수가 아니라, 이 시스템이 "모른다"고 말할 수 있게 설계됐다는 점이다:**

| 상황 | 일반 접근 | Tickpoint |
|---|---|---|
| 데이터가 어제 것뿐 | 그래도 답한다 | **BUY 객체 생성 자체가 `ValueError`** (`_enforce_forward_judgment_honesty`) |
| 모델 응답이 깨짐 | 재시도하거나 빈 화면 | `success=False` + **기본값 HOLD** |
| 모델끼리 의견이 갈림 | 하나를 골라 보여줌 | 합의율 67% 미만이면 **`NO_CONSENSUS`, 신뢰도 0** |
| 성과 표본이 0건 | 수익률 0%로 표시 | **알파 = `None` (모름)** |
| 표본이 6건뿐 | "+3% 수익!" | t검정 후 `significant_95: false` 병기 |
| 가격 데이터가 오래됨 | 그 값으로 손익률 계산 | 낙폭 단정 금지, `price_unreliable` 로 대체 |
| 종목 정보가 DB에 없음 | "위험 없음" | **"모름"** (`risk_flags_known=False`) |
| 정상적으로 0건 검출 | 장애로 오인 → 알림 폭주 | 정상 0건과 실장애(`insufficient_price_bars`)를 분리 판정 |

**측정 정직성이 코드에 명시적으로 적혀 있다는 점도 다르다.** 예: 성과 지표를 달력일에서 거래세션 기준으로 바꾸고(`_close_after_trading_sessions` OFFSET 0/4/19), 최대 성과 시점을 고르던 편향을 제거한 `measurement_honesty.fixed_1m` 을 기존 지표와 **나란히** 표기한다(`build_kpi_snapshot`). 자기에게 유리한 숫자를 지우지 않고 둘 다 보여준다.

---

## 6. 규모 지표

- **총 파일**: 3,110개 (추적 기준)
- **주요 언어**: Python(백엔드·분석·스케줄러, 21.9MB) / HTML(Jinja2 SSR 템플릿 84개, 2.9MB) / TypeScript(React 19 모바일 SPA, 383KB) / PL-pgSQL(마이그레이션, 74KB) / Shell / CSS
- **코드 라인**: Python 568,620줄 (애플리케이션 350,815 + 테스트 189,167), TypeScript/TSX 10,176줄, SQL 13,310줄
- **커밋**: 1,729개 / **PR**: 597개
- **기간**: 2025-11-23 ~ 2026-08-16 (약 9개월, 1인 개발)
- **문서**: 마크다운 462개 (`docs/superpowers/specs/`, `docs/superpowers/plans/`, `docs/plans/` 에 설계·검증·실측 기록)
- **아키텍처**: FastAPI + Jinja2 SSR(데스크톱) + React 19 SPA(모바일) + Supabase PostgreSQL + Redis + APScheduler
- **운영**: EC2 + Gunicorn/Uvicorn + Nginx (systemd), GitHub Actions CI(`.github/workflows/ci.yml`, pytest 회귀 + 계약 드리프트 검사)
- **개발 방식(코드에 남은 흔적)**: 설계 문서 → 독립 코드리뷰 → TDD → 배포 → 관찰의 루프가 CLAUDE.md에 Rule 1~15로 성문화돼 있다. 특히 **Rule 15**: "배포 후 관찰이 필요한 시스템은 운영자 텔레그램 알림까지 포함해 구현한다. 알림 미포함은 미완성으로 간주." 코드 주석에 `Codex review MEDIUM #3a` / `Codex 2026-05-13 §4.1` / `G1 적발` 같은 교차 검증 흔적이 남아 있다.

---

## 7. 주의 — 포트폴리오에 쓰면 안 되는 것

### 7-1. 개인정보 / 인프라 식별자 (본문 인용 금지)
- `CLAUDE.md` 와 `app/config.py` 에 운영자 개인 이메일(`MASTER_SEED_EMAILS` / `ADMIN_EMAIL` 기본값)이 평문으로 들어 있다. **포트폴리오에 노출 금지.**
- `CLAUDE.md` 에 EC2 퍼블릭 IP, EC2 인스턴스 ID, AWS 리전, SSH 접속 절차가 그대로 적혀 있다. **공개 문서에 옮기지 말 것.**
- 텔레그램 개인 채널 ID(`TELEGRAM_PERSONAL_CHAT_ID`) 등 알림 라우팅 설정도 마찬가지.

### 7-2. 비밀키
- 스캔 결과 **커밋된 실제 API 키·토큰은 발견되지 않았다.** `.gitignore` 가 `.env` / `.env.*` / `deploy/ec2.env` 를 차단하고 `env.example` 에는 placeholder만 있다(`SECRET_KEY=changeme-...`). 이 점은 오히려 강점으로 써도 된다.
- 다만 필요한 키 목록(OpenAI / Google / DART / ECOS / Tavily / Perplexity / Apify / Supabase / Telegram / KIS / KRX)은 README에 공개돼 있으므로, "외부 API 11종 연동" 정도로만 쓰고 키 이름을 나열할 필요는 없다.

### 7-3. 투자 자문 오해 소지 — **가장 중요**
- 이 서비스는 **자본시장법상 투자자문업·중개업·유사투자자문업 미인가**이며 README가 이를 명시한다. 포트폴리오에서 **"수익률", "수익 보장", "매수 추천", "유망 종목" 같은 표현을 절대 쓰면 안 된다.**
- 시스템 자체가 "추천 / 권장 / 유망 / 기회 / 주목"을 금지어로 필터링하고 있다(§2-13). 포트폴리오 카피가 그 원칙을 어기면 자기모순이 된다.
- 안전한 표현: "팩트 기반 정보 제공", "신호 품질 측정", "판단 근거 구조화". 위험한 표현: "돈 버는 AI", "적중률 N%".

### 7-4. 성과를 자랑거리로 쓰면 안 된다 (코드가 반대로 기록하고 있다)
- `docs/2026-06-14-profitability-verification.md` 와 CLAUDE.md에 **전 섹션(종합추천/VCP/급등/이슈/forward/심층/개인종목)에서 매수 신호가 손실, HOLD가 수익이라는 신호 역전**이 기록돼 있다. 진단: 시장이 +14.2%일 때 추천은 −4.25%, 알파 −18.5%.
- 익절/손절 shadow 실측도 현행 −6.99%다.
- **따라서 "성과가 좋다"고 쓰면 저장소 내용과 정면 충돌한다.** 대신 쓸 수 있는 진짜 강점은 **"성과가 나쁘다는 것을 스스로 측정해서 드러내는 시스템을 만들었다"** 는 사실이다. 이게 훨씬 강한 메시지이기도 하다.
- 관련 수치를 인용할 때는 반드시 "백테스트 표본 지배적", "단일 국면 한계", "개선 후 수익성은 미검증"이라는 코드에 적힌 단서를 함께 옮길 것.

### 7-5. 미완성 / 관찰 중인 기능 (완성품으로 소개 금지)
- **자동매매**: Paper Trading(모의) 모드만 가동 중이며 `kill_switch` 및 `dry_run_only=True` 강제. **실주문은 범위 밖.** "자동매매 시스템을 만들었다"가 아니라 "실주문 전 검증 파이프라인을 만들었다"로 표현해야 정확하다.
- **회피신호 / 시장현실 갭 / 익절손절 규칙 / 토스 OpenAPI 연동**: 전부 `shadow`(관찰 전용)이며 추천 점수에 연결돼 있지 않다. 관련 플래그(`RECO_MARKET_REALITY_*` 등)가 default OFF.
- **뉴스 다대다 링크(Epic C/D)**: 진행 중. 읽기는 여전히 레거시 FK이며 기사↔종목 단일 FK의 약 51%가 오염된 상태로 측정됐다.
- **커뮤니티 SEO 자동 블로그**: 하드 일시정지 + nav 숨김 상태(`COMMUNITY_AUTO_POST_PAUSED=true`).
- **AI 채팅**: TIER_2+ 위젯 전용이며 README 기준 `ENABLE_AI_CHAT=false` 가 권장 기본값.
- **모바일**: `mobile-v2`(주) + `mobile`(롤백용) 이중 유지 중이며, 모바일 UA에 "공사중" 인터셉트가 걸려 있다.

### 7-6. 고객사 실명
- **없음.** 이 저장소는 개인 프로젝트(한국 주식 정보 시스템)이며 외부 고객사 명칭은 발견되지 않았다.

### 7-7. 사고 기록의 표현 주의
- CLAUDE.md에는 KRX IP 차단(8일간), 워커 타임아웃 7시간 스케줄러 정지, 뉴스 INSERT 17시간 무저장, `change_rate` 100배 오염 등 **장애 기록이 상세히 남아 있다.** 이것은 포트폴리오에서 **"이렇게 진단하고 고쳤다"는 문제해결 서사로는 쓸 수 있지만**, 운영 안정성을 자랑하는 맥락에서는 쓰면 안 된다.
- 특히 KRX 차단 대응을 "우회 기법"처럼 서술하면 안 된다. 실제 코드가 한 일은 **요청 수를 500회에서 9회로 줄여 상대 서버 부하를 없앤 것**이므로, 그대로 "API 사용량 최적화"로 서술하는 것이 사실이자 안전하다.
