"use client";
import { useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { CONTACT_EMAIL } from "@/lib/data/home";

export function Cta() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section className="bg-[var(--bg)] text-[var(--fg)] border-t border-[var(--line)] flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-20 md:py-24 text-center">
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
