export const MANIFESTO =
  "AI 시대를 만난 17년 Marketer가, AI Builder로 다시 태어났습니다";

// AI 사용 슬로건 — "얼마나 많은 AI를 직접 써봤는지(폭)" + "3년 AI 사용료 1억+ 실전 투자"
export type AiUsageStat = { to: number; suffix: string; duration: number; label: string };

export const AI_USAGE = {
  eyebrow: "AI IN PRACTICE",
  headlineLead: "빠르게 변하는 AI 시장,",
  headlineMain: "분야를 가리지 않고 ",
  headlineAccent: "직접 써봅니다",
  // 8개 분야 — 스태거 애니메이션으로 "전 영역"을 시각적으로 증명
  categories: ["텍스트", "코딩", "이미지", "영상", "음성", "발표", "리서치", "자동화"],
  stats: [
    { to: 100, suffix: "+", duration: 1.4, label: "직접 써본 AI 도구" },
    { to: 100_000_000, suffix: "+", duration: 2.0, label: "3년 AI 사용료 (원)" },
  ] as AiUsageStat[],
  bodyLines: [
    "새 도구가 나올 때마다 직접 결제해 써보며 검증했습니다.",
    "3년간 AI 사용료로만 1억+. 수많은 시행착오가 곧 지금의 판단 기준이 됐습니다. 무엇을 언제 써야 하는지는, 결국 다 써본 사람만 압니다.",
  ],
};

/**
 * 홈 "왜 다른가" 섹션 — 수량이 아니라 판단 기준을 보여주는 자리.
 * 각 항목은 실제 시스템의 거부 기준에서 뽑았다 (lib/data/saas-differentiation.ts).
 * slug는 해당 SaaS 상세 페이지로 연결된다.
 */
export type RefusalHighlight = {
  slug: string;
  system: string;
  rule: string;
};

export const WHY_DIFFERENT = {
  eyebrow: "WHAT MAKES THEM DIFFERENT",
  headlineLead: "AI로 만드는 사람은 많습니다.",
  headlineMain: "결과물의 합격 기준을 아는 사람이 만든 시스템은 ",
  headlineAccent: "다릅니다",
  bodyLines: [
    "각 시스템은 무엇을 만드는지가 아니라 무엇을 내보내지 않는지로 구분됩니다.",
    "아래는 실제로 코드가 거부하는 것들입니다.",
  ],
  highlights: [
    {
      slug: "shopping-insight",
      system: "Naver Shopping Insight",
      rule: "순위로 매출을 역산하지 않습니다",
    },
    {
      slug: "factto",
      system: "Factto",
      rule: "경쟁 글의 문장은 시스템 안으로 들어오지 않습니다",
    },
    {
      slug: "tickpoint",
      system: "Tickpoint",
      rule: "데이터가 오래되면 신호 자체를 만들지 않습니다",
    },
    {
      slug: "os-agent",
      system: "OS Agent",
      rule: "AI가 결재를 건너뛰겠다고 해도 코드가 막습니다",
    },
  ] as RefusalHighlight[],
  ctaLabel: "시스템별 전체 보기",
  ctaHref: "/builder",
};

export const HERO_META = {
  name: "정인수",
  birth: "1983",
  city: "서울",
};

export type Counter = {
  value: string;
  suffix: string;
  label: string;
};

export const COUNTERS: Counter[] = [
  { value: "17", suffix: "년", label: "Career" },
  { value: "43", suffix: "", label: "Vibe Coding Repos" },
  { value: "81", suffix: "", label: "자동화 시나리오" },
  { value: "10", suffix: "", label: "Live SaaS" },
];

export type TechCategory = {
  category: string;
  items: string[];
};

// 6 카테고리 50+ 항목 — 사용자 요청에 따라 풍부화
export const TECH_STACK: TechCategory[] = [
  {
    category: "AI 모델",
    items: [
      "Claude",
      "GPT",
      "Gemini",
      "Perplexity",
      "Flux",
      "Veo",
      "Kling",
      "Nano Banana",
      "GPT Image",
      "Suno",
      "ElevenLabs",
      "Castsome",
      "Whisper TTS",
    ],
  },
  {
    category: "워크플로우 / 자동화",
    items: [
      "자동화 시나리오",
      "n8n",
      "LangGraph",
      "APScheduler",
      "MCP (Model Context Protocol)",
    ],
  },
  {
    category: "데이터 수집 · 검색",
    items: [
      "SerpAPI",
      "Apify",
      "DataForSEO",
      "Naver API",
      "YouTube Data API",
      "RSS / HTTP",
      "Bizinfo (정부지원)",
      "GA4",
    ],
  },
  {
    category: "발행 / SNS",
    items: [
      "WordPress REST",
      "Instagram Graph",
      "YouTube Upload",
      "TikTok",
      "Naver Blog",
      "Solapi (KakaoTalk)",
      "Slack",
      "Google Chat",
    ],
  },
  {
    category: "문서 / 파일",
    items: [
      "Airtable",
      "Notion",
      "Google Docs",
      "Google Drive",
      "Dropbox",
      "PDF.co OCR",
      "CloudConvert",
    ],
  },
  {
    category: "프레임워크 / 인프라",
    items: [
      "Next.js 16",
      "React 19",
      "Vite",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Supabase",
      "PostgreSQL",
      "Redis",
      "Qdrant",
      "Neo4j",
      "AWS EC2",
      "Vercel",
      "Docker",
      "FastAPI",
      "Python 3.12",
    ],
  },
];

// 호환성 위해 flat 도출 (기존 import 유지)
export const TECH_BADGES = TECH_STACK.flatMap((c) => c.items);

export const CONTACT_EMAIL = "9843ohs@gmail.com";
