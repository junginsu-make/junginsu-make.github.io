"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  TMON_PORTFOLIO_PERIOD,
  TMON_ROAS_MONTHLY,
  TMON_BEFORE_AFTER,
} from "@/lib/data/marketing";

/** "3,516%" → 3516 / "208억" → 208 / "94,153" → 94153 / "4,709원" → 4709 */
function parseNum(raw: string): number {
  const m = raw.replace(/[^0-9.]/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

/**
 * TMON CASE — 단일 영역.
 * 12개월 ROAS 막대 차트 (전체 추이) + 4 KPI 비포/애프터 (스냅샷).
 * 같은 데이터의 두 시각화를 하나의 섹션에 통합 — 수치 중복 표기 제거.
 */
export function TmonCase() {
  const data = TMON_ROAS_MONTHLY;
  const peakRoas = Math.max(...data.map((d) => d.roas));

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      {/* HEADER */}
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TMON CASE · VERIFIED 9 MONTHS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {TMON_PORTFOLIO_PERIOD}
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            티몬 공식 광고대행 ·{" "}
            <WordHighlight delay={0.6}>9개월</WordHighlight>의 정량 데이터
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 max-w-[920px] leading-[1.6] mb-16">
          이커머스 티몬 공식 광고대행사 운영총괄실장으로 9개월 광고 운영. 연
          40~60억 광고비 규모. 월별 추이 (좌)와 4 KPI 스냅샷 (우)을 한 섹션에서
          비교 — 같은 데이터의 두 각도.
        </p>
      </ScrollReveal>

      {/* 12개월 ROAS 막대 차트 */}
      <ScrollReveal delay={0.3}>
        <div className="border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_2%,var(--bg))] p-6 md:p-10">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="text-display-md font-display leading-none tracking-[-0.02em]">
              월별 ROAS · 12 개월
            </h3>
            <span className="text-meta opacity-50 tabular-nums">
              피크 {peakRoas.toLocaleString()}%
            </span>
          </div>

          <div className="h-[360px] md:h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 24, right: 16, left: -8, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: "var(--fg)",
                    fillOpacity: 0.6,
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--line)" }}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "var(--fg)",
                    fillOpacity: 0.6,
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k%`}
                />
                <Tooltip
                  cursor={{
                    fill: "color-mix(in oklab, var(--accent) 8%, transparent)",
                  }}
                  contentStyle={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--line)",
                    borderRadius: 0,
                    fontSize: 12,
                    color: "var(--fg)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                  }}
                  formatter={(v) => {
                    const num = typeof v === "number" ? v : Number(v);
                    return [`${num.toLocaleString()}%`, "ROAS"];
                  }}
                  labelFormatter={(label, items) => {
                    const phase = items?.[0]?.payload?.phase;
                    return `${label} · ${phase ?? ""}`;
                  }}
                />
                <ReferenceLine
                  x="2022.07"
                  stroke="var(--accent)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.55}
                  label={{
                    value: "운영 시작",
                    fill: "var(--accent)",
                    fontSize: 11,
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                    position: "top",
                  }}
                />
                <Bar
                  dataKey="roas"
                  radius={[2, 2, 0, 0]}
                  animationDuration={1800}
                  animationEasing="ease-out"
                >
                  {data.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        entry.highlight
                          ? "var(--accent)"
                          : entry.phase === "이전"
                            ? "color-mix(in oklab, var(--fg) 18%, transparent)"
                            : "color-mix(in oklab, var(--accent) 55%, transparent)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 차트 범례 */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-meta opacity-70">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block w-3 h-3"
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--fg) 18%, transparent)",
                }}
              />
              운영 이전 (2022.03–06)
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block w-3 h-3"
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--accent) 55%, transparent)",
                }}
              />
              운영 중 (2022.08–2023.01)
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-[var(--accent)]" />
              시작·정점 (2022.07 / 2023.02)
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* 4 KPI 비포/애프터 — 차트 옆 보조 시각 */}
      <ScrollReveal delay={0.45} className="mt-16 md:mt-20">
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>4 KPI · BEFORE → AFTER</MaskReveal>
          </p>
          <span className="text-meta opacity-40">
            ROAS · GR · BU · CPBU
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          {TMON_BEFORE_AFTER.map((m, i) => {
            const isUp = m.direction === "up";
            const beforeNum = parseNum(m.before);
            const afterNum = parseNum(m.after);
            const beforeWidth = isUp
              ? Math.max(8, (beforeNum / Math.max(beforeNum, afterNum)) * 100)
              : 100;
            const afterWidth = isUp
              ? 100
              : Math.max(8, (afterNum / beforeNum) * 100);

            return (
              <div
                key={m.label}
                className="bg-[var(--bg)] p-7 md:p-9 group"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-meta opacity-60 tracking-[0.15em]">
                    {(i + 1).toString().padStart(2, "0")} · {m.label}
                  </span>
                  <span className="text-meta tabular-nums text-[var(--accent)]">
                    {m.delta}
                  </span>
                </div>

                {/* AFTER — 메인 큰 숫자 */}
                <p className="text-display-md md:text-display-lg font-display leading-none tracking-[-0.03em] tabular-nums">
                  {m.after}
                </p>

                {/* BEFORE/AFTER 막대 비교 */}
                <div className="mt-6 space-y-3">
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
                        transition={{
                          duration: 0.9,
                          delay: 0.2,
                          ease: [0.6, 0.05, 0.3, 0.95],
                        }}
                        className="h-full bg-current opacity-30"
                      />
                    </div>
                  </div>

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
                        transition={{
                          duration: 1.1,
                          delay: 0.5,
                          ease: [0.6, 0.05, 0.3, 0.95],
                        }}
                        className="h-full bg-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-meta opacity-60">{m.note}</p>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 출처 — 한 번만 */}
      <ScrollReveal delay={0.55} className="mt-12">
        <p className="text-body opacity-70 leading-[1.7] max-w-[820px]">
          <span className="text-[var(--accent)] mr-2">✓</span>
          출처: 정인수 본인 작성{" "}
          <span className="font-mono text-meta opacity-90">
            「개인 포토폴리오-23.03.02.pdf」
          </span>{" "}
          · 12 개월 월별 ROAS + 운영 종료 시점 4 KPI 비포/애프터. TMON 공식
          광고대행 운영총괄실장 (퍼포먼스디자인 시기) 시점 공식 데이터.
        </p>
      </ScrollReveal>
    </section>
  );
}
