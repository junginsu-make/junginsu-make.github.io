# SaaS 차별화 개편 설계

작성일: 2026-08-16
상태: 승인됨 (사용자 승인 2026-08-16)

## 1. 문제

포트폴리오의 10개 SaaS 상세 페이지는 **무엇을 만들었는지(기능·수량)**는 잘 보여주지만
**왜 아무나 못 만드는지(판단 기준)**는 보여주지 못한다.

사용자(정인수)의 문제 제기:

> 혼자 1인 개발한 시스템들이 유튜브에서 남들도 쉽게 만드는 것들과 보이는 부분과 결과만
> 두고 따지면 큰 차이가 없어 보인다. 하지만 나는 워크플로우가 다르고 17년 마케터 경력과
> 노하우가 담겨 사용자가 원하는 결과물, 퀄리티 높은 결과물을 제공한다. 예를 들어 같은
> 블로그 자동화라도 상위 블로그 데이터를 수집·분석해 알고리즘을 파악하고, 단순 글쓰기가
> 아니라 가독성 높게 자연스러운 글쓰기에 내용과 일치하는 이미지를 중간중간 삽입하는
> 과정 등 — 단순히 블로그 글을 쓴다는 접근과 완전히 다르다.

### 왜 현재 표현이 통하지 않는가

1. **기능 나열은 복제 가능한 주장이다.** "AI가 블로그 글을 쓴다"는 문장은 유튜브 튜토리얼을
   따라 한 사람도 똑같이 쓸 수 있다. 인사담당자는 시스템을 직접 돌려보지 않고 문장만
   읽으므로, 문장 차원에서 구분되지 않으면 판단이 끝난다.

2. **수량 지표는 방향이 반대다.** "48+ 에이전트", "50+ 도구", "15+ AI 모델"은 투입(input)
   자랑이다. 실제 차별점은 결과물 품질을 보장하는 장치(output 검증)에 있는데, 투입을
   자랑할수록 "많이 갖다 붙였구나"로 읽힌다.

3. **이미 잘하고 있는 곳이 있다.** Factto의 "경쟁 글의 통계 수치만 참고하고 내용은 인용하지
   않는다", Place Insight의 "데이터가 없으면 그럴듯한 숫자로 메우지 않는다 — 벤치마크 불가를
   명시한다". 이 문장들이 사이트에서 가장 강력하다. **시스템이 무엇을 거부하는지**를 말하기
   때문이다. 거부 기준은 판단력이 있어야만 쓸 수 있어 흉내낸 사람은 못 쓴다. 이 패턴이
   우연히 두 곳에만 있는데, 사이트 전체의 중심 문법으로 끌어올려야 한다.

## 2. 해결 원칙

**"퀄리티가 높다"고 말하지 않고, 퀄리티를 만드는 메커니즘을 보여준다.**

"가독성 높은 글"은 형용사라 믿을 이유가 없다. "상위 노출 블로그 20개의 글자수·이미지수·제목
구조 분포를 수집해 그 통계 범위 안에서 쓴다"는 메커니즘이라 반박이 안 된다. 인사담당자는
형용사는 걸러 읽고 메커니즘은 믿는다.

### 4개 장치

| 장치 | 내용 | 왜 효과가 있는가 |
|---|---|---|
| ① 일반 접근 대조 | "ChatGPT로 하면 3단계" vs "이 시스템은 8단계" | 비교 대상이 있으면 3초 만에 판단, 없으면 판단 자체를 안 함 |
| ② 단계별 '왜' | 각 파이프라인 단계에 존재 이유를 첨부 | 단계는 베껴도 단계가 존재하는 이유는 실무자만 씀 — 17년 경력이 들어가는 자리 |
| ③ 거부 기준 | "이 시스템이 하지 않는 것" | 거부 목록 = 품질 기준 목록. 튜토리얼 흉내와의 가장 선명한 경계선 |
| ④ 서사 | 시스템별 해부 문단 | 깊이의 증거. 다른 SaaS를 볼 때도 "이것도 뒤에 뭔가 있겠구나"로 읽게 만듦 |

### 한 줄 포지셔닝

> AI로 뭔가를 만드는 사람은 많습니다. 결과물의 합격 기준을 아는 사람이 만든 시스템은 다릅니다.

17년 마케터 경력의 가치는 코딩이 아니라 이 '합격 기준'이고, 사이트가 팔아야 하는 것은
시스템이 아니라 그 기준이다.

