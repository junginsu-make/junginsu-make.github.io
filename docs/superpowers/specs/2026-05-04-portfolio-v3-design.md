# 정인수 포트폴리오 v3 — 디자인 스펙

> **작성일**: 2026-05-04 (2차 정정 — 자료 폴더 5 문서 + 이력서 PDF + 강의경력 PDF 풀 정독 결과 반영)
> **프로젝트 루트**: `/home/a20616050/projects/A/junginsu-portfolio-v3/`
> **자료 마스터**: `/home/a20616050/projects/A/포토폴리오-260503/`
> **이전 버전**: `/home/a20616050/projects/A/junginsu-portfolio-2026/` (v2, 보존)
> **상태**: 사용자 검토 대기 (2차)

---

## 0. 절대 원칙 (HARD RULES — 자료 폴더 빌드 룰 + 사용자 후속 피드백)

### 단 하나의 KPI
> **"대기업 회장이 사이트를 5분 보고 정인수님을 채용해야겠다고 결심하게 만든다."**

이 KPI를 지나치는 모든 결정은 폐기. "/frontend 6 단계 통과 = 끝" 안일한 프레임 금지.

### 5 절대 룰 (자료 폴더 `포트폴리오 빌드 룰.md` 기반)
1. **자료 전부 활용** — 폴더 안 모든 파일은 의도적 증거. 임의로 줄이지 않음 (사용자가 명시 큐레이션 OK한 일부만 큐레이션 — 자격증 9개 중 3개 비주얼 등)
2. **모든 주장은 시각 증거** — 텍스트 카드만 금지. 라이브 URL 직접 캡처, 폴더 스크린샷 풀 갤러리, 회사 색상/로고
3. **인터랙션 = 임팩트의 도구** — 단순 호버·캐러셀 추가 ≠ 좋은 사이트. 평가자에게 더 많은 증거 노출이 목적
4. **레퍼런스의 영혼 재현** — 컬러·폰트 흉내 X. 인터랙션 패턴·여백 리듬·타이포 위계의 영혼
5. **가독성 절대 우선** — 본문 충분한 대비 (다크 #F4F4F5 이상, 라이트 #1B1B1B), 메타 4.5:1 이상, 모바일 16px 본문, mute 컬러는 라벨용

### 사용자 후속 피드백 5개 (2026-05-04)
1. **AI 만든 티 X** — Framer Motion `whileInView` 디폴트 패턴 금지. 진짜 모션 크래프트
2. **다이나믹 애니메이션** — fourmula·klimov 영혼의 풀스크린 모션 임팩트
3. **세련된 타이포그래픽** — 타입이 메인 디자인 언어. 큰 디스플레이·정확한 위계·여백
4. **프리미엄 디자인** — "초보자가 AI와 만든 수준" 절대 회피
5. **다크 + 화이트 둘 다 풀 디자인 완성도** — 토글 정도가 아니라 둘 다 별도 풀 디자인 검증

### 매 페이지 5 자문 (자료 폴더 빌드 룰 §10)
빌드 후 매 페이지마다:
1. 평가자가 정인수님의 어떤 강점을 여기서 확인하는가?
2. 그 강점을 증명하는 시각 자료가 화면에 있는가?
3. 평가자가 더 깊이 보고 싶을 때 어디로 갈 수 있는가?
4. 5초 안에 페이지의 핵심 메시지를 잡을 수 있는가?
5. 모바일에서도 읽히는가?

5개 모두 "예" 아니면 페이지 미완.

---

## 1. v2 실패 원인 (분석)

- Framer Motion `whileInView` + ImageStack 호버 = AI 디폴트 패턴, 진짜 모션 크래프트 부재
- klimov.agency·fourmula.ai 영혼(ScrollTrigger 핀·키네틱 타입·마그네틱 커서·풀스크린 페이지 전환) 단 1개도 미구현
- pieterkoopt 영혼(여백·도록 그리드·섬네일 호버 줌) 대신 max-w-7xl 단조 그리드 반복
- 다크/라이트 결정 흐릿, "밝은 톤" 하에서 모션 임팩트 보상 없음
- 텍스트 카드 위주 — 차트·다이어그램·아이콘 활용 부재
- 콘텐츠 url placeholder만, 실제 라이브 자료 미캡처
- 정확하지 않은 데이터 (글로리아교육재단 "자동화" 표현 거짓, GitHub 81↔84 혼동, TMON ROAS 출처 미검증)

---

## 2. 확정 결정 (변경 금지)

| 항목 | 결정 |
|---|---|
| 메인 영혼 | **D = pieterkoopt 페이퍼 갤러리 + fourmula 모션** |
| 6 SaaS 인터랙션 | **γ = 인덱스 → 디테일 (컬러 스윕 페이지 전환)** |
| 홈 컨셉 | **a = 매니페스토 키네틱** (600vh 6 핀 섹션) |
| 색 모드 | **다크 + 라이트 둘 다 풀 디자인 완성도** (토글 + 시스템 기본값 + 두 모드 별도 시각 검증) |
| 액센트 | 오렌지 `#FF6B02` (라이트) / `#FF7A1F` (다크) — 단 1색 |
| 디스플레이 폰트 | **Fraunces Variable** (영문 7 axes — opsz·wght·SOFT·WONK 적극 활용) |
| 본문 폰트 | **Pretendard Variable** (한글 본문·디스플레이 폴백) |
| 메타 폰트 | **JetBrains Mono** (UPPERCASE 0.08em tracking) |
| 메인 메일 | **9843ohs@gmail.com** |
| 콘텐츠 비중 | AI Builder ≥ 마케팅 > 강사 > 그 외 (영업력 강조 X) |
| **make.com 룰** | **4 핵심 시나리오 = 메인 (`make.com 핵심 시나리오 리스트.txt` 정답)**. **PDF 인벤토리 81 SYSTEM = 보조** (서울법무법인 등 클라이언트 작업·실험·V1→V2→V3 진화 모두 포함, 메인 후보 아님) |
| **GitHub 룰** | **84 저장소** (2026-05-03 gh 직접 조회). 81은 2026-05-01 동결값 |
| make.com vs GitHub | **절대 합산 금지**. 각각 별도 정체성: No-code 자동화(4 핵심) vs Vibe Coding 풀스택(84 저장소) |
| 자격증 처리 | AI/마케팅 3개만 비주얼, 나머지 6개는 텍스트 한 줄 |
| 메인 증명사진 | `정인수 증명사진 고화질.png` (15.8MB, 새 자료) |
| 자료 활용 룰 | 6 SaaS 폴더 모든 스크린샷 갤러리 / 강의 사진 16 그룹별 풀 갤러리 / 자격증은 사용자 결정대로 / 중복은 제거 |
| URL 캡처 | Playwright Node 스크립트 일괄 실행 (빌드 시작 전, 옵션 A) |
| 출처 미검증 데이터 | **TMON ROAS 7,404% / NGO 마음하나 +4,378 회원 사용 안 함** (이력서에 없음, portfolio-site 옛 메타 출처 미상) |

---

## 3. 정정된 정량 지표 (포트폴리오 카운터)

| 카운터 | 정확한 값 | 출처 |
|---|---|---|
| 경력 | **17년 4개월** | 이력서 |
| GitHub 저장소 | **84** (Public 43 + Private 41 / Original 53 + Fork 31) | gh repo list 직접 조회 2026-05-03 |
| make.com 핵심 시나리오 | **4** | 본인 명시 리스트.txt |
| make.com PDF 인벤토리 (보조) | 81 SYSTEM | automation_portfolio_fixed.pdf (보조) |
| 라이브 SaaS | **6** | 사용자 명시 URL 6개 |
| 강의처 | **31개** (좌 18 + 우 13) | 강의경력.pdf |
| 자격증 | **9** (AI/마케팅 3 + 강의·CS 5 + 사회·기초 1) | 자격증 폴더 + 이력서 |
| AI PL 진행 중 | **4** (호반·서울법무·아주·Palette OS Agent) | 이력서 |
| AI Content Operation | **7+ 클라이언트** (성동청년이룸·고려대기술지주·제2서울핀테크랩·서울도시철도엔지니어링·시스트란·모두솔루션·리부트라이프) | 이력서 |
| AI/SaaS 연동 | **17+** (Claude·GPT·o1·Gemini·Perplexity·Flux·Midjourney·Runway·Vidu·Kling·Suno·ElevenLabs·Castsome 외) | 자료 분석 |

---

## 4. IA / 라우트 (16개 + 1 옵션)

```
/                          홈 — 매니페스토 키네틱 600vh (6 핀 섹션)
/about                     5 챕터 인생 + 양면성 (강사·빌더) + 새 고화질 증명사진
/career                    경력 17 회사 풀 타임라인 (마케팅·AI·교육 임팩트) + 자격증 3+6 통합
/marketing                 마케팅 임팩트 (회사별 정확 KPI + 차트 + 다이어그램)
/marketing/teaching        강의처 31개 (좌 18 + 우 13) + 강의 사진 16 그룹 풀 갤러리
/marketing/content         15+ 콘텐츠 url 풀 (Playwright 캡처 + iframe 임베드)
/builder                   AI Builder 인덱스 (6 SaaS 도록 + 4 핵심 시나리오 + GitHub 84 미리보기)
/builder/[slug] × 6        6 SaaS 디테일 (라이브 + 폴더 모든 스크린샷 갤러리 + 핀 스크롤)
/builder/scenarios         make.com 4 핵심 풀 + PDF 인벤토리 81 SYSTEM 보조 (구분 명확)
/builder/github            GitHub 84 저장소 카테고리 5그룹 + 12 통합 시스템 (옵션)
/contact                   메일 9843ohs + GitHub + 이력서 PDF
/playground (옵션)         AI 자동화 시스템 인터랙티브 시각화 — 시간 여유 시
```

총: **11 정적 + 6 동적 = 17 라우트** (+ /playground 옵션 = 18)

**SaaS 슬러그**: `tickpoint`, `lumio`, `os-agent`, `mkt-automation`, `propintel`, `architect`

---

## 5. 디자인 토큰 — 다크 + 라이트 둘 다 풀 완성

### 컬러 (Tailwind v4 `@theme`) — 두 모드 별도 검증

```css
@theme {
  /* === LIGHT (페이퍼 갤러리 — pieterkoopt 영혼) === */
  --color-paper: #F5F1E8;          /* 베이스 아이보리 (v2 #F4EFE6보다 따뜻) */
  --color-ink: #1B1B1B;            /* 본문 차콜, 대비 12.4:1 WCAG AAA */
  --color-orange: #FF6B02;         /* 액센트 단 1색 fourmula */
  --color-stone: #5C544A;          /* 라벨 (v2 #8C8478보다 진해 대비 7:1+) */
  --color-line: rgb(27 27 27 / 0.18);

  /* === DARK (klimov 키네틱 영혼 + ink 베이스) === */
  --color-ink-dark: #0A0A0A;        /* 베이스 잉크 블랙 */
  --color-paper-dark: #F4F0E6;      /* 본문 베이지, 대비 18:1 */
  --color-orange-dark: #FF7A1F;     /* 다크에서 채도 살짝 올림 */
  --color-stone-dark: #A89F8E;      /* 라벨 (4.6:1) */
  --color-line-dark: rgb(244 240 230 / 0.20);
}
```

**두 모드 공통 디자인 검증**:
- 라이트: pieterkoopt 도록 톤 — 페이퍼 + 잉크 차콜 + 오렌지 액센트
- 다크: klimov 키네틱 톤 — 잉크 블랙 + 베이지 + 오렌지 (밝기 살짝 ↑)
- 토글 시 액센트·디스플레이·이미지 색 모두 별도 검증 (오렌지가 두 베이스 모두에서 살아있는가)
- 시스템 기본 `prefers-color-scheme` 존중 + 사용자 토글 `localStorage.theme` 저장
- 두 모드 모두 Lighthouse 접근성 95+ 만족

### 타이포 위계 (8단계, 두 모드 동일)

| 단계 | 사이즈 (clamp 반응형) | 사용처 |
|---|---|---|
| `display-mega` | clamp(96px, 18vw, 240px) | 홈 매니페스토 한 문장 |
| `display-xl` | clamp(64px, 10vw, 160px) | 홈 카운터, `/builder/[slug]` 히어로, `/career` 회사명 |
| `display-lg` | clamp(48px, 6vw, 96px) | 페이지 타이틀 |
| `display-md` | clamp(32px, 4vw, 56px) | 섹션 헤더 |
| `body-xl` | 28px (모바일 22px) | 리드 카피 |
| `body-lg` | 20px | 강조 본문 |
| `body` | 17px (line-height 1.7, letter-spacing -0.01em) | 본문 |
| `meta` | 13px UPPERCASE 0.08em — JetBrains Mono | 라벨·캡션·숫자 |

**한글 자간**: 본문 -0.01em, 디스플레이 -0.02em (Pretendard 적용 시)

### 간격 / 그리드
- 컨테이너 max-width: **1440px**
- 외곽 패딩: 모바일 `px-6`, 태블릿 `px-10`, 데스크탑 `px-16`, 와이드 `px-24`
- 12-col grid + **비대칭 break-out** (pieterkoopt 톤)
- 풀블리드 섹션은 `w-screen` (max-width 무시)
- 섹션 간 수직 간격: 모바일 `py-24`, 데스크탑 `py-40`

### 이징 (커스텀 — fourmula 차용)
- 디폴트: `cubic-bezier(0.6, 0.05, 0.3, 0.95)`
- 페이지 전환: `cubic-bezier(0.85, 0, 0.15, 1)` (가속·감속)
- 키네틱 타입: `cubic-bezier(0.34, 1.56, 0.64, 1)` (소량 오버슛)
- v2의 `ease-out` 디폴트 금지

---

## 6. 모션 시스템 — 다이나믹·프리미엄

| 기법 | 어디서 | 라이브러리 |
|---|---|---|
| Lenis 스무스 스크롤 (관성·휠 정규화) | 전 페이지 | `lenis` |
| GSAP ScrollTrigger 핀 섹션 | 홈 6 섹션, `/builder/[slug]` 케이스, `/marketing` 임팩트 | `gsap` + `ScrollTrigger` |
| GSAP scrub 키네틱 타입 (axis 변형) | 홈 매니페스토, 페이지 타이틀 | `gsap` + Fraunces variable axes |
| GSAP SplitText 무료 대안 | 디스플레이 글자별 stagger reveal | 자체 split (range API) |
| View Transitions API | 전 페이지 → `/builder/[slug]` 컬러 스윕 | 네이티브 (Chromium) + framer-motion 폴백 |
| 마그네틱 커서 + 커서 follower | CTA 버튼 + 6 SaaS 행 + 메뉴 + 다크 토글 | 자체 hook (mousemove + spring lerp) |
| Image mask reveal (clip-path) | 풀블리드 사진 (KOICA 강의, SaaS 라이브, 증명사진) | clip-path + GSAP |
| 풀스크린 케이스 핀 (좌측 고정·우측 스크롤) | `/builder/[slug]` | ScrollTrigger pin |
| Horizontal scroll 케이스 캐러셀 | 홈 6 SaaS 사이클, `/marketing` 임팩트 | ScrollTrigger horizontal |
| 카운터 카운트업 (이징 적용) | 홈, `/marketing`, `/builder/scenarios` | `framer-motion useMotionValue` + 자체 spring |
| 호버 thumbnail dock (stagger fade-in) | `/builder` 인덱스 행 호버 | framer-motion stagger |
| 색 반전 호버 (mix-blend-mode) | 모든 클릭 가능 텍스트·카드 | CSS `mix-blend-mode: difference` 또는 clip-path reveal |
| 페이지 전환 컬러 스윕 | 모든 라우트 변경 | 풀스크린 오렌지 패널 좌→우 320ms |
| Parallax (가벼운 시차) | 6 SaaS 사이클, 강의 갤러리 | translateY 기반 |

**v2의 `whileInView` 디폴트 단순 fade-up 금지**. 모든 모션은 위 표의 정의된 패턴 중 하나.

---

## 7. 반전 인터랙션 (사용자 명시 요구 — 4 모드)

### 7.1 호버 색 반전 (모든 클릭 가능 요소)
- 200ms 안에 반전 색으로 swap
- 라이트 모드: 페이퍼 → 잉크 검정 + 베이지 텍스트
- 다크 모드: 잉크 블랙 → 베이지 + 잉크 텍스트
- 구현: `mix-blend-mode: difference` (텍스트) + `clip-path` reveal (카드)

### 7.2 페이지 전환 컬러 스윕 (γ 핵심)
- 클릭 → 풀스크린 오렌지 패널 좌→우 320ms slide → 다음 페이지 fade-in
- View Transitions API + `::view-transition-old/new(root)` 커스텀 키프레임
- 폴백: framer-motion AnimatePresence

### 7.3 다크 ↔ 라이트 토글 (우측 상단)
- 즉시 전환 200ms
- **두 모드 모두 풀 디자인 완성도** (토글이 아니라 별도 디자인 검증)
- 초기값: `prefers-color-scheme` → 사용자 토글 시 `localStorage.theme = 'light' | 'dark'`
- 토글 UI: `<Sun>` ↔ `<Moon>` Lucide + 마그네틱 호버

### 7.4 6 SaaS 인덱스 호버 (γ)
- SaaS 행 호버 → 좌측 라이브 캡처 우측으로 빨려들어감 (clip-path + scale 1.05)
- 다른 5 행은 0.3 opacity 후퇴
- 행 위로 7~12장 폴더 섬네일 stagger fade-in (마우스 시차)

---

## 8. 페이지별 풀 명세

### 8.1 `/` (홈) — 매니페스토 키네틱 600vh

| 단계 | 화면 | 인터랙션 |
|---|---|---|
| 0vh — 첫 인상 | 풀뷰포트 거대 세리프 한 문장 200px+: **"AI 시대를 만난 17년 마케터가, 풀사이클 빌더로 다시 태어났다"**. 우하단 작은 메타: `정인수 / 1983 / 서울 / Palette ㈜ Agent 본부 팀장` | 마우스 따라 글자 SOFT/WONK axis 흔들림. 스크롤 1번 = 핀 해제 |
| 100vh — 카운터 | 거대 숫자 4개: **17년 / 84 GitHub / 4 make.com 핵심 / 6 라이브 SaaS** (커서 추가 라벨: "Repos / Scenarios / Live"). 배경 작은 메타: `Make.com · Claude · GPT · Gemini · n8n · MCP · React/Next.js · Supabase` | 카운트업 1.2s 진입 |
| 200vh — 6 SaaS 사이클 | 풀스크린 라이브 캡처 자동 페이드 사이클 3초마다 (Tickpoint → Lumio → OS Agent → MKT Automation → PropIntel → 아키텍처). 좌하단 platform 이름 + 한 줄 설명 변경 | 마우스 호버 → 사이클 정지. 클릭 → `/builder/[slug]` 컬러 스윕 |
| 300vh — 3 분류 인덱스 | 3 거대 카드 (`경력` / `마케팅` / `AI Builder`). pieterkoopt 도록 톤 | 호버 → 카드 안 풀블리드 사진 채워짐 (KOICA 현수막 / 강사 클로즈업 / SaaS 라이브) |
| 400vh — 양면성 | 좌: 강사 사진(KOICA) + sbcyberpass 메일 메타. 우: SaaS 라이브 + 9843ohs 메일 메타. 중앙: 새 고화질 증명사진 + **"한 사람, 두 면"** 카피 | 좌→우 시차 모션 (parallax) |
| 500vh — CTA | 풀스크린 검정 — 거대 9843ohs 메일 + 마그네틱 호버. **"커피 한 잔이면 됩니다"** 카피 + 이력서 PDF 다운로드 보조 버튼 | 호버 시 자석 효과 |

### 8.2 `/about` — 5 챕터 + 양면성

- **새 고화질 증명사진** 풀블리드 히어로 (`object-cover`, 100vh, mask reveal)
- **5 인생 챕터** (이력서 자기소개서 기반):
  1. 군 장교 + 성직자 부친 가정에서 위계·희생·책임감 학습 (1983~)
  2. 군대 → 부적응병사 상담 → 말년휴가 수능 → 영동대 사회복지학과 (학점 3.98 / 4.5, 16대 총학생회 복지국장)
  3. 영업·마케팅 17년 (캐드뱅크 최연소 주임 → 영동대 학과조교 우수교직원 → 학원·교육원·평생교육·티몬광고대행 등)
  4. AI/강의 진입 (2018) → 솔찍한인쌤 시작
  5. 풀사이클 AI 빌더 (2024.10~) → 11개월 81 SYSTEM 자동화 + 6 라이브 SaaS + Palette Agent 본부 팀장
- 각 챕터 = 핀 스크롤 섹션 (좌 텍스트 / 우 사진 또는 다이어그램)
- **양면성 벤 다이어그램 (SVG 커스텀)**: 강사·블로거·KOICA + AI 빌더·84 GitHub·6 SaaS — 교집합에 "콘텐츠 자동화 강의 & 운영"

### 8.3 `/career` — 6 임팩트 스트림 (회사가 아닌 임팩트 중심)

> **사용자 후속 룰**: 회사 강조 X. 회사에서 했던 업무 임팩트가 메인. 회사명은 작은 메타로만.

**상단 헤더**: "17년 4개월 / 6 임팩트 스트림" — 거대 디스플레이 카운터 + 키네틱 모션

#### 스트림 1 — AI Builder · 풀사이클 자동화 (2024.10~)
- **100+ Vibe Coding 자체 시스템 1인 개발** + GitHub 84 저장소
- **make.com 4 핵심 시나리오** (정부지원사업·10X 콘텐츠·계약서+GA4·뉴스레터/웹 크롤링) + n8n
- 데이터 크롤링·OCR·웹스크랩·자동 발행 + AI Prompt SEO
- 멀티 LLM 통합 (Claude · GPT · Gemini · Perplexity)
- *팔레트 ㈜ Agent 본부 팀장 / 솔찍한인쌤 (병행)*

#### 스트림 2 — AI SaaS PL · 클라이언트 4건 진행 중
- **호반그룹 · 서울법무법인 · 아주그룹 · Palette OS Agent**
- 클라이언트 시스템 기획 + 개발 리딩
- *팔레트 ㈜*

#### 스트림 3 — AI Content Operation · 7+ 클라이언트
- **성동청년이룸창업지원센터 · 고려대기술지주 · 제2서울핀테크랩 · 서울도시철도엔지니어링 · 시스트란 · 모두솔루션 · 리부트라이프**
- 콘텐츠 자동화 + 데이터 기반 마케팅 전략 운영
- *팔레트 ㈜*

#### 스트림 4 — 광고 운영·총괄 (10년+ 누적)
- **티몬 공식 광고대행, 연 40~60억 광고비 총괄** (9개월)
- **전국 30지점·카페 4지점, 연 20억+ 광고비 총괄** (1년 3개월) / 월 3,000만원 광고비 절감 / 네이버 검색광고·SNS 각 월 1억+
- Naver · Daum · Kakao · Google · SNS · GDN 통합 운영
- 화장품·가전·성형외과 광고 마케팅 + 나라장터 제안 PT
- *퍼포먼스디자인 / 퍼스트 아카데미 / 프랜차이즈산업연구원*

#### 스트림 5 — 종합홍보 PM · 20+ 프로젝트
- **농림축산식품부 · 조달청 · 한국벤처투자 · 창업진흥원 (2023 과업 총괄 PM)** + 14건+
- 마케팅·홍보 PM + 마케팅실 직원·AI Agent 직원 관리
- Owned Media (Blog · SNS · YouTube) + Paid Media (Naver · Kakao · Google · Instagram · Facebook · GDN) 통합 기획
- *Capsule Media (팔레트 그룹)*

#### 스트림 6 — 마케팅 강의 · 7년 6개월 (병행)
- **AI 강의** — 정부 부처 · 창업지원센터 (성동청년이룸 · 한국산림복지진흥원 · 제2서울핀테크랩 · 고려대기술지주)
- **마케팅 강의** — KOICA · 대학 · 소상공인 · 기업 · 자영업자
- 블로그 기초 → 마케팅 활용 / 지식인 / 검색광고 / 플레이스 / 온라인 마케팅 기획·운영
- *솔찍한인쌤*

**옵션 토글: 17 회사 풀 타임라인 보기** (expand) — 시기 · 회사 · 기간 · 직책 · 회사별 임팩트 메타. 회장이 더 깊이 보고 싶을 때만

**하단 자격증 섹션** (사용자 결정 — 3 비주얼 + 6 텍스트):

**비주얼 카드 3개 (AI/마케팅 — 큰 자격증 이미지 + 발급년·기관·코드)**:
1. **AIPOT 프롬프트엔지니어링 2급** (2025.02 · 한국생산성본부 KPC) — 최신 AI 자격
2. **검색광고마케터 1급** (2022.07 · 한국정보통신진흥협회 KAIT)
3. **SNS광고마케터 1급** (2022.05 · 한국정보통신진흥협회 KAIT)

**텍스트 한 줄 표 (강의·CS + 사회·기초)**:
```
CS강사 1급 · 2018 · 아샤서비스아카데미 (제18ASHA38180호)
서비스 및 이미지컨설턴트 강사양성과정 100h · 2018 · 아샤서비스아카데미
스피치지도사 2급 · 리더십지도사 1급 · 고객관리지도사 1급 · 2011 · 한국경영인재개발원 KMRD
사회복지사 2급 · 2010 · 한국사회복지사협회/보건복지가족부 (제2-261521호)
워드프로세서 1급 · 2012 · 대한상공회의소
컴퓨터활용능력 2급 · 2010 · 대한상공회의소
1종보통운전면허 · 2002 · 경찰청
```

### 8.4 `/marketing` — 임팩트 차트·다이어그램

| 섹션 | 시각화 | 출처 |
|---|---|---|
| **회사별 광고비 임팩트** | 막대 차트 — 퍼포먼스디자인 (40~60억) / 퍼스트 아카데미 (20억+) | 이력서 |
| **다중 채널 통합 운영** | 노드-엣지 다이어그램 — Naver / Daum·Kakao·Google / SNS / 언론보도 / 디자인 (이력서 마케팅 활동 풀맵) | 이력서 |
| **고객 매출 영향 (수상)** | 칩 4개: 매출 1~2위(KG패스원) / 신규매출 1위 4개월차(이페이저) / 우수교직원(영동대) / 최연소 주임(캐드뱅크) | 이력서 |
| **AI PL 클라이언트 4** | 호반그룹·서울법무법인·아주그룹·Palette OS Agent — 로고 또는 아이콘 카드 (진행 중 표시) | 이력서 |
| **AI Content Operation 7+** | 노드 다이어그램 — 성동청년이룸·고려대기술지주·제2서울핀테크랩·서울도시철도엔지니어링·시스트란·모두솔루션·리부트라이프 | 이력서 |
| **Capsule Media 종합홍보 PM 20+** | 농림축산식품부·조달청·한국벤처투자·창업진흥원 (+14) — 스택형 카드 | 이력서 |

> **TMON ROAS 7,404% / NGO 마음하나 +4,378 회원 — 사용 안 함** (이력서 미명시, 출처 미검증)

### 8.5 `/marketing/teaching` — AI/정부/기업 메인 + 사진 롤링 캐러셀 + 텍스트 리스트

> **사용자 후속 룰**: 강의처 다 나열 X. AI 교육·정부 부처·기업 강의 메인 비주얼. 개인·자영업자는 텍스트 리스트. 사진은 롤링 캐러셀.

#### 풀블리드 히어로 — 강의 사진 자동 롤링 캐러셀
- 강의 사진 56장 자동 슬라이드 (3초 간격, 마우스 호버 시 정지)
- Ken Burns 효과 (가벼운 줌·팬) + parallax
- 풀블리드, 좌하단 작은 캡션 (현재 사진 활동 메타)
- 키보드 ←→ 수동 제어
- 클릭 시 라이트박스 풀스크린 갤러리 진입

#### Tier 1 — 메인 비주얼 카드 (정부·공공·대학·AI 교육 — 6 카드)

| # | 강의처 | 사진 매핑 | 비주얼 강조 |
|---|---|---|---|
| 1 | **국제협력단 KOICA 해외봉사단** | IMG_1187.JPG (현수막 명시) | 공신력 |
| 2 | **한국산림복지진흥원 AI 교육** | (정부 산하 — 폴더 카메라 인터뷰 컷) | 정부 산하 |
| 3 | **제2서울핀테크랩 AI 교육** | (서울시 공공 — P1070 시리즈) | 서울시 공공 |
| 4 | **성동청년창업이룸센터 AI 교육** | (성동구 공공 — 협회·단체 그룹) | 성동구 공공 |
| 5 | **고려대학교기술지주 ㈜ AI 교육** | (대학 — 협회·단체 그룹) | 대학 산학협력 |
| 6 | **청운대학교** | DSC01363.JPG (호텔 연회장 60명+) | 대학 정식 |

각 카드: 큰 사진 + 강의처 이름 + 카테고리 라벨 (정부·대학·AI 교육) + 클릭 시 라이트박스 풀스크린 사이클

#### Tier 2 — 보조 카드 (협회·기업·연합회 — 8 카드)
- 메가스터디 더조은컴퓨터학원
- 동작구 소상공인 연합회
- 서대문구 학원협회 50여 곳
- KCT 보습학원
- 헬로우뮤지엄 미술관
- 전국 태권도장·합기도장 관장님 300여명
- 세무사 모임
- 인테리어 디자이너

각 카드: 작은 사진 + 강의처 이름. 사진 없는 곳은 도형 디바이더 + 아이콘으로

#### Tier 3 — 텍스트 리스트 (개인·자영업자)
한 줄 칩 리스트로:
```
영업 직원 · 개인 블로그모임 · 작가 · 에이스 인쇄·제본 · 명품시계 AS센터 ·
1인 네일샵 · 의정부 컴퓨터 AS센터 · Y-GYM · 음악학원 · 아샤 아카데미 ·
1인샵 윤정문 안마원 · 대전 이사업체 · 경기도 청소업체 ·
수원 삼성경매공인 부동산 · 퍼스트 아카데미
```

#### 보조 갤러리 (옵션) — 16 그룹 라이트박스
- "더 많은 강의 사진 보기" 토글
- 그룹별 그리드 (DSC·IMG·P1070·KakaoTalk 등 16 그룹) → 클릭 시 라이트박스 사이클
- 자료 분석 §4 Agent E 분류 그대로

**히어로 풀블리드 정지 컷**: `KakaoTalk_20200102_190424548_01.jpg` (강사 클로즈업 + Naver Blog 검색률 차트 슬라이드) — 캐러셀 시작 시 첫 프레임

> 강의 영상 `20200410_170643.mp4` (1.79GB) — 30초 클립 재인코딩 후 추가 가능 (옵션, 시간 여유 시).

### 8.6 `/marketing/content` — 15+ 콘텐츠 url 풀

- **Playwright 일괄 캡처** 결과 + iframe 임베드 가능한 것은 임베드
- 카테고리: 네이버 블로그(sbcyberpass) / 인스타 / 유튜브 / 노션 / 외부 사이트
- **자료**: 자료 폴더 `MKT Automation/콘텐츠 레퍼런스/콘텐츠 레퍼런스.txt` + `구글블로그/01_K-beauty global trend.html의 사본.html`
- 각 url = 카드 (스크린샷 + 제목 + 발행처 + 발행일 + 카테고리 태그 + 외부 링크)
- 비대칭 mason 그리드 (큰 사진 1 + 작은 4 패턴 반복) — pieterkoopt 톤
- iframe 가능: 노션 (anyone with link), 유튜브 (oEmbed), 인스타 (oEmbed)

### 8.7 `/builder` — AI Builder 인덱스

**상단 카운터**: **84 GitHub 저장소 / 4 make.com 핵심 시나리오 / 6 라이브 SaaS / 17+ AI·SaaS 연동**

> ⚠️ 카운터 라벨로 GitHub와 make.com 절대 합산 X. "100+ 시스템" 같은 통합 표기 금지.

#### 6 SaaS 도록 인덱스 (γ — 5 bullet 요약 카드)

> **디테일 기준**: 회장이 5초 안에 "이 사람이 뭘 만들 수 있는지" 인지. 약어·전문용어 풀어서 평이한 한국어. 5 능력 bullet (구체 + 숫자).

각 SaaS 도록 행에 호버 시 펼쳐지는 카드:

##### 1. Tickpoint — 한국 주식 트레이딩 인텔리전스 (라이브 — tickpoint.co.kr)
KOSPI·KOSDAQ 2,769 종목을 멀티 LLM으로 통합 분석하는 SaaS
- 변동성 수축 패턴 시그널 스크리너 + 백테스트 검증
- 차트·펀더멘털·뉴스·9 기술지표 + LLM 전문가 오버레이 종합 분석
- 24 이슈 종목 자동 큐레이션 + 80+ 시그널
- 시장 심리 게이지 (공포·탐욕)
- 자동매매 시스템 (관리자 권한)

##### 2. Lumio — AI 광고·CF 영상 자동 생성 스튜디오 (라이브 — lumio-video.vercel.app)
소스 → 스토리 → 영상 → 합성 4단계 파이프라인
- YouTube 영상 분석·스토리보드 자동 생성
- 이미지 모델 4종 라우팅 (자동 선택)
- 영상 모델 (Veo 3.1, Kling v3 Pro) + 음악 (ElevenLabs)
- CF 모드 — 브랜드/제품 양식만 입력하면 풀 광고 영상 생성
- 씬 단위 편집 (트림·속도·필터·트랜지션)

##### 3. OS Agent (Synapse) — 사내 AI OS (라이브 — 43.201.237.25:3010)
12명 가상직원 + 20개 AI 에이전트가 부서별 협업하는 사내 운영 OS
- 자연어 업무 지시 → AI 에이전트 자동 처리 (예: "이번주 휴가자" → 일정 조회 + 신청서 PDF + 캘린더)
- 워크플로우 빌더 (노드 에디터, 분기·병렬)
- 5 부서 (경영·경영지원·Agent·Creative·Marketing) + 인사 카드
- 승인·결재 (휴가·반차·워크플로우)
- 캘린더 + 작업 관리

##### 4. MKT Automation — All-in-One 마케팅 OS (라이브 — frontend-three-smoky-68.vercel.app)
네이버·구글·블로그·SNS·YouTube 단일 워크플로우
- 키워드 → 경쟁 분석 → AI 글 → 본문 이미지 → 자동 포스팅
- 광고 카피 생성 (멀티 LLM, 모드별 최대 24개 변형)
- SNS 분석 (인스타·페북·틱톡·스레드 + 감정 분석)
- YouTube 분석 (6 모드)
- 자동 SEO 생성기 (URL·파일·텍스트 → 메타·사이트맵·robots.txt)

##### 5. PropIntel AI — 부동산 AI 어시스턴트 (라이브 — propintel-ai-beta.vercel.app)
시장 + 등기 + 계약 사기 검증을 묶은 부동산 SaaS
- 사기방지 5탭 — 주소·서류·특약·보증보험·입주 (AI PDF·이미지 분석)
- 등기 변경 이력 타임라인 + AI 분석
- 시장 데이터 9탭 (매매·전월세·청약·미분양·금리 등)
- 청약 알림 2,713건 + 10 지역
- 부동산 뉴스 모니터링 매일 08시 100건 분류

##### 6. 아키텍처 시스템 — AI 비즈니스 진단 + 이중 출력 워크벤치 (라이브 — architect-portfolio-lake.vercel.app)
5단계 인터뷰만으로 제안서·PRD 동시 자동 생성
- 5단계 비즈니스 진단 (배경·모델·프로세스·기술·KPI)
- 단일 분석 → 클라이언트용 제안서 + 개발자용 PRD/LLD/API/DB/UI 동시
- 멀티모달 입력 (텍스트·문서·회의 녹음)
- Mermaid 시퀀스 다이어그램 자동
- 결과물 5탭 (로드맵·아키텍처·구현·문서·UI 설계)

**도록 인터랙션**:
- 6 가로 행 (각 행 약 130px, 합 800px)
- 좌측 platform 이름 (Fraunces 80px) + 중앙 1줄 정의 + 우측 라이브 캡처 미리보기
- **호버**: 행 확장 → 5 bullet 펼쳐짐 + 라이브 캡처 풀행 + 폴더 섬네일 7~12장 stagger
- **클릭**: 컬러 스윕 → `/builder/[slug]` 디테일

#### 4 핵심 시나리오 카운터 + 미리보기 (메인)
1. **정부지원사업 크롤링·사업계획서 자동화** — 24+ 공고 누적 / Webhook → Airtable → CloudConvert → OpenAI 6+ 분기 → Google Docs
2. **10X 콘텐츠 자동화** — 5개 WP 동시 / Iterator + Router + OpenAI 2차
3. **계약서 관리 + GA4 분석** — Drive Watch → PDF Convert → OpenAI → Airtable + Router(폴더 자동 분류)
4. **뉴스레터·웹사이트 크롤링 콘텐츠 발행** — 47+ 콘텐츠 수집 / SerpAPI 5+ 카테고리

각 시나리오 = 작은 플로우 다이어그램 + "디테일 보기" 버튼 → `/builder/scenarios`

#### GitHub 84 미리보기
5 카테고리 도넛 (대표 시스템 35 / Claude Code 11 / Frontend 16 / 외부 fork 6 / Misc 6 + 신규 3) → 클릭 시 `/builder/github`

> ⚠️ PDF 인벤토리 81 SYSTEM은 **이 페이지 메인이 아님**. `/builder/scenarios` 보조 섹션에서만.

### 8.8 `/builder/[slug] × 6` — 6 SaaS 디테일 (트렌디·풍부 — 사용자 명시 URL 순서)

> **사용자 후속 룰**: AI 관련 SaaS는 **최대한 트렌디하게 많이 표현**. 라이브 헤더 스크린샷 + 폴더 크롭 이미지 풀 활용. (이게 회장이 "이 사람이 진짜 만들었구나"를 시각으로 인지하는 핵심)

#### 디테일 페이지 구조 (6 SaaS 공통, 트렌디·풍부 풀세트)

각 SaaS 페이지에 다음 12+ 섹션이 들어감:

1. **풀블리드 라이브 히어로 (100vh)** — Playwright로 캡처한 라이브 URL 풀스크린. 좌하단: platform 이름 (Fraunces display-mega) + 1줄 정의 + "Visit Live →" 마그네틱 버튼
2. **랭귀지 메타 바** — 라이브 URL · 운영 시점(SINCE) · 톤(다크/라이트) · 운영자(ls.Jung) · 문의 메일 (작은 메타 한 줄)
3. **5 능력 풀 (인덱스 카드 확장판)** — 각 능력별 큰 텍스트 + 폴더 크롭 또는 라이브 캡처 1장 + 작은 메트릭 칩
4. **핀 스크롤 케이스 스토리** — 좌 라이브 화면 고정, 우 챕터(문제→스택→기능→메트릭→CTA). 챕터마다 좌측 화면이 다른 폴더 스크롤샷으로 페이드
5. **기능별 풀블리드 스크린샷 (3~5장)** — 각 핵심 기능에 풀스크린 이미지 + 캡션. 폴더에서 직접 크롭 또는 Playwright 캡처
6. **기술 스택 풀세트** — Next.js · Tailwind · shadcn · Recharts · 멀티 LLM (Claude · GPT · Gemini · Perplexity) + SaaS별 추가 (예: Tickpoint = 차트 라이브러리, Lumio = Veo·Kling·ElevenLabs)
7. **데이터·메트릭 시각화** — SaaS별 거대 숫자 (예: Tickpoint 2,769 종목 / Lumio 4단계 / OS Agent 20+12+5 / MKT 50+ 도구·15+ AI·48+ 에이전트 / PropIntel 9탭+5탭+2,713 알림 / 아키텍처 5단계+이중 출력)
8. **풀스크린 갤러리 캐러셀** — 폴더 안 **모든** 스크린샷 가로 스크롤 (Tickpoint 15장 / Lumio 8장 / OS Agent 10장 / MKT 10+장 / PropIntel 7장 / 아키텍처 7장). 큐레이션 X — 룰 §1·§8
9. **라이트박스 풀스크린 모드** — 캐러셀 클릭 시 풀스크린 + 키보드 ←→ESC + 썸네일 스트립
10. **GitHub 매칭** (있는 경우) — Architect-Build, AD_Copy 카드 (저장소 README 발췌 + 별·언어·최종 커밋)
11. **공통 푸터** — ls.Jung / Insu Jung / SINCE 날짜 / 9843ohs@gmail.com (PropIntel·Tickpoint)
12. **이전 / 다음 SaaS 도크** — 좌하 ← prev / 우하 next → 마그네틱 버튼

#### Tickpoint — 한국 주식 트레이딩 인텔리전스 (15장 + 라이브 헤더)

**1줄 정의**: KOSPI·KOSDAQ 2,769 종목을 멀티 LLM으로 통합 분석하는 한국 주식 트레이딩 인텔리전스 (BETA)
**라이브**: https://tickpoint.co.kr/
**톤**: 다크 + 빨강(하락)·초록(상승) 네온, TradingView 인상
**SINCE**: 2026-04-24

**5+ 능력 풀 (각각 풀블리드 비주얼)**:
- 변동성 수축 패턴 시그널 스크리너 + 백테스트 검증 KPI 9개 (924/204/175/37.1%/+1.42%/3.24/+55.17%/-12.21% 등)
- 차트·캔들·볼륨 + 펀더멘털 + 9 기술지표 + LLM 전문가 오버레이 종합 분석
- 24 이슈 종목 자동 큐레이션 + 80+ 시그널
- 시장 심리 게이지 (공포·탐욕)
- 자동매매 시스템 (관리자 권한)
- 1H/24H/7D 뉴스 트렌드 + 핫 키워드 + 감정 분석
- 시장 현황 (섹터 히트맵, 외인/기관/개인 차트)
- 종목 검색 (2,769) + 개인 종목 (관심·보유)
- 신호 시뮬레이션 + 로또 6/45

**기술 스택**: Next.js + shadcn/ui + Recharts/TradingView + 멀티 LLM (Claude/GPT/Gemini/Perplexity)
**GitHub**: 비공개 (`python-bithumb` 부분 연관)

#### Lumio — AI 광고·CF 영상 자동 생성 (8장 + 라이브 헤더)

**1줄 정의**: 소스 → 스토리 → 영상 → 합성 4단계 파이프라인의 AI 광고·CF·숏폼 영상 자동 제작 스튜디오
**라이브**: https://lumio-video.vercel.app/
**톤**: 라이트 + 오렌지 액센트, shadcn/ui

**6+ 능력 풀**:
- YouTube 영상 탐색 5방식 (키워드/URL/채널/카테고리/트렌드) + 등급 배지 (Excellent/Good/Average/Low)
- 씬 단위 스토리보드 자동 생성 (이미지 + TTS 나레이션 + 자막 + 트랜지션)
- 이미지 모델 라우팅 4종 (Auto / Nano Banana Pro / GPT Image 2 / Flux Pro 2)
- 영상 모델 (Veo 3.1 단일, Kling v3 Pro 단일)
- 씬별 편집 — 트림·속도·밝기·대비·채도·페이드·Grayscale·Sepia·Blur·Vignette·Mirror·Negative·Vintage
- CF 모드 — 브랜드/제품 양식 (메시지·타겟·컨셉·9:16/30s·참고 문서) → Gemini 3.1 Pro + Gemini Image + Kling v3 Pro + ElevenLabs Music 일괄 생성

**기술 스택**: Next.js + shadcn/ui + 다중 영상/이미지 모델 통합 (Veo · Kling · Flux · Gemini Image · ElevenLabs)
**GitHub**: 비공개

#### OS Agent (Synapse) — 사내 AI OS (10장 + 라이브 헤더)

**1줄 정의**: 12명 가상직원 + 20개 AI 에이전트가 부서별로 협업하는 사내 AI OS — 실제 회사처럼 조직도·인사·결재·워크플로우 작동
**라이브**: http://43.201.237.25:3010/ (자체 EC2 IP 직접 노출)
**톤**: 라이트 + 베이지·갈색

**6+ 능력 풀**:
- 20개 AI 에이전트 라이브러리 — 문서 관리자, 카피라이터, 데이터 툴킷, **HR Agent**, 한글 문서 전문가, 이미지 편집자/생성자/OCR, 의도 분석기, 맞춤 마케팅 보고서, PDF 분석관/제작자, 프롬프트 엔지니어, 스케줄 비서, SNS 분석기, 텍스트 툴킷, 영상 제작자/도구함
- 12명 가상 구성원 + 5개 부서 (경영/경영지원실/Agent 본부/Creative 본부/Marketing 본부) — 인사카드 (이름·직급·연락처·연봉·재직·기술스택)
- AI Agent 자연어 채팅 + 실시간 작업 처리 (예: "이번주 휴가자 누구야?" → 일정 조회 + 휴가 신청서 자동 생성 LR-2026-0042.pdf + 팀 캘린더 등록 + 알림 4단계)
- 승인·결재 (휴가/반차/워크플로우 — 대기/승인/반려)
- 워크플로우 빌더 — 노드 에디터 (React Flow), HR Agent → 구성원 → 분기(자동 승인/조건/병렬) → AI Agent
- 작업 관리 + 5월 캘린더 52개 일정
- 휴가 신청서 PDF·DOCX 다운로드

**기술 스택**: Next.js + shadcn/ui + React Flow + 자체 LLM 라우팅
**GitHub**: 비공개
**푸터**: © 2026 Synapse · 개발자 ls.Jung

#### MKT Automation — All-in-One 마케팅 OS (10+장 + 라이브 헤더)

**1줄 정의**: 네이버 + 구글 + 블로그 + SNS + YouTube를 단일 워크플로우로 묶은 All-in-One 마케팅 OS
**라이브**: https://frontend-three-smoky-68.vercel.app/
**톤**: 다크 + 네온 그라디언트 블롭, 카테고리 컬러 코딩 (N=초록/G=파랑/I=청록/V=핑크/A=보라)
**SINCE**: 2025-12-19

**8+ 능력 풀**:
- 8 통합 영역 / 50+ 자동화 도구 / 15+ AI 모델 / 6개 SNS 플랫폼 분석
- 3 자동화 흐름:
  - 블로그 콘텐츠 (키워드 → 경쟁 분석 → AI 글 → 본문 이미지 → 자동 포스팅)
  - 비주얼 자산 (광고 카피·썸네일·상세페이지·카드뉴스·Cinema Studio)
  - 마케팅 인텔리전스 (SNS·키워드·딥리서치·전략 보고서·SEO)
- 광고 카피 생성 3 모드 — 집중/균형 (GPT+Claude+Gemini 15개) / 최대 다양성 (24개+)
- YouTube 분석 6 모드
- SNS 분석 (인스타·페북·틱톡·스레드 + 감정 분석 + 통합)
- 자동 SEO 생성기 (URL/파일/텍스트 → 메타태그·사이트맵·robots.txt)
- 48개+ 전문 AI 에이전트 협력 분석
- 멀티 LLM (Claude+GPT+Gemini+Perplexity)

**기술 스택**: Next.js + shadcn/ui + 멀티 LLM 라우팅 + 카테고리 컬러 시스템
**GitHub**: [AD_Copy](https://github.com/junginsu-make/AD_Copy) (광고 카피 모듈만 공개)

**보조 자료** — 자료 폴더 `MKT Automation/콘텐츠 레퍼런스/`:
- `구글블로그/01_K-beauty global trend.html` (실제 생성 SEO 블로그 샘플)
- `콘텐츠 레퍼런스.txt` (실제 마케팅 콘텐츠 url 모음)

#### PropIntel AI — 부동산 AI 어시스턴트 (7장 + 라이브 헤더)

**1줄 정의**: 시장 동향 + 등기부 변경 추적 + 사기방지 5탭 계약 검증을 묶은 부동산 AI 어시스턴트 SaaS
**라이브**: https://propintel-ai-beta.vercel.app/
**톤**: 라이트 + 초록 액센트, Recharts 인상

**7+ 능력 풀**:
- 대시보드 — 강남·서초·송파 실거래가 라인차트 + 위험도 도넛 (안전 7/주의 2/위험 1) + 7일 활동 영역차트 + KPI (서울 가격지수 174.1 / 기준금리 2.50%) + 우측 플로팅 AI 어시스턴트
- 경영진 브리핑 — 서울 매매가격지수 195.8 +3.06p / 한국은행 기준금리 / 청약 분양 / 뉴스 핫픽
- 사기방지 계약 검증 5탭 — 주소 진단 / 서류 확인 / 특약 검증 / 보증보험 / 입주 보호 (PDF·이미지 업로드 AI 분석)
- 공고 알림 — 청약 2,713건 + 10개 지역
- 시장 데이터 9탭 — 아파트 매매·전월세 / 연립·다세대 / 청약 경쟁률 / 미분양 / 상권 / 가격지수 / 금리 / 종합
- 등기 변경 이력 타임라인 — 소유권이전·근저당권·전세권·가처분 + AI 분석
- 부동산 뉴스 모니터링 매일 08시 / 100건 분류 (시장동향 40 / 정비사업 20 / 정책규제 19 / 금리금융 12 / 건설사 9)

**기술 스택**: Next.js + shadcn/ui + Recharts + AI PDF·이미지 분석
**GitHub**: 비공개
**개발자**: ls.Jung

#### 아키텍처 시스템 — AI 비즈니스 진단 + 이중 출력 워크벤치 (7장 + 라이브 헤더)

**1줄 정의**: 5단계 AI 진단 인터뷰만으로 클라이언트용 제안서 + 개발자용 PRD/LLD/API/DB/UI 설계서를 동시 자동 생성하는 멀티모달 AI 워크벤치
**라이브**: https://architect-portfolio-lake.vercel.app/
**톤**: 다크 + 보라 그라디언트(랜딩) / 라이트 + 컬러풀 결과 패널

**6+ 능력 풀**:
- 5단계 비즈니스 진단 — 비즈니스 배경 / 시스템 모델 / 업무 프로세스 / 기술 환경 / 성공 지표 KPI (채팅 + 양식 양방향)
- 이중 출력 — 단일 분석으로 비즈니스 제안서·ROI·일정표 (Claude) + PRD·LLD·API·DB·Frontend (Claude/Gemini) 동시 생성
- 멀티모달 입력 — 텍스트 / 문서 / 회의 녹음 → 분석
- 결과물 5탭:
  - 로드맵 (3개월 캘린더 + 27 스프린트 진행률 + GitHub·Terraform·Docker·CI/CD)
  - 아키텍처 (Mermaid 시퀀스 — 고객·API Gateway·인증·주문·매장 KDS·Kafka·재고/ERP, Happy Path/오프라인/Re-Network 분기)
  - 구현
  - 문서
  - UI 설계 (페이지 흐름도 + 라우트 표 + 컴포넌트 매핑 + 와이어프레임 4종 + **디자인 토큰** brand-primary-red #D12F2F / brand-secondary-brass #C5A059 / status 컬러 / bg-dashboard #F8F9FA / bg-kds-dark #121212 / 타이포 display-headline 32px/700)
- 클라이언트용 / 개발자용 뷰 토글
- 한국어 / 영어 UI

**기술 스택**: Vite + React 19 + TypeScript 5.8 + Tailwind v4 + Zustand + Dexie(IndexedDB) + Mermaid.js + jszip + @google/genai (Gemini) + @anthropic-ai/sdk (Claude)
**GitHub**: ✅ https://github.com/junginsu-make/Architect-Build (정확히 일치)

#### 6 플랫폼 공통 표시
- ls.Jung / Insu Jung
- 9843ohs@gmail.com (PropIntel · Tickpoint 푸터)
- 다크 3 / 라이트 3 시각 균형
- 6개 다른 도메인 — 영상 / 마케팅 / 조직 / 부동산 / 주식 / 설계

### 8.9 `/builder/scenarios` — 4 핵심 + 81 인벤토리 (보조)

**상단 — 4 핵심 풀 (메인)**:
- 각 시나리오 별도 섹션 = 노드-엣지 플로우 다이어그램 (Visx 또는 자체 SVG) + 매핑 스크린샷 + 데이터 메트릭 + 기술 스택
- 시나리오 1: `21.00.40.JPG` + `21.04.22.JPG`
- 시나리오 2: `21.01.43.JPG` + `21.02.59.JPG` + `21.03.20.JPG`
- 시나리오 3: `21.01.24.JPG` (GA4 부분은 별도 스크린샷 필요 — 사용자 확인 후 보강)
- 시나리오 4: `21.00.07.JPG` + `21.05.55.JPG` + `21.06.15.JPG`
- 전체 워크스페이스: `20.57.34.JPG`

**중단 — 11개월 개발 타임라인** (자료 분석 §6):
- 2024.10 기반 → 2024.11 확장 → 2024.12 심화 → 2025.01 통합·고도화 → 2025.02-03 전문화 → 2025.04 클라이언트 납품 → 2025.05 최신 기술 통합 → 2025.06-08 운영·협업 자동화

**하단 — PDF 인벤토리 81 SYSTEM (보조 자료)**:
- ⚠️ 헤더에 명시: "본인 작업 인벤토리 (보조). 메인 강조는 위 4 핵심"
- 6 제품군 도넛 차트 (Visx Treemap 가능):
  1. AI 검색·SEO 콘텐츠 엔진 (SYSTEM 01-17, 63-66, 81 — 약 23개)
  2. 버티컬 업무 자동화 — 정부지원·법무·금융 (SYSTEM 18-36, 약 19개)
  3. SNS·숏폼·멀티미디어 (SYSTEM 37-42, 52-60, 75 — 약 16개)
  4. 뉴스·지식 큐레이션 (SYSTEM 43-51, 9개)
  5. 데이터 수집·분석 인프라 (SYSTEM 02, 06-07, 61-70, 76-79 — 약 15개)
  6. 마케팅·광고·운영 자동화 (SYSTEM 71-74, 80 — 약 5개)
- 풀 인벤토리 표 토글 (시스템 ID·이름·도구·모듈 수)
- ⚠️ 클라이언트 작업(서울법무법인 SYSTEM 24-32 등)은 작은 메타로만, 메인 후보 X

### 8.10 `/builder/github` — GitHub 84 (옵션 페이지)

**카테고리 5그룹 인터랙티브 카드**:

| 그룹 | 수 | 대표 저장소 |
|---|---|---|
| A. 대표 시스템 (AI Agent / 마케팅 / 금융 / 영상 / 이미지 / 문서) | ~35 | synapse-platform, propintel-ai, stock-training, palette-hoban-develop, cinema_AI, motion-magic, MARKETING_SEO_AUTOMATION, AD_Copy, Image_Agent, hodu-stocks, legal-agent |
| B. Claude Code 생태계 | ~11 | claude-forge, my-claude-code-setting, claude-code-skills, claude-skills-official, frontend-toolkit, spec-kit, claw-code |
| C. Frontend Stack 큐레이션 (학습용 fork) | ~16 | shadcn-landing-page, next-shadcn-dashboard-starter, SaaS-Boilerplate, zustand, motion, query, recharts |
| D. 외부 도구·학습 fork | ~6 | hwp-open-source, NAVER_NESS, spider, python-bithumb, Qwen-Image-Layered |
| E. Misc/부속 | ~6 | 2026-New-Year-s-Fortune, suno-api, youtube-studio, replit, **Architect-Build**, LLM-Model |
| 신규 추가 | 3 | gh로 직접 가져와 보강 |

**12 통합 시스템 그룹** (관련 저장소 묶음):
1. Synapse Platform / 2. Hoban Platform / 3. Cinema AI / 4. Marketing Suite / 5. SNS·Crawling Suite / 6. Naver·Google Blog Automation / 7. Image AI Suite / 8. Stock·Crypto / 9. PDP Suite / 10. Document Automation / 11. Claude Code Ecosystem / 12. Frontend Stack

**12 Golden Principles 카드** (본인 코딩 철학): Immutability / Secrets in Env / TDD / Conclusion First / Small Files / Validate at Boundaries / Explain with Analogies / Context 50% / HARD-GATE / Evidence-Based / SDD Review / Surgical Changes

### 8.11 `/contact` — 컨택

- 풀스크린 거대 메일: **9843ohs@gmail.com** (Fraunces 200px+, 마그네틱 호버, mailto:)
- 작은 보조 메일: junginsuai@gmail.com (이직), sbcyberpass@naver.com (블로그)
- GitHub: https://github.com/junginsu-make
- 이력서 PDF 다운로드 (`public/resume.pdf`)
- 다크/라이트 토글

---

## 9. 시각화 컴포넌트 풀세트

### 차트 라이브러리
- **Recharts** (반응형 막대·라인·도넛·area)
- **Visx** (트리맵·네트워크·sunburst — 81 SYSTEM, 회사 영향, 기술 스택)
- **자체 SVG** (한국 지도 마커, 노드-엣지 플로우 다이어그램, 벤 다이어그램)

### 사용처별
- `/marketing` — 회사 광고비 막대 / 다중 채널 노드 다이어그램 / 임팩트 도넛
- `/marketing/teaching` — 한국 지도 마커 (강의처 31개)
- `/builder` — 카운터, 6 SaaS 도록, GitHub 84 5그룹 도넛
- `/builder/scenarios` — 4 시나리오 노드-엣지 플로우 + 81 SYSTEM 트리맵 + 11개월 타임라인 차트
- `/about` — 양면성 벤 다이어그램, 5 챕터 타임라인

### 아이콘 (Lucide React 풀세트)
| 사용처 | 아이콘 |
|---|---|
| Tickpoint | `TrendingUp` / `LineChart` |
| Lumio | `Film` / `Clapperboard` |
| OS Agent | `Network` / `Cpu` |
| MKT Automation | `Megaphone` / `Zap` |
| PropIntel | `Building` / `Map` |
| 아키텍처 | `Workflow` / `Compass` |
| make.com | `GitBranch` / `Webhook` |
| GitHub | `Github` |
| 강의 | `Presentation` / `GraduationCap` |
| 컨택 | `Mail` / `Linkedin` |
| 다크/라이트 토글 | `Sun` / `Moon` |

### 도형 디바이더
- 원·삼각형·라인 SVG (pieterkoopt 톤)
- 섹션 구분 + 키네틱 모션 (회전·축소)

### shadcn/ui 컴포넌트
Button (마그네틱 wrapper) · Card (페이퍼 변형) · Sheet (모바일 메뉴) · Dialog (라이트박스) · Tabs (`/builder/scenarios` 6 제품군 토글) · Tooltip (지도 마커, 자격증) · Progress (스크롤 인디케이터) · Switch (다크 토글) · Separator (디바이더)

---

## 10. 기술 스택

```
Next.js 16.x          App Router · Turbopack · View Transitions
React 19              with use() · Suspense
Tailwind CSS 4        @theme + tokens · CSS variables · 다크 .dark 클래스 또는 data-theme
TypeScript 5.9        strict
Pretendard Variable   한글 본문·디스플레이 (CDN: orioncactus/pretendard@v1.3.9)
Fraunces Variable     영문 디스플레이 (Google Fonts variable, 7 axes)
JetBrains Mono        메타 (Google Fonts)
GSAP 3.12             ScrollTrigger (무료) · 자체 SplitText 대안
Lenis 1.x             스무스 스크롤
Framer Motion 12      마이크로 인터랙션 + View Transitions 폴백
Recharts 2.x          반응형 차트
Visx 3.x              트리맵·네트워크
Lucide React          아이콘
shadcn/ui (Radix)     UI 컴포넌트
sharp                 webp/avif 변환 (206MB → 절반)
Playwright            URL 캡처 (Node 스크립트)
zod                   런타임 타입 검증 (자료 매니페스트)
```

**프로젝트 위치**: `/home/a20616050/projects/A/junginsu-portfolio-v3/`

---

## 11. URL 캡처 계획

### 캡처 대상 (총 50~70 URL × 2 viewport — 트렌디·풍부 룰)

> **사용자 룰**: AI 관련 SaaS는 트렌디·풍부 표현. 헤더 + 각 핵심 기능 별도 캡처 + 폴더 크롭. 평균 SaaS당 6~8 캡처.

**6 라이브 SaaS — 헤더 + 핵심 기능별 (약 40~50 url)**:

`tickpoint.co.kr` (라이브 — 8 캡처 후보):
- 홈 헤더 / 공포&탐욕 게이지 / VCP 시그널 스크리너 / 백테스트 KPI / 24개 이슈 종목 카드 / 종합 분석 (AI Logic + 차트) / 시장 현황 / 자동매매 화면

`lumio-video.vercel.app` (라이브 — 7 캡처 후보):
- 홈 헤더 / YouTube 탐색 5방식 / 씬 단위 스토리보드 / 이미지 모델 라우팅 4종 / 영상 모델 (Veo·Kling) / 씬별 편집 / CF 모드

`43.201.237.25:3010` (OS Agent 라이브 — 7 캡처 후보, 다운 시 폴더 폴백):
- 홈 헤더 / 20개 에이전트 라이브러리 / 12명 부서 인사카드 / HR 자연어 채팅 / 워크플로우 빌더 (React Flow) / 승인·결재 / 5월 캘린더

`frontend-three-smoky-68.vercel.app` (MKT Automation 라이브 — 8 캡처 후보):
- 홈 헤더 / 8 통합 영역 / 광고 카피 3 모드 / YouTube 분석 6 모드 / SNS 분석 / 자동 SEO 생성기 / 48+ 에이전트 그리드 / 카테고리 컬러 코딩

`propintel-ai-beta.vercel.app` (라이브 — 8 캡처 후보):
- 홈 대시보드 / 경영진 브리핑 / 사기방지 5탭 (각 1) / 시장 9탭 그리드 / 등기 타임라인 / 부동산 뉴스 모니터링

`architect-portfolio-lake.vercel.app` (라이브 — 7 캡처 후보):
- 홈 헤더 / 5단계 진단 (각 1) / 결과물 5탭 (로드맵·아키텍처·구현·문서·UI 설계) / Mermaid 시퀀스 / 디자인 토큰

**콘텐츠 url 15+** (자료 폴더 `MKT Automation/콘텐츠 레퍼런스/콘텐츠 레퍼런스.txt`):
- 네이버 블로그 sbcyberpass / 인스타 / 유튜브 / 노션 / 외부 사이트
- 무설탕젤리·종합소득세·지스타캐드·국가유공자·어린이유산균젤리·AHC Collagen·착한의사·서울철도엔지니어링·여기고기 등

**기타**:
- https://github.com/junginsu-make (헤더 + 84 저장소 그리드)
- 블로그 메인 https://blog.naver.com/sbcyberpass

### 폴더 크롭 (보조)
캡처 외에 자료 폴더 6 SaaS 스크린샷 (~57장)에서 핵심 기능별 크롭 가능:
- Tickpoint 폴더 15장 → VCP 스크리너·백테스트·자동매매 등 디테일 크롭
- Lumio 8장 → 스토리보드·CF 모드·이미지 모델 비교
- 등등 SaaS별 크롭

이 크롭본은 `public/cropped/<slug>/<feature>.jpg`로 저장 (자료 폴더 원본 미손상).

### 캡처 명세
- 뷰포트: 1440×900 (데스크탑) + 375×812 (모바일)
- 풀페이지 (`fullPage: true`)
- 저장: `public/captured/<slug>/{desktop,mobile}.jpg`
- 메타: `lib/captured-meta.json` (url · title · captured_at · w/h)
- 타임아웃 30s/url, 재시도 1회, 실패 url 텍스트 카드 폴백

### 실행 방식 — Node 스크립트 (글로벌 Playwright 순차 룰 회피)
- **`node scripts/capture-urls.ts`** (또는 `pnpm tsx scripts/capture-urls.ts`)
- Claude Code 내부 MCP `mcp__plugin_playwright_playwright__*` **사용 안 함** (한 메시지 1회 룰 비효율)
- 스크립트는 `playwright` npm 패키지 직접 import (룰 적용 외부)
- 빌드 시작 전 1회 Bash로 호출

### 캡처 스크립트 구조
- `scripts/capture-urls.ts` — 메인
- `scripts/url-list.json` — 캡처 대상 메타
- 출력: `public/captured/<slug>/{desktop,mobile}.jpg` + `lib/captured-meta.json`

---

## 12. 자료 매핑 (자료 폴더 빌드 룰 §9 기반)

| 자료 | 사용 페이지 | 사용 방식 |
|---|---|---|
| `정인수 이력서.pdf` | `/about`, `/career`, `/contact` (PDF 다운로드) | **6 임팩트 스트림** + 자기소개서(군대→사회복지→마케팅 17년→AI) + 봉사·교내활동·수상. 17 회사 풀 타임라인은 옵션 토글 |
| `정인수 증명사진 고화질.png` (15.8MB) | `/`, `/about` | 풀블리드 히어로 (mask reveal). 기존 (1)/(3)/(4) 미사용 |
| `강의 사진/` (56장) | `/marketing/teaching` | **자동 롤링 캐러셀 56장 풀** + 보조 16 그룹 라이트박스 (옵션 토글) |
| `강의 사진/강의경력.pdf` | `/marketing/teaching` | 3 Tier 분류 (Tier 1 정부·대학·AI 6 / Tier 2 협회·기업 8 / Tier 3 개인 텍스트 리스트) |
| `자격증 이미지/` (9 + PDF 1) | `/career` 자격증 섹션 | AI/마케팅 3개 비주얼 카드 + 나머지 6개 텍스트 (사용자 결정) |
| `make.com/` 11 스크린샷 + 4 핵심 + 인벤토리 PDF | `/builder/scenarios` | 4 핵심 메인 (시나리오별 다이어그램) + 11개월 타임라인 + 81 인벤토리 보조 |
| `make.com/automation_portfolio_fixed.pdf` (40p) | `/builder/scenarios` 보조 | 81 SYSTEM 풀카드 (시스템별 ID·모듈수·기술스택), 트리맵 + 토글 표 |
| `make.com/AI AUTOMATION PORTFOLIO-make.pdf` (12p) | `/contact` 다운로드 옵션 | 간결판 (이력서 첨부용) |
| `플랫폼 레퍼런스/{6 SaaS}/*` (~57장) | `/builder/[slug]` | **각 SaaS 폴더 안 모든 스크린샷 풀 갤러리** (큐레이션 X — 룰 §1) |
| `MKT Automation/콘텐츠 레퍼런스/콘텐츠 레퍼런스.txt` | `/marketing/content` | 15+ url Playwright 캡처 후 카드 |
| `MKT Automation/콘텐츠 레퍼런스/구글블로그/01_K-beauty global trend.html` | `/marketing/content` | 실제 발행물 iframe 또는 모달 미리보기 |
| `홈페이지 레퍼런스 url.txt` | (디자인 영감용) | 사이트에 노출 X. 빌드 톤·인터랙션 가이드 |
| **교육자료** (GPT pptx + Pltt PDF) | **사용 안 함** | 사용자 결정 — 강의 사진으로 대체 |
| **기존 증명사진 (1)/(3)/(4)** | **사용 안 함** | 새 고화질로 대체 |
| 강의 mp4 (1.79GB) | (옵션 — 시간 여유 시) | 30초 클립 재인코딩 후 `/marketing/teaching` 히어로 비디오 |

---

## 13. 검증 기준 (KPI)

### 콘텐츠 KPI (회장 5분 시뮬레이션)
- [ ] 5초: 홈 첫 화면에서 "AI 풀사이클 빌더 + 17년 마케터" 인지
- [ ] 30초: 마케팅·AI 영향력 시각 증거 (차트·다이어그램·사진) — 회사명이 아닌 임팩트 위주
- [ ] 1분: 6 SaaS 라이브 인지 (홈 사이클 또는 `/builder` 인덱스 5 bullet 카드)
- [ ] 2분: make.com 4 핵심 시나리오 인지 (PDF 인벤토리 81 SYSTEM과 분리)
- [ ] 3분: 강의 영향력 — KOICA·정부 부처·AI 교육 4곳·대학 메인 + 사진 캐러셀
- [ ] 4분: AI/마케팅 자격증 3 + 6 임팩트 스트림 (필요시 17 회사 풀 토글)
- [ ] 5분: 9843ohs@gmail.com 컨택 가능

### 디자인 KPI
- [ ] **다크 + 라이트 둘 다 풀 디자인 완성도** (별도 시각 검증)
- [ ] 모든 페이지 컬러 스윕 페이지 전환 작동
- [ ] 호버 반전 인터랙션 (모든 클릭 가능 요소)
- [ ] 디스플레이 폰트 SOFT/WONK axis 변형 작동 (홈 매니페스토)
- [ ] 마그네틱 커서 (CTA · 6 SaaS 행 · 토글)
- [ ] 폰트 대비: 라이트 #1B1B1B / 다크 #F4F0E6 — 본문 7:1+, 메타 4.5:1+
- [ ] AI 디폴트 패턴 X — `whileInView` 단순 fade-up 미사용 검증
- [ ] AI SaaS 디테일 페이지 트렌디·풍부 — 6 SaaS 평균 6~8 캡처/크롭, 5+ 능력 풀, 라이브 헤더 + 폴더 갤러리

### 자료 KPI
- [ ] make.com 4 핵심 = 리스트.txt 정답 100% 일치
- [ ] make.com 81 SYSTEM 인벤토리 = 보조 라벨 명시 (메인 X)
- [ ] **make.com vs GitHub 절대 합산 X** (4 vs 84 별도)
- [ ] 클라이언트 작업(서울법무법인 SYSTEM 24-32 등) 메인에 노출 X
- [ ] 글로리아교육재단 "자동화" 표현 절대 X (정정된 마케팅·B2B 표현)
- [ ] TMON ROAS 7,404% / NGO 마음하나 X (출처 미검증)
- [ ] AI/마케팅 자격증 3개 비주얼 + 나머지 6개 텍스트 (사용자 결정)
- [ ] 새 고화질 증명사진 사용 (기존 (1)(3)(4) 미사용)
- [ ] 캡처 50~70 URL 모두 박혀있음 (실패 시 텍스트 카드 또는 폴더 크롭 폴백)
- [ ] 6 SaaS 폴더 안 모든 스크린샷 갤러리 + 헤더 라이브 캡처 + 기능별 크롭 (룰 §1)
- [ ] **`/career` 회사 강조 X · 6 임팩트 스트림 메인** (사용자 후속 룰)
- [ ] **`/marketing/teaching` 강의처 다 나열 X · 3 Tier (정부·기업·AI 메인 / 협회 보조 / 개인 텍스트) · 사진 자동 롤링 캐러셀** (사용자 후속 룰)

### 기술 KPI
- [ ] 모바일 375px / 768px / 데스크탑 1440px / 와이드 2560px 깨짐 없음
- [ ] Lighthouse 90+ (성능·접근성·SEO·베스트프랙티스) — 라이트·다크 모드 각각
- [ ] 모든 페이지 콘솔 에러 0
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] production 빌드 성공
- [ ] View Transitions 미지원 브라우저 폴백 작동

### 페이지별 5 자문 (모두 "예")
매 페이지 빌드 후 자료 폴더 빌드 룰 §10 5 질문 통과 확인.

---

## 14. 범위 외 (이번엔 안 함)

- 강의 영상 (1.79GB mp4) 메인 임베드 — 30초 클립은 옵션
- 교육자료 PPTX/PDF 변환 또는 임베드 (사용자 제외)
- 기존 v2 마이그레이션 — 보존만
- 다국어 (한국어만, 디스플레이 영문 라벨 일부)
- 블로그/CMS 백오피스
- 결제·뉴스레터 폼 (mailto만)
- E2E 테스트 자동화 (수동 검증 + Lighthouse만)

---

## 15. 위험 / 미정

### 위험
- **Playwright URL 캡처 시간**: 50~70 URL × 2 viewport = 100~140 캡처 (트렌디·풍부 룰로 SaaS당 6~8 url). Node 스크립트 일괄로 60~90분 예상. 일부 URL 다운/로그인 게이트 가능 — 폴더 크롭 폴백
- **GSAP ScrollTrigger 라이선스**: 무료 사용 OK (premium 플러그인 없음)
- **View Transitions 브라우저 지원**: Chrome/Edge 111+, Safari 18+. Firefox 폴백 (framer-motion AnimatePresence)
- **Pretendard + Fraunces 변수폰트 페이로드**: 합 ~150KB → 폰트 서브세팅 (한글 KS 2350자만)
- **OS Agent 라이브 URL** (`http://43.201.237.25:3010/`) — IP 직접 노출, 다운 가능성. 폴더 10장이 폴백
- **이미지 206MB+** — sharp webp/avif 변환 (절반 이하 목표)
- **다크 + 라이트 둘 다 풀 완성도** — 작업량 약 1.5배. 두 모드 별도 시각 검증 필요
- **GitHub 신규 3 저장소** — 81→84 차이. 빌드 시 `gh repo list` 직접 호출로 보강

### 미정 (구현 단계 결정)
- `/builder/github` 옵션 페이지 — 콘텐츠 깊이 결정 후 (84 카테고리 풀 vs 5 그룹 요약만)
- `/playground` 옵션 페이지 — 시간 여유 시
- 모바일 `/builder` 가로 도크 → 세로 스택 폴백 디테일
- 다크 모드 오렌지 채도 (`#FF7A1F` 가설, 시각 검증 후 조정)
- 콘텐츠 url 캡처 우선순위 (`콘텐츠 레퍼런스.txt` 풀 정독 후 캡처 시도, 다운/로그인은 텍스트 폴백)
- 강의 mp4 30초 클립 재인코딩 (시간 여유 시)
- GitHub 84 카테고리 신규 3 저장소 보강 시점

---

## 16. 다음 단계

1. ✅ 디자인 스펙 1차 작성
2. ✅ 사용자 1차 피드백 수렴 (글로리아 정정, 자격증 3+6, 다이나믹·프리미엄·다크/라이트 둘 다)
3. ✅ 자료 폴더 5 문서 + 이력서 PDF + 강의경력 PDF 풀 정독
4. ✅ 디자인 스펙 2차 정정 (이 문서)
5. ⏳ 사용자 2차 spec 검토
6. ⏳ writing-plans 스킬로 구현 계획 수립
7. ⏳ Playwright URL 캡처 일괄 실행 (Node 스크립트)
8. ⏳ Next.js 16 프로젝트 init
9. ⏳ 빌드 시작
