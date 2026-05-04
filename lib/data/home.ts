export const MANIFESTO =
  "AI 시대를 만난 17년 마케터가, 풀사이클 빌더로 다시 태어났다";

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
  { value: "43", suffix: "", label: "GitHub Repos" },
  { value: "81", suffix: "", label: "Make.com 시스템 (4 핵심)" },
  { value: "6", suffix: "", label: "Live SaaS" },
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
      "GPT-4o / o1",
      "Gemini 3.1 Pro",
      "Perplexity",
      "Flux Pro 2",
      "Veo 3.1",
      "Kling v3 Pro",
      "Nano Banana Pro",
      "GPT Image 2",
      "Suno",
      "ElevenLabs",
      "Castsome",
      "Whisper TTS",
    ],
  },
  {
    category: "워크플로우 / 자동화",
    items: [
      "Make.com",
      "n8n",
      "LangGraph",
      "APScheduler",
      "MCP (Model Context Protocol)",
    ],
  },
  {
    category: "데이터 수집·검색",
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

export const CTA_QUOTE = "커피 한 잔이면 됩니다";
export const CONTACT_EMAIL = "9843ohs@gmail.com";
