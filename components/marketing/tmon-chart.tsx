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
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { TMON_ROAS_MONTHLY } from "@/lib/data/marketing";

export function TmonChart() {
  const data = TMON_ROAS_MONTHLY;
  const peakRoas = Math.max(...data.map((d) => d.roas));

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TMON ROAS · 12 MONTH TREND</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          2022.03 → 2023.02
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            매월 상승하는 ROAS — <WordHighlight delay={0.6}>3,516%</WordHighlight>
            에서 <WordHighlight delay={0.95}>7,404%</WordHighlight>까지
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 max-w-[920px] leading-[1.6] mb-16">
          이커머스 티몬 공식 광고대행사 운영총괄실장으로 9개월간 광고 운영. 연
          40~60억 광고비 규모. 2022.07 운영 시작 시점부터 매월 상승하는 ROAS
          그래프 — 본인 작성 운영 보고서 데이터를 직접 시각화.
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

          <div className="h-[400px] md:h-[480px]">
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
                    fontFamily:
                      "var(--font-mono), ui-monospace, monospace",
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--line)" }}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "var(--fg)",
                    fillOpacity: 0.6,
                    fontFamily:
                      "var(--font-mono), ui-monospace, monospace",
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k%`}
                />
                <Tooltip
                  cursor={{ fill: "color-mix(in oklab, var(--accent) 8%, transparent)" }}
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
                    fontFamily:
                      "var(--font-mono), ui-monospace, monospace",
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
              <span
                className="inline-block w-3 h-3 bg-[var(--accent)]"
              />
              시작·정점 (2022.07 / 2023.02)
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* 차트 요약 — 카운터 3개 */}
      <ScrollReveal delay={0.45} className="mt-12 grid grid-cols-3 gap-6 md:gap-10">
        <div>
          <p className="text-display-md font-display leading-none tabular-nums">
            <Counter to={1084} suffix="%" />
          </p>
          <p className="text-meta opacity-60 mt-3">최저 (2022.03)</p>
        </div>
        <div className="md:text-center">
          <p className="text-display-md font-display leading-none tabular-nums">
            <span className="text-[var(--accent)]">▲</span>{" "}
            <Counter to={6320} suffix="%P" />
          </p>
          <p className="text-meta opacity-60 mt-3 md:text-center">
            최저→정점 상승 폭
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-display-md font-display leading-none tabular-nums text-[var(--accent)]">
            <Counter to={peakRoas} suffix="%" />
          </p>
          <p className="text-meta opacity-60 mt-3 md:text-right">
            정점 (2023.02)
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.6} className="mt-10">
        <p className="text-meta opacity-50 leading-[1.7] max-w-[820px]">
          ※ 출처: 정인수 본인 작성 「개인 포토폴리오-23.03.02.pdf」 — 12 개월
          월별 ROAS 데이터. 2022.07 운영 시작 이전은 회색, 운영 시작·정점은
          오렌지로 강조.
        </p>
      </ScrollReveal>
    </section>
  );
}
