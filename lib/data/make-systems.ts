/**
 * make.com 자동화 시스템 풀스펙
 * 자료 출처: AI AUTOMATION PORTFOLIO-make.pdf (정인수 작성, 2026-05) 페이지 5-11
 *
 * 81 시스템 중 디테일 명시된 18개 (4 핵심 + 14 보조). 나머지 63개는 모듈 카드만 존재.
 */

export type MakeSystem = {
  category: MakeSystemCategory;
  title: string;
  modules: number | "복합 시나리오";
  services: string[];
  description: string;
  isStar?: boolean; // ★ 대표 시스템
  isFlagship?: boolean; // 4 핵심 시나리오
};

export type MakeSystemCategory =
  | "콘텐츠 자동화"
  | "블로그·워드프레스 자동화"
  | "SEO·데이터 분석 자동화"
  | "공공데이터·정부지원사업 자동화"
  | "AI 이미지·음성 자동화"
  | "정보 수집·뉴스 큐레이션";

export const CATEGORY_INFO: Record<
  MakeSystemCategory,
  { number: string; count: number; tone: "fg" | "accent" }
> = {
  "콘텐츠 자동화": { number: "01", count: 5, tone: "accent" },
  "블로그·워드프레스 자동화": { number: "02", count: 5, tone: "fg" },
  "SEO·데이터 분석 자동화": { number: "03", count: 5, tone: "fg" },
  "공공데이터·정부지원사업 자동화": { number: "04", count: 2, tone: "accent" },
  "AI 이미지·음성 자동화": { number: "05", count: 3, tone: "fg" },
  "정보 수집·뉴스 큐레이션": { number: "06", count: 2, tone: "fg" },
};

