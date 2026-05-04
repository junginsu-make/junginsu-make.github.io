export type ContentRef = {
  url: string;
  title: string;
  publisher: string;
  date?: string;
  category: "blog" | "instagram" | "youtube" | "notion" | "external";
  capturedImage?: string; // public/captured/<slug>/desktop.jpg
  embedType?: "iframe" | "screenshot";
};

// 자료: 포토폴리오-260503/github-vibe coding/MKT Automation/콘텐츠 레퍼런스/추가 콘텐츠 레퍼런스.txt
export const CONTENT_REFS: ContentRef[] = [
  {
    url: "https://www.instagram.com/p/DME1fovSlbS/?img_index=1",
    title: "AHC Vital Golden Collagen Lotion",
    publisher: "Collagen Lotion",
    category: "instagram",
  },
  {
    url: "https://www.instagram.com/p/DSKLA0oD9pM/?utm_source=ig_web_copy_link",
    title: "Seoul Luggage Storage Guide",
    publisher: "서울철도엔지니어링",
    category: "instagram",
  },
  {
    url: "https://youtube.com/shorts/GLYh2ZaU2LA?si=dYwWz-CIwPlnFaz0",
    title: "Where to Leave Bags in Seoul",
    publisher: "서울철도엔지니어링",
    category: "youtube",
  },
  {
    url: "https://blog.naver.com/capsule_media/224107486731",
    title:
      "Where to Leave Bags in Seoul — Traveler-Favorite Lockers, Delivery & Storage Picks",
    publisher: "서울철도엔지니어링",
    category: "blog",
  },
  {
    url: "https://www.instagram.com/p/DSKIueYkokz/?utm_source=ig_web_copy_link",
    title: "여기고기 — 카드뉴스 실사형",
    publisher: "여기고기",
    category: "instagram",
  },
  {
    url: "https://www.instagram.com/p/DSKI2NWkl2J/?utm_source=ig_web_copy_link",
    title: "여기고기 — 카드뉴스 일러스트형",
    publisher: "여기고기",
    category: "instagram",
  },
  {
    url: "https://www.instagram.com/reel/DSKJGmuEcej/?utm_source=ig_web_copy_link",
    title: "여기고기 — 기존 리소스 숏폼화",
    publisher: "여기고기",
    category: "instagram",
  },
];

export const FEATURED_BLOG = {
  url: "https://blog.naver.com/sbcyberpass",
  title: "SB사이버평생교육원 공식 블로그 — 솔직한 인쌤",
  publisher: "정인수",
  category: "blog" as const,
  capturedDesktop: "/captured/blog/sbcyberpass/desktop.jpg",
  capturedMobile: "/captured/blog/sbcyberpass/mobile.jpg",
};

export const CONTENT_REFS_PLACEHOLDER: ContentRef[] = [];

/* ============================================================
 * AI Builder 페이지용 — MKT Automation 자동화 시스템 결과 콘텐츠
 * (SNS 카드 시리즈 / 블로그 데스크탑 / YouTube shorts)
 * 자료: 포토폴리오-260503/github-vibe coding/MKT Automation/콘텐츠 레퍼런스/
 * ============================================================ */
export type BuilderContentRef =
  | {
      type: "sns";
      slug: string;
      title: string;
      caption: string;
      slides: number;
      ext: "jpg" | "png";
    }
  | {
      type: "blog-google";
      slug: string;
      title: string;
      caption: string;
      capture: string;
    }
  | {
      type: "blog-naver";
      slug: string;
      title: string;
      caption: string;
      capture: string;
      url: string;
    }
  | {
      type: "shorts";
      slug: string;
      title: string;
      caption: string;
      videoId: string;
    };

export const BUILDER_CONTENT_REFS: BuilderContentRef[] = [
  {
    type: "sns",
    slug: "kbeauty-tips",
    title: "K-Beauty Manufacturing Tips",
    caption: "K-Beauty 카드뉴스 시리즈 · 6 슬라이드",
    slides: 6,
    ext: "jpg",
  },
  {
    type: "sns",
    slug: "black-gloves",
    title: "검은색 요리장갑",
    caption: "이커머스 제품 카드뉴스 · 6 슬라이드",
    slides: 6,
    ext: "jpg",
  },
  {
    type: "sns",
    slug: "yeogigogi",
    title: "여기고기",
    caption: "F&B 카드뉴스 시리즈 · 4 슬라이드",
    slides: 4,
    ext: "png",
  },
  {
    type: "blog-google",
    slug: "google-kbeauty",
    title: "2025 K-beauty Global Trend",
    caption: "Google Blog · SEO 최적화 2,780 word",
    capture: "/content-refs/blogs/google.png",
  },
  {
    type: "blog-naver",
    slug: "naver-onedmedia",
    title: "온드미디어마케팅 브랜드 성장에 꼭 필요한 이유",
    caption: "Naver Blog · 솔찍한인쌤",
    capture: "/content-refs/blogs/naver.png",
    url: "https://blog.naver.com/wjddlstn486/224105931120",
  },
  {
    type: "shorts",
    slug: "shorts-travel-korea",
    title: "Travel Korea without the weight",
    caption: "YouTube Shorts · 9:16",
    videoId: "SmtY7-8JpOk",
  },
];
