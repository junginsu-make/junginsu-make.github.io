"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { GITHUB_TOTAL } from "@/lib/data/github";

type Kpi = {
  to: number;
  suffix?: string;
  label: string;
  note: string;
};

/** SaaS 개수는 SAAS_LIST 에서 주입받는다 — 하드코딩하면 목록이 늘 때 어긋난다. */
const buildKpis = (saasCount: number): Kpi[] => [
  { to: GITHUB_TOTAL, label: "Vibe Coding Repos", note: "외부 공개" },
  { to: 4, label: "자동화 Core", note: "핵심 시나리오" },
  { to: saasCount, label: "Live SaaS", note: "프로덕션 운영" },
  { to: 81, label: "Total Systems", note: "자동화 시나리오 인벤토리" },
];

export function BuilderHero({ saasCount }: { saasCount: number }) {
  const KPIS = buildKpis(saasCount);
  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
      <p className="text-meta opacity-50 mb-12">
        <MaskReveal>AI BUILDER · 2025—2026</MaskReveal>
      </p>

      <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.03em]">
        <MaskRevealStagger text="AI Builder" letterDelay={0.05} duration={0.9} />
      </h1>

      <div className="mt-12 max-w-[860px] text-body-xl leading-[1.45] opacity-85">
        <MaskReveal delay={0.6}>
          <span>
            17년 마케터가{" "}
            <WordHighlight delay={1.0}>직접 코드를 씁니다</WordHighlight>.
          </span>
        </MaskReveal>
        <span className="block mt-2">
          <MaskReveal delay={0.85}>
            <span>
              <WordHighlight delay={1.25}>Vibe Coding 43</WordHighlight> · {" "}
              <WordHighlight delay={1.4}>자동화 시나리오 81</WordHighlight> · {" "}
              <WordHighlight delay={1.55}>{`SaaS ${saasCount} Live`}</WordHighlight>
            </span>
          </MaskReveal>
        </span>
        <span className="block mt-3 text-body-lg opacity-70">
          <MaskReveal delay={1.0}>
            <span>기획 · 설계 · 구현 · 검증 · 배포까지 — 전부 1인 풀사이클</span>
          </MaskReveal>
        </span>
      </div>

      <ScrollReveal delay={0.3} className="mt-14 max-w-[820px]">
        <div className="border-l-2 border-[var(--accent)] pl-6 md:pl-8">
          <p className="text-body-lg leading-[1.7] opacity-85">
            AI로 뭔가를 만드는 사람은 많습니다.{" "}
            <span className="text-[var(--accent)]">
              결과물의 합격 기준을 아는 사람이 만든 시스템은 다릅니다.
            </span>
          </p>
          <p className="text-body-lg leading-[1.7] opacity-65 mt-3">
            각 시스템 상세 페이지에서 일반적인 접근과 무엇이 다른지, 각 단계가 왜
            거기 있는지, 그리고 무엇을 거부하는지 확인하실 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {KPIS.map((k, i) => (
          <ScrollReveal
            key={k.label}
            delay={i * 0.1}
            className="border-t border-[var(--line)] pt-6"
          >
            <p className="text-display-xl font-display leading-none glow-pulse">
              <Counter to={k.to} suffix={k.suffix ?? ""} />
            </p>
            <p className="text-meta opacity-70 mt-4">{k.label}</p>
            <p className="text-meta opacity-40 mt-1">{k.note}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.55} className="mt-24">
        <p className="text-meta opacity-50 tracking-[0.2em]">
          ↓ SCROLL TO EXPLORE
        </p>
      </ScrollReveal>
    </section>
  );
}
