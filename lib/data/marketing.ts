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

/** 공공기관 제안서·PT·종합홍보 PM 운영 이력 (자료: 정인수 이력서.pdf 페이지 2-3) */
export type PublicAgency = {
  name: string;
  category: "정부 부처" | "공공기관" | "공기업" | "지자체" | "NGO";
  role: string;
  period?: string;
};

export const PUBLIC_AGENCIES: PublicAgency[] = [
  {
    name: "농림축산식품부",
    category: "정부 부처",
    role: "소셜미디어·마케팅 홍보 영역 PM",
    period: "Capsule Media",
  },
  {
    name: "조달청",
    category: "정부 부처",
    role: "소셜미디어·마케팅 홍보 영역 PM",
    period: "Capsule Media",
  },
  {
    name: "한국벤처투자",
    category: "공공기관",
    role: "과업 총괄 PM",
    period: "Capsule Media",
  },
  {
    name: "창업진흥원",
    category: "공공기관",
    role: "2023년도 과업 총괄 PM",
    period: "Capsule Media",
  },
  {
    name: "서울관광공사",
    category: "공기업",
    role: "제안서 작성 + 제안 PT 발표",
    period: "퍼포먼스디자인",
  },
  {
    name: "연수구청",
    category: "지자체",
    role: "제안서 작성 + 제안 PT 발표",
    period: "퍼포먼스디자인",
  },
  {
    name: "한국산림복지진흥원",
    category: "공공기관",
    role: "AI 교육 강의",
    period: "솔찍한인쌤",
  },
  {
    name: "성동청년창업이룸센터",
    category: "지자체",
    role: "AI 교육 강의 + 콘텐츠 운영",
    period: "팔레트 ㈜ + 솔찍한인쌤",
  },
  {
    name: "제2서울핀테크랩",
    category: "공공기관",
    role: "AI 교육 강의 + 콘텐츠 운영",
    period: "팔레트 ㈜",
  },
  {
    name: "고려대학교기술지주",
    category: "공공기관",
    role: "AI 교육 강의 + 콘텐츠 운영",
    period: "팔레트 ㈜",
  },
  {
    name: "국제협력단 KOICA",
    category: "공공기관",
    role: "해외봉사단 고향방문단 국내 교육",
    period: "솔찍한인쌤",
  },
  {
    name: "서울도시철도엔지니어링",
    category: "공기업",
    role: "콘텐츠 운영",
    period: "팔레트 ㈜",
  },
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
