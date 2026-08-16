import { Manifesto } from "@/components/home/manifesto";
import { AiUsageStatement } from "@/components/shared/ai-usage-statement";
import { CounterSection } from "@/components/home/counter-section";
import { SaasCycle } from "@/components/home/saas-cycle";
import { WhyDifferent } from "@/components/home/why-different";
import { ThreeCategories } from "@/components/home/three-categories";
import { Duality } from "@/components/home/duality";
import { Cta } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Manifesto />
      <CounterSection />
      <AiUsageStatement />
      <SaasCycle />
      <WhyDifferent />
      <ThreeCategories />
      <Duality />
      <Cta />
    </>
  );
}
