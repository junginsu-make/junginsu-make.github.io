export type AiSaasPlClient = {
  name: string;
  domain: string;
  scope: string;
  status: "in-progress" | "delivered";
};

/**
 * AI SaaS PL 클라이언트 — 정인수가 PL로 시스템 기획 + 개발 리딩 중인 4건.
 * 마케팅이 아니라 AI 빌더 영역. 회사 강조 X · 시스템 · 성과 강조.
 */
export const AI_SAAS_PL_CLIENTS: AiSaasPlClient[] = [
  {
    name: "대형 건설·부동산 그룹",
    domain: "건설 · 부동산 · 그룹사",
    scope: "사내 AI 시스템 PL · 기획 + 개발 리딩",
    status: "in-progress",
  },
  {
    name: "대형 법무법인",
    domain: "법무 · B2B SaaS",
    scope: "법률 자동화 SaaS PL · 멀티 LLM 라우팅",
    status: "in-progress",
  },
  {
    name: "대기업 그룹사",
    domain: "그룹사 · 다업종",
    scope: "그룹 통합 AI 시스템 PL · 사내 자동화",
    status: "in-progress",
  },
  {
    name: "Palette OS Agent",
    domain: "사내 AI OS · Synapse",
    scope: "12 가상직원 + 20 AI 에이전트 OS 기획 · 구축",
    status: "in-progress",
  },
];
