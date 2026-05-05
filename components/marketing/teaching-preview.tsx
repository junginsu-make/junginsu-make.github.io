"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { PulseNumber } from "@/components/motion/pulse-number";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { TIER1, TIER2, TIER3 } from "@/lib/data/teaching";
import { cn } from "@/lib/utils";

type Props = {
  photos: string[];
};

/**
 * 마케팅 페이지의 강의 요약 섹션.
 * 좌(자동 carousel 사진) + 우(큰 카운터 + 3 Tier + FEATURED + CTA).
 * 강의 = 마케팅 신뢰의 외부 검증 자료라는 관점.
 */
export function TeachingPreview({ photos }: Props) {
  const totalCount = TIER1.length + TIER2.length + TIER3.length;
  const featured = TIER1.slice(0, 6).map((t) => t.name);

  // 사진 carousel — 자동 롤링 + 좌우 수동 navigation
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || photos.length === 0) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % photos.length),
      2000,
    );
    return () => clearInterval(t);
  }, [paused, photos.length]);
  const goPrev = () =>
    setIdx((i) => (i - 1 + photos.length) % photos.length);
  const goNext = () => setIdx((i) => (i + 1) % photos.length);

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-10 md:mb-12">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TEACHING · 마케팅 신뢰의 자료</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          7년 6개월 · {totalCount} 강의처
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            마케팅을{" "}
            <WordHighlight delay={0.5}>가르치는 사람</WordHighlight>이 직접
            운영도 한다
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 leading-[1.6] mb-12 md:mb-16 lg:whitespace-nowrap">
          정부 부처 · 대학 · 창업지원센터 · 협회 · 기업 · 1인샵까지 7년 6개월 직접 강의 —
          17년 마케팅 운영 경력을 외부에서 검증한 자료.
        </p>
      </ScrollReveal>

      {/* 좌 사진 carousel + 우 카운터 · 태그 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* LEFT — 자동 carousel */}
        <ScrollReveal className="md:col-span-7">
          <div
            className="relative aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="sync">
              {photos[idx] && (
                <motion.picture
                  key={photos[idx]}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.6, 0.05, 0.3, 0.95],
                  }}
                  className="absolute inset-0"
                >
                  <source
                    srcSet={photos[idx].replace(
                      /\.(jpe?g|png|webp)$/i,
                      ".avif",
                    )}
                    type="image/avif"
                  />
                  <source
                    srcSet={photos[idx].replace(/\.(jpe?g|png)$/i, ".webp")}
                    type="image/webp"
                  />
                  <img
                    src={photos[idx]}
                    alt={`강의 사진 ${idx + 1}`}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover ken-burns-slow"
                  />
                </motion.picture>
              )}
            </AnimatePresence>

            {/* 그라디언트 가독성 */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            <div
              className="absolute bottom-5 left-5 right-5 text-[#F4F0E6]"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              <p className="text-meta opacity-80 tracking-[0.2em] mb-3 flex items-baseline justify-between">
                <span>LIVE TEACHING</span>
                <span className="tabular-nums opacity-90">
                  {String(idx + 1).padStart(2, "0")} /{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
              </p>
              <p className="text-display-md font-display leading-[1.1] tracking-[-0.02em]">
                정부 부처 · 대학 · 창업지원센터까지
              </p>
            </div>

            {/* 진행 인디케이터 — carousel 진행 도트 */}
            <div className="absolute top-5 left-5 right-5 flex gap-1.5 pointer-events-none">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 bg-[#F4F0E6]/30 overflow-hidden"
                >
                  {i === idx && (
                    <motion.div
                      key={`bar-${idx}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused ? 0 : 1 }}
                      transition={{
                        duration: paused ? 0 : 2,
                        ease: "linear",
                      }}
                      className="h-full bg-[#F4F0E6] origin-left"
                    />
                  )}
                  {i < idx && <div className="h-full bg-[#F4F0E6]/60" />}
                </div>
              ))}
            </div>

            {/* 좌측 화살표 */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/55 backdrop-blur-md text-[var(--fg)] border border-[var(--line)]/50 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="이전 강의 사진"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="12,4 6,10 12,16" />
              </svg>
            </button>
            {/* 우측 화살표 */}
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/55 backdrop-blur-md text-[var(--fg)] border border-[var(--line)]/50 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="다음 강의 사진"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8,4 14,10 8,16" />
              </svg>
            </button>
          </div>

          {/* 썸네일 strip — 8장 직접 이동 */}
          <div
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIdx(i)}
                className={cn(
                  "flex-shrink-0 w-16 md:w-20 aspect-[16/10] overflow-hidden border transition-all duration-300",
                  i === idx
                    ? "border-[var(--accent)] opacity-100 scale-[1.04]"
                    : "border-[var(--line)] opacity-50 hover:opacity-100 hover:border-[var(--accent)]/60",
                )}
                aria-label={`강의 사진 ${i + 1}로 이동`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* RIGHT — 큰 카운터 + 태그 */}
        <div className="md:col-span-5 space-y-10">
          {/* 강의처 +N 큰 카운터 (메인 강조) */}
          <ScrollReveal delay={0.15}>
            <p className="text-meta opacity-60 mb-3 tracking-[0.2em]">
              총 강의처
            </p>
            <p className="text-display-mega font-display leading-[0.85] tracking-[-0.04em] tabular-nums">
              <PulseNumber>
                <span className="text-[var(--accent)]">+</span>
                <Counter to={totalCount} />
              </PulseNumber>
            </p>
            <p className="text-meta opacity-70 mt-4 leading-[1.5]">
              7년 6개월 누적 · 정부 · 대학 · 창업지원 · 협회 · 기업 · 1인샵까지
            </p>
          </ScrollReveal>

          {/* 3 Tier 카운터 */}
          <ScrollReveal delay={0.25}>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-8">
              <div>
                <p className="text-display-md font-display leading-none tabular-nums text-[var(--accent)]">
                  <Counter to={TIER1.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 01
                  <br />
                  <span className="opacity-60">정부 · 대학 · AI</span>
                </p>
              </div>
              <div>
                <p className="text-display-md font-display leading-none tabular-nums">
                  <Counter to={TIER2.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 02
                  <br />
                  <span className="opacity-60">협회 · 기업</span>
                </p>
              </div>
              <div>
                <p className="text-display-md font-display leading-none tabular-nums">
                  <Counter to={TIER3.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 03
                  <br />
                  <span className="opacity-60">개인 · 1인샵</span>
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 대표 강의처 6 */}
          <ScrollReveal delay={0.35}>
            <div className="border-t border-[var(--line)] pt-8">
              <p className="text-meta opacity-60 mb-5 tracking-[0.2em]">
                FEATURED · TIER 01
              </p>
              <ul className="space-y-2.5">
                {featured.map((name, i) => (
                  <motion.li
                    key={name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.06,
                      ease: [0.6, 0.05, 0.3, 0.95],
                    }}
                    className="flex items-baseline gap-3 text-body opacity-85"
                  >
                    <span className="text-meta opacity-40 tabular-nums shrink-0 w-6">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
