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
        <div className="absolute bottom-10 left-6 md:left-10 lg:left-16 text-paper-dark mix-blend-difference pointer-events-none">
          <p className="text-meta">
            {idx + 1} / {SAAS_LIST.length}
          </p>
          <p className="text-display-md font-display mt-2">{saas.name}</p>
          <p className="text-body opacity-90 mt-1 max-w-xl">
            {saas.tagline.split(" — ")[0]}
          </p>
        </div>
        <div className="absolute bottom-10 right-6 md:right-10 lg:right-16 text-meta text-paper-dark mix-blend-difference pointer-events-none">
          호버 시 정지 · 클릭 시 디테일 →
        </div>
      </div>
    </PinSection>
  );
}
