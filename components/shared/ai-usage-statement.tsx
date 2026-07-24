"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { PulseNumber } from "@/components/motion/pulse-number";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { AI_USAGE } from "@/lib/data/home";

// 메인 · 빌더 페이지 공용 AI 사용 슬로건 블록
// 헤드라인(리드 + 펀치) · 8개 분야 스태거 · 카운트업 스탯 · 노하우 본문
export function AiUsageStatement() {
  return (
    <section className="relative px-6 md:px-10 lg:px-16 py-24 md:py-36 border-t border-[var(--line)] overflow-hidden">
      {/* eyebrow + 악센트 룰 draw */}
      <div className="flex items-center gap-4 mb-10">
        <p className="text-meta opacity-50 tracking-[0.25em]">
          <MaskReveal>{AI_USAGE.eyebrow}</MaskReveal>
        </p>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.6, 0.05, 0.3, 0.95] }}
          className="inline-block h-px w-16 md:w-28 bg-[var(--accent)] origin-left"
        />
      </div>

      {/* 헤드라인 — 리드(작게·흐리게) + 펀치(크게 + WordHighlight) */}
      <h2 className="font-display tracking-[-0.02em]">
        <span className="block text-body-xl md:text-display-md opacity-45 mb-2 md:mb-4">
          <MaskReveal delay={0.05}>{AI_USAGE.headlineLead}</MaskReveal>
        </span>
        <span className="block text-display-lg md:text-display-xl leading-[0.98] max-w-[16ch]">
          <MaskReveal delay={0.2}>
            <span>
              {AI_USAGE.headlineMain}
              <WordHighlight delay={0.95}>{AI_USAGE.headlineAccent}</WordHighlight>.
            </span>
          </MaskReveal>
        </span>
      </h2>

      {/* 8개 분야 — 스태거 reveal로 "전 영역" 시각 증명 */}
      <div className="mt-12 flex flex-wrap items-center gap-y-2 text-body md:text-body-lg opacity-85">
        {AI_USAGE.categories.map((c, i) => (
          <span key={c} className="inline-flex items-center">
            <MaskReveal delay={0.55 + i * 0.07}>
              <span className="transition-colors duration-300 hover:text-[var(--accent)]">
                {c}
              </span>
            </MaskReveal>
            {i < AI_USAGE.categories.length - 1 && (
              <span className="mx-2 opacity-25">·</span>
            )}
          </span>
        ))}
      </div>

      {/* 카운트업 스탯 — Counter + PulseNumber 호흡 + glow (세로 스택으로 큰 숫자에 여백 확보) */}
      <div className="mt-20 space-y-10 max-w-[760px]">
        {AI_USAGE.stats.map((s, i) => (
          <ScrollReveal
            key={s.label}
            delay={i * 0.15}
            className="border-t border-[var(--line)] pt-6"
          >
            <p className="text-display-lg font-display leading-none glow-pulse tabular-nums">
              <PulseNumber>
                <Counter to={s.to} suffix={s.suffix} duration={s.duration} />
              </PulseNumber>
            </p>
            <p className="text-meta opacity-60 mt-5">{s.label}</p>
          </ScrollReveal>
        ))}
      </div>

      {/* 노하우 본문 */}
      <ScrollReveal delay={0.2} className="mt-20 max-w-[820px]">
        <p className="text-body-lg opacity-75 leading-[1.75]">{AI_USAGE.body}</p>
      </ScrollReveal>
    </section>
  );
}
