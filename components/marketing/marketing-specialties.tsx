"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  MARKETING_SPECIALTIES,
  AD_BUDGET_HIGHLIGHTS,
} from "@/lib/data/marketing";

export function MarketingSpecialties() {
  const totalItems = MARKETING_SPECIALTIES.reduce(
    (sum, s) => sum + s.items.length,
    0,
  );

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>SPECIALTIES · OPERATIONAL DEPTH</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          <Counter to={totalItems} /> ITEMS · {MARKETING_SPECIALTIES.length} 영역
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[920px]">
        <MaskReveal>
          <span>
            마케팅의 <WordHighlight delay={0.6}>표면</WordHighlight>이 아니라{" "}
            <WordHighlight delay={0.85}>운영 디테일</WordHighlight>
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 max-w-[820px] leading-[1.6] mb-16">
          17년간 직접 운영한 채널·도구·전략. 각 항목은 실제 라이브 운영 경험만
          포함 — 도구를 들어본 수준이 아닌, 광고비·정산·KPI 까지 책임진 영역.
        </p>
      </ScrollReveal>

      {/* 6 영역 — 카테고리별 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] mb-20">
        {MARKETING_SPECIALTIES.map((s, i) => (
          <ScrollReveal
            key={s.category}
            delay={i * 0.06}
            className="bg-[var(--bg)] p-7 md:p-8 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-meta opacity-50 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-meta opacity-40">
                {s.items.length} ITEMS
              </span>
            </div>

            <h3 className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-300">
              {s.category}
            </h3>

            <ul className="mt-6 space-y-1.5">
              {s.items.map((it) => (
                <li
                  key={it}
                  className="font-mono text-meta opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  ./{it}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ))}
      </div>

      {/* 광고비 운영 highlight (이력서 페이지 4 자료) */}
      <ScrollReveal delay={0.35}>
        <div className="border-t border-[var(--line)] pt-10">
          <p className="text-meta opacity-60 mb-8 tracking-[0.2em]">
            BUDGET HIGHLIGHTS · 퍼스트 아카데미 시기
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {AD_BUDGET_HIGHLIGHTS.map((b, i) => (
              <ScrollReveal
                key={b.label}
                delay={i * 0.08}
              >
                <p className="text-display-md font-display leading-none tabular-nums">
                  {b.value}
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  {b.label}
                </p>
                <p className="text-meta opacity-40 mt-1">{b.source}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
