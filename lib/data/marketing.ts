// AI SaaS PL 클라이언트 4건은 AI 빌더 영역으로 이동됨.
// 새 위치: lib/data/builder-clients.ts → AI_SAAS_PL_CLIENTS
// /builder 인덱스 페이지에서 별도 섹션으로 노출.

export const AI_CONTENT_OP_CLIENTS = [
  "성동청년이룸창업지원센터",
  "고려대학교기술지주",
  "제2서울핀테크랩",
  "서울도시철도엔지니어링",
  "시스트란",
  "모두솔루션",
  "리부트라이프",
];

export type CapsuleProject = {
  name: string;
  role: string;
};

export const CAPSULE_PM_PROJECTS: CapsuleProject[] = [
  { name: "농림축산식품부", role: "소셜미디어·마케팅 홍보 영역 PM" },
  { name: "조달청", role: "소셜미디어·마케팅 홍보 영역 PM" },
  { name: "한국벤처투자", role: "과업 총괄 PM" },
  { name: "창업진흥원", role: "2023년도 과업 총괄 PM" },
];

export const CAPSULE_PM_OTHERS = "+14건";

export const AD_CHANNELS = {
  owned: ["Blog", "SNS", "YouTube"],
  paid: ["Naver", "Kakao", "Google", "Instagram", "Facebook", "GDN"],
};

export type CompanyAdBudget = {
  company: string;
  budget: string;
  note: string;
  metrics?: {
    roas?: string;
    gr?: string;
    bu?: string;
    cpbu?: string;
  };
};

export const COMPANY_AD_BUDGET: CompanyAdBudget[] = [
  {
    company: "퍼포먼스디자인 — 티몬 광고대행",
    budget: "연 40~60억",
    note: "운영총괄실장 (2022.08~2023.04)",
    metrics: {
      roas: "3,516% → 7,404% (▲ 3,888%p)",
      gr: "208억 → 288억 (▲ 79.4억+)",
      bu: "94,153 → 180,713 (▲ 86,560명)",
      cpbu: "4,709원 → 2,365원 (▼ -50% 절감)",
    },
  },
  {
    company: "퍼스트 아카데미 본사",
    budget: "연 20억+",
    note: "마케팅 총괄팀장 (2021.03~2022.05) — 전국 30지점·카페 4지점",
  },
];

/**
 * TMON ROAS 검증 출처 — 사용자 직접 작성한 마스터 자료.
 * `/home/a20616050/projects/A/포토폴리오-260503/개인 포토폴리오-23.03.02.pdf`
 *
 * 변환된 차트 이미지는 `/marketing-portfolio/page-01.{jpg,webp,avif,png}` 로 사용.
 */
export const TMON_PORTFOLIO_PERIOD = "2022.07 중순 ~ 2023.02.20";
export const TMON_PORTFOLIO_SOURCE = "/marketing-portfolio/page-01.jpg";

/**
 * TMON 월별 ROAS 12개월 추이 — 막대 차트용
 * 자료: 정인수_정인수_포토폴리오-23.03.03.pdf (정인수 본인 작성)
 * 운영 시작: 2022.07 / 정점: 2023.02
 */
export type TmonMonthly = {
  month: string;
  roas: number;
  phase: "이전" | "운영 시작" | "운영" | "정점";
  highlight?: boolean;
};

export const TMON_ROAS_MONTHLY: TmonMonthly[] = [
  { month: "2022.03", roas: 1084, phase: "이전" },
  { month: "2022.04", roas: 1085, phase: "이전" },
  { month: "2022.05", roas: 1985, phase: "이전" },
  { month: "2022.06", roas: 3301, phase: "이전" },
  { month: "2022.07", roas: 3516, phase: "운영 시작", highlight: true },
  { month: "2022.08", roas: 4335, phase: "운영" },
  { month: "2022.09", roas: 6648, phase: "운영" },
  { month: "2022.10", roas: 6529, phase: "운영" },
  { month: "2022.11", roas: 5930, phase: "운영" },
  { month: "2022.12", roas: 6494, phase: "운영" },
  { month: "2023.01", roas: 6822, phase: "운영" },
  { month: "2023.02", roas: 7404, phase: "정점", highlight: true },
];

/** TMON 비포/애프터 정량 메트릭 — 직접 컴포넌트로 시각화 */
export const TMON_BEFORE_AFTER = [
  {
    label: "ROAS",
    before: "3,516%",
    after: "7,404%",
    delta: "▲ 3,888%P",
    direction: "up" as const,
    note: "광고 효율",
  },
  {
    label: "GR (총매출)",
    before: "208억",
    after: "288억",
    delta: "▲ 79.4억+",
    direction: "up" as const,
    note: "9개월 누적",
  },
  {
    label: "BU (신규 회원)",
    before: "94,153",
    after: "180,713",
    delta: "▲ 86,560명",
    direction: "up" as const,
    note: "1인당 가입",
  },
  {
    label: "CPBU (회원 획득 단가)",
    before: "4,709원",
    after: "2,365원",
    delta: "▼ 50% 절감",
    direction: "down" as const,
    note: "효율 개선",
  },
];

