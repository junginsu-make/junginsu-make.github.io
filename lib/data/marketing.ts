export const AI_PL_CLIENTS = [
  "호반그룹",
  "서울법무법인",
  "아주그룹",
  "Palette OS Agent",
];

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