export const MAKE_SYSTEMS: MakeSystem[] = [
  // 4-1. 콘텐츠 자동화 (5개)
  {
    category: "콘텐츠 자동화",
    title: "구글 트렌드 블로그 + 릴스 베포 자동화",
    modules: 19,
    services: [
      "Google Trends",
      "SerpAPI",
      "Perplexity AI",
      "OpenAI",
      "ElevenLabs",
      "JSON2Video",
      "YouTube",
      "Airtable",
      "Google Drive",
    ],
    description:
      "구글 트렌드에서 실시간 키워드를 수집하고, OpenAI가 SEO 최적화 블로그 글을 자동 작성하고, ElevenLabs로 음성을 합성한 뒤 JSON2Video로 영상을 자동 제작합니다. 완성된 콘텐츠는 YouTube/SNS에 자동 배포되며, Airtable로 콘텐츠 DB를 관리합니다. 가장 많은 서비스(13개)가 연동된 고복잡도 시스템입니다.",
    isStar: true,
    isFlagship: true,
  },
  {
    category: "콘텐츠 자동화",
    title: "AI 유튜브 쇼츠 자동화",
    modules: 18,
    services: [
      "YouTube",
      "Claude AI",
      "OpenAI",
      "JSON2Video",
      "Instagram Business",
      "Airtable",
    ],
    description:
      "YouTube 인기 영상을 자동 수집·분석하고, Claude AI가 쇼츠 전용 스크립트를 작성합니다. JSON2Video로 영상을 자동 제작한 후 YouTube Shorts와 Instagram Reels에 동시 배포하는 완전 자동화 시스템입니다.",
  },
  {
    category: "콘텐츠 자동화",
    title: "AI 뉴스 쇼츠 자동화",
    modules: 12,
    services: ["YouTube", "OpenAI", "JSON2Video", "Instagram"],
    description:
      "뉴스 피드를 실시간으로 모니터링한 후 Claude AI가 쇼츠용 스크립트를 작성하고, JSON2Video로 영상을 자동 제작합니다. YouTube Shorts와 Instagram Reels에 동시 배포되어 시의성 있는 뉴스 콘텐츠를 자동 발행합니다.",
  },

  // 4-2. 블로그·워드프레스 자동화 (5개)
  {
    category: "블로그·워드프레스 자동화",
    title: "구글 키워드 블로그 자동화",
    modules: 9,
    services: [
      "SerpAPI",
      "Claude AI",
      "Perplexity AI",
      "OpenAI",
      "WordPress",
      "Google Docs",
    ],
    description:
      "구글 키워드 검색량·경쟁도를 분석하고, Claude + Perplexity AI의 듀얼 AI 리서치로 고품질 콘텐츠를 생성합니다. 구글 검색 상위노출에 특화된 SEO 블로그를 WordPress에 자동 발행합니다.",
  },
  {
    category: "블로그·워드프레스 자동화",
    title: "퍼플렉시티 X 클로드 블로그 자동화",
    modules: 8,
    services: ["Perplexity AI", "Claude AI", "WordPress", "Markdown"],
    description:
      "Perplexity AI로 최신 정보를 실시간 검색·요약하고, Claude AI가 자연스럽고 깊이 있는 블로그 글로 재구성합니다. 정보의 신선도와 글의 퀄리티를 동시에 확보한 블로그 자동화 시스템입니다.",
  },
  {
    category: "블로그·워드프레스 자동화",
    title: "원텐 플로우 — 워드프레스 자동화 (QJC 앱버서더 전용)",
    modules: 14,
    services: [
      "Inoreader",
      "Claude AI",
      "Perplexity AI",
      "Midjourney",
      "WordPress",
      "Google Drive",
    ],
    description:
      "Inoreader RSS 피드로 최신 아티클을 자동 수집하고, Claude AI + Perplexity AI가 분석·재작성합니다. 미드저니 이미지를 자동 삽입 후 WordPress에 발행합니다. QJC 커뮤니티 앱버서더 전용으로 제작·배포된 고급 시스템입니다.",
  },
  {
    category: "블로그·워드프레스 자동화",
    title: "천은영 블로그 자동화 (클라이언트 맞춤 납품)",
    modules: 8,
    services: ["Inoreader", "OpenAI", "WordPress", "Markdown"],
    description:
      "클라이언트 맞춤 제작 블로그 자동화 시스템입니다. Inoreader 아티클을 수집하고 OpenAI가 요약·번역·재작성하여 WordPress에 자동 포스팅합니다. Watch(실시간 트리거)와 List(주기적 실행) 두 가지 모드를 모두 지원합니다.",
  },

  // 4-3. SEO & 데이터 분석 자동화 (5개)
  {
    category: "SEO·데이터 분석 자동화",
    title: "네이버 키워드 분석 자동화 V2",
    modules: 17,
    services: [
      "SerpAPI",
      "OpenAI",
      "Airtable",
      "Google Docs",
      "Discord",
      "Gmail",
      "OneSaaS",
    ],
    description:
      "네이버 검색 키워드의 월간 검색량·경쟁도·상위노출 페이지를 자동 분석합니다. 결과를 Airtable DB에 저장하고 Google Docs 보고서를 자동 생성한 뒤 Discord 알림·이메일 발송까지 완전 자동화합니다. V1 → V2 → V3로 지속 개선된 시스템입니다.",
    isFlagship: true,
  },
  {
    category: "SEO·데이터 분석 자동화",
    title: "GA4 이탈율 분석 자동화",
    modules: 10,
    services: [
      "Google Analytics 4",
      "OpenAI",
      "Airtable",
      "Google Docs",
      "Markdown",
    ],
    description:
      "Google Analytics 4 API로 홈페이지 이탈율 데이터를 자동 수집하고, OpenAI가 이탈 원인을 분석·개선 방안을 도출합니다. 분석 결과는 Google Docs 보고서로 자동 생성되고 Airtable에 저장됩니다.",
  },
  {
    category: "SEO·데이터 분석 자동화",
    title: "상위노출 분석 자동화 V.1",
    modules: 14,
    services: ["SerpAPI", "OpenAI", "Airtable", "Google Docs"],
    description:
      "네이버·구글 상위노출 페이지를 자동 분석하고, AI가 공통 패턴·키워드 밀도·콘텐츠 구조를 파악합니다. 최적화 전략을 자동 보고서로 정리해 주기적으로 업데이트합니다.",
  },
  {
    category: "SEO·데이터 분석 자동화",
    title: "구글 + 네이버 키워드 분석 V1",
    modules: "복합 시나리오",
    services: ["SerpAPI", "OpenAI", "Airtable", "Discord", "Google Docs"],
    description:
      "구글·네이버 양대 검색엔진의 키워드 데이터를 동시 수집·비교 분석합니다. 플랫폼별 검색 트렌드 차이를 AI가 해석하고 채널별 최적 키워드 전략을 자동 도출합니다.",
  },
  {
    category: "SEO·데이터 분석 자동화",
    title: "유튜브 경쟁사 분석 자동화",
    modules: "복합 시나리오",
    services: ["YouTube Data API", "Apify", "OpenAI", "Airtable"],
    description:
      "경쟁사 유튜브 채널을 자동 모니터링하고, 인기 영상·키워드·업로드 패턴을 AI가 분석합니다. 우리 채널 전략에 활용할 인사이트를 자동 보고화합니다.",
  },

  // 4-4. 공공데이터·정부지원사업 (2개)
  {
    category: "공공데이터·정부지원사업 자동화",
    title: "정부지원사업 필터링 자동 수집 V1",
    modules: 10,
    services: ["BizInfo API", "Claude AI", "OpenAI", "Airtable", "정규식 처리"],
    description:
      "BizInfo 공공 API를 통해 정부지원사업 공고를 자동 수집합니다. Claude + OpenAI가 사업 내용을 분석하고 조건별로 필터링한 뒤, 적합한 지원사업을 Airtable에 자동 정리하고 알림을 발송합니다. 공공 API를 직접 연동한 고난도 시스템입니다.",
    isStar: true,
    isFlagship: true,
  },
  {
    category: "공공데이터·정부지원사업 자동화",
    title: "지원사업 추천 자동화 (고급)",
    modules: 15,
    services: ["PDF.co", "CloudConvert", "Perplexity AI", "OpenAI", "Airtable", "Discord"],
    description:
      "PDF 형태의 지원사업 공고문을 CloudConvert로 변환하고 PDF.co로 텍스트를 추출합니다. Perplexity AI가 조건을 분석하고 OpenAI가 적합도를 점수화합니다. Discord로 맞춤 추천 알림을 발송하는 PDF 파싱 시스템입니다.",
  },

  // 4-5. AI 이미지·음성 자동화 (3개)
  {
    category: "AI 이미지·음성 자동화",
    title: "이미지 자동화 메가 시스템 V1 ~ V3 (4세트)",
    modules: "복합 시나리오",
    services: [
      "Midjourney (useapi)",
      "Loosari.net",
      "OpenAI",
      "Airtable",
      "Google Drive",
    ],
    description:
      "Midjourney API와 다양한 이미지 도구를 연동해 블로그·SNS용 이미지를 대량 자동 생성합니다. V1 → V2 → V3로 진화하며 4세트로 운영됩니다.",
  },
  {
    category: "AI 이미지·음성 자동화",
    title: "영상 자동화 V1 ~ V3 (5세트)",
    modules: "복합 시나리오",
    services: ["Suno AI", "OpenAI", "JSON2Video"],
    description:
      "Suno AI로 BGM을 자동 작곡하고, OpenAI 스크립트를 결합해 JSON2Video가 영상을 자동 제작합니다. V1 → V2 → V3로 발전한 5 세트 영상 자동화 시스템입니다.",
  },
  {
    category: "AI 이미지·음성 자동화",
    title: "AI 음성 합성 자동화",
    modules: "복합 시나리오",
    services: ["ElevenLabs", "OpenAI", "Airtable"],
    description:
      "OpenAI가 작성한 스크립트를 ElevenLabs로 자연스러운 한국어 음성으로 합성합니다. 블로그·릴스·쇼츠용 음성을 자동 생성하는 시스템입니다.",
  },

  // 4-6. 정보 수집·뉴스 큐레이션 (2개)
  {
    category: "정보 수집·뉴스 큐레이션",
    title: "퀀텀 AI 스튜디오 — 광고 기획 자동화",
    modules: 10,
    services: ["Claude AI", "OpenAI", "Airtable"],
    description:
      "클라이언트 정보를 Airtable에 입력하면 Claude + OpenAI가 광고 컨셉·타겟·카피·채널 전략을 자동으로 기획합니다. 광고 기획서를 AI가 자동 생성하는 마케터 보조 시스템으로, 기획 시간을 대폭 단축합니다.",
  },
  {
    category: "정보 수집·뉴스 큐레이션",
    title: "SNS 콘텐츠 수집 및 분석",
    modules: "복합 시나리오",
    services: ["Apify", "OpenAI", "Airtable"],
    description:
      "Instagram·YouTube·블로그 등 주요 SNS에서 인기 콘텐츠를 자동 수집하고 AI가 성과 패턴을 분석합니다. 바이럴 요인·최적 포스팅 시간·해시태그 전략을 자동으로 도출합니다.",
  },
];

