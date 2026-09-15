"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

export function TeachingHero({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || photos.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 3500);
    return () => clearInterval(t);
  }, [paused, photos.length]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-[var(--line)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 자동 롤링 캐러셀 */}
      <AnimatePresence mode="sync">
        {photos[idx] && (
          <motion.picture
            key={photos[idx]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.6, 0.05, 0.3, 0.95] }}
            className="absolute inset-0"
          >
            <source srcSet={photos[idx].replace(/\.(jpe?g|png|webp)$/i, ".avif")} type="image/avif" />
            <source srcSet={photos[idx].replace(/\.(jpe?g|png)$/i, ".webp")} type="image/webp" />
            <img
              src={photos[idx]}
              alt={`강의 사진 ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover ken-burns-slow"
              fetchPriority={idx === 0 ? "high" : undefined}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
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
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative h-full flex flex-col justify-end px-6 md:px-10 lg:px-16 xl:px-24 pb-16 md:pb-20 text-[#F4F0E6]">
        <p
          className="text-meta opacity-80 mb-6 tracking-[0.2em]"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
        >
          <MaskReveal>TEACHING · 7년 6개월 · 56장</MaskReveal>
        </p>

        <h1
          className="text-display-xl md:text-display-mega font-display leading-[0.92] tracking-[-0.03em]"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}
        >
          <MaskRevealStagger text="마케팅 강의" letterDelay={0.05} />
        </h1>

        <p
          className="mt-8 max-w-[820px] text-body-lg md:text-body-xl leading-[1.45] opacity-95"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
        >
          <MaskReveal delay={0.6}>
            <span>
              정부 부처 · 대학 · 창업지원센터 · 협회 · 기업 · 자영업자 · 1인샵까지 —{" "}
              <WordHighlight delay={1.0}>3 Tier</WordHighlight> 가능한 모든
              현장
            </span>
          </MaskReveal>
        </p>

        <div className="mt-10 flex items-center justify-between text-meta opacity-70">
          <span style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            {paused ? "● 일시정지" : "▶ 자동 재생"}
          </span>
          <span
            className="tabular-nums"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {String(idx + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
