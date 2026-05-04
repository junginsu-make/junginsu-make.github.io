"use client";
import { useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CONTACT_EMAIL, CTA_QUOTE } from "@/lib/data/home";

export function Cta() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section className="bg-[var(--color-ink-dark)] text-[var(--color-paper-dark)] flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-20 md:py-24 text-center">
      <ScrollReveal>
        <p className="text-meta opacity-60 mb-8">{CTA_QUOTE}</p>
      </ScrollReveal>
      <Magnetic strength={0.5}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-display-lg md:text-display-xl font-display whitespace-nowrap inline-block tracking-tight"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {Array.from(CONTACT_EMAIL).map((char, i) => {
            const dist =
              hoverIdx !== null ? Math.abs(hoverIdx - i) : Number.POSITIVE_INFINITY;
            const lift =
              dist === 0
                ? -12
                : dist === 1
                  ? -8
                  : dist === 2
                    ? -4
                    : 0;
            const colored = dist <= 1;
            return (
              <span
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                className="inline-block transition-all duration-300 ease-out"
                style={{
                  transform: `translateY(${lift}px)`,
                  color: colored ? "var(--color-orange-dark)" : "inherit",
                }}
              >
                {char}
              </span>
            );
          })}
        </a>
      </Magnetic>
      <ScrollReveal delay={0.6}>
        <a
          href="/정인수 이력서_260505.pdf"
          download="정인수 이력서.pdf"
          className="text-meta mt-16 underline-offset-4 hover:underline opacity-70 hover:opacity-100 transition-opacity inline-block"
        >
          이력서 PDF 다운로드 →
        </a>
      </ScrollReveal>
    </section>
  );
}
