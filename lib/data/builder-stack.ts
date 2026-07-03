/**
 * make.com 자동화 스택 (자료: AI AUTOMATION PORTFOLIO-make.pdf 페이지 3)
 * 노드/에어테이블 캡처 이미지 대신 직접 컴포넌트로 시각화
 */

export type StackTool = {
  category: string;
  glyph: string;
  name: string;
  vendor: string;
  usage: string;
  isHub?: boolean;
};

export const MAKE_STACK_TOOLS: StackTool[] = [
  {
    category: "자동화 허브",
    glyph: "⚙",
    name: "자동화 시나리오",
    vendor: "Make",
    usage: "모든 시스템의 중심 — API 연동 · 조건 분기 · 스케줄링",
    isHub: true,
  },
  {
    category: "AI 언어모델",
    glyph: "✦",
    name: "Claude AI",
    vendor: "Anthropic",
    usage: "고품질 블로그 글 생성 · 데이터 분석 · 전략 기획",
  },
  {
    category: "AI 언어모델",
    glyph: "◐",
    name: "ChatGPT",
    vendor: "OpenAI",
    usage: "콘텐츠 초안 · 요약 · 번역, Vision으로 명함 인식",
  },
  {
    category: "AI 리서치",
    glyph: "⌕",
    name: "Perplexity AI",
    vendor: "Perplexity",
    usage: "실시간 웹 검색 기반 최신 정보 수집 · 팩트체크",
  },
  {
    category: "AI 이미지",
    glyph: "✿",
    name: "Midjourney",
    vendor: "useapi",
    usage: "블로그 · SNS용 AI 이미지 자동 생성 및 저장",
  },
  {
    category: "AI 이미지",
    glyph: "◈",
    name: "Flux AI",
    vendor: "Black Forest Labs",
    usage: "릴스용 고품질 이미지 자동 생성",
  },
  {
    category: "AI 영상",
    glyph: "▷",
    name: "Runway AI",
    vendor: "Runway",
    usage: "이미지 → 영상 변환, 릴스 콘텐츠 자동 제작",
  },
  {
    category: "AI 음성합성",
    glyph: "♪",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    usage: "블로그 · 릴스용 자연스러운 한국어 음성 자동 생성",
  },
  {
    category: "AI 음악생성",
    glyph: "♫",
    name: "Suno AI",
    vendor: "Suno",
    usage: "콘텐츠 맞춤 BGM 자동 작곡",
  },
  {
    category: "영상 자동제작",
    glyph: "▤",
    name: "JSON2Video",
    vendor: "JSON2Video",
    usage: "텍스트 · 이미지 · 음성을 조합해 영상 자동 제작",
  },
  {
    category: "데이터베이스",
    glyph: "▢",
    name: "Airtable",
    vendor: "Airtable",
    usage: "자동화 시스템의 DB · 워크플로우 관리",
  },
  {
    category: "블로그 발행",
    glyph: "✎",
    name: "WordPress API",
    vendor: "WordPress",
    usage: "작성된 콘텐츠 자동 포스팅",
  },
];

/** 두 트랙 — Vibe Coding (직접 코드) vs Make.com (노코드 자동화) */
export type BuildTrack = {
  id: "vibe" | "make";
  number: string;
  title: string;
  subtitle: string;
  bullets: string[];
  metric: { value: string; label: string };
  color: "fg" | "accent";
};

export const BUILD_TRACKS: BuildTrack[] = [
  {
    id: "vibe",
    number: "01",
    title: "Vibe Coding",
    subtitle: "직접 코드를 쓴다",
    bullets: [
      "Cursor · Claude Code · Codex CLI 멀티 에이전트 페어 프로그래밍",
      "Next.js · React 19 · TypeScript 5 · Tailwind v4 · Vite 풀 프론트엔드",
      "SaaS 8 Live 프로덕션 운영 — Tickpoint · Lumio · OS Agent · MKT Automation · PropIntel · Architect · Factto · Naver Place SEO",
      "Multi-LLM 라우팅 (Claude · GPT · Gemini · Perplexity)",
      "shadcn/ui · Recharts · React Flow · Radix · Zustand · Dexie",
    ],
    metric: { value: "43", label: "Vibe Coding 저장소" },
    color: "accent",
  },
  {
    id: "make",
    number: "02",
    title: "자동화 시나리오",
    subtitle: "노코드로 시스템을 짠다",
    bullets: [
      "12+ AI 도구 통합 워크플로우 (자동화 시나리오 허브)",
      "정부지원사업 · 10X 콘텐츠 · 계약서 자동화 · GA4 · 뉴스레터 · 웹 크롤링 4 핵심",
      "Airtable 데이터 모델 + WordPress 5채널 자동 발행",
      "JSON2Video로 영상 자동 제작 (텍스트→이미지→음성→릴스)",
      "n8n 백업 자동화 + Webhook + 조건 분기 + 스케줄링",
    ],
    metric: { value: "81", label: "자동화 시나리오 (4 핵심 메인 + 77 인벤토리)" },
    color: "fg",
  },
];
