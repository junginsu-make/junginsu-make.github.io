"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CERTS_VISUAL, CERTS_TEXT } from "@/lib/data/certifications";

export function Certifications() {
  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-20 md:py-24 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-10 md:mb-12">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>CERTIFICATIONS · 09</MaskReveal>
        </p>
        <span className="text-meta opacity-40">3 비주얼 · 6 부속</span>
      </div>

      <h2 className="text-display-md font-display leading-[1.1] tracking-[-0.02em] mb-10 lg:whitespace-nowrap">
        <MaskReveal>
          <span>AI · 마케팅 자격증 3 (메인) + 강사 · CS 부속 6</span>
        </MaskReveal>
      </h2>

      {/* 3 비주얼 — 4:3 원본 비율 + object-contain (잘림 방지). 영역 축소. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-16 max-w-4xl">
        {CERTS_VISUAL.map((c, i) => (
          <ScrollReveal
            key={c.name}
            delay={i * 0.08}
            className="group flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] transition-colors duration-500 group-hover:border-[var(--accent)]">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-4 text-meta opacity-60 tracking-[0.1em] tabular-nums">
              {c.year}
            </p>
            <h3 className="mt-1.5 text-body font-medium leading-[1.4] group-hover:text-[var(--accent)] transition-colors duration-300">
              {c.name}
            </h3>
            <p className="mt-1 text-meta opacity-60">{c.issuer}</p>
          </ScrollReveal>
        ))}
      </div>

      {/* 6 부속 — chip 스타일 wrap (단순 정보 라벨) */}
      <ScrollReveal>
        <p className="text-meta opacity-60 mb-4 tracking-[0.2em]">
          ADDITIONAL · 06
        </p>
        <div className="flex flex-wrap gap-2 max-w-4xl">
          {CERTS_TEXT.map((c) => (
            <span
              key={c.name}
              title={`${c.issuer} · ${c.year}`}
              className="text-meta border border-[var(--line)] px-3 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300 cursor-default"
            >
              {c.name}
              <span className="opacity-50 ml-2 tabular-nums">{c.year}</span>
            </span>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
