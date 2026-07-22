import fs from "node:fs";
import path from "node:path";
import { BuilderHero } from "@/components/builder/builder-hero";
import { BuildTracks } from "@/components/builder/build-tracks";
import { SaasIndex } from "@/components/builder/saas-card-5bullet";
import { AiSaasPlSection } from "@/components/builder/ai-saas-pl";
import { MakeSystemsShowcase } from "@/components/builder/make-systems-showcase";
import { GithubPreview } from "@/components/builder/github-preview";
import { ContentReferences } from "@/components/builder/content-references";
import { SAAS_LIST } from "@/lib/data/saas";

export const metadata = {
  description:
    "Vibe Coding 43 · SaaS 10 Live · AI SaaS PL 4건 + 자동화 시나리오 (18 디테일 시스템). 17년 마케터가 직접 코드도 쓰고 노코드도 짠다.",
};

function getMakeScreenshots(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "automation");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.webp$/i.test(f))
      .sort()
      .map((f) => `/automation/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

export default function BuilderIndex() {
  const makeScreenshots = getMakeScreenshots();
  return (
    <>
      <BuilderHero />
      <BuildTracks />
      <SaasIndex list={SAAS_LIST} />
      <AiSaasPlSection />
      <GithubPreview />
      <MakeSystemsShowcase screenshots={makeScreenshots} />
      <ContentReferences />
    </>
  );
}
