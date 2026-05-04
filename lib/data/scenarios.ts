export type CoreScenario = {
  number: number;
  title: string;
  flow: string[];
  metric: string;
  screenshots: string[];
};

export type InventoryGroup = {
  name: string;
  systemRange: string;
  count: number;
  isMain: false; // 보조 라벨 (메인 X)
};

export type TimelinePhase = {
  period: string;
  phase: string;
  note: string;
};

export const CORE_SCENARIOS: CoreScenario[] = [
  {
    number: 1,
    title: "정부지원사업 크롤링·사업계획서 자동화",
    flow: [
      "Webhook",
      "Airtable",
      "CloudConvert/PDF.co",
      "OpenAI 6+ 분기",
      "Google Docs",
      "Airtable 상태 업데이트",
    ],
    metric: "24+ 공고 누적",
    screenshots: [
      "/automation/scenario-1-flow.jpg",
      "/automation/scenario-1-airtable.jpg",
    ],
  },
  {
    number: 2,
    title: "10X 콘텐츠 자동화",
    flow: [
      "Webhook",
      "Airtable 10X Content",
      "OpenAI 1차 (4-5개)",
      "HTTP/Sleep",
      "Iterator",
      "OpenAI 2차",
      "Wordpress 5채널 분기",
      "GDrive",
      "Airtable",
    ],
    metric: "5개 WP 동시 / Published Blog 6+ / Deep Dive 18+ 행",
    screenshots: [
      "/automation/scenario-2-flow.jpg",
      "/automation/scenario-2-published.jpg",
      "/automation/scenario-2-deepdive.jpg",
    ],
  },
  {
    number: 3,
    title: "계약서 관리 시스템 + GA4 분석 자동화",
    flow: [
      "Drive Watch Folder",
      "Drive Download",
      "PDF Convert",
      "OpenAI Generate",
      "JSON Parse",
      "Airtable Create",
      "폴더 ID 서치",
      "Router(폴더 존재/신규/벤도 신규)",
      "계약서 url 업데이트",
    ],
    metric: "광고주 폴더 자동 분류",
    screenshots: ["/automation/scenario-3-flow.jpg"],
  },
  {
    number: 4,
    title: "뉴스레터 또는 웹사이트 크롤링 후 콘텐츠 생성·업로드 자동화",
    flow: [
      "Webhook",
      "Tools",
      "Airtable",
      "SerpAPI 5+ 카테고리",
      "데이터 정제",
      "Iterator+Router 5+ 분기",
      "OpenAI 통합 분석",
      "Airtable",
    ],
    metric: "Grid view 25 키워드 / 상세 47+ 콘텐츠",
    screenshots: [
      "/automation/scenario-4-flow.jpg",
      "/automation/scenario-4-grid.jpg",
      "/automation/scenario-4-detail.jpg",
    ],
  },
];

export const INVENTORY_GROUPS: InventoryGroup[] = [
  {
    name: "AI 검색·SEO 콘텐츠 엔진",
    systemRange: "01-17, 63-66, 81",
    count: 23,
    isMain: false,
  },
  {
    name: "버티컬 업무 자동화 (정부지원·법무·금융)",
    systemRange: "18-36",
    count: 19,
    isMain: false,
  },
  {
    name: "SNS·숏폼·멀티미디어",
    systemRange: "37-42, 52-60, 75",
    count: 16,
    isMain: false,
  },
  {
    name: "뉴스·지식 큐레이션",
    systemRange: "43-51",
    count: 9,
    isMain: false,
  },
  {
    name: "데이터 수집·분석 인프라",
    systemRange: "02, 06-07, 61-70, 76-79",
    count: 15,
    isMain: false,
  },
  {
    name: "마케팅·광고·운영 자동화",
    systemRange: "71-74, 80",
    count: 5,
    isMain: false,
  },
];

export const TIMELINE_2024_2025: TimelinePhase[] = [
  {
    period: "2024.10",
    phase: "기반 구축",
    note: "자동화 시나리오 실습 / Notion+Claude+Flux / RSS+IG / YouTube 채널 분석",
  },
  {
    period: "2024.11",
    phase: "확장 성장",
    note: "정부지원사업 / Midjourney 3단계 / Suno / AI 쇼츠",
  },
  {
    period: "2024.12",
    phase: "심화 발전",
    note: "구글 키워드 블로그 / 정부지원 사업계획서 / 증권 리포트",
  },
  {
    period: "2025.01",
    phase: "통합·고도화",
    note: "퍼플렉시티-WP / 10X 콘텐츠",
  },
  {
    period: "2025.02-03",
    phase: "전문화",
    note: "YouTube to Blog / 고객사 마케팅 전략 / 온페이지 SEO",
  },
  {
    period: "2025.04",
    phase: "클라이언트 납품",
    note: "5채널 자동화 / 연예인 뉴스",
  },
  {
    period: "2025.05",
    phase: "최신 기술 통합",
    note: "AI FAKE 릴스 NEWS CMS / Vidu/Kling / Castsome",
  },
  {
    period: "2025.06-08",
    phase: "운영·협업 자동화",
    note: "Apify 통합 / Pltt AI News 3채널 / Google Chat 알림",
  },
];
