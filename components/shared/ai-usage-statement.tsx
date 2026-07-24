"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AI_USAGE } from "@/lib/data/home";

// 메인 · 빌더 페이지 공용 AI 사용 슬로건 블록 (헤드라인 + 근거 스탯 + 노하우 본문)
export function AiUsageStatement() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <p className="text-meta opacity-50 mb-10 tracking-[0.2em]">
        <MaskReveal>{AI_USAGE.eyebrow}</MaskReveal>
      </p>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em] max-w-[900px]">
        <MaskReveal>{AI_USAGE.headline}</MaskReveal>
      </h2>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10 max-w-[720px]">
        {AI_USAGE.stats.map((s, i) => (
          <ScrollReveal
            key={s.label}
            delay={i * 0.1}
            className="border-t border-[var(--line)] pt-5"
          >
            <p className="text-display-lg font-display leading-none glow-pulse">
              {/^\d+$/.test(s.value) ? (
                <Counter to={parseInt(s.value, 10)} suffix={s.suffix} />
              ) : (
                <span>
                  {s.value}
                  {s.suffix}
                </span>
              )}
            </p>
            <p className="text-meta opacity-60 mt-3">{s.label}</p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3} className="mt-16 max-w-[820px]">
        <p className="text-body-lg opacity-75 leading-[1.7]">{AI_USAGE.body}</p>
      </ScrollReveal>
    </section>
  );
}
