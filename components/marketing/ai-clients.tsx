"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  AI_CONTENT_OP_CLIENTS,
  CAPSULE_PM_PROJECTS,
  CAPSULE_PM_OTHERS,
} from "@/lib/data/marketing";

export function AiClients() {
  return (
    <section className="border-t border-[var(--line)]">
      {/* AI Content Op 7+ */}
      <div className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>AI CONTENT OPERATION</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={AI_CONTENT_OP_CLIENTS.length} suffix="+" /> CLIENTS
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
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

      {/* Capsule Media PM 20+ */}
      <div className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>CAPSULE MEDIA · 종합홍보 PM</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={20} suffix="+" /> PROJECTS
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>정부 부처 4건 + 14건+ 종합홍보 PM 운영</span>
          </MaskReveal>
        </h2>

        <div className="border-t border-[var(--line)]">
          {CAPSULE_PM_PROJECTS.map((p, i) => (
            <ScrollReveal
              key={p.name}
              delay={i * 0.08}
              className="grid grid-cols-12 gap-x-4 gap-y-2 py-6 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-300 group"
            >
              <span className="col-span-2 md:col-span-1 text-meta opacity-50 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="col-span-10 md:col-span-5 text-body-lg font-medium group-hover:text-[var(--accent)] transition-colors">
                {p.name}
              </span>
              <span className="col-span-12 md:col-span-6 text-meta opacity-70 md:text-right">
                {p.role}
              </span>
            </ScrollReveal>
          ))}
        </div>

        {/* +14건 강조 — 단순 텍스트 → 큰 카드 */}
        <ScrollReveal delay={0.4} className="mt-12">
          <div className="border border-[var(--accent)]/40 hover:border-[var(--accent)] transition-colors duration-500 p-7 md:p-10 bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))]">
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-meta opacity-60 tracking-[0.2em]">
                ADDITIONAL · BROADER PORTFOLIO
              </span>
              <span className="text-display-md font-display leading-none text-[var(--accent)] tabular-nums">
                <Counter to={14} suffix="+" />
              </span>
            </div>

            <p className="text-body-lg md:text-display-md font-display leading-[1.2] tracking-[-0.02em] mb-4">
              + 추가 종합홍보 PM 운영
            </p>

            <p className="text-body opacity-80 leading-[1.6]">
              소상공인 · 중소기업 · 자영업자 · 교육기관 — 정부 부처 4건 외에도
              민간·소상공인 영역까지 풀스펙 PM 운영 포트폴리오.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
