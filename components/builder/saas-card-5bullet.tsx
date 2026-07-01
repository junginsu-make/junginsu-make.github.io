"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";
import type { SaaSDetail } from "@/lib/data/saas";

export function SaasCard({ saas, order }: { saas: SaaSDetail; order: number }) {
  const router = useRouter();
  function handleCardClick() {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof document !== "undefined" && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => router.push(`/builder/${saas.slug}`));
    } else {
      router.push(`/builder/${saas.slug}`);
    }
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group relative block border-b border-[var(--line)] py-10 md:py-14 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      aria-label={`${saas.name} 자세히 보기`}
    >
      <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
        {/* order */}
        <div className="col-span-12 md:col-span-1">
          <span className="text-meta opacity-40 tabular-nums">
            {order.toString().padStart(2, "0")}
          </span>
        </div>

        {/* name + tagline + capabilities — 가로 영역 더 넓힘 */}
        <div className="col-span-12 md:col-span-8 lg:col-span-8 min-w-0">
          <div className="flex items-baseline flex-wrap gap-x-4">
            <h3
              className={cn(
                "font-display text-display-md md:text-display-lg leading-[0.95]",
                "transition-[transform,letter-spacing] duration-500",
                "group-hover:tracking-[-0.025em] group-hover:translate-x-2",
                "group-hover:text-[var(--accent)]",
              )}
            >
              {saas.name}
            </h3>
            {/* 클릭 안내 — 이름 옆에 항상 표시 */}
            <span className="text-meta opacity-40 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-300">
              ↗ 자세히 보기
            </span>
            {/* 바로가기 — 외부 라이브 URL, 카드 클릭과 분리 */}
            <a
              href={saas.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[var(--accent)] text-[var(--bg)] text-[12px] tracking-[0.1em] uppercase font-mono font-semibold shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_30%,transparent)] hover:shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent)_25%,transparent)] hover:-translate-y-0.5 transition-all duration-300"
              aria-label={`${saas.name} 라이브 사이트 새 탭으로 열기`}
            >
              바로가기 ↗
            </a>
          </div>

          <p className="mt-5 text-body opacity-80 leading-[1.6] max-w-none lg:max-w-[760px]">
            {saas.tagline}
          </p>

          {/* 5 bullets — group-hover로 reveal */}
          <motion.ul
            initial={false}
            className={cn(
              "grid gap-y-2 overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-[cubic-bezier(0.6,0.05,0.3,0.95)]",
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
                  · {(i + 1).toString().padStart(2, "0")}
                </span>
                <span>{c.title}</span>
              </li>
            ))}
          </motion.ul>

          {/* 메타: tone · since · 능력 카운트 */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta opacity-50">
            <span>{saas.tone === "dark" ? "DARK TONE" : "LIGHT TONE"}</span>
            {saas.since && <span>SINCE {saas.since}</span>}
            <span>{saas.capabilities.length} 핵심 능력</span>
            <span>{saas.metrics.length} KPI</span>
            <span className="text-[var(--accent)] opacity-100 ml-auto">
              호버 시 능력 펼침 · 클릭 시 디테일
            </span>
          </div>
        </div>

        {/* captured image */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3 aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] relative">
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
                "h-full w-full object-contain",
                "transition-[transform,filter] duration-700 ease-[cubic-bezier(0.6,0.05,0.3,0.95)]",
                "grayscale-[40%] scale-100",
                "group-hover:grayscale-0 group-hover:scale-[1.04]",
              )}
            />
          </picture>
          {/* 호버 오버레이 — 디테일 안내 */}
          <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/15 transition-colors duration-500 pointer-events-none flex items-end justify-end p-3">
            <span
              className="text-meta px-2.5 py-1 backdrop-blur-sm bg-black/40 border border-white/10 text-[#F4F0E6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              VIEW DETAIL →
            </span>
          </div>
          {/* 코너 브래킷 — 호버 시 등장 (AI Builder 시스템·청사진 시그니처) */}
          <span aria-hidden className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--accent)] opacity-0 -translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
          <span aria-hidden className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--accent)] opacity-0 translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
          <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--accent)] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
          <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--accent)] opacity-0 translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ease-out" />
        </div>
      </div>
    </div>
  );
}

export function SaasIndex({ list }: { list: SaaSDetail[] }) {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="flex items-baseline justify-between mb-8">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>{`${list.length} LIVE SAAS · INDEX`}</MaskReveal>
        </p>
        <span className="text-meta opacity-40">PRODUCTION</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-6 lg:whitespace-nowrap">
        <MaskReveal>
          <span>각 카드를 클릭하면 풀스펙 디테일 페이지로 이동합니다</span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 leading-[1.6] mb-12 md:mb-16 lg:whitespace-nowrap">
          호버하면 5 핵심 능력이 펼쳐지고, 카드를 클릭하면 풀블리드 라이브 캡처
          + 5+ 능력 디테일 + 메트릭 + 갤러리까지 디테일 페이지로 이동합니다.
        </p>
      </ScrollReveal>

      <div className="border-t border-[var(--line)]">
        {list.map((s, i) => (
          <SaasCard key={s.slug} saas={s} order={i + 1} />
        ))}
      </div>
    </section>
  );
}
