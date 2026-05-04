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
    "17년 마케팅 진화 6 milestone + TMON ROAS 7,404% 검증 + 마케팅 강의 7년 6개월 + 마케팅 전문 분야 6 영역 + 공공기관 12 + Owned/Paid 멀티채널 9 + Content Op 7+. 17년 마케팅 임팩트.",
};

/** 강의 사진을 5장 균등 샘플링 (앞쪽 5장은 동일 행사일 가능성 높음) */
function getTeachingCarouselPhotos(count = 5): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "photos", "teaching");
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort();
    if (files.length === 0) return [];
    // 균등 샘플링 — 다른 행사 사진 다양성 확보
    const step = Math.max(1, Math.floor(files.length / count));
    const sampled: string[] = [];
    for (let i = 0; i < count && i * step < files.length; i++) {
      sampled.push(files[i * step]);
    }
    return sampled.map((f) => `/photos/teaching/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export default function Marketing() {
  const teachingPhotos = getTeachingCarouselPhotos(5);
  return (
    <>
      <MarketingHero />
      <MarketingTimeline />
      <TmonCase />
      <TeachingPreview photos={teachingPhotos} />
      <MarketingSpecialties />
      <PublicAgencies />
      <AdChannels />
      <AiClients />
    </>
  );
}
