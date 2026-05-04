"use client";
import { motion } from "framer-motion";
import { SweepLink } from "@/components/motion/color-sweep";
import { cn } from "@/lib/utils";
import type { SaaSDetail } from "@/lib/data/saas";

export function SaasCard({ saas, order }: { saas: SaaSDetail; order: number }) {
  return (
    <SweepLink
      href={`/builder/${saas.slug}`}
      className="group relative block border-b border-[var(--line)] py-10 md:py-14"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
        {/* order */}
        <div className="col-span-12 md:col-span-1">
          <span className="text-meta opacity-40 tabular-nums">
            {order.toString().padStart(2, "0")}
          </span>
        </div>

        {/* name + tagline + capabilities (hover reveal) */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 min-w-0">
          <h3
            className={cn(
              "font-display text-display-md md:text-display-lg leading-[0.95]",
              "transition-[transform,letter-spacing] duration-500",
              "group-hover:tracking-[-0.025em] group-hover:translate-x-2",
            )}
          >
            {saas.name}
          </h3>

          <p className="mt-5 text-body opacity-75 max-w-[680px]">
            {saas.tagline}
          </p>

          {/* 5 bullets — group-hover로 reveal */}
          <motion.ul
            initial={false}
            className={cn(
              "mt-6 grid gap-y-2 overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-[cubic-bezier(0.6,0.05,0.3,0.95)]",
              "max-h-0 opacity-0 mt-0",
              "group-hover:max-h-[320px] group-hover:opacity-100 group-hover:mt-6",
            )}
            aria-hidden="true"
          >
            {saas.capabilities.slice(0, 5).map((c, i) => (
              <li
                key={i}
                className="flex items-baseline gap-3 text-meta opacity-75"
              >
                <span className="opacity-40 tabular-nums">
                  ·{(i + 1).toString().padStart(2, "0")}
                </span>
                <span>{c.title}</span>
              </li>
            ))}
          </motion.ul>

          {/* 메타: tone · since */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-meta opacity-50">
            <span>{saas.tone === "dark" ? "DARK" : "LIGHT"}</span>
            {saas.since && <span>SINCE {saas.since}</span>}
            <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              VIEW DETAIL →
            </span>
          </div>
        </div>

        {/* captured image */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 aspect-[4/3] md:aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]">
          <picture>
            <source
              srcSet={`/captured/${saas.capturedSlug}/home/desktop.avif`}
              type="image/avif"
            />
            <source
              srcSet={`/captured/${saas.capturedSlug}/home/desktop.webp`}
              type="image/webp"
            />
            <img
              src={`/captured/${saas.capturedSlug}/home/desktop.jpg`}
              alt={`${saas.name} 라이브 캡처`}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover object-top",
                "transition-[transform,filter] duration-700 ease-[cubic-bezier(0.6,0.05,0.3,0.95)]",
                "grayscale-[40%] scale-100",
                "group-hover:grayscale-0 group-hover:scale-[1.04]",
              )}
            />
          </picture>
        </div>
      </div>
    </SweepLink>
  );
}

export function SaasIndex({ list }: { list: SaaSDetail[] }) {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="flex items-baseline justify-between mb-10 md:mb-16">
        <h2 className="text-meta opacity-60 tracking-[0.2em]">
          6 LIVE SAAS · INDEX
        </h2>
        <span className="text-meta opacity-40">PRODUCTION</span>
      </div>
      <div className="border-t border-[var(--line)]">
        {list.map((s, i) => (
          <SaasCard key={s.slug} saas={s} order={i + 1} />
        ))}
      </div>
    </section>
  );
}
