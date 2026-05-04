"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SweepLink } from "@/components/motion/color-sweep";
import { AI_CONTENT_OP_CLIENTS } from "@/lib/data/marketing";

/**
 * AI Content Operation + Capsule PM 20+ 강조.
 * Capsule PM 4 정부 부처 (농림축산·조달청·한국벤처투자·창업진흥원) 행 리스트 제거 —
 * PublicAgencies 섹션과 중복이라 양쪽에 표시 X.
 * Capsule PM 카운트 20+ 와 +14건 강조 카드만 유지.
 */
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

      {/* Capsule Media PM 20+ — 정부 부처 4 행 제거. 카운트 + +14건 강조 카드만 */}
      <div className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>CAPSULE MEDIA · 종합홍보 PM</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={20} suffix="+" /> PROJECTS
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-10 lg:whitespace-nowrap">
          <MaskReveal>
            <span>정부 부처 4건 + 14건+ 종합홍보 PM 운영 포트폴리오</span>
          </MaskReveal>
        </h2>

        <ScrollReveal delay={0.15}>
          <p className="text-body-lg opacity-75 leading-[1.6] mb-12 lg:whitespace-nowrap">
            정부 부처 4건 풀 디테일은 위 「PUBLIC SECTOR」 참조 · 이 섹션은
            카운트 요약 + 추가 14건+ 민간·소상공인.
          </p>
        </ScrollReveal>

        {/* 두 큰 카운터 카드 — 정부 부처 4 + 추가 14건+. 데스크탑에서는 텍스트 풀 너비. */}
        <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          <ScrollReveal className="bg-[var(--bg)] p-6 md:p-8 group">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-meta opacity-60 tracking-[0.2em]">
                정부 부처 · CORE
              </span>
              <span className="text-display-md font-display leading-none tabular-nums">
                <Counter to={4} />
              </span>
            </div>
            <p className="text-body-lg md:text-display-md font-display leading-[1.2] tracking-[-0.02em] mb-4">
              정부 부처 4건 PM 운영
            </p>
            <p className="text-meta opacity-70 leading-[1.6]">
              농림축산식품부 · 조달청 · 한국벤처투자 · 창업진흥원 —{" "}
              <SweepLink
                href="#public-sector"
                className="text-[var(--accent)] underline-offset-4 hover:underline"
              >
                위 PUBLIC SECTOR 섹션 참조
              </SweepLink>
            </p>
          </ScrollReveal>

          <ScrollReveal
            delay={0.15}
            className="bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] p-6 md:p-8 group border-l-2 border-[var(--accent)]"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-meta opacity-60 tracking-[0.2em]">
                ADDITIONAL · BROADER
              </span>
              <span className="text-display-md font-display leading-none text-[var(--accent)] tabular-nums">
                <Counter to={14} suffix="+" />
              </span>
            </div>
            <p className="text-body-lg md:text-display-md font-display leading-[1.2] tracking-[-0.02em] mb-4">
              + 추가 종합홍보 PM 운영
            </p>
            <p className="text-meta opacity-70 leading-[1.6]">
              소상공인 · 중소기업 · 자영업자 · 교육기관 — 민간·소상공인 영역
              풀스펙 PM 운영 포트폴리오.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
