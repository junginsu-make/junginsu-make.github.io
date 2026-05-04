"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { cn } from "@/lib/utils";
import {
  MAKE_SYSTEMS,
  MAKE_FOLDERS,
  CATEGORY_INFO,
  type MakeSystemCategory,
} from "@/lib/data/make-systems";

type Props = {
  screenshots: string[];
};

export function MakeSystemsShowcase({ screenshots }: Props) {
  const [zoomedShot, setZoomedShot] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<MakeSystemCategory | null>(
    null,
  );

  const filteredSystems = activeCategory
    ? MAKE_SYSTEMS.filter((s) => s.category === activeCategory)
    : MAKE_SYSTEMS;

  const categories = Object.entries(CATEGORY_INFO) as [
    MakeSystemCategory,
    typeof CATEGORY_INFO[MakeSystemCategory],
  ][];

  return (
    <>
      {/* 실제 make.com 화면 갤러리 — horizontal scroll snap */}
      <section className="py-24 md:py-32 border-t border-[var(--line)]">
        <div className="px-6 md:px-10 lg:px-16 mb-12 md:mb-16">
          <div className="flex items-baseline justify-between mb-12">
            <p className="text-meta opacity-60 tracking-[0.2em]">
              <MaskReveal>LIVE NODES · MAKE.COM SCREENS</MaskReveal>
            </p>
            <span className="text-meta opacity-40 tabular-nums">
              <Counter to={screenshots.length} /> CAPTURES · 클릭 시 확대
            </span>
          </div>

          <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
            <MaskReveal>
              <span>
                실제 make.com 화면 — <WordHighlight delay={0.5}>노드</WordHighlight>
                ·<WordHighlight delay={0.7}>플로우</WordHighlight>·
                <WordHighlight delay={0.9}>인벤토리</WordHighlight>
              </span>
            </MaskReveal>
          </h2>

          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-body-lg opacity-75 max-w-[920px] leading-[1.6]">
              81 시스템이 어떻게 폴더로 정리되어 있고, 각 시나리오 노드가 어떻게
              연결되어 있는지 — 실제 작업 화면을 직접 보여드립니다.
            </p>
          </ScrollReveal>
        </div>

        {/* 가로 스크롤 갤러리 */}
        <div
          className="overflow-x-auto"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties
          }
        >
          <div className="flex gap-4 md:gap-6 px-6 md:px-10 lg:px-16 snap-x snap-mandatory pb-4">
            {screenshots.map((src, i) => (
              <ScrollReveal
                key={src}
                delay={Math.min(i * 0.04, 0.4)}
                className="snap-start flex-shrink-0"
              >
                <button
                  onClick={() => setZoomedShot(i)}
                  className="group relative block w-[78vw] md:w-[44vw] lg:w-[34vw] aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] hover:border-[var(--accent)] transition-colors duration-500"
                  aria-label={`make.com 캡처 ${i + 1} 확대`}
                >
                  <picture>
                    <source
                      srcSet={src.replace(/\.(jpe?g|png|webp)$/i, ".avif")}
                      type="image/avif"
                    />
                    <source
                      srcSet={src.replace(/\.(jpe?g|png)$/i, ".webp")}
                      type="image/webp"
                    />
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </picture>
                  <div
                    className="absolute bottom-3 left-3 px-2.5 py-1 text-meta tracking-[0.15em] text-[#F4F0E6] backdrop-blur-sm bg-black/40 border border-white/10"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {(i + 1).toString().padStart(2, "0")} /{" "}
                    {screenshots.length.toString().padStart(2, "0")} · MAKE.COM
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <Dialog
          open={zoomedShot !== null}
          onOpenChange={(open) => !open && setZoomedShot(null)}
        >
          <DialogContent className="max-w-[95vw] md:max-w-[92vw] p-2 md:p-4 bg-[var(--bg)]">
            <DialogTitle className="sr-only">
              make.com 캡처 {(zoomedShot ?? 0) + 1}
            </DialogTitle>
            {zoomedShot !== null && screenshots[zoomedShot] && (
              <picture>
                <source
                  srcSet={screenshots[zoomedShot].replace(
                    /\.(jpe?g|png|webp)$/i,
                    ".avif",
                  )}
                  type="image/avif"
                />
                <source
                  srcSet={screenshots[zoomedShot].replace(
                    /\.(jpe?g|png)$/i,
                    ".webp",
                  )}
                  type="image/webp"
                />
                <img
                  src={screenshots[zoomedShot]}
                  alt=""
                  className="w-full h-auto max-h-[88vh] object-contain"
                />
              </picture>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* 81 시스템 폴더 트리 */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>FOLDER TREE · 19 GROUPS · 81 SYSTEMS</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={MAKE_FOLDERS.reduce((s, f) => s + f.count, 0)} />{" "}
            scenarios
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-10 max-w-none lg:whitespace-nowrap">
          <MaskReveal>
            <span>
              실제 make.com 좌측 사이드바 폴더 — 이대로 운영 중
            </span>
          </MaskReveal>
        </h2>

        {/* 폴더 트리 — 좌측 사이드바 형태 */}
        <ScrollReveal delay={0.2}>
          <div className="border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_2%,var(--bg))] font-mono">
            <div className="flex items-baseline justify-between px-5 py-3 border-b border-[var(--line)] text-meta opacity-60">
              <span>📁 Folders</span>
              <span>{MAKE_FOLDERS.length} groups</span>
            </div>
            {MAKE_FOLDERS.map((f, i) => {
              const widthPct = Math.max(
                12,
                (f.count / Math.max(...MAKE_FOLDERS.map((x) => x.count))) * 100,
              );
              return (
                <div
                  key={f.index}
                  className="grid grid-cols-12 gap-x-4 items-center px-5 py-2.5 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))] transition-colors duration-200 group"
                >
                  <span className="col-span-1 text-meta opacity-40 tabular-nums">
                    {f.index.padStart(2, "0")}
                  </span>
                  <span className="col-span-7 text-body group-hover:text-[var(--accent)] transition-colors">
                    {f.name}
                  </span>
                  <div className="col-span-3 h-1.5 bg-[var(--line)]/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widthPct}%` }}
                      viewport={{ once: true, margin: "-5% 0px" }}
                      transition={{
                        duration: 0.7,
                        delay: Math.min(i * 0.03, 0.3),
                        ease: [0.6, 0.05, 0.3, 0.95],
                      }}
                      className="h-full bg-[var(--accent)]"
                    />
                  </div>
                  <span className="col-span-1 text-meta opacity-70 tabular-nums text-right">
                    {f.count}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* 18 디테일 시스템 — 카테고리 필터 + 카드 grid */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>DETAILED SYSTEMS · {MAKE_SYSTEMS.length} / 81</MaskReveal>
          </p>
          <span className="text-meta opacity-40">
            모듈·연동·설명 풀스펙
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-10 max-w-none lg:whitespace-nowrap">
          <MaskReveal>
            <span>각 시스템의 모듈·연동 서비스·운영 시나리오</span>
          </MaskReveal>
        </h2>

        {/* 카테고리 필터 칩 */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                "text-meta border px-4 py-2 transition-colors duration-300",
                activeCategory === null
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
                  : "border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
              )}
            >
              ALL · {MAKE_SYSTEMS.length}
            </button>
            {categories.map(([cat, info]) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "text-meta border px-4 py-2 transition-colors duration-300",
                  activeCategory === cat
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
                    : "border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
                )}
              >
                <span className="opacity-60 mr-2">{info.number}</span>
                {cat}
                <span className="opacity-50 ml-2">·</span>
                <span className="opacity-90 ml-1">{info.count}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {filteredSystems.map((sys, i) => {
            const info = CATEGORY_INFO[sys.category];
            return (
              <ScrollReveal
                key={sys.title + i}
                delay={Math.min(i * 0.04, 0.3)}
                className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span className="text-meta opacity-60 tracking-[0.1em]">
                    {info.number} · {sys.category}
                  </span>
                  {(sys.isStar || sys.isFlagship) && (
                    <span className="text-meta text-[var(--accent)] tracking-[0.15em]">
                      {sys.isStar ? "★ STAR" : "◆ CORE"}
                    </span>
                  )}
                </div>

                <h3 className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.015em] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {sys.title}
                </h3>

                <div className="mt-5 flex items-baseline gap-3 text-meta opacity-70">
                  <span>모듈</span>
                  <span className="font-mono opacity-90">
                    {typeof sys.modules === "number"
                      ? `${sys.modules}개`
                      : sys.modules}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sys.services.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="text-meta border border-[var(--line)] px-2 py-0.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {s}
                    </span>
                  ))}
                  {sys.services.length > 5 && (
                    <span className="text-meta opacity-50">
                      +{sys.services.length - 5}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-meta opacity-70 leading-[1.6]">
                  {sys.description}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
