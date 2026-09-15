"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { ContentRef } from "@/lib/data/content-refs";
import { CONTENT_REFS } from "@/lib/data/content-refs";

const CATEGORY_LABELS: Record<ContentRef["category"], string> = {
  blog: "BLOG",
  instagram: "INSTAGRAM",
  youtube: "YOUTUBE SHORTS",
  notion: "NOTION",
  external: "EXTERNAL",
};

const CATEGORY_GLYPH: Record<ContentRef["category"], string> = {
  blog: "B",
  instagram: "IG",
  youtube: "▶",
  notion: "N",
  external: "↗",
};

export function ContentGrid() {
  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>RECENT · {CONTENT_REFS.length} ENTRIES</MaskReveal>
        </p>
        <span className="text-meta opacity-40">CLIENT WORK</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 md:mb-16 max-w-[820px]">
        <MaskReveal>
          <span>최근 클라이언트 콘텐츠 운영 사례</span>
        </MaskReveal>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
        {CONTENT_REFS.map((c, i) => {
          return (
            <ScrollReveal
              key={c.url}
              delay={Math.min(i * 0.06, 0.4)}
              className="bg-[var(--bg)]"
            >
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group block p-7 md:p-8 h-full transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="inline-flex items-center gap-2 text-meta opacity-60 group-hover:text-[var(--accent)] group-hover:opacity-100 transition-all duration-300">
                    <span
                      className="font-mono text-[var(--accent)] tabular-nums"
                      aria-hidden
                    >
                      {CATEGORY_GLYPH[c.category]}
                    </span>
                    <span>{CATEGORY_LABELS[c.category]}</span>
                  </span>
                  <span className="text-meta opacity-50 tabular-nums">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-body-lg md:text-display-md font-display leading-[1.2] tracking-[-0.015em] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {c.title}
                </h3>

                <p className="mt-6 text-meta opacity-60">{c.publisher}</p>

                <p className="mt-8 font-mono text-meta opacity-40 truncate group-hover:opacity-70 transition-opacity duration-300">
                  {c.url.replace(/^https?:\/\//, "").slice(0, 56)}
                  {c.url.length > 60 && "…"}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-meta opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--accent)]">
                  <span>VIEW</span>
                  <span aria-hidden>↗</span>
                </div>
              </a>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
