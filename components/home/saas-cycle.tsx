"use client";
import { useState, useEffect } from "react";
import { SAAS_LIST } from "@/lib/data/saas";
import { SweepLink } from "@/components/motion/color-sweep";
import { PinSection } from "@/components/motion/pin-section";
import { cn } from "@/lib/utils";

export function SaasCycle() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SAAS_LIST.length), 2000);
    return () => clearInterval(t);
  }, [paused]);

  const saas = SAAS_LIST[idx];

  function handlePrev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + SAAS_LIST.length) % SAAS_LIST.length);
  }
  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % SAAS_LIST.length);
  }

  return (
    <PinSection>
      <div
        className="h-screen flex flex-col px-6 md:px-10 lg:px-16 py-5 md:py-7 lg:py-8 gap-3 md:gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 사진 carousel — 살짝 inset, 풀높이 - 썸네일 영역 */}
        <div className="relative flex-1 overflow-hidden">
          {SAAS_LIST.map((s, i) => (
            <SweepLink
              key={s.slug}
              href={`/builder/${s.slug}`}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                i === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <picture>
                <source
                  srcSet={`/captured/${s.capturedSlug}/home/desktop.avif`}
                  type="image/avif"
                />
                <source
                  srcSet={`/captured/${s.capturedSlug}/home/desktop.webp`}
                  type="image/webp"
                />
                <img
                  src={`/captured/${s.capturedSlug}/home/desktop.jpg`}
                  alt={s.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  className="w-full h-full object-contain bg-[color-mix(in_oklab,var(--fg)_4%,var(--bg))]"
                />
              </picture>
            </SweepLink>
          ))}

          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 text-paper-dark mix-blend-difference pointer-events-none z-10">
            <p className="text-meta">
              {idx + 1} / {SAAS_LIST.length}
            </p>
            <p className="text-display-md font-display mt-2">{saas.name}</p>
            <p className="text-body opacity-90 mt-1 max-w-xl">
              {saas.tagline.split(" — ")[0]}
            </p>
          </div>

          {/* 좌측 화살표 */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 SaaS"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="12,4 6,10 12,16" />
            </svg>
          </button>
          {/* 우측 화살표 */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 SaaS"
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,4 14,10 8,16" />
            </svg>
          </button>
        </div>

        {/* 하단 썸네일 strip — 6 SaaS 직접 이동 */}
        <div
          className="flex gap-2 md:gap-3 overflow-x-auto pb-1 shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          {SAAS_LIST.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "flex-shrink-0 w-20 md:w-28 lg:w-32 aspect-[16/10] overflow-hidden border transition-all duration-300",
                i === idx
                  ? "border-[var(--accent)] opacity-100 scale-[1.04]"
                  : "border-[var(--line)] opacity-50 hover:opacity-100 hover:border-[var(--accent)]/60",
              )}
              aria-label={`${s.name}으로 이동`}
            >
              <picture>
                <source
                  srcSet={`/captured/${s.capturedSlug}/home/desktop.avif`}
                  type="image/avif"
                />
                <source
                  srcSet={`/captured/${s.capturedSlug}/home/desktop.webp`}
                  type="image/webp"
                />
                <img
                  src={`/captured/${s.capturedSlug}/home/desktop.jpg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </picture>
            </button>
          ))}
        </div>
      </div>
    </PinSection>
  );
}
