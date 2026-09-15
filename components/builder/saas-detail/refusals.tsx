"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

/**
 * 이 시스템이 하지 않는 것 — 거부 목록이 곧 품질 기준 목록이다.
 * 무엇을 거부할지는 판단 기준이 있어야 정할 수 있어, 흉내로는 나오지 않는다.
 */
export function SaasRefusals({ saas }: { saas: SaaSDetail }) {
  const diff = saas.differentiation;
  if (!diff || diff.refusals.length === 0) return null;

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>WHAT THIS SYSTEM REFUSES TO DO</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {diff.refusals.length.toString().padStart(2, "0")} RULES
        </span>
      </div>

      <ScrollReveal>
        <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em] mb-6 max-w-[900px]">
          이 시스템이 하지 않는 것
        </h2>
        <p className="text-body-lg opacity-70 leading-[1.7] mb-16 md:mb-20 max-w-[760px]">
          무엇을 만들지보다 무엇을 내보내지 않을지가 결과물의 수준을 정합니다.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
        {diff.refusals.map((refusal, i) => (
          <ScrollReveal key={i} delay={(i % 2) * 0.1}>
            <div className="border-t border-[var(--line)] pt-8">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="text-meta tabular-nums opacity-40">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[var(--accent)] text-body-lg leading-none"
                >
                  ✕
                </span>
              </div>
              <h3 className="text-body-xl font-display leading-[1.25] tracking-[-0.01em] mb-4">
                {refusal.rule}
              </h3>
              <p className="text-body-lg opacity-75 leading-[1.7]">
                {refusal.reason}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