/** make.com 폴더 분류 — 실제 화면 캡처 기준 (자료: Screenshot 2026-05-03 at 20.57.34) */
export type MakeFolder = {
  index: string;
  name: string;
  count: number;
};

export const MAKE_FOLDERS: MakeFolder[] = [
  { index: "0", name: "Data Collection · Planning · Creation", count: 9 },
  { index: "1", name: "Search Base", count: 17 },
  { index: "2", name: "10X 콘텐츠", count: 6 },
  { index: "3", name: "YouTube video base", count: 2 },
  { index: "4", name: "Text base", count: 4 },
  { index: "5", name: "YouTube Channel Analysis", count: 4 },
  { index: "6", name: "News base", count: 6 },
  { index: "7", name: "Website base", count: 4 },
  { index: "8", name: "주식 보고서", count: 2 },
  { index: "9", name: "Midjourney image", count: 3 },
  { index: "10", name: "기타 (완료)", count: 4 },
  { index: "11", name: "미완성", count: 6 },
  { index: "12", name: "서울법무법인 (클라이언트)", count: 9 },
  { index: "13", name: "정부지원 사업 크롤링&사업계획서 작성", count: 7 },
  { index: "14", name: "카드뉴스 자동화", count: 8 },
  { index: "15", name: "AI FAKE 릴스 NEWS", count: 5 },
  { index: "16", name: "Naver", count: 8 },
  { index: "17", name: "Pltt AI News", count: 3 },
  { index: "18", name: "Test", count: 3 },
];
