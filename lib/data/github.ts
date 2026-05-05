// 2026-05-04 시점 외부 공개 43개 (https://api.github.com/users/junginsu-make → public_repos: 43).
// private 41개는 클라이언트 작업 · 실험 비공개.
export const GITHUB_TOTAL = 43;
export const GITHUB_PROFILE = "https://github.com/junginsu-make";

export type GithubCategory = {
  id: string;
  name: string;
  count: number;
  examples: string[];
};

export const GITHUB_CATEGORIES: GithubCategory[] = [
  {
    id: "A",
    name: "대표 시스템 (AI Agent / 마케팅 / 금융 / 영상 / 이미지 / 문서)",
    count: 25,
    examples: [
      "synapse-platform",
      "propintel-ai",
      "stock-training",
      "palette-hoban-develop",
      "cinema_AI",
      "MARKETING_SEO_AUTOMATION",
      "AD_Copy",
      "Image_Agent",
      "legal-agent",
    ],
  },
  {
    id: "B",
    name: "Claude Code 생태계",
    count: 6,
    examples: [
      "claude-forge",
      "my-claude-code-setting",
      "claude-code-skills",
      "frontend-toolkit",
      "spec-kit",
      "claw-code",
    ],
  },
  {
    id: "C",
    name: "Frontend Stack 큐레이션 (학습용 fork)",
    count: 8,
    examples: [
      "shadcn-landing-page",
      "next-shadcn-dashboard-starter",
      "SaaS-Boilerplate",
      "zustand",
      "motion",
      "query",
      "recharts",
    ],
  },
  {
    id: "D",
    name: "외부 도구 · 학습 fork",
    count: 2,
    examples: [
      "hwp-open-source",
      "NAVER_NESS",
    ],
  },
  {
    id: "E",
    name: "Misc/부속",
    count: 2,
    examples: [
      "2026-New-Year-s-Fortune",
      "suno-api",
    ],
  },
];

export const GOLDEN_PRINCIPLES = [
  "Immutability",
  "Secrets in Env",
  "TDD (RED-GREEN-IMPROVE)",
  "Conclusion First",
  "Small Files (800 · 50 라인)",
  "Validate at Boundaries",
  "Explain with Analogies",
  "Context 50% Rule",
  "HARD-GATE: No Coding Without Design",
  "Evidence-Based Completion",
  "SDD Review Enforcement",
  "Surgical Changes",
];
