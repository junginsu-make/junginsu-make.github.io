import { ContentHero } from "@/components/marketing/content-hero";
import { ContentFeatured } from "@/components/marketing/content-featured";
import { ContentGrid } from "@/components/marketing/content-grid";

export const metadata = {
  title: "Content — 정인수",
  description:
    "Naver Blog · Instagram · YouTube Shorts · Notion 멀티채널 콘텐츠 운영. 솔직한 인쌤 SB사이버평생교육원 + 클라이언트 콘텐츠 운영 사례.",
};

export default function Content() {
  return (
    <>
      <ContentHero />
      <ContentFeatured />
      <ContentGrid />
    </>
  );
}
