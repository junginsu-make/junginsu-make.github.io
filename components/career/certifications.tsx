"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CERTS_VISUAL, CERTS_TEXT } from "@/lib/data/certifications";

export function Certifications() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>CERTIFICATIONS · 09</MaskReveal>
        </p>
        <span className="text-meta opacity-40">3 비주얼 + 6 텍스트</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-16 md:mb-20 max-w-[680px]">
        <MaskReveal>
          <span>AI · 마케팅 자격증 3 + 강사·CS 자격증 6</span>
        </MaskReveal>
      </h2>

      {/* 3 비주얼 카드 */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32">
        {CERTS_VISUAL.map((c, i) => (
          <ScrollReveal
            key={c.name}
            delay={i * 0.1}
            className="group flex flex-col"
          >
            <div className="aspect-[3/4] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] transition-colors duration-500 group-hover:border-[var(--accent)]">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-6 text-meta opacity-60 tracking-[0.1em]">{c.year}</p>
            <h3 className="mt-2 text-body-lg font-medium leading-[1.4]">
              {c.name}
            </h3>
            <p className="mt-2 text-meta opacity-60">{c.issuer}</p>
          </ScrollReveal>
        ))}
      </div>

      {/* 6 텍스트 (CS강사 1급은 text 첫줄, 사회복지사 2급 등 — id별 표시) */}
      <ScrollReveal>
        <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">
          ADDITIONAL · 06
        </p>
        <div className="border-t border-[var(--line)]">
          {CERTS_TEXT.map((c, i) => (
            <ScrollReveal
              key={c.name}
              delay={Math.min(i * 0.04, 0.25)}
              className="grid grid-cols-12 gap-x-4 gap-y-2 py-4 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-300"
            >
              <span className="col-span-12 md:col-span-7 text-body">
                {c.name}
              </span>
              <span className="col-span-6 md:col-span-2 text-meta opacity-60 tabular-nums">
                {c.year}
              </span>
              <span className="col-span-6 md:col-span-3 text-meta opacity-60">
                {c.issuer}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
