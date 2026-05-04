import { BuilderHero } from "@/components/builder/builder-hero";
import { BuildTracks } from "@/components/builder/build-tracks";
import { SaasIndex } from "@/components/builder/saas-card-5bullet";
import { AiSaasPlSection } from "@/components/builder/ai-saas-pl";
import { MakeStackVisualization } from "@/components/builder/make-stack";
import { ScenariosPreview } from "@/components/builder/scenarios-preview";
import { GithubPreview } from "@/components/builder/github-preview";
import { SAAS_LIST } from "@/lib/data/saas";

export const metadata = {
  title: "AI Builder — 정인수",
  description:
    "Vibe Coding (GitHub 43) + Make.com 자동화 (12 도구·81 시스템·4 핵심) + 6 라이브 SaaS + AI SaaS PL 4건. 17년 마케터가 직접 코드도 쓰고 노코드도 짠다.",
};

export default function BuilderIndex() {
  return (
    <>
      <BuilderHero />
      <BuildTracks />
      <SaasIndex list={SAAS_LIST} />
      <AiSaasPlSection />
      <MakeStackVisualization />
      <ScenariosPreview />
      <GithubPreview />
    </>
  );
}
