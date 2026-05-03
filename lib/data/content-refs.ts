export type ContentRef = {
  url: string;
  title: string;
  publisher: string;
  date?: string;
  category: "blog" | "instagram" | "youtube" | "notion" | "external";
  capturedImage?: string; // public/captured/<slug>/desktop.jpg
  embedType?: "iframe" | "screenshot";
};

// scripts/capture-urls.ts 가 자료 폴더 콘텐츠 레퍼런스.txt 파싱 후 이 배열 채움
// (런타임에는 captured-meta.json 사용)
export const CONTENT_REFS_PLACEHOLDER: ContentRef[] = [];
