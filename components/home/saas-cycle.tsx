"use client";
import { useState, useEffect } from "react";
import { SAAS_LIST } from "@/lib/data/saas";
import { SweepLink } from "@/components/motion/color-sweep";

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
    <section className="overflow-hidden">
      <div
        className="px-6 md:px-10 lg:px-16 py-8 md:py-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 메인 캡처 — 16:10 정확 매칭으로 풀가시 · 풀필 (썸네일 strip 제거하여 세로 영역 활용) */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
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
                  className="w-full h-full object-cover"
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
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/55 backdrop-blur-md text-[var(--fg)] border border-[var(--line)]/50 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
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
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/55 backdrop-blur-md text-[var(--fg)] border border-[var(--line)]/50 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,4 14,10 8,16" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
