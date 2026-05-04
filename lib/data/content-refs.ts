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
