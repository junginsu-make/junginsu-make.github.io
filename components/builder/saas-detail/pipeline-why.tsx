"use client";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

/**
 * 실제 파이프라인 — 각 단계에 "왜 이 단계가 있나"를 붙인다.
 * 단계는 베낄 수 있어도 단계가 존재하는 이유는 실무자만 쓸 수 있다.
 */
export function SaasPipelineWhy({ saas }: { saas: SaaSDetail }) {
  const diff = saas.differentiation;
  if (!diff) return null;

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>HOW IT ACTUALLY WORKS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {diff.pipeline.length.toString().padStart(2, "0")} STAGES
        </span>
      </div>

      <ScrollReveal>
        <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em] mb-6 max-w-[900px]">
          각 단계가 존재하는 이유
        </h2>
        <p className="text-body-lg opacity-70 leading-[1.7] mb-16 md:mb-20 max-w-[760px]">
          단계는 베낄 수 있습니다. 단계가 왜 거기 있어야 하는지는 그 일을 해본
          사람만 압니다.
        </p>
      </ScrollReveal>

      <ol className="space-y-14 md:space-y-20">
        {diff.pipeline.map((stage, i) => (
          <li
            key={i}
            className="grid md:grid-cols-12 gap-6 md:gap-12 border-t border-[var(--line)] pt-8 md:pt-10"
          >
            <div className="md:col-span-5">
              <div className="flex items-baseline gap-5">
                <span className="text-display-md md:text-display-lg font-display opacity-15 leading-none tabular-nums shrink-0">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                    ease: [0.6, 0.05, 0.3, 0.95],
                  }}
                  className="h-px bg-current opacity-30 flex-1 origin-left mt-3"
                />
              </div>
              <h3 className="mt-6 text-body-xl md:text-display-md font-display leading-[1.15] tracking-[-0.02em]">
                <MaskReveal>{stage.name}</MaskReveal>
              </h3>
            </div>

            <div className="md:col-span-7">
              <ScrollReveal delay={0.1}>
                <p className="text-body-lg opacity-85 leading-[1.7]">
                  {stage.detail}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="mt-8 border-l-2 border-[var(--accent)] pl-6">
                  <p className="text-meta tracking-[0.15em] text-[var(--accent)] mb-3">
                    왜 이 단계가 있나
                  </p>
                  <p className="text-body-lg opacity-80 leading-[1.7]">
                    {stage.why}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </li>
        ))}
      </ol>

      {diff.narrative && diff.narrative.length > 0 && (
        <ScrollReveal delay={0.15}>
          {/* 파이프라인 행과 같은 12칸 격자 — 한 단 고정 폭이면 넓은 화면에서 우측이 통째로 빈다. */}
          <div className="mt-20 md:mt-28 border-t border-[var(--line)] pt-12 md:pt-16 grid md:grid-cols-12 gap-6 md:gap-12">
            <div className="md:col-span-5">
              <p className="text-meta opacity-60 tracking-[0.2em]">WHY IT MATTERS</p>
              <h3 className="mt-6 text-body-xl md:text-display-md font-display leading-[1.15] tracking-[-0.02em]">
                <MaskReveal>결국 무엇이 갈리나</MaskReveal>
              </h3>
            </div>
            <div className="md:col-span-7 space-y-6">
              {diff.narrative.map((para, i) => (
                <p key={i} className="text-body-lg opacity-85 leading-[1.8]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