/** 공공기관 제안서·PT·종합홍보 PM 운영 이력 (자료: 정인수 이력서.pdf 페이지 2-3)
 *  abbr: 카드 좌상단 wordmark 박스에 표시할 약어.
 *  logo: 옵셔널. 명시 시 해당 경로의 이미지로 wordmark 대체 (사용자 추후 SVG 추가용). */
export type PublicAgency = {
  name: string;
  slug: string;
  abbr: string;
  category: "정부 부처" | "공공기관" | "공기업" | "지자체" | "NGO";
  role: string;
  period?: string;
  logo?: string;
};

export const PUBLIC_AGENCIES: PublicAgency[] = [
  { name: "농림축산식품부", slug: "mafra", abbr: "농식품부", category: "정부 부처", role: "종합홍보 용역 PM" },
  { name: "조달청", slug: "pps", abbr: "조달청", category: "정부 부처", role: "종합홍보 용역 PM" },
  { name: "농촌진흥청", slug: "rda", abbr: "농진청", category: "정부 부처", role: "종합홍보 용역 PM" },
  { name: "국가기술표준원", slug: "kats", abbr: "기표원", category: "정부 부처", role: "종합홍보 용역 PM" },
  { name: "제외동포청", slug: "oka", abbr: "재외동포청", category: "정부 부처", role: "종합홍보 용역 PM" },
  { name: "한국벤처투자", slug: "kvic", abbr: "KVIC", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "KOTRA", slug: "kotra", abbr: "KOTRA", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "KOICA", slug: "koica", abbr: "KOICA", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "한국산업단지공단", slug: "kicox", abbr: "KICOX", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "언론중재위원회", slug: "pac", abbr: "언론중재", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "창업진흥원", slug: "kised", abbr: "KISED", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "한국가스기술공사", slug: "kogas-tech", abbr: "KOGAS-Tech", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "지역문화활용", slug: "rcc", abbr: "지역문화", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "서울문화재단", slug: "sfac", abbr: "SFAC", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "한국문화유산연구회", slug: "khra", abbr: "KHRA", category: "공공기관", role: "종합홍보 용역 PM" },
  { name: "한국지역난방공사", slug: "kdhc", abbr: "KDHC", category: "공기업", role: "종합홍보 용역 PM" },
  { name: "서울관광공사", slug: "stto", abbr: "STTO", category: "지자체", role: "종합홍보 용역 PM" },
  { name: "서울대공원", slug: "grandpark", abbr: "서울대공원", category: "지자체", role: "종합홍보 용역 PM" },
];

/** 민간기업 디지털 마케팅 대행 (TMON 외) */
export const PRIVATE_CLIENTS = [
  { name: "티몬 (TMON)", note: "공식 광고대행, 연 40~60억 광고비 총괄" },
  { name: "성형외과", note: "검색·SNS 광고 운영" },
  { name: "이커머스", note: "퍼포먼스 마케팅 운영" },
  { name: "교육업", note: "전국 30지점 광고 운영" },
];

/** 마케팅 전문 분야 (자료: 정인수 이력서.pdf 페이지 3) */
export const MARKETING_SPECIALTIES = [
  {
    category: "Search Engine Optimization",
    items: ["Web SEO", "Naver Blog SEO", "Naver Place SEO", "Naver Shopping SEO"],
  },
  {
    category: "Search Ad",
    items: ["Google Ads", "Naver 검색광고", "Kakao 검색광고"],
  },
  {
    category: "Display Ad",
    items: ["Google Display", "Naver DA", "SNS Display", "Kakao Display", "GDN"],
  },
  {
    category: "Demand Side Platform",
    items: ["DSP 광고 운영"],
  },
  {
    category: "Viral · Review",
    items: ["Naver Blog 바이럴", "SNS 바이럴", "Review Marketing"],
  },
  {
    category: "Analysis",
    items: ["Naver Analytics", "Google Analytics", "App Tracking"],
  },
];

/** 광고비 운영 추가 디테일 (자료: 정인수 이력서.pdf 페이지 4) */
export const AD_BUDGET_HIGHLIGHTS = [
  { label: "월 검색광고 운영", value: "1억+", source: "퍼스트 아카데미 시기" },
  { label: "월 SNS 광고 운영", value: "1억+", source: "퍼스트 아카데미 시기" },
  { label: "월 광고비 절감", value: "3,000만", source: "퍼스트 아카데미 시기" },
  { label: "상위 1% 개인 블로그", value: "6개", source: "자체 보유 운영" },
];

/**
 * 마케팅 경력 진화 — 6 milestone (자료: 정인수 이력서.pdf 페이지 2-5)
 * /career 임팩트 스트림과 다른 각도 — 시간순 + 회사별 마케팅 케이스 디테일
 */
export type MarketingMilestone = {
  number: string;
  period: string;
  era: string;
  company: string;
  role: string;
  highlight: string;
  scale?: string;
  bullets: string[];
};

