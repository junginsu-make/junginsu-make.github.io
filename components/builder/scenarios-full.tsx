"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  CORE_SCENARIOS,
  INVENTORY_GROUPS,
  TIMELINE_2024_2025,
} from "@/lib/data/scenarios";

export function ScenariosFull() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
        <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
          <MaskReveal>SCENARIOS · 자동화</MaskReveal>
        </p>

        <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.03em]">
          <MaskRevealStagger text="81 시스템" letterDelay={0.05} />
        </h1>

        <p className="mt-10 text-body-xl md:text-display-md font-display max-w-[860px] leading-[1.2]">
          <MaskReveal delay={0.6}>
            <span>
              <WordHighlight delay={1.0}>4 핵심</WordHighlight>이 메인 ·{" "}
              <WordHighlight delay={1.2}>77 인벤토리</WordHighlight>가 보조
            </span>
          </MaskReveal>
        </p>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          <ScrollReveal className="border-t border-[var(--line)] pt-6">
            <p className="text-display-xl font-display leading-none glow-pulse">
              <Counter to={4} />
            </p>
            <p className="text-meta opacity-70 mt-4">CORE</p>
            <p className="text-meta opacity-40 mt-1">메인 운영</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="border-t border-[var(--line)] pt-6">
            <p className="text-display-xl font-display leading-none glow-pulse">
              <Counter to={81} />
            </p>
            <p className="text-meta opacity-70 mt-4">TOTAL</p>
            <p className="text-meta opacity-40 mt-1">인벤토리</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="border-t border-[var(--line)] pt-6">
            <p className="text-display-xl font-display leading-none glow-pulse">
              <Counter to={INVENTORY_GROUPS.length} />
            </p>
            <p className="text-meta opacity-70 mt-4">GROUPS</p>
            <p className="text-meta opacity-40 mt-1">카테고리</p>
          </ScrollReveal>
          <ScrollReveal delay={0.3} className="border-t border-[var(--line)] pt-6">
            <p className="text-display-xl font-display leading-none glow-pulse">
              <Counter to={TIMELINE_2024_2025.length} />
            </p>
            <p className="text-meta opacity-70 mt-4">PHASES</p>
            <p className="text-meta opacity-40 mt-1">2024-2025 진화</p>
          </ScrollReveal>
        </div>
      </section>

      {/* CORE 4 풀 디테일 */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>CORE · 04 / 81</MaskReveal>
          </p>
          <span className="text-meta opacity-40">메인 운영</span>
        </div>

        <div className="space-y-16 md:space-y-24">
          {CORE_SCENARIOS.map((s) => (
            <article
              key={s.number}
              className="grid md:grid-cols-12 gap-8 md:gap-12 border-t border-[var(--line)] pt-10 md:pt-14"
            >
              <div className="md:col-span-2">
                <p className="text-display-lg font-display opacity-15 leading-none tabular-nums">
                  {String(s.number).padStart(2, "0")}
                </p>
              </div>
              <div className="md:col-span-10">
                <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-[920px]">
                  <MaskReveal>{s.title}</MaskReveal>
                </h2>

                <ScrollReveal delay={0.15}>
                  <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3 text-meta opacity-70">
                    {s.flow.map((step, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span className="border border-[var(--line)] px-3 py-1.5">
                          {step}
                        </span>
                        {j < s.flow.length - 1 && (
                          <span className="opacity-40">→</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </ScrollReveal>

                <ScrollReveal delay={0.3} className="mt-8">
                  <div className="flex items-baseline gap-3 text-meta">
                    <span className="opacity-40 tracking-[0.2em]">METRIC</span>
                    <span className="opacity-90 text-[var(--accent)]">
                      {s.metric}
                    </span>
                  </div>
                </ScrollReveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 81 인벤토리 그룹 — 트리맵 대체 (시각 임팩트) */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>INVENTORY · {INVENTORY_GROUPS.length} GROUPS</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">77 SYSTEMS</span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>6 카테고리로 묶은 77 보조 시스템 인벤토리</span>
          </MaskReveal>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {INVENTORY_GROUPS.map((g, i) => (
            <ScrollReveal
              key={g.name}
              delay={i * 0.06}
              className="bg-[var(--bg)] p-7 md:p-8 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-meta opacity-50 tabular-nums">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-display-md font-display leading-none tabular-nums">
                  {g.count}
                </span>
              </div>

              <h3 className="text-body-lg font-medium leading-[1.3] group-hover:text-[var(--accent)] transition-colors duration-300">
                {g.name}
              </h3>

              <p className="mt-4 font-mono text-meta opacity-50 group-hover:opacity-80 transition-opacity duration-300">
                {g.systemRange}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TIMELINE 2024-2025 진화 */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>TIMELINE · 2024 → 2025</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            {TIMELINE_2024_2025.length} PHASES
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>기반 구축 → 확장 → 심화 → 전문화 → 클라이언트 납품</span>
          </MaskReveal>
        </h2>

        <div className="border-t border-[var(--line)]">
          {TIMELINE_2024_2025.map((p, i) => (
            <ScrollReveal
              key={p.period}
              delay={Math.min(i * 0.04, 0.3)}
              className="grid grid-cols-12 gap-x-4 gap-y-2 py-6 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-300"
            >
              <span className="col-span-12 md:col-span-2 text-meta opacity-60 tabular-nums">
                {p.period}
              </span>
              <span className="col-span-12 md:col-span-3 text-body-lg font-medium">
                {p.phase}
              </span>
              <span className="col-span-12 md:col-span-7 text-body opacity-75">
                {p.note}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
