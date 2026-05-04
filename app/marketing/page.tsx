import { MarketingHero } from "@/components/marketing/marketing-hero";
import { TmonPortfolio } from "@/components/marketing/tmon-portfolio";
import { MarketingSpecialties } from "@/components/marketing/marketing-specialties";
import { PublicAgencies } from "@/components/marketing/public-agencies";
import { AdChannels } from "@/components/marketing/ad-channels";
import { AiClients } from "@/components/marketing/ai-clients";

export const metadata = {
  title: "Marketing — 정인수",
  description:
    "TMON ROAS 7,404% 검증 + 마케팅 전문 분야 6 영역 + 공공기관 12 + Owned/Paid 멀티채널 9 + Content Op 7+ + Capsule PM 20+. 17년 마케팅 임팩트.",
};

export default function Marketing() {
  return (
    <>
      <MarketingHero />
      <TmonPortfolio />
      <MarketingSpecialties />
      <PublicAgencies />
      <AdChannels />
      <AiClients />
    </>
  );
}
