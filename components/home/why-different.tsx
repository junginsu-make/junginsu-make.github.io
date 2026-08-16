"use client";
import { motion } from "framer-motion";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SweepLink } from "@/components/motion/color-sweep";
import { WHY_DIFFERENT } from "@/lib/data/home";

/**
 * 홈에서 유일하게 수량이 아니라 판단 기준을 말하는 섹션.
 * 각 거부 기준은 해당 SaaS 상세 페이지의 같은 섹션으로 연결된다.
 */
export function WhyDifferent() {
  const d = WHY_DIFFERENT;

  // 아래쪽 패딩을 위쪽보다 작게 둔다 — 다음 섹션(ThreeCategories)이 py-32를 자체로
  // 갖고 있어, 대칭으로 두면 이 섹션 아래 여백만 272px로 벌어진다.
  return (
    <section className="px-6 md:px-10 lg:px-16 pt-28 md:pt-36 pb-12 md:pb-20 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-10 md:mb-14">
        <p className="text-meta opacity-50 tracking-[0.2em]">
          <MaskReveal>{d.eyebrow}</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {d.highlights.length.toString().padStart(2, "0")} RULES
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
        <span className="block opacity-45">
          <MaskRevealStagger text={d.headlineLead} letterDelay={0.02} />
        </span>
        <span className="block mt-3">
          <MaskReveal delay={0.35}>
            <span>
              {d.headlineMain}
              <span className="text-[var(--accent)]">{d.headlineAccent}</span>
            </span>
          </MaskReveal>
        </span>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-70 leading-[1.7] mt-8 md:mt-10 max-w-[680px]">
          {d.bodyLines[0]}
          <br />
          {d.bodyLines[1]}
        </p>
      </ScrollReveal>

      <ul className="mt-14 md:mt-20 grid md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
        {d.highlights.map((h, i) => (
          <ScrollReveal key={h.slug} delay={0.15 + (i % 2) * 0.1}>
            <li>
              <SweepLink
                href={`/builder/${h.slug}`}
                className="group block border-t border-[var(--line)] pt-6 hover:border-[var(--accent)] transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="text-[var(--accent)] text-body-lg leading-[1.5] shrink-0"
                  >
                    ✕
                  </span>
                  <div>
                    <p className="text-body-xl font-display leading-[1.35] tracking-[-0.01em]">
                      {h.rule}
                    </p>
                    <p className="text-meta opacity-50 mt-3 group-hover:opacity-90 group-hover:text-[var(--accent)] transition-all duration-300">
                      {h.system} →
                    </p>
                  </div>
                </div>
              </SweepLink>
            </li>
          </ScrollReveal>
        ))}
      </ul>

      <ScrollReveal delay={0.3}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.3, 0.95] }}
          className="h-px bg-[var(--accent)] origin-left mt-16 md:mt-20"
        />
        <SweepLink
          href={d.ctaHref}
          className="group inline-flex items-baseline gap-3 mt-8 text-meta tracking-[0.15em] hover:text-[var(--accent)] transition-colors duration-300"
        >
          <span className="opacity-70 group-hover:opacity-100 transition-opacity">
            {d.ctaLabel}
          </span>
          <span aria-hidden="true">→</span>
        </SweepLink>
      </ScrollReveal>
    </section>
  );
}
