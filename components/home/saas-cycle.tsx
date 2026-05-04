"use client";
import { useState, useEffect } from "react";
import { SAAS_LIST } from "@/lib/data/saas";
import { SweepLink } from "@/components/motion/color-sweep";
import { PinSection } from "@/components/motion/pin-section";

export function SaasCycle() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SAAS_LIST.length), 3000);
    return () => clearInterval(t);
  }, [paused]);

  const saas = SAAS_LIST[idx];

  function handlePrev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPaused(true);
    setIdx((i) => (i - 1 + SAAS_LIST.length) % SAAS_LIST.length);
  }
  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPaused(true);
    setIdx((i) => (i + 1) % SAAS_LIST.length);
  }

  return (
    <PinSection>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative h-screen overflow-hidden"
      >
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
        <div className="absolute bottom-10 left-6 md:left-10 lg:left-16 text-paper-dark mix-blend-difference pointer-events-none z-10">
          <p className="text-meta">
            {idx + 1} / {SAAS_LIST.length}
          </p>
          <p className="text-display-md font-display mt-2">{saas.name}</p>
          <p className="text-body opacity-90 mt-1 max-w-xl">
            {saas.tagline.split(" — ")[0]}
          </p>
        </div>
        {/* 우하단 — 수동 < > 버튼 (z-20 으로 SweepLink 위 + pointer-events-auto) */}
        <div className="absolute bottom-10 right-6 md:right-10 lg:right-16 flex gap-3 mix-blend-difference text-paper-dark z-20">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 SaaS"
            className="w-12 h-12 rounded-full border border-current/40 hover:bg-current/10 transition-colors flex items-center justify-center text-2xl font-display leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 SaaS"
            className="w-12 h-12 rounded-full border border-current/40 hover:bg-current/10 transition-colors flex items-center justify-center text-2xl font-display leading-none"
          >
            ›
          </button>
        </div>
      </div>
    </PinSection>
  );
}
