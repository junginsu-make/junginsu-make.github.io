"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { cn } from "@/lib/utils";
import {
  MAKE_SYSTEMS,
  MAKE_CORE_FOUR,
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

  // 갤러리 carousel — 자동 롤링 + 좌우 수동 navigation
  const [shotIdx, setShotIdx] = useState(0);
  const [shotPaused, setShotPaused] = useState(false);
  const total = screenshots.length;
  useEffect(() => {
    if (shotPaused || total <= 1) return;
    const t = setInterval(() => setShotIdx((i) => (i + 1) % total), 2000);
    return () => clearInterval(t);
  }, [shotPaused, total]);
  const goPrev = () => setShotIdx((i) => (i - 1 + total) % total);
  const goNext = () => setShotIdx((i) => (i + 1) % total);

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
              <MaskReveal>LIVE NODES · 자동화 시나리오 SCREENS</MaskReveal>
            </p>
            <span className="text-meta opacity-40 tabular-nums">
              <Counter to={screenshots.length} /> CAPTURES · 클릭 시 확대
            </span>
          </div>

          <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
            <MaskReveal>
              <span>
                실제 자동화 시나리오 화면 — <WordHighlight delay={0.5}>노드</WordHighlight>
                ·<WordHighlight delay={0.7}>플로우</WordHighlight>·
                <WordHighlight delay={0.9}>인벤토리</WordHighlight>
              </span>
            </MaskReveal>
          </h2>

          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-body-lg opacity-75 leading-[1.6] lg:whitespace-nowrap">
              81 시스템이 어떻게 폴더로 정리되어 있고, 각 시나리오 노드가 어떻게
              연결되어 있는지 — 실제 작업 화면을 직접 보여드립니다.
            </p>
          </ScrollReveal>
        </div>

        {/* 단일 슬라이드 carousel — 자동 롤링 + 좌우 수동 navigation */}
        <ScrollReveal delay={0.2} className="px-6 md:px-10 lg:px-16">
          <div
            className="relative w-full aspect-[16/9] md:aspect-[16/8] border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] overflow-hidden"
            onMouseEnter={() => setShotPaused(true)}
            onMouseLeave={() => setShotPaused(false)}
          >
            <AnimatePresence mode="sync">
              {screenshots[shotIdx] && (
                <motion.button
                  key={screenshots[shotIdx]}
                  type="button"
                  onClick={() => setZoomedShot(shotIdx)}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.6, 0.05, 0.3, 0.95] }}
                  className="absolute inset-0 group"
                  aria-label={`캡처 ${shotIdx + 1} 확대`}
                >
                  <picture>
                    <source
                      srcSet={screenshots[shotIdx].replace(
                        /\.(jpe?g|png|webp)$/i,
                        ".avif",
                      )}
                      type="image/avif"
                    />
                    <source
                      srcSet={screenshots[shotIdx].replace(
                        /\.(jpe?g|png)$/i,
                        ".webp",
                      )}
                      type="image/webp"
                    />
                    <img
                      src={screenshots[shotIdx]}
                      alt=""
                      decoding="async"
                      className="h-full w-full object-cover object-top md:object-contain bg-[color-mix(in_oklab,var(--fg)_4%,var(--bg))]"
                    />
                  </picture>
                </motion.button>
              )}
            </AnimatePresence>

            {/* 진행 인디케이터 — 상단 도트 bar */}
            <div className="absolute top-3 left-3 right-3 flex gap-1.5 pointer-events-none">
              {screenshots.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 bg-[#F4F0E6]/30 overflow-hidden"
                >
                  {i === shotIdx && (
                    <motion.div
                      key={`bar-${shotIdx}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: shotPaused ? 0 : 1 }}
                      transition={{ duration: shotPaused ? 0 : 2, ease: "linear" }}
                      className="h-full bg-[var(--accent)] origin-left"
                    />
                  )}
                  {i < shotIdx && <div className="h-full bg-[#F4F0E6]/60" />}
                </div>
              ))}
            </div>

            {/* 인덱스 라벨 */}
            <div
              className="absolute bottom-3 left-3 px-2.5 py-1 text-meta tracking-[0.15em] text-[#F4F0E6] backdrop-blur-sm bg-black/45 border border-white/10 pointer-events-none"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              {(shotIdx + 1).toString().padStart(2, "0")} /{" "}
              {total.toString().padStart(2, "0")} · 자동화 시나리오
            </div>

            {/* 좌측 화살표 */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="이전 캡처"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="12,4 6,10 12,16" />
              </svg>
            </button>
            {/* 우측 화살표 */}
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="다음 캡처"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8,4 14,10 8,16" />
              </svg>
            </button>
          </div>

          {/* 썸네일 strip — 빠른 이동 */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {screenshots.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShotIdx(i)}
                className={cn(
                  "flex-shrink-0 w-20 md:w-24 aspect-[16/10] overflow-hidden border transition-all duration-300",
                  i === shotIdx
                    ? "border-[var(--accent)] opacity-100 scale-105"
                    : "border-[var(--line)] opacity-50 hover:opacity-100 hover:border-[var(--accent)]/60",
                )}
                aria-label={`캡처 ${i + 1}로 이동`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </ScrollReveal>

        <Dialog
          open={zoomedShot !== null}
          onOpenChange={(open) => !open && setZoomedShot(null)}
        >
          <DialogContent className="max-w-[95vw] md:max-w-[92vw] p-2 md:p-4 bg-[var(--bg)]">
            <DialogTitle className="sr-only">
              자동화 시나리오 캡처 {(zoomedShot ?? 0) + 1}
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

      {/* 81 시스템 폴더 트리 — 사용자 요청에 따라 숨김 처리 */}

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

        {/* 4 CORE 시나리오 — 강조 영역 */}
        <ScrollReveal delay={0.1} className="mb-16 md:mb-20">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-meta tracking-[0.2em] text-[var(--accent)]">
              ◆ 4 CORE SCENARIOS · 가장 핵심 자동화
            </p>
            <span className="text-meta opacity-50">제일 위 · 메인</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--accent)]/40 border-2 border-[var(--accent)]">
            {MAKE_CORE_FOUR.map((c, i) => (
              <ScrollReveal
                key={c.title}
                delay={i * 0.06}
                className="bg-[color-mix(in_oklab,var(--accent)_8%,var(--bg))] p-7 md:p-8 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg))]"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-meta tracking-[0.15em] text-[var(--accent)] tabular-nums">
                    CORE · {c.number}
                  </span>
                  <span className="text-meta tracking-[0.15em] text-[var(--accent)]">
                    ★ FLAGSHIP
                  </span>
                </div>
                <h3 className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.015em] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {c.title}
                </h3>
                <div className="mt-5 flex items-baseline gap-3 text-meta opacity-70">
                  <span>모듈</span>
                  <span className="font-mono opacity-90">{c.modules}개</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.slice(0, 7).map((s) => (
                    <span
                      key={s}
                      className="text-meta border border-[var(--accent)]/40 px-2 py-0.5 opacity-80 group-hover:opacity-100 group-hover:border-[var(--accent)] transition-all duration-300"
                    >
                      {s}
                    </span>
                  ))}
                  {c.services.length > 7 && (
                    <span className="text-meta opacity-60">
                      +{c.services.length - 7}
                    </span>
                  )}
                </div>
                <p className="mt-5 text-meta opacity-80 leading-[1.6]">
                  {c.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <div className="flex items-baseline justify-between mb-6">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            그 외 자동화 시스템 인벤토리
          </p>
          <span className="text-meta opacity-40">{MAKE_SYSTEMS.length} INVENTORY</span>
        </div>

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

          {/* 빈 칸 자리에 자연스럽게 들어가는 "더 많은 시나리오 보유" 카드 */}
          <ScrollReveal
            delay={0.1}
            className="bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_10%,var(--bg))] flex flex-col justify-center border-l-2 border-dashed border-[var(--accent)]/40"
          >
            <span className="text-display-md font-display opacity-40 tracking-[0.05em] tabular-nums leading-none mb-4">
              ...
            </span>
            <p className="text-body opacity-80 leading-[1.55]">
              위 시스템 외에도 다수의 자동화 시나리오를 추가 보유 중 —{" "}
              <span className="text-[var(--accent)] font-medium">
                81 시스템
              </span>{" "}
              · 19 폴더 · 4 핵심 메인 + 인벤토리.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
