"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AI_CONTENT_OP_CLIENTS } from "@/lib/data/marketing";

/**
 * AI Content Operation 7+ 클라이언트 영역.
 * 종합홍보 PM (정부·공공·민간) 카운트는 PublicAgencies 섹션에서 일원 처리.
 */
export function AiClients() {
  return (
    <section className="border-t border-[var(--line)]">
      <div className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>AI CONTENT OPERATION</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={AI_CONTENT_OP_CLIENTS.length} suffix="+" /> CLIENTS
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 lg:whitespace-nowrap">
          <MaskReveal>
            <span>콘텐츠 자동화 + 데이터 기반 마케팅 전략 운영</span>
          </MaskReveal>
        </h2>

        <ScrollReveal>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {AI_CONTENT_OP_CLIENTS.map((c) => (
              <span
                key={c}
                className="text-meta md:text-body border border-[var(--line)] px-4 py-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {c}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
