"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

type Kpi = {
  to: number;
  suffix: string;
  prefix?: string;
  label: string;
  note: string;
};

const KPIS: Kpi[] = [
  {
    to: 7404,
    suffix: "%",
    label: "TMON ROAS",
    note: "3,516% → 7,404% (▲ 3,888%p)",
  },
  {
    to: 79,
    suffix: ".4억",
    label: "GR 증가",
    note: "208억 → 288억 매출",
  },
  {
    to: 86560,
    suffix: "명",
    label: "BU 신규 회원",
    note: "94,153 → 180,713",
  },
  {
    to: 50,
    suffix: "%",
    prefix: "▼ ",
    label: "CPBU 절감",
    note: "4,709원 → 2,365원",
  },
];

export function MarketingHero() {
  return (
    <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
      <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
        <MaskReveal>MARKETING · PERFORMANCE</MaskReveal>
      </p>

      <h1 className="text-display-lg lg:text-display-xl font-display leading-[0.95] tracking-[-0.03em] [word-break:keep-all]">
        <MaskRevealStagger text="Marketing Performance" letterDelay={0.05} />
      </h1>

      <p className="mt-20 md:mt-24 text-body-xl md:text-display-md font-display max-w-[860px] leading-[1.2]">
        <MaskReveal delay={0.6}>
          <span>
            17년의 광고 운영 · PM · 강의가 한 화면에서 증명되는{" "}
            <WordHighlight delay={1.0}>숫자</WordHighlight>들
          </span>
        </MaskReveal>
      </p>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {KPIS.map((k, i) => (
          <ScrollReveal
            key={k.label}
            delay={i * 0.1}
            className="border-t border-[var(--line)] pt-6"
          >
            {/* number와 suffix 분리 — number 큰 폰트, suffix 작은 폰트 → 줄바꿈 방지 */}
            <p className="font-display leading-none tracking-[-0.04em] glow-pulse flex items-baseline gap-1 flex-wrap">
              {k.prefix && (
                <span className="text-[var(--accent)] text-display-md md:text-display-lg">
                  {k.prefix.trim()}
                </span>
              )}
              <span className="text-display-lg md:text-display-xl tabular-nums">
                <Counter to={k.to} />
              </span>
              <span className="text-display-md md:text-display-lg opacity-90">
                {k.suffix}
              </span>
            </p>
            <p className="text-meta opacity-70 mt-5 tracking-[0.1em]">
              {k.label}
            </p>
            <p className="text-meta opacity-40 mt-2 leading-[1.5]">{k.note}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.6} className="mt-12">
        <p className="text-body opacity-70 leading-[1.6] max-w-[760px]">
          <span className="text-[var(--accent)] mr-2">✓</span>
          출처: 정인수 본인 작성{" "}
          <span className="font-mono text-meta opacity-90">
            「개인 포토폴리오-23.03.02.pdf」
          </span>{" "}
          — TMON 공식 광고대행 운영총괄실장
        </p>
      </ScrollReveal>
    </section>
  );
}
