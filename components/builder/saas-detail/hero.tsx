"use client";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

export function SaasHero({ saas }: { saas: SaaSDetail }) {
  const meta = [
    saas.toneNote,
    saas.since ? `SINCE ${saas.since}` : null,
    saas.developer ? `BY ${saas.developer.toUpperCase()}` : null,
  ].filter(Boolean);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-[var(--line)]">
      {/* 풀블리드 라이브 캡처 */}
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
          alt={`${saas.name} 라이브 화면`}
          className="absolute inset-0 h-full w-full object-cover object-top scale-[1.02]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* 가독성 그라디언트 — 하단으로 갈수록 진해짐 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* 컨텐츠 — 항상 light text + drop-shadow */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-16 md:pb-20 text-[#F4F0E6]">
        <p
          className="text-meta opacity-80 mb-6 tracking-[0.2em]"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
        >
          <MaskReveal>
            {`AI BUILDER · ${String(saas.order).padStart(2, "0")} / 06`}
          </MaskReveal>
        </p>

        <h1
          className="text-display-xl md:text-display-mega font-display leading-[0.92] tracking-[-0.03em] max-w-[1280px]"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.55)" }}
        >
          <MaskRevealStagger
            text={saas.name}
            letterDelay={0.04}
            duration={0.85}
          />
        </h1>

        <p
          className="mt-8 max-w-[820px] text-body-lg md:text-body-xl leading-[1.45] opacity-95"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
        >
          <MaskReveal delay={0.5}>{saas.tagline}</MaskReveal>
        </p>

        <ScrollReveal
          delay={0.8}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-meta opacity-75"
        >
          {meta.map((m, i) => (
            <span key={i} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {m}
            </span>
          ))}
        </ScrollReveal>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.25} className="inline-block">
            <a
              href={saas.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-[#F4F0E6] px-7 py-3.5 text-meta tracking-[0.15em] hover:bg-[#F4F0E6] hover:text-[#0A0A0A] transition-colors duration-300"
            >
              <span>LIVE</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </Magnetic>

          <a
            href="#capabilities"
            className="group inline-flex items-center gap-3 border border-[#F4F0E6]/30 px-7 py-3.5 text-meta tracking-[0.15em] hover:border-[#F4F0E6] transition-colors duration-300"
          >
            <span>능력 풀 보기</span>
            <span aria-hidden className="transition-transform group-hover:translate-y-1">
              ↓
            </span>
          </a>
        </div>

        <div className="mt-12 max-w-[420px] text-meta opacity-60 leading-[1.7]">
          <WordHighlight delay={1.2}>{saas.tone === "dark" ? "DARK TONE" : "LIGHT TONE"}</WordHighlight>
          <span className="ml-2">— {saas.toneNote}</span>
        </div>
      </div>
    </section>
  );
}
