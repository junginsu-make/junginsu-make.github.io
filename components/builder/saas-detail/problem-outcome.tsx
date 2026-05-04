"use client";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

export function SaasProblemOutcome({ saas }: { saas: SaaSDetail }) {
  if (!saas.problemStatement && !saas.outcome) return null;

  return (
    <section className="px-6 md:px-10 lg:px-16 py-20 md:py-28 border-t border-[var(--line)]">
      <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
        <MaskReveal>WHY · HOW IT CHANGES</MaskReveal>
      </p>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {saas.problemStatement && (
          <ScrollReveal>
            <div className="border-l-2 border-[var(--fg)]/30 pl-6 md:pl-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-display-md font-display opacity-15 leading-none tabular-nums">
                  01
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
                <span className="text-meta opacity-50 tracking-[0.15em]">
                  PROBLEM
                </span>
              </div>
              <h3 className="text-display-md font-display leading-[1.1] tracking-[-0.02em] mb-6">
                <MaskReveal>왜 만들었나</MaskReveal>
              </h3>
              <p className="text-body-lg opacity-85 leading-[1.7]">
                {saas.problemStatement}
              </p>
            </div>
          </ScrollReveal>
        )}

        {saas.outcome && (
          <ScrollReveal delay={0.15}>
            <div className="border-l-2 border-[var(--accent)] pl-6 md:pl-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-display-md font-display opacity-15 leading-none tabular-nums">
                  02
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: [0.6, 0.05, 0.3, 0.95],
                  }}
                  className="h-px bg-[var(--accent)] flex-1 origin-left mt-3"
                />
                <span className="text-meta tracking-[0.15em] text-[var(--accent)]">
                  OUTCOME
                </span>
              </div>
              <h3 className="text-display-md font-display leading-[1.1] tracking-[-0.02em] mb-6">
                <MaskReveal>이 SaaS로 무엇이 달라지나</MaskReveal>
              </h3>
              <p className="text-body-lg opacity-85 leading-[1.7]">
                {saas.outcome}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
