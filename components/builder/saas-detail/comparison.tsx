"use client";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

/**
 * 같은 목표, 다른 과정 — 일반 접근과 이 시스템의 단계 수를 나란히 놓는다.
 * 단계 수의 격차 자체가 메시지이므로 숫자를 크게 노출한다.
 */
export function SaasComparison({ saas }: { saas: SaaSDetail }) {
  const diff = saas.differentiation;
  if (!diff) return null;

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>SAME GOAL · DIFFERENT PROCESS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {diff.genericSteps.length} → {diff.pipeline.length} STEPS
        </span>
      </div>

      <ScrollReveal>
        <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em] mb-14 md:mb-20 max-w-[900px]">
          결과만 보면 비슷합니다. 과정이 다릅니다.
        </h2>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* 좌 — 일반 접근 (저채도) */}
        <ScrollReveal>
          <div className="border-t border-[var(--line)] pt-8 opacity-45">
            <div className="flex items-baseline justify-between mb-8">
              <span className="text-meta tracking-[0.15em]">일반 접근</span>
              <span className="text-display-lg font-display leading-none tabular-nums">
                {diff.genericSteps.length.toString().padStart(2, "0")}
              </span>
            </div>
            <p className="text-body-lg leading-[1.7] mb-8">{diff.genericLabel}</p>
            <ol className="space-y-4">
              {diff.genericSteps.map((step, i) => (
                <li key={i} className="flex gap-4 items-baseline">
                  <span className="text-meta tabular-nums shrink-0 opacity-70">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-body-lg leading-[1.6]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        {/* 우 — 이 시스템 (액센트) */}
        <ScrollReveal delay={0.15}>
          <div className="border-t-2 border-[var(--accent)] pt-8">
            <div className="flex items-baseline justify-between mb-8">
              <span className="text-meta tracking-[0.15em] text-[var(--accent)]">
                {saas.name}
              </span>
              <span className="text-display-lg font-display leading-none tabular-nums text-[var(--accent)]">
                {diff.pipeline.length.toString().padStart(2, "0")}
              </span>
            </div>
            <p className="text-body-lg leading-[1.7] mb-8 opacity-85">
              같은 목표를 {diff.pipeline.length}단계로 나눠 각 단계에 검증을 건다.
            </p>
            <ol className="space-y-4">
              {diff.pipeline.map((stage, i) => (
                <li key={i} className="flex gap-4 items-baseline">
                  <span className="text-meta tabular-nums shrink-0 text-[var(--accent)]">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-body-lg leading-[1.6] opacity-90">
                    {stage.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.3, 0.95] }}
          className="h-px bg-[var(--accent)] origin-left mt-16 md:mt-20"
        />
      </ScrollReveal>
    </section>
  );
}