## 3. 범위

- **대상**: 10개 SaaS 상세 페이지 전부 (`app/builder/[slug]`)
- **콘텐츠 소스**: 각 SaaS의 실제 GitHub 저장소 코드 분석 (추정·창작 금지)
- **기존 섹션 불변**: Hero · Problem/Outcome · Capabilities · Metrics · Gallery는 건드리지 않고
  새 섹션을 삽입만 한다 (수술적 변경 원칙)
- **홈 제외**: 홈은 여러 라운드의 디자인 확정을 거쳤으므로 이번 범위에서 제외. 상세 페이지
  개편이 자리잡은 뒤 별도 판단.

### SaaS ↔ 저장소 매핑 (사용자 확인 완료)

| # | SaaS | slug | 저장소 |
|---|---|---|---|
| 1 | AI 상세페이지 스튜디오 | `detail-page-studio` | `detail-page-studio` |
| 2 | Tickpoint | `tickpoint` | `stock-training` |
| 3 | Lumio | `lumio` | `lumio-video` |
| 4 | OS Agent (Synapse) | `os-agent` | `HR-system` (+`synapse-frontend`) |
| 5 | MKT Automation | `mkt-automation` | `MARKETING_SEO_AUTOMATION` |
| 6 | PropIntel AI | `propintel` | `propintel-ai` |
| 7 | 아키텍처 시스템 | `architect` | `Architect-Build` (+`architect-portfolio`) |
| 8 | Factto | `factto` | `image-insight` |
| 9 | Naver Shopping Insight | `shopping-insight` | `naver-shopping-insight` |
| 10 | Place Insight | `place-insight` | `place-insight` |

## 4. 데이터 모델

`lib/data/saas.ts`의 `SaaSDetail`에 선택 필드 `differentiation`을 추가한다.

```ts
export type PipelineStage = {
  name: string;    // 단계 이름 (예: "상위 노출 글 통계 수집")
  detail: string;  // 이 시스템이 실제로 하는 일 (코드 근거 기반)
  why: string;     // 이 단계가 존재하는 이유 — 마케터 판단
};

export type Refusal = {
  rule: string;    // 하지 않는 것 (예: "순위로 매출을 역산하지 않는다")
  reason: string;  // 왜 하지 않는가
};

export type Differentiation = {
  genericLabel: string;       // 대조 대상 (예: "ChatGPT에 글을 시키면")
  genericSteps: string[];     // 일반 접근의 단계 — 3개 내외
  pipeline: PipelineStage[];  // 실제 파이프라인 — 5~10단계
  refusals: Refusal[];        // 거부 기준 — 2개 이상
  narrative?: string[];       // 서사 확장 문단 (시스템별)
};
```

### 파일 분리

`saas.ts`는 이미 695줄이다. `differentiation` 데이터 10개를 여기 넣으면 800줄 제한을
넘는다. 따라서:

- **`lib/data/saas-differentiation.ts`** (신규) — `Record<string, Differentiation>` (slug 키)
- `saas.ts`는 이 맵을 import해 `SAAS_LIST` 조립 시 병합

선택 필드이므로 데이터가 준비된 SaaS부터 점진 반영이 가능하고, 데이터가 없으면 섹션
컴포넌트가 `null`을 반환한다 (`problem-outcome.tsx`와 동일 패턴).

## 5. 컴포넌트 설계

`components/builder/saas-detail/`에 3개 컴포넌트를 추가한다. 각 파일은 하나의 섹션만
책임지고, `SaaSDetail`을 prop으로 받는 기존 컨벤션을 따른다.

### 5.1 `comparison.tsx` — 일반 접근 대조

- 좌: 일반 접근 (회색·저채도, 3단계 내외) / 우: 이 시스템 (액센트, 5~10단계)
- 단계 수의 시각적 격차 자체가 메시지 — 숫자를 크게 노출 (`3 STEPS` vs `9 STEPS`)
- 모바일에서는 상하 배치
- 섹션 라벨: `SAME GOAL · DIFFERENT PROCESS`

### 5.2 `pipeline-why.tsx` — 단계별 '왜'

- 실제 파이프라인 세로 스텝 리스트 (번호 + 단계명 + detail)
- 각 단계마다 `why` 콜아웃 — 액센트 좌측 보더로 구분, "왜 이 단계가 있나" 라벨
- `narrative`가 있으면 섹션 하단에 문단으로 렌더
- 섹션 라벨: `HOW IT ACTUALLY WORKS`

