"use client";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

const LEFT_ITEMS = [
  "17년 영업 · 광고 운영",
  "티몬 광고대행 연 40~60억",
  "전국 30지점 연 20억+",
  "KOICA · 31 강의처",
];

const RIGHT_ITEMS = [
  "풀사이클 자동화",
  "Vibe Coding 43",
  "자동화 시나리오 81",
  "6 라이브 SaaS · AI SaaS PL 4건",
];

const INTERSECTION_ITEMS = [
  "콘텐츠 자동화 — 마케팅 + AI 융합",
  "AI Content Operation 18+ 기업 운영",
  "정부 부처 · 창업지원센터 AI 강의",
];

export function DualityVenn() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-32 border-t border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] overflow-hidden">
      <p className="text-meta opacity-50 mb-8 tracking-[0.2em]">DUALITY</p>

      <h2 className="text-display-md md:text-display-lg font-display mb-12 md:mb-16 lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            한 사람, 두 면 그리고 그{" "}
            <WordHighlight delay={0.6}>교집합</WordHighlight>.
          </span>
        </MaskReveal>
      </h2>

      {/* 비주얼 — 두 원 + 교집합 + breathe 애니메이션 */}
      <div className="relative w-full max-w-[1100px] mx-auto h-[420px] md:h-[480px] mb-20 md:mb-24">
        {/* 좌측 원 — 마케터 (살짝 좌우 swing) */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--fg)]/40 bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]"
          initial={{ x: "calc(-50% - clamp(34px, 9vw, 80px))", scale: 0.9, opacity: 0 }}
          whileInView={{
            x: [
              "calc(-50% - clamp(34px, 9vw, 80px))",
              "calc(-50% - clamp(44px, 11vw, 100px))",
              "calc(-50% - clamp(34px, 9vw, 80px))",
            ],
            scale: 1,
            opacity: 1,
          }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{
            x: {
              duration: 8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 1.5,
            },
            scale: { duration: 0.9, ease: [0.6, 0.05, 0.3, 0.95] },
            opacity: { duration: 0.9 },
          }}
          style={{
            width: "min(360px, 44vw)",
            height: "min(360px, 44vw)",
          }}
          aria-hidden
        />

        {/* 우측 원 — AI 빌더 (반대 방향 swing + orange) */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]"
          initial={{ x: "calc(-50% + clamp(34px, 9vw, 80px))", scale: 0.9, opacity: 0 }}
          whileInView={{
            x: [
              "calc(-50% + clamp(34px, 9vw, 80px))",
              "calc(-50% + clamp(44px, 11vw, 100px))",
              "calc(-50% + clamp(34px, 9vw, 80px))",
            ],
            scale: 1,
            opacity: 1,
          }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{
            x: {
              duration: 8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 1.5,
            },
            scale: {
              duration: 0.9,
              delay: 0.15,
              ease: [0.6, 0.05, 0.3, 0.95],
            },
            opacity: { duration: 0.9, delay: 0.15 },
          }}
          style={{
            width: "min(360px, 44vw)",
            height: "min(360px, 44vw)",
          }}
          aria-hidden
        />

        {/* 좌측 라벨 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 max-w-[180px] md:max-w-[220px]"
        >
          <p className="text-display-md font-display leading-none">마케터</p>
          <p className="text-meta opacity-60 mt-3 tracking-[0.15em]">
            17년 운영 · 광고
          </p>
        </motion.div>

        {/* 우측 라벨 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 max-w-[180px] md:max-w-[220px] text-right"
        >
          <p className="text-display-md font-display leading-none text-[var(--accent)]">
            AI 빌더
          </p>
          <p className="text-meta opacity-60 mt-3 tracking-[0.15em]">
            풀사이클 자동화
          </p>
        </motion.div>

        {/* 중앙 교집합 라벨 (원 안 위쪽) — 펄스 + breathe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="absolute left-1/2 -translate-x-1/2 top-[18%] text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block px-4 py-1.5 border border-[var(--accent)] bg-[var(--bg)]"
          >
            <p className="text-meta tracking-[0.2em] text-[var(--accent)]">
              교집합 · INTERSECTION
            </p>
          </motion.div>
        </motion.div>

        {/* 중앙 큰 카피 — 두 원 안쪽 가운데 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[160px] md:w-[200px]"
        >
          <p className="text-[20px] md:text-[28px] font-display leading-[1.05] tracking-[-0.02em]">
            Multi Agent
          </p>
          <p className="text-[20px] md:text-[28px] font-display leading-[1.05] tracking-[-0.02em] mt-1">
            SaaS 개발
          </p>
        </motion.div>
      </div>

      {/* 디테일 카드 3 col — 도형 외부 */}
      <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] mb-12 md:mb-16">
        {/* 좌 — 마케터 디테일 */}
        <ScrollReveal className="bg-[var(--bg)] p-6 md:p-8">
          <p className="text-meta opacity-60 mb-5 tracking-[0.2em]">
            01 · 마케터
          </p>
          <ul className="space-y-2.5">
            {LEFT_ITEMS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.06,
                  ease: [0.6, 0.05, 0.3, 0.95],
                }}
                className="flex items-baseline gap-3 text-body opacity-85"
              >
                <span className="text-meta opacity-40 tabular-nums shrink-0 w-6">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </ScrollReveal>

        {/* 중 — 교집합 디테일 (orange 강조) */}
        <ScrollReveal
          delay={0.1}
          className="bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] p-6 md:p-8 border-l-2 border-r-2 border-[var(--accent)]"
        >
          <p className="text-meta mb-5 tracking-[0.2em] text-[var(--accent)]">
            02 · 교집합 · CORE
          </p>
          <ul className="space-y-2.5">
            {INTERSECTION_ITEMS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.08,
                  ease: [0.6, 0.05, 0.3, 0.95],
                }}
                className="flex items-baseline gap-3 text-body font-medium"
              >
                <span className="text-meta opacity-50 tabular-nums shrink-0 w-6 text-[var(--accent)]">
                  ◆
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </ScrollReveal>

        {/* 우 — AI 빌더 디테일 */}
        <ScrollReveal delay={0.2} className="bg-[var(--bg)] p-6 md:p-8">
          <p className="text-meta opacity-60 mb-5 tracking-[0.2em]">
            03 · AI 빌더
          </p>
          <ul className="space-y-2.5">
            {RIGHT_ITEMS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.06,
                  ease: [0.6, 0.05, 0.3, 0.95],
                }}
                className="flex items-baseline gap-3 text-body opacity-85"
              >
                <span className="text-meta opacity-40 tabular-nums shrink-0 w-6">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </ScrollReveal>
      </div>

      {/* 마무리 카피 — 1줄 */}
      <ScrollReveal delay={0.3}>
        <p className="text-body-lg md:text-display-md font-display leading-[1.3] tracking-[-0.015em] lg:whitespace-nowrap">
          17년 마케팅과 AI 빌더는 둘이 아니라 하나의{" "}
          <WordHighlight delay={0.5}>풀사이클</WordHighlight> 정체성.
        </p>
      </ScrollReveal>
    </section>
  );
}
