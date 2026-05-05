"use client";
import { motion } from "framer-motion";
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
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>CAPABILITIES · 능력 풀</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {saas.capabilities.length.toString().padStart(2, "0")} / SET
        </span>
      </div>

      {/* 인트로 — 라이브 사이트 콘텐츠 안내 */}
      <ScrollReveal>
        <p className="text-body-lg opacity-75 leading-[1.6] mb-16 md:mb-24 max-w-[820px]">
          {saas.name}이 실제로 무엇을 하는지 — 각 능력은 라이브 사이트에서
          하나의 화면 또는 워크플로우 단위. 텍스트 설명만으로 안 닿는다면 우측
          상단 「바로가기」 버튼으로 직접 살펴보세요.
        </p>
      </ScrollReveal>

      <div className="space-y-20 md:space-y-28">
        {saas.capabilities.map((c, i) => {
          const isReversed = i % 2 === 1;
          const matchedImage =
            galleryImages[i] ?? galleryImages[i % galleryImages.length];
          return (
            <article
              key={i}
              className="grid md:grid-cols-12 gap-8 md:gap-14 items-center border-t border-[var(--line)] pt-12 md:pt-16"
            >
              <div
                className={cn(
                  "md:col-span-7 order-2",
                  isReversed ? "md:order-2" : "md:order-1",
                )}
              >
                <div className="flex items-baseline gap-5">
                  <p className="text-display-md md:text-display-lg font-display opacity-15 leading-none tabular-nums shrink-0">
                    {(i + 1).toString().padStart(2, "0")}
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15,
                      ease: [0.6, 0.05, 0.3, 0.95],
                    }}
                    className="h-px bg-current opacity-30 flex-1 origin-left mt-3"
                  />
                  <span className="text-meta opacity-50 shrink-0 tracking-[0.15em]">
                    FEATURE
                  </span>
                </div>

                <h3 className="mt-8 text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em]">
                  <MaskReveal>{c.title}</MaskReveal>
                </h3>

                <ScrollReveal delay={0.15}>
                  <p className="mt-8 text-body-lg opacity-85 leading-[1.7] max-w-[760px]">
                    {c.description}
                  </p>
                </ScrollReveal>
              </div>

              <div
                className={cn(
                  "md:col-span-5 order-1",
                  isReversed ? "md:order-1" : "md:order-2",
                )}
              >
                <ScrollReveal delay={0.1}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] group">
                    {matchedImage ? (
                      <picture>
                        <source
                          srcSet={matchedImage.replace(
                            /\.(jpe?g|png|webp)$/i,
                            ".avif",
                          )}
                          type="image/avif"
                        />
                        <source
                          srcSet={matchedImage.replace(
                            /\.(jpe?g|png)$/i,
                            ".webp",
                          )}
                          type="image/webp"
                        />
                        <img
                          src={matchedImage}
                          alt={`${saas.name} — ${c.title}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </picture>
                    ) : (
                      <div className="h-full w-full grid place-items-center text-meta opacity-30">
                        NO IMAGE
                      </div>
                    )}

                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 text-meta tracking-[0.2em] text-[#F4F0E6] backdrop-blur-sm bg-black/30 border border-white/10"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                      {saas.name.toUpperCase()}
                    </div>

                    <div
                      className="absolute bottom-4 right-4 px-2.5 py-1 text-meta tracking-[0.15em] text-[#F4F0E6] backdrop-blur-sm bg-black/40 border border-white/10"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                      {(i + 1).toString().padStart(2, "0")} /{" "}
                      {saas.capabilities.length.toString().padStart(2, "0")}
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
