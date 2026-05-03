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
};

export const COMPANY_AD_BUDGET: CompanyAdBudget[] = [
  {
    company: "퍼포먼스디자인",
    budget: "연 40~60억",
    note: "티몬 공식 광고대행 9개월",
  },
  {
    company: "퍼스트 아카데미",
    budget: "연 20억+",
    note: "전국 30지점 1년 3개월",
  },
];