export const MARKETING_TIMELINE: MarketingMilestone[] = [
  {
    number: "01",
    period: "2017.06 ~ 2020.05 · 3년",
    era: "입학·홍보 마케팅",
    company: "글로리아교육재단 ㈜",
    role: "입학관리처 팀장 3년차",
    highlight:
      "한국항공/국제호텔전문 — 디지털 채널 풀스택 + B2B/B2C 통합 운영",
    bullets: [
      "온라인 디지털마케팅 — 블로그·지식인·파워링크·파워컨텐츠 풀세트",
      "B2B — 전국 고교·학원 방문 홍보 (오프라인 채널 직접 운영)",
      "B2C — 입학상담·유치 직접 담당",
      "개인 블로그 + 홈페이지 운영 관리",
    ],
  },
  {
    number: "02",
    period: "2020.06 ~ 2021.03 · 10개월",
    era: "평생교육 입학 총괄",
    company: "중앙대학교 사회교육처",
    role: "실장",
    highlight:
      "평생교육원 입학·홍보 모집 총괄 + 광고대행사 관리 + DA·네이버 애널리틱스 운영",
    bullets: [
      "입학 관련 전 과정 신규 기획 + 리딩",
      "신규 DB / 등록생 / 재학생 관리 + 실무자",
      "DA · 네이버 애널리틱스 분석 및 활용",
      "홈페이지 및 홍보물 리뉴얼 + 신규 제작",
      "광고대행사 관리 + 자체 온·오프라인 홍보 전략 기획·실무",
    ],
  },
  {
    number: "03",
    period: "2021.03 ~ 2022.05 · 1년 3개월",
    era: "프랜차이즈 마케팅 총괄",
    company: "퍼스트 아카데미 본사",
    role: "마케팅 총괄팀장",
    highlight:
      "전국 30지점·카페 4지점 마케팅 총괄 — 연 20억+ 광고비",
    scale: "월 1억+ 검색광고 · 월 1억+ SNS · 월 3,000만 절감",
    bullets: [
      "월 3,000만원 광고비 절감 + 광고 효과·신규 고객 유입 상승",
      "마케팅 비용 연 20억원 이상 집행·관리",
      "네이버 검색광고 (월 1억원+) 기본 세팅·운영·분석",
      "SNS (월 1억원+) 광고 집행 관리 + 페이스북·인스타그램 비즈니스",
      "네이버 VIEW (2일간 약 100건+ 포스팅) 상위노출 성공",
      "상위 1% 개인 블로그 6개 자체 보유 → 즉시 활용 가능",
    ],
  },
  {
    number: "04",
    period: "2022.05 ~ 2022.08 · 4개월",
    era: "광고대행사 전략실",
    company: "프랜차이즈산업연구원",
    role: "마케팅 책임연구원 / 실장",
    highlight: "광고대행사 마케팅 전략 총괄 실장",
    bullets: [
      "광고대행사 마케팅 전략실 운영",
      "퍼포먼스디자인 합류 직전 단기 시기",
    ],
  },
  {
    number: "05",
    period: "2022.08 ~ 2023.04 · 9개월",
    era: "이커머스 광고대행 운영총괄",
    company: "퍼포먼스디자인",
    role: "전략마케팅1실·소셜바이럴팀 운영총괄실장",
    highlight:
      "이커머스 티몬 공식 대행사 + 화장품·가전·성형외과 + 나라장터(공공)",
    scale: "TMON 연 40~60억 광고비 총괄 · ROAS 7,404% 달성",
    bullets: [
      "이커머스 티몬 공식 광고대행사, 연 40~60억 광고비 총괄 운영관리",
      "화장품·가전제품·성형외과 등 제안서 작성 + 제안 PT 발표",
      "나라장터 (서울관광공사·연수구청·NGO 등) 제안서 작성·PT 발표",
      "Search Engine Optimization (Web · Naver Blog · Place · Shopping)",
      "Search Ad (Google · Naver · Kakao) + Display Ad + DSP",
      "Viral Marketing + Review Marketing + Analysis (Naver · Google · App)",
      "광고 운영 결과 보고서 + 광고주·광고대행사 관리",
    ],
  },
  {
    number: "06",
    period: "2023.04 ~ 재직중",
    era: "AI Builder + 마케팅 융합",
    company: "팔레트 ㈜",
    role: "Agent 본부",
    highlight:
      "마케팅 17년 + AI Builder — 풀사이클로 콘텐츠·자동화·데이터를 한 명이",
    scale: "AI SaaS PL 4건 · Content Op 7+ · Capsule PM 20+",
    bullets: [
      "Vibe Coding으로 100+ 자체 시스템 1인 개발",
      "자동화 시나리오 · n8n으로 콘텐츠 자동화·데이터 수집·웹스크랩 시스템 구축",
      "AI Prompt SEO + 멀티 LLM 통합 (Claude · GPT · Gemini · Perplexity)",
      "AI SaaS PL 4건 — 호반·서울법무법인·아주그룹·Palette OS Agent",
      "AI Content Operation 7+ 클라이언트 — 성동청년이룸·고려대기술지주·시스트란 외",
      "Capsule Media 종합홍보 PM — 농림축산·조달청·한국벤처투자·창업진흥원 + 14건",
    ],
  },
];
