"use client";
import { SweepLink } from "@/components/motion/color-sweep";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SAAS_LIST } from "@/lib/data/saas";

export function SaasNav({ currentSlug }: { currentSlug: string }) {
  const idx = SAAS_LIST.findIndex((s) => s.slug === currentSlug);
  const prev = SAAS_LIST[(idx - 1 + SAAS_LIST.length) % SAAS_LIST.length];
  const next = SAAS_LIST[(idx + 1) % SAAS_LIST.length];

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-20 md:py-24 border-t border-[var(--line)]">
      <ScrollReveal className="flex items-baseline justify-between mb-10">
        <p className="text-meta opacity-60 tracking-[0.2em]">EXPLORE NEXT</p>
        <SweepLink
          href="/builder"
          className="text-meta opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-colors duration-300"
        >
          ← INDEX
        </SweepLink>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 border-t border-[var(--line)]">
        <SweepLink
          href={`/builder/${prev.slug}`}
          className="group relative block py-10 md:py-12 md:pr-10 border-r border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-500"
        >
          <p className="text-meta opacity-50 mb-3 tracking-[0.15em]">
            ← PREV {String(prev.order).padStart(2, "0")}
          </p>
          <h3 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] transition-transform duration-500 group-hover:-translate-x-2">
            {prev.name}
          </h3>
          <p className="mt-4 text-body opacity-70 max-w-[440px] line-clamp-2">
            {prev.tagline}
          </p>
        </SweepLink>

        <SweepLink
          href={`/builder/${next.slug}`}
          className="group relative block py-10 md:py-12 md:pl-10 hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-500 md:text-right"
        >
          <p className="text-meta opacity-50 mb-3 tracking-[0.15em]">
            NEXT {String(next.order).padStart(2, "0")} →
          </p>
          <h3 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2">
            {next.name}
          </h3>
          <p className="mt-4 text-body opacity-70 max-w-[440px] line-clamp-2 md:ml-auto">
            {next.tagline}
          </p>
        </SweepLink>
      </div>
    </section>
  );
}
