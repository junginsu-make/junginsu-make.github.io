"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { AI_SAAS_PL_CLIENTS } from "@/lib/data/builder-clients";

export function AiSaasPlSection() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>AI SAAS PL · CLIENTS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          <Counter to={AI_SAAS_PL_CLIENTS.length} /> IN PROGRESS
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            클라이언트 AI 시스템 기획 + 개발{" "}
            <WordHighlight delay={0.6}>PL</WordHighlight> · 4건 진행 중...
          </span>
        </MaskReveal>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
        {AI_SAAS_PL_CLIENTS.map((c, i) => (
          <ScrollReveal
            key={c.name}
            delay={i * 0.08}
            className="bg-[var(--bg)] p-8 md:p-10 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-meta opacity-50 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-2 text-meta opacity-60 group-hover:text-[var(--accent)] group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span>IN PROGRESS</span>
              </span>
            </div>

            <h3 className="text-display-md font-display leading-[1.1] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-500">
              {c.name}
            </h3>

            <p className="mt-4 text-meta opacity-60 tracking-[0.1em]">
              {c.domain}
            </p>

            <p className="mt-6 text-body opacity-80 leading-[1.6]">
              {c.scope}
            </p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4} className="mt-12">
        <p className="text-meta opacity-50 leading-[1.7] lg:whitespace-nowrap">
          ※ 마케팅 캠페인이 아니라 AI 시스템 구축 PL 역할 — 기획 → 데이터 모델 →
          시나리오 → 멀티 LLM 라우팅 → 사내 OS 까지 동일 흐름.
        </p>
      </ScrollReveal>
    </section>
  );
}
