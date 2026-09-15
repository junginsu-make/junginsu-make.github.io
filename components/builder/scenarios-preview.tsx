"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SweepLink } from "@/components/motion/color-sweep";
import { CORE_SCENARIOS } from "@/lib/data/scenarios";

export function ScenariosPreview() {
  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          자동화 시나리오 · CORE
        </p>
        <span className="text-meta opacity-40">04 / 81</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[0.95] max-w-[920px]">
        <MaskReveal>
          <span>4 핵심 시나리오 — 실제 매출과 운영을 돌리는 자동화</span>
        </MaskReveal>
      </h2>

      <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
        {CORE_SCENARIOS.map((s, i) => (
          <ScrollReveal
            key={s.number}
            delay={i * 0.08}
            className="bg-[var(--bg)] p-8 md:p-10 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-meta opacity-50">
                SCENARIO {s.number.toString().padStart(2, "0")}
              </span>
              <span className="text-meta text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {s.metric}
              </span>
            </div>

            <h3 className="text-display-md font-display leading-[1.05] tracking-[-0.02em]">
              {s.title}
            </h3>

            <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-meta opacity-60">
              {s.flow.map((step, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span>{step}</span>
                  {j < s.flow.length - 1 && (
                    <span className="opacity-40">→</span>
                  )}
                </li>
              ))}
            </ol>

            <p className="mt-8 text-meta opacity-50 group-hover:opacity-0 transition-opacity duration-500">
              {s.metric}
            </p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4} className="mt-16">
        <SweepLink
          href="/builder/scenarios"
          className="inline-flex items-center gap-3 text-body-lg border-b border-[var(--fg)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
        >
          <span>81 시스템 인벤토리 전체 보기</span>
          <span aria-hidden>→</span>
        </SweepLink>
      </ScrollReveal>
    </section>
  );
}
