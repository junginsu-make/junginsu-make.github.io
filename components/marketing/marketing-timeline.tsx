"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { MARKETING_TIMELINE } from "@/lib/data/marketing";

export function MarketingTimeline() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>CAREER · 17년 마케팅 진화</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          <Counter to={MARKETING_TIMELINE.length} /> MILESTONES
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            입학·홍보 → 프랜차이즈 → 광고대행 →{" "}
            <WordHighlight delay={0.6}>AI Builder</WordHighlight>
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 max-w-[920px] leading-[1.6] mb-16">
          17년 마케팅 영역의 진화를 회사·역할·임팩트 기준으로 정리. 각 시기별로
          어떤 채널·도구·스케일을 다뤘는지 — 이력서에 흩어진 디테일을 한 흐름으로.
        </p>
      </ScrollReveal>

      <div className="space-y-16 md:space-y-20">
        {MARKETING_TIMELINE.map((m, i) => (
          <article
            key={m.number}
            className="grid md:grid-cols-12 gap-8 md:gap-10 border-t border-[var(--line)] pt-10 md:pt-14"
          >
            {/* 번호 + 시기 */}
            <div className="md:col-span-3">
              <p className="text-display-md md:text-display-lg font-display opacity-15 leading-none tabular-nums">
                {m.number}
              </p>
              <p className="mt-5 text-meta opacity-60 tabular-nums leading-[1.5]">
                {m.period}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.6, 0.05, 0.3, 0.95],
                }}
                className="mt-5 h-px bg-[var(--accent)] origin-left w-16"
              />
              <p className="mt-5 text-meta opacity-50 tracking-[0.15em]">
                {m.era}
              </p>
            </div>

            {/* 회사 + 역할 + 디테일 */}
            <div className="md:col-span-9">
              <div className="flex items-baseline flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-display-md font-display leading-[1.1] tracking-[-0.02em]">
                  <MaskReveal>{m.company}</MaskReveal>
                </h3>
                <span className="text-meta opacity-60">·</span>
                <span className="text-body-lg opacity-80">{m.role}</span>
              </div>

              <ScrollReveal delay={0.15}>
                <p className="mt-6 text-body-lg opacity-90 leading-[1.6] max-w-[820px]">
                  {m.highlight}
                </p>
              </ScrollReveal>

              {m.scale && (
                <ScrollReveal delay={0.25}>
                  <div className="mt-6 inline-flex items-center gap-3 border border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] px-4 py-2">
                    <span className="text-meta tracking-[0.15em] text-[var(--accent)]">
                      SCALE
                    </span>
                    <span className="text-meta opacity-90">{m.scale}</span>
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal delay={0.35}>
                <ul className="mt-8 space-y-3">
                  {m.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex gap-4 text-body opacity-80 leading-[1.6] max-w-[920px]"
                    >
                      <span className="text-meta opacity-40 tabular-nums shrink-0 w-6 mt-1">
                        {(j + 1).toString().padStart(2, "0")}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </article>
        ))}
      </div>

      <ScrollReveal delay={0.5} className="mt-12">
        <p className="text-meta opacity-50 leading-[1.7] max-w-[820px]">
          ※ 자료: 정인수 이력서.pdf 페이지 2~5 · 17년 4개월 마케팅 경력의 6개
          전환점. 과거 모든 회사·기관·역할 풀 타임라인은{" "}
          <span className="text-[var(--accent)]">/career</span> 페이지의 17 회사
          풀 타임라인 토글에서 확인.
        </p>
      </ScrollReveal>
    </section>
  );
}
