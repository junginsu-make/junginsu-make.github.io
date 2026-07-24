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

const KPIS: Kpi[] = [
  { to: GITHUB_TOTAL, label: "Vibe Coding Repos", note: "외부 공개" },
  { to: 4, label: "자동화 Core", note: "핵심 시나리오" },
  { to: 10, label: "Live SaaS", note: "프로덕션 운영" },
  { to: 81, label: "Total Systems", note: "자동화 시나리오 인벤토리" },
];

export function BuilderHero() {
  return (
    <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
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
              <WordHighlight delay={1.55}>SaaS 10 Live</WordHighlight>
            </span>
          </MaskReveal>
        </span>
        <span className="block mt-3 text-body-lg opacity-70">
          <MaskReveal delay={1.0}>
            <span>기획 · 설계 · 구현 · 검증 · 배포까지 — 전부 1인 풀사이클</span>
          </MaskReveal>
        </span>
      </div>

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
