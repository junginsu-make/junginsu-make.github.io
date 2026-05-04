import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingTimeline } from "@/components/marketing/marketing-timeline";
import { TmonCase } from "@/components/marketing/tmon-case";
import { MarketingSpecialties } from "@/components/marketing/marketing-specialties";
import { PublicAgencies } from "@/components/marketing/public-agencies";
import { AdChannels } from "@/components/marketing/ad-channels";
import { AiClients } from "@/components/marketing/ai-clients";

export const metadata = {
  title: "Marketing — 정인수",
  description:
    "17년 마케팅 진화 6 milestone + TMON ROAS 7,404% 검증 + 마케팅 전문 분야 6 영역 + 공공기관 12 + Owned/Paid 멀티채널 9 + Content Op 7+ + Capsule PM 20+. 17년 마케팅 임팩트.",
};

export default function Marketing() {
  return (
    <>
      <MarketingHero />
      <MarketingTimeline />
      <TmonCase />
      <MarketingSpecialties />
      <PublicAgencies />
      <AdChannels />
      <AiClients />
    </>
  );
}
