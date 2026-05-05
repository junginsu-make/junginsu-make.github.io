"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  AI_CONTENT_OP_CLIENTS,
  AI_CONTENT_OP_TOTAL,
} from "@/lib/data/marketing";

/**
 * AI Content Operation 클라이언트 영역.
 * 인큐베이터/센터 안 (+N 입주기업) 별도 표기. 총 운영 기업 수 기준 16개.
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
            <Counter to={AI_CONTENT_OP_TOTAL} suffix="+" /> 기업 운영 · {" "}
            {AI_CONTENT_OP_CLIENTS.length} 채널
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-8 lg:whitespace-nowrap">
          <MaskReveal>
            <span>콘텐츠 자동화 + 데이터 기반 마케팅 전략 운영</span>
          </MaskReveal>
        </h2>

        <ScrollReveal delay={0.15}>
          <p className="text-body-lg opacity-75 leading-[1.6] mb-12 lg:whitespace-nowrap">
            인큐베이터/센터의 경우 <span className="text-[var(--accent)] font-medium">(+N)</span>은 그 안에서 운영한 입주기업 수 — 총{" "}
            <span className="text-[var(--accent)] font-medium">
              {AI_CONTENT_OP_TOTAL}+ 기업
            </span>{" "}
            실제 운영.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {AI_CONTENT_OP_CLIENTS.map((c) => (
              <span
                key={c.name}
                className="text-meta md:text-body border border-[var(--line)] px-4 py-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {c.name}
                {c.subCount && (
                  <span className="ml-2 text-[var(--accent)] font-medium">
                    +{c.subCount} 입주기업
                  </span>
                )}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
