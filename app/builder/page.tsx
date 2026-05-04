import fs from "node:fs";
import path from "node:path";
import { BuilderHero } from "@/components/builder/builder-hero";
import { BuildTracks } from "@/components/builder/build-tracks";
import { SaasIndex } from "@/components/builder/saas-card-5bullet";
import { AiSaasPlSection } from "@/components/builder/ai-saas-pl";
import { MakeStackVisualization } from "@/components/builder/make-stack";
import { MakeSystemsShowcase } from "@/components/builder/make-systems-showcase";
import { GithubPreview } from "@/components/builder/github-preview";
import { SAAS_LIST } from "@/lib/data/saas";

export const metadata = {
  title: "AI Builder — 정인수",
  description:
    "Vibe Coding (GitHub 43) + Make.com 자동화 (12 도구·81 시스템·19 폴더·18 디테일 시나리오) + 6 라이브 SaaS + AI SaaS PL 4건. 17년 마케터가 직접 코드도 쓰고 노코드도 짠다.",
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
      <MakeStackVisualization />
      <MakeSystemsShowcase screenshots={makeScreenshots} />
      <GithubPreview />
    </>
  );
}
