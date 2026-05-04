import { MarketingHero } from "@/components/marketing/marketing-hero";
import { TmonPortfolio } from "@/components/marketing/tmon-portfolio";
import { AdChannels } from "@/components/marketing/ad-channels";
import { AiClients } from "@/components/marketing/ai-clients";

export const metadata = {
  title: "Marketing — 정인수",
  description:
    "TMON ROAS 7,404% 검증 + AI SaaS PL 4건 + Content Op 7+ + Capsule PM 20+ + Owned/Paid 멀티채널 통합 운영. 17년 마케팅 임팩트.",
};

export default function Marketing() {
  return (
    <>
      <MarketingHero />
      <TmonPortfolio />
      <AdChannels />
      <AiClients />
    </>
  );
}
