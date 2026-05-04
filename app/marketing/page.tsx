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
    "17년 마케팅 진화 6 milestone + TMON ROAS 7,404% 검증 + 마케팅 강의 7년 6개월 + 마케팅 전문 분야 6 영역 + 공공기관 12 + Owned/Paid 멀티채널 9 + Content Op 7+ + Capsule PM 20+. 17년 마케팅 임팩트.",
};

function getFirstTeachingPhoto(): string | undefined {
  try {
    const dir = path.join(process.cwd(), "public", "photos", "teaching");
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort();
    return files[0]
      ? `/photos/teaching/${encodeURIComponent(files[0])}`
      : undefined;
  } catch {
    return undefined;
  }
}

export default function Marketing() {
  const heroPhoto = getFirstTeachingPhoto();
  return (
    <>
      <MarketingHero />
      <MarketingTimeline />
      <TmonCase />
      <TeachingPreview heroPhoto={heroPhoto} />
      <MarketingSpecialties />
      <PublicAgencies />
      <AdChannels />
      <AiClients />
    </>
  );
}
