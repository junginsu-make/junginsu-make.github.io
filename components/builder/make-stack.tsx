"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { cn } from "@/lib/utils";
import { MAKE_STACK_TOOLS } from "@/lib/data/builder-stack";

export function MakeStackVisualization() {
  const hub = MAKE_STACK_TOOLS.find((t) => t.isHub)!;
  const spokes = MAKE_STACK_TOOLS.filter((t) => !t.isHub);

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>자동화 시나리오 STACK · 12 INTEGRATIONS</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          <Counter to={MAKE_STACK_TOOLS.length} /> TOOLS · 1 HUB
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[920px]">
        <MaskReveal>
          <span>
            노드 캡처 대신 <WordHighlight delay={0.6}>실제 도구</WordHighlight>
            로 그린 자동화 스택
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 max-w-[820px] leading-[1.6] mb-16">
          자동화 시나리오 화면 캡처는 정보 밀도가 낮아요. 대신 — 어떤 도구를
          어떤 역할로 연동했는지 직접 시각화. 호버하면 사용 맥락이 펼쳐집니다.
        </p>
      </ScrollReveal>

      {/* HUB + SPOKES 시각화 (반응형) */}
      <div className="relative">
        {/* 중앙 HUB */}
        <div className="grid place-items-center mb-12 md:mb-16">
          <ScrollReveal>
            <div className="relative inline-block group">
              {/* 펄스 링 */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 border-2 border-[var(--accent)] rounded-full pointer-events-none"
                aria-hidden
              />
              <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full border-2 border-[var(--accent)] grid place-items-center bg-[color-mix(in_oklab,var(--accent)_8%,var(--bg))] transition-transform duration-500 group-hover:scale-[1.04]">
                <div className="text-center">
                  <p className="text-display-md md:text-display-lg font-display leading-none">
                    {hub.glyph}
                  </p>
                  <p className="mt-3 text-body-lg font-display tracking-[-0.02em]">
                    {hub.name}
                  </p>
                  <p className="text-meta opacity-60 mt-1 tracking-[0.15em]">
                    HUB
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* SPOKE 도구 grid — 11개 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)]">
          {spokes.map((tool, i) => (
            <ScrollReveal
              key={tool.name}
              delay={Math.min(i * 0.06, 0.5)}
              className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
            >
              <div className="flex items-baseline justify-between mb-5">
                <span
                  className={cn(
                    "font-mono text-display-md leading-none transition-colors duration-500 opacity-30",
                    "group-hover:text-[var(--accent)] group-hover:opacity-100",
                  )}
                  aria-hidden
                >
                  {tool.glyph}
                </span>
                <span className="text-meta opacity-40 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="text-meta opacity-60 mb-2 tracking-[0.15em]">
                {tool.category}
              </p>

              <h3 className="text-body-lg md:text-display-md font-display leading-[1.1] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-300">
                {tool.name}
              </h3>

              <p className="mt-2 text-meta opacity-50 font-mono">
                {tool.vendor}
              </p>

              {/* Usage — hover로 펼쳐짐 */}
              <motion.div
                initial={false}
                className={cn(
                  "overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-[cubic-bezier(0.6,0.05,0.3,0.95)]",
                  "max-h-0 opacity-0",
                  "group-hover:max-h-[120px] group-hover:opacity-100 group-hover:mt-5",
                )}
                aria-hidden
              >
                <div className="border-t border-[var(--accent)]/30 pt-4">
                  <p className="text-meta opacity-80 leading-[1.55]">
                    {tool.usage}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal delay={0.45} className="mt-16">
        <p className="text-meta opacity-50 leading-[1.7] max-w-[820px]">
          ※ 4 핵심 시나리오 (정부지원사업 · 10X 콘텐츠 · 계약서 자동화 · GA4 · 뉴스레터 · 웹 크롤링) 가
          이 스택으로 매일 돌아가는 자동화. 81 시스템 인벤토리는{" "}
          <span className="text-[var(--accent)]">/builder/scenarios</span> 에서
          전체 보기.
        </p>
      </ScrollReveal>
    </section>
  );
}
