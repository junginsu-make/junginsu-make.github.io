"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AD_CHANNELS, COMPANY_AD_BUDGET } from "@/lib/data/marketing";

export function AdChannels() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>AD OPERATION · 10년+ 누적</MaskReveal>
        </p>
        <span className="text-meta opacity-40">
          {AD_CHANNELS.owned.length + AD_CHANNELS.paid.length} CHANNELS
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
        <MaskReveal>
          <span>Owned + Paid 멀티채널 통합 운영</span>
        </MaskReveal>
      </h2>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <ScrollReveal>
          <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">
            OWNED MEDIA · {AD_CHANNELS.owned.length}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {AD_CHANNELS.owned.map((ch) => (
              <span
                key={ch}
                className="text-body border border-[var(--line)] px-5 py-2.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {ch}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">
            PAID MEDIA · {AD_CHANNELS.paid.length}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {AD_CHANNELS.paid.map((ch) => (
              <span
                key={ch}
                className="text-body border border-[var(--line)] px-5 py-2.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {ch}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* 회사별 광고비 운영 규모 (TMON 디테일은 위 섹션에서 시각화) */}
      <ScrollReveal delay={0.3} className="mt-20 md:mt-24">
        <p className="text-meta opacity-60 mb-8 tracking-[0.2em]">
          광고비 운영 규모 (확정 · 검증)
        </p>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          {COMPANY_AD_BUDGET.map((b, i) => (
            <div
              key={b.company}
              className="bg-[var(--bg)] p-7 md:p-8 group"
            >
              <p className="text-meta opacity-50 mb-4 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </p>
              <p className="text-display-md font-display leading-none tracking-[-0.03em] mb-5">
                {b.budget}
              </p>
              <p className="text-body-lg font-medium leading-[1.4]">
                {b.company}
              </p>
              <p className="text-meta opacity-60 mt-3 leading-[1.55]">
                {b.note}
              </p>
              {b.metrics && (
                <p className="mt-4 text-meta opacity-50 leading-[1.55]">
                  ↑ 자세한 KPI는 상단 「TMON CASE」 섹션 참조
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
