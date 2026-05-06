"use client";
import { useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { CONTACT_EMAIL } from "@/lib/data/home";

export function Cta() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section className="relative z-10 bg-[var(--bg)] text-[var(--fg)] border-t border-[var(--line)] flex min-h-[30vh] flex-col items-center justify-center px-6 py-16 text-center md:min-h-[46vh] md:px-10 md:py-28 lg:px-16">
      <Magnetic strength={0.5}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block max-w-full whitespace-nowrap font-display text-[clamp(30px,8.8vw,56px)] leading-none tracking-normal md:text-display-xl"
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
                  color: colored ? "var(--accent)" : "inherit",
                }}
              >
                {char}
              </span>
            );
          })}
        </a>
      </Magnetic>
    </section>
  );
}
