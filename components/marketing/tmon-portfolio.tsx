"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  TMON_PORTFOLIO_PERIOD,
  TMON_BEFORE_AFTER,
} from "@/lib/data/marketing";

/** "3,516%" → 3516 / "208억" → 208 / "94,153" → 94153 / "4,709원" → 4709 */
function parseNum(raw: string): number {
  const m = raw.replace(/[^0-9.]/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

export function TmonPortfolio() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-10 md:mb-12">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TMON CASE · VERIFIED CHART</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {TMON_PORTFOLIO_PERIOD}
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-[920px]">
        <MaskReveal>
          <span>
            티몬 공식 광고대행 · {" "}
            <WordHighlight delay={0.6}>9개월</WordHighlight>의 정량 데이터
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 max-w-[820px] leading-[1.6]">
          연 40~60억 광고비를 직접 총괄. 운영 보고서의 4 KPI 모두 동시 개선.
          PDF 차트는 보존하되, 데이터는 직접 컴포넌트로 시각화 (이미지 의존성 제거).
        </p>
      </ScrollReveal>

      {/* 4 KPI 비포/애프터 비교 — 직접 디자인 */}
      <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
        {TMON_BEFORE_AFTER.map((m, i) => {
          const isUp = m.direction === "up";
          const beforeNum = parseNum(m.before);
          const afterNum = parseNum(m.after);
          const beforeWidth =
            isUp
              ? Math.max(8, (beforeNum / Math.max(beforeNum, afterNum)) * 100)
              : 100;
          const afterWidth =
            isUp
              ? 100
              : Math.max(8, (afterNum / beforeNum) * 100);

          return (
            <ScrollReveal
              key={m.label}
              delay={i * 0.1}
              className="bg-[var(--bg)] p-7 md:p-10 group"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-meta opacity-50 tracking-[0.15em]">
                  {(i + 1).toString().padStart(2, "0")} · {m.label}
                </span>
                <span
                  className={`text-meta tabular-nums ${
                    isUp ? "text-[var(--accent)]" : "text-[var(--accent)]"
                  }`}
                >
                  {m.delta}
                </span>
              </div>

              {/* AFTER — 큰 카운터 (메인) */}
              <p className="text-display-md md:text-display-lg font-display leading-none tracking-[-0.03em] tabular-nums">
                {m.after}
              </p>

              {/* 비포/애프터 가로 막대 비교 */}
              <div className="mt-6 space-y-3">
                {/* before */}
                <div>
                  <div className="flex items-baseline justify-between text-meta opacity-50 mb-1.5">
                    <span>BEFORE</span>
                    <span className="tabular-nums">{m.before}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--line)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${beforeWidth}%` }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{ duration: 0.9, delay: 0.2, ease: [0.6, 0.05, 0.3, 0.95] }}
                      className="h-full bg-current opacity-30"
                    />
                  </div>
                </div>

                {/* after */}
                <div>
                  <div className="flex items-baseline justify-between text-meta mb-1.5">
                    <span className="text-[var(--accent)] tracking-[0.15em]">
                      AFTER
                    </span>
                    <span className="tabular-nums opacity-90">{m.after}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--line)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${afterWidth}%` }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{ duration: 1.1, delay: 0.5, ease: [0.6, 0.05, 0.3, 0.95] }}
                      className="h-full bg-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-5 text-meta opacity-60">{m.note}</p>
            </ScrollReveal>
          );
        })}
      </div>

      {/* 9개월 timeline progress bar */}
      <ScrollReveal delay={0.3} className="mt-16">
        <div className="flex items-baseline justify-between mb-3 text-meta opacity-60">
          <span>2022.07 (시작)</span>
          <span className="tabular-nums">9개월 · 39주차</span>
          <span>2023.02 (종료)</span>
        </div>
        <div className="h-1 bg-[var(--line)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.6, ease: [0.6, 0.05, 0.3, 0.95] }}
            className="h-full bg-[var(--accent)]"
          />
        </div>
      </ScrollReveal>

      {/* 합계 강조 — Big stat */}
      <ScrollReveal delay={0.45} className="mt-20 md:mt-24 grid md:grid-cols-3 gap-8 md:gap-12 border-t border-[var(--line)] pt-12">
        <div>
          <p className="text-display-md font-display leading-none tabular-nums">
            <Counter to={3888} suffix="%P" />
          </p>
          <p className="text-meta opacity-60 mt-3 tracking-[0.1em]">
            ROAS 상승 폭
          </p>
        </div>
        <div>
          <p className="text-display-md font-display leading-none tabular-nums">
            <Counter to={86560} suffix="명" />
          </p>
          <p className="text-meta opacity-60 mt-3 tracking-[0.1em]">
            BU 신규 누적
          </p>
        </div>
        <div>
          <p className="text-display-md font-display leading-none">
            <span className="text-[var(--accent)]">▼</span>{" "}
            <Counter to={50} suffix="%" /> 절감
          </p>
          <p className="text-meta opacity-60 mt-3 tracking-[0.1em]">
            CPBU 효율 개선
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.6} className="mt-12">
        <p className="text-meta opacity-50 leading-[1.7] max-w-[680px]">
          ※ 출처: 정인수 본인 작성 「개인 포토폴리오-23.03.02.pdf」 — TMON
          공식 광고대행 운영총괄실장 (퍼포먼스디자인 시기) 시점 ROAS·GR·BU·CPBU
          공식 데이터.
        </p>
      </ScrollReveal>
    </section>
  );
}
