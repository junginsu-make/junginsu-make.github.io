"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  TMON_PORTFOLIO_PERIOD,
  TMON_PORTFOLIO_SOURCE,
} from "@/lib/data/marketing";

export function TmonPortfolio() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>VERIFIED · TMON ROAS CHART</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {TMON_PORTFOLIO_PERIOD}
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-[860px] mb-12">
        <MaskReveal>
          <span>본인이 직접 작성한 운영 보고서 원본 차트</span>
        </MaskReveal>
      </h2>

      <ScrollReveal>
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="group block w-full overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] hover:border-[var(--accent)] transition-colors duration-500"
          aria-label="TMON ROAS 차트 확대 보기"
        >
          <div className="relative aspect-[16/10] md:aspect-[16/9]">
            <picture>
              <source
                srcSet="/marketing-portfolio/page-01.avif"
                type="image/avif"
              />
              <source
                srcSet="/marketing-portfolio/page-01.webp"
                type="image/webp"
              />
              <img
                src={TMON_PORTFOLIO_SOURCE}
                alt="TMON ROAS 운영 보고서 차트 (정인수 직접 작성, 2023.03)"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </picture>

            <div
              className="absolute bottom-4 right-4 px-3 py-1.5 text-meta tracking-[0.15em] text-[#F4F0E6] backdrop-blur-sm bg-black/40 border border-white/10"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              CLICK TO ZOOM ⤢
            </div>
          </div>
        </button>
      </ScrollReveal>

      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-[95vw] md:max-w-[92vw] p-2 md:p-4 bg-[var(--bg)]">
          <DialogTitle className="sr-only">
            TMON ROAS 운영 보고서 차트 확대 보기
          </DialogTitle>
          <picture>
            <source
              srcSet="/marketing-portfolio/page-01.avif"
              type="image/avif"
            />
            <source
              srcSet="/marketing-portfolio/page-01.webp"
              type="image/webp"
            />
            <img
              src={TMON_PORTFOLIO_SOURCE}
              alt="TMON ROAS 운영 보고서 차트 확대"
              className="w-full h-auto max-h-[88vh] object-contain"
            />
          </picture>
          <p className="px-2 pt-3 text-meta opacity-60">
            출처: 정인수 본인 작성 「개인 포토폴리오-23.03.02.pdf」
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
