"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { FEATURED_BLOG } from "@/lib/data/content-refs";

export function ContentFeatured() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>FEATURED · OWNED MEDIA</MaskReveal>
        </p>
        <span className="text-meta opacity-40">SINCE 2018</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 md:mb-16 max-w-[820px]">
        <MaskReveal>
          <span>{FEATURED_BLOG.title}</span>
        </MaskReveal>
      </h2>

      <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
        {/* desktop 캡처 */}
        <ScrollReveal className="md:col-span-8">
          <a
            href={FEATURED_BLOG.url}
            target="_blank"
            rel="noreferrer"
            className="group block aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] hover:border-[var(--accent)] transition-colors duration-500"
          >
            <picture>
              <source srcSet="/captured/blog/sbcyberpass/desktop.avif" type="image/avif" />
              <source srcSet="/captured/blog/sbcyberpass/desktop.webp" type="image/webp" />
              <img
                src={FEATURED_BLOG.capturedDesktop}
                alt={`${FEATURED_BLOG.title} 데스크탑 캡처`}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </picture>
          </a>
        </ScrollReveal>

        {/* mobile 캡처 */}
        <ScrollReveal delay={0.15} className="md:col-span-4">
          <a
            href={FEATURED_BLOG.url}
            target="_blank"
            rel="noreferrer"
            className="group block aspect-[9/16] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] hover:border-[var(--accent)] transition-colors duration-500"
          >
            <picture>
              <source srcSet="/captured/blog/sbcyberpass/mobile.avif" type="image/avif" />
              <source srcSet="/captured/blog/sbcyberpass/mobile.webp" type="image/webp" />
              <img
                src={FEATURED_BLOG.capturedMobile}
                alt={`${FEATURED_BLOG.title} 모바일 캡처`}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </picture>
          </a>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3} className="mt-10">
        <a
          href={FEATURED_BLOG.url}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 text-body-lg border-b border-[var(--fg)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
        >
          <span className="font-mono">
            {FEATURED_BLOG.url.replace(/^https?:\/\//, "")}
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
        </a>
      </ScrollReveal>
    </section>
  );
}
