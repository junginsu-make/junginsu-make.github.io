"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { MARKETING_TIMELINE } from "@/lib/data/marketing";

/**
 * 17년 마케팅 진화 — vertical rail 형태로 차별화.
 * 다른 섹션의 grid·card 패턴 X. 좌측 vertical line + node dot + 우측 콘텐츠.
 * 텍스트 영역은 넓게 (col 11/12) — 2줄로 보이는 issue 해결.
 */
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
        <p className="mt-6 text-body-lg opacity-75 leading-[1.6] mb-20 md:mb-24 lg:whitespace-nowrap">
          17년 마케팅 영역의 진화를 회사·역할·임팩트 기준으로 정리 — 이력서에
          흩어진 디테일을 한 흐름으로.
        </p>
      </ScrollReveal>

      {/* Vertical timeline rail */}
      <div className="relative">
        {/* 좌측 세로 라인 — 전체 길이 */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.6, ease: [0.6, 0.05, 0.3, 0.95] }}
          className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-[var(--accent)]/40 origin-top"
          aria-hidden
        />

        <ol className="space-y-16 md:space-y-24">
          {MARKETING_TIMELINE.map((m, i) => (
            <li
              key={m.number}
              className="relative grid grid-cols-[1.5rem_1fr] md:grid-cols-[2.5rem_1fr] gap-x-6 md:gap-x-10"
            >
              {/* 노드 점 + 인덱스 */}
              <div className="relative">
                {/* 점 */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    ease: [0.6, 0.05, 0.3, 0.95],
                  }}
                  className="absolute -left-1 top-3 w-3 h-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg)] z-10"
                  aria-hidden
                />
                {/* 펄스 링 — 마지막 milestone (현재) 만 */}
                {i === MARKETING_TIMELINE.length - 1 && (
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute -left-1 top-3 w-3 h-3 rounded-full bg-[var(--accent)]"
                  />
                )}
                {/* 인덱스 — 점 아래 */}
                <span className="absolute -left-1.5 md:-left-3 top-12 text-meta opacity-50 tabular-nums tracking-[0.1em]">
                  {m.number}
                </span>
              </div>

              {/* 콘텐츠 — 우측 풀 너비 */}
              <article className="min-w-0 pb-2">
                {/* 시기 + era 라벨 — 헤딩 위 한 줄로 */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-meta opacity-60 mb-4">
                  <span className="tabular-nums">{m.period}</span>
                  <span className="opacity-40">·</span>
                  <span className="tracking-[0.15em] text-[var(--accent)]">
                    {m.era}
                  </span>
                </div>

                {/* 회사 + 역할 — 두 줄 wrap 허용 (긴 회사명 대비) */}
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h3 className="text-display-md font-display leading-[1.1] tracking-[-0.02em]">
                    <MaskReveal>{m.company}</MaskReveal>
                  </h3>
                  <span className="text-body-lg opacity-70">{m.role}</span>
                </div>

                {/* highlight — 큰 영역, 한 줄로 */}
                <ScrollReveal delay={0.15}>
                  <p className="mt-6 text-body-lg md:text-display-md font-display leading-[1.3] tracking-[-0.015em] opacity-95 max-w-none">
                    {m.highlight}
                  </p>
                </ScrollReveal>

                {/* SCALE 박스 — 임팩트 메트릭 */}
                {m.scale && (
                  <ScrollReveal delay={0.25}>
                    <div className="mt-6 inline-flex items-center gap-3 border border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] px-5 py-2.5">
                      <span className="text-meta tracking-[0.15em] text-[var(--accent)]">
                        SCALE
                      </span>
                      <span className="text-body opacity-90">{m.scale}</span>
                    </div>
                  </ScrollReveal>
                )}

                {/* bullets — 텍스트 영역 풀 너비 */}
                <ScrollReveal delay={0.35}>
                  <ul className="mt-8 space-y-3.5">
                    {m.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-4 text-body opacity-80 leading-[1.65]"
                      >
                        <span className="text-meta opacity-40 tabular-nums shrink-0 w-7 mt-1">
                          {(j + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="min-w-0">{b}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <ScrollReveal delay={0.5} className="mt-16 ml-9 md:ml-14">
        <p className="text-meta opacity-50 leading-[1.7] max-w-[920px]">
          ※ 자료: 정인수 이력서.pdf 페이지 2~5 · 17년 4개월 마케팅 경력의 6개
          전환점. 과거 모든 회사·기관·역할 풀 타임라인은{" "}
          <span className="text-[var(--accent)]">/career</span> 페이지의 17 회사
          풀 타임라인 토글에서 확인.
        </p>
      </ScrollReveal>
    </section>
  );
}
