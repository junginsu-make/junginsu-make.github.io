"use client";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";
import type { SaaSDetail } from "@/lib/data/saas";

type Props = {
  saas: SaaSDetail;
  galleryImages: string[];
};

export function SaasCapabilities({ saas, galleryImages }: Props) {
  return (
    <section
      id="capabilities"
      className="px-6 md:px-10 lg:px-16 py-24 md:py-32"
    >
      <div className="flex items-baseline justify-between mb-16 md:mb-24">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>CAPABILITIES · 능력 풀</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {saas.capabilities.length.toString().padStart(2, "0")} / SET
        </span>
      </div>

      <div className="space-y-24 md:space-y-32">
        {saas.capabilities.map((c, i) => {
          const isReversed = i % 2 === 1;
          const matchedImage = galleryImages[i] ?? galleryImages[i % galleryImages.length];
          return (
            <article
              key={i}
              className={cn(
                "grid md:grid-cols-12 gap-8 md:gap-12 items-center border-t border-[var(--line)] pt-12 md:pt-16",
              )}
            >
              <div
                className={cn(
                  "md:col-span-6 order-2",
                  isReversed ? "md:order-2" : "md:order-1",
                )}
              >
                <p className="text-display-md md:text-display-lg font-display opacity-15 leading-none tabular-nums">
                  {(i + 1).toString().padStart(2, "0")}
                </p>

                <h3 className="mt-6 text-display-md font-display leading-[1.05] tracking-[-0.02em] max-w-[520px]">
                  <MaskReveal>{c.title}</MaskReveal>
                </h3>

                <ScrollReveal delay={0.15}>
                  <p className="mt-6 text-body opacity-80 leading-[1.7] max-w-[560px]">
                    {c.description}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.25}>
                  <div className="mt-8 flex items-center gap-3 text-meta opacity-50">
                    <span className="h-px w-8 bg-current" />
                    <span>FEATURE {(i + 1).toString().padStart(2, "0")}</span>
                  </div>
                </ScrollReveal>
              </div>

              <div
                className={cn(
                  "md:col-span-6 order-1",
                  isReversed ? "md:order-1" : "md:order-2",
                )}
              >
                <ScrollReveal delay={0.1}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]">
                    {matchedImage ? (
                      <picture>
                        <source srcSet={matchedImage.replace(/\.(jpe?g|png|webp)$/i, ".avif")} type="image/avif" />
                        <source srcSet={matchedImage.replace(/\.(jpe?g|png)$/i, ".webp")} type="image/webp" />
                        <img
                          src={matchedImage}
                          alt={`${saas.name} — ${c.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                        />
                      </picture>
                    ) : (
                      <div className="h-full w-full grid place-items-center text-meta opacity-30">
                        NO IMAGE
                      </div>
                    )}

                    {/* 인덱스 오버레이 — backdrop-blur로 가독성 안전 확보 */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 text-meta tracking-[0.2em] text-[#F4F0E6] backdrop-blur-sm bg-black/30 border border-white/10"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                      {saas.name.toUpperCase()}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
