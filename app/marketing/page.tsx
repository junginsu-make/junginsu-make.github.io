import fs from "node:fs";
import path from "node:path";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingTimeline } from "@/components/marketing/marketing-timeline";
import { TmonCase } from "@/components/marketing/tmon-case";
import { TeachingPreview } from "@/components/marketing/teaching-preview";
import { MarketingSpecialties } from "@/components/marketing/marketing-specialties";
import { PublicAgencies } from "@/components/marketing/public-agencies";
import { AdChannels } from "@/components/marketing/ad-channels";
import { AiClients } from "@/components/marketing/ai-clients";

export const metadata = {
  title: "Marketing — 정인수",
  description:
    "17년 마케팅 진화 6 milestone + TMON ROAS 7,404% 검증 + 마케팅 강의 7년 6개월 + 마케팅 전문 분야 6 영역 + 정부·공공기관 18 + 민간기업 4 + Owned/Paid 멀티채널 9 + Content Op 7+. Marketing Performance.",
};

/** 강의 사진 — 사용자 지정 순서 (8장) */
const TEACHING_PHOTO_ORDER = [
  "DSC01363",
  "1573555749107",
  "1572109158953-1",
  "KakaoTalk_20190811_173810972_05",
  "20200118_182955",
  "SE-330181ba-2e5e-40a5-ad9a-ee3a0c8bbc6e",
  "P1070865",
  "20190927_121849",
];

function getTeachingCarouselPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "photos", "teaching");
  return TEACHING_PHOTO_ORDER.flatMap((base) => {
    const webp = path.join(dir, `${base}.webp`);
    return fs.existsSync(webp)
      ? [`/photos/teaching/${encodeURIComponent(`${base}.webp`)}`]
      : [];
  });
}

export default function Marketing() {
  const teachingPhotos = getTeachingCarouselPhotos();
  return (
    <>
      <MarketingHero />
      <MarketingTimeline />
      <TmonCase />
      <TeachingPreview photos={teachingPhotos} />
      <MarketingSpecialties />
      <AdChannels />
      <AiClients />
      <PublicAgencies />
    </>
  );
}
