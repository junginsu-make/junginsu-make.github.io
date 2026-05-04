import { BuilderHero } from "@/components/builder/builder-hero";
import { SaasIndex } from "@/components/builder/saas-card-5bullet";
import { AiSaasPlSection } from "@/components/builder/ai-saas-pl";
import { ScenariosPreview } from "@/components/builder/scenarios-preview";
import { GithubPreview } from "@/components/builder/github-preview";
import { SAAS_LIST } from "@/lib/data/saas";

export const metadata = {
  title: "AI Builder — 정인수",
  description:
    "GitHub 43 · make.com 4 핵심 시나리오 · 6 라이브 SaaS · AI SaaS PL 4건. 17년 마케터가 직접 코드를 쓰는 풀사이클 빌더의 작업 인덱스.",
};

export default function BuilderIndex() {
  return (
    <>
      <BuilderHero />
      <SaasIndex list={SAAS_LIST} />
      <AiSaasPlSection />
      <ScenariosPreview />
      <GithubPreview />
    </>
  );
}