### 5.3 `refusals.tsx` — 거부 기준

- "이 시스템이 하지 않는 것" — 규칙 + 이유 목록
- Factto·Place Insight의 기존 강점 문법을 전 시스템으로 확장
- 섹션 라벨: `WHAT THIS SYSTEM REFUSES TO DO`

### 5.4 배치

`app/builder/[slug]/page.tsx`에서 **Problem/Outcome과 Capabilities 사이**에 삽입:

```
Hero
ProblemOutcome      왜 만들었나
Comparison          ← 신규: 남들과 뭐가 다른가
PipelineWhy         ← 신규: 실제로 어떻게 동작하나 (+ 서사)
Refusals            ← 신규: 무엇을 거부하나
Capabilities        무엇을 하나
Metrics
Gallery
Nav
```

"왜 만들었나 → 왜 아무나 못 만드나 → 무엇을 하나" 순서로 서사가 이어진다.

### 5.5 모션

기존 프리미티브(`ScrollReveal`, `MaskReveal`, framer-motion)만 재사용한다. 새 애니메이션
라이브러리는 추가하지 않는다.

## 6. 빌더 인덱스 반영 (경량)

- `components/builder/builder-hero.tsx`에 포지셔닝 문장 1줄 추가 (§2의 한 줄 포지셔닝)
- SaaS 카드(`saas-card-5bullet.tsx`)는 **변경하지 않는다** — 이미 정보 밀도가 높다

## 7. 챗봇 KB 동기화

`lib/data/knowledge-base.ts`에 SaaS별 차별점 요약(거부 기준 중심)을 추가하고
`KNOWLEDGE_BASE_VERSION`을 올린다. 챗봇이 "이거 ChatGPT랑 뭐가 달라요?"에 근거 있는 답을
할 수 있게 된다.

## 8. 콘텐츠 파이프라인

1. **저장소 분석** — 10개 저장소를 서브에이전트로 병렬 분석.
   산출물: `docs/superpowers/research/<slug>-facts.md`
   각 팩트 시트 구성: 실제 파이프라인 단계 / 품질 보증·검증 장치 / 도메인 판단이 박힌 지점 /
   검증 가능한 숫자 / 일반 접근과의 대조 / 규모 지표 / 주의(실명·비밀키 등)
   **규칙: 코드에서 확인한 것만. 추측·창작 금지. 모든 주장에 파일 경로 첨부.**

2. **팩트 시트 검수 게이트** — 사용자 확인. 코드에서 뽑은 사실이라도 "무엇을 내세울지"는
   사용자 판단이 우선.

3. **콘텐츠 작성** — 팩트 시트 → `differentiation` 데이터. 한국어, 기존 톤 유지,
   클라이언트 실명 익명화 원칙 준수.

4. **구현·검증** — 타입/컴포넌트/데이터/KB/테스트 → `pnpm build` + `pnpm test` 통과 확인 후
   커밋. main 푸시 = 자동 배포이므로 로컬 검증 필수.

## 9. 테스트

- `tests/data/saas.test.ts` 확장:
  - 10개 전부 `differentiation` 존재
  - `pipeline.length >= 4`, 각 단계의 `name`·`detail`·`why` 비어있지 않음
  - `refusals.length >= 2`
  - `genericSteps.length >= 2`
- `tests/data/marketing.test.ts`의 실명 가드가 `saas-differentiation.ts`도 검사하도록 확장
- `tests/knowledge-base.test.ts`: 버전 범프 + 차별점 내용 포함 확인

## 10. 위험과 대응

| 위험 | 대응 |
|---|---|
| 코드에 없는 내용을 그럴듯하게 쓰게 됨 | 팩트 시트에 파일 경로 필수화. 근거 없으면 "근거 없음" 명시. 사용자 검수 게이트 |
| 고객사 실명 노출 | 팩트 시트 §7에 격리, 본문 사용 금지. 기존 실명 가드 테스트 확장 |
| 상세 페이지가 너무 길어짐 | 신규 3섹션은 각각 간결하게. 대조는 시각적, 파이프라인은 스캔 가능한 리스트 |
| 10개가 같은 틀이라 단조로움 | `narrative` 필드로 시스템별 서사 차별화 |
| 기존 카피와 중복 | Capabilities는 "무엇을 하나", 신규 섹션은 "어떻게·왜" — 역할 분리 유지 |
