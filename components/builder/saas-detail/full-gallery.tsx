"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

type Props = {
  saas: SaaSDetail;
  galleryImages: string[];
};

export function SaasGallery({ saas, galleryImages }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (galleryImages.length === 0) return null;

  const isOpen = activeIndex !== null;
  const activeImage = activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <section className="py-24 md:py-32 border-t border-[var(--line)]">
      <div className="px-6 md:px-10 lg:px-16 flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>GALLERY · 풀 인벤토리</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {galleryImages.length.toString().padStart(2, "0")} 장
        </span>
      </div>

      {/* horizontal scroll snap */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <div className="flex gap-4 md:gap-6 px-6 md:px-10 lg:px-16 snap-x snap-mandatory pb-4">
          {galleryImages.map((src, i) => (
            <ScrollReveal
              key={src}
              delay={Math.min(i * 0.04, 0.4)}
              className="snap-start flex-shrink-0"
            >
              <button
                onClick={() => setActiveIndex(i)}
                className="group relative block w-[78vw] md:w-[44vw] lg:w-[36vw] aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] hover:border-[var(--accent)] transition-colors duration-500"
                aria-label={`${saas.name} 갤러리 이미지 ${i + 1}`}
              >
                <picture>
                  <source srcSet={src.replace(/\.(jpe?g|png|webp)$/i, ".avif")} type="image/avif" />
                  <source srcSet={src.replace(/\.(jpe?g|png)$/i, ".webp")} type="image/webp" />
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </picture>

                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 text-meta tracking-[0.2em] text-[#F4F0E6] backdrop-blur-sm bg-black/30 border border-white/10"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                >
                  {(i + 1).toString().padStart(2, "0")} / {galleryImages.length.toString().padStart(2, "0")}
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-[90vw] p-2 md:p-4 bg-[var(--bg)]">
          <DialogTitle className="sr-only">
            {saas.name} 갤러리 이미지 {(activeIndex ?? 0) + 1}
          </DialogTitle>
          {activeImage && (
            <picture>
              <source srcSet={activeImage.replace(/\.(jpe?g|png|webp)$/i, ".avif")} type="image/avif" />
              <source srcSet={activeImage.replace(/\.(jpe?g|png)$/i, ".webp")} type="image/webp" />
              <img
                src={activeImage}
                alt={`${saas.name} 갤러리 ${(activeIndex ?? 0) + 1}`}
                className="w-full h-auto max-h-[88vh] object-contain"
              />
            </picture>
          )}
          <div className="flex items-center justify-between text-meta opacity-70 px-2 pt-2">
            <span>{saas.name}</span>
            <span className="tabular-nums">
              {((activeIndex ?? 0) + 1).toString().padStart(2, "0")} /{" "}
              {galleryImages.length.toString().padStart(2, "0")}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
