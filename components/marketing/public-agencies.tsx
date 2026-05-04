"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { PUBLIC_AGENCIES } from "@/lib/data/marketing";

const CATEGORY_GLYPH = {
  "정부 부처": "🏛",
  공공기관: "▲",
  공기업: "◆",
  지자체: "■",
  NGO: "◯",
} as const;

const CATEGORY_COLOR = {
  "정부 부처": "var(--accent)",
  공공기관: "currentColor",
  공기업: "currentColor",
  지자체: "currentColor",
  NGO: "currentColor",
} as const;

export function PublicAgencies() {
  const total = PUBLIC_AGENCIES.length;
  const categories = Array.from(
    new Set(PUBLIC_AGENCIES.map((a) => a.category)),
  );

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>PUBLIC SECTOR · CLIENTS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          <Counter to={total} /> AGENCIES · {categories.length} CATEGORIES
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[920px]">
        <MaskReveal>
          <span>
            정부 부처 · 공공기관 · 공기업 ·{" "}
            <WordHighlight delay={0.6}>지자체</WordHighlight>까지
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 max-w-[820px] leading-[1.6] mb-16">
          제안서 작성·PT 발표·과업 총괄 PM·소셜미디어 운영·AI 강의까지 — 모든 형태로
          공공 영역과 협업한 이력. 카테고리별 색 구분으로 한눈에.
        </p>
      </ScrollReveal>

      {/* 카테고리 카운트 요약 */}
      <ScrollReveal delay={0.3} className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8">
          {categories.map((cat) => {
            const count = PUBLIC_AGENCIES.filter(
              (a) => a.category === cat,
            ).length;
            return (
              <div
                key={cat}
                className="border-t border-[var(--line)] pt-4"
              >
                <p className="text-display-md font-display leading-none tabular-nums">
                  <Counter to={count} />
                </p>
                <p className="text-meta opacity-60 mt-3">{cat}</p>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 12 기관 카드 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
        {PUBLIC_AGENCIES.map((a, i) => (
          <ScrollReveal
            key={a.name}
            delay={Math.min(i * 0.05, 0.4)}
            className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
          >
            <div className="flex items-baseline justify-between mb-5">
              <span
                className="font-mono text-meta opacity-60"
                style={{ color: CATEGORY_COLOR[a.category] }}
              >
                <span className="mr-2">{CATEGORY_GLYPH[a.category]}</span>
                {a.category}
              </span>
              <span className="text-meta opacity-40 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-300">
              {a.name}
            </h3>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.6, 0.05, 0.3, 0.95] }}
              className="my-5 h-px bg-[var(--accent)] origin-left"
            />

            <p className="text-meta opacity-70 leading-[1.55]">{a.role}</p>

            {a.period && (
              <p className="text-meta opacity-40 mt-3 font-mono">
                {a.period}
              </p>
            )}
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
