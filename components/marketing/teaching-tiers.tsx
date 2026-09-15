"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TIER1, TIER2, TIER3 } from "@/lib/data/teaching";

export function TeachingTiers({ photos }: { photos: string[] }) {
  return (
    <>
      {/* TIER 1 — 정부 · 공공 · 대학 · AI 교육 6 (메인) */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>TIER 01 · 정부 · 대학 · AI 교육</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={TIER1.length} /> ENTRIES
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 md:mb-16 max-w-[820px]">
          <MaskReveal>
            <span>정부 부처 · 공공기관 · 대학 · 창업지원센터의 AI · 마케팅 강의</span>
          </MaskReveal>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {TIER1.map((c, i) => {
            const photo = photos[i] ?? photos[i % Math.max(1, photos.length)];
            return (
              <ScrollReveal
                key={c.name}
                delay={i * 0.08}
                className="bg-[var(--bg)] group"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--line)]">
                  {photo ? (
                    <picture>
                      <source srcSet={photo.replace(/\.(jpe?g|png|webp)$/i, ".avif")} type="image/avif" />
                      <source srcSet={photo.replace(/\.(jpe?g|png)$/i, ".webp")} type="image/webp" />
                      <img
                        src={photo}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-[1.04]"
                      />
                    </picture>
                  ) : (
                    <div className="h-full w-full grid place-items-center text-meta opacity-30">
                      NO PHOTO
                    </div>
                  )}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 text-meta tracking-[0.2em] text-[#F4F0E6] backdrop-blur-sm bg-black/30 border border-white/10"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {c.category.toUpperCase()}
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <p className="text-meta opacity-50 mb-3 tabular-nums">
                    {(i + 1).toString().padStart(2, "0")}
                  </p>
                  <h3 className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-500">
                    {c.name}
                  </h3>
                  {c.desc && (
                    <p className="mt-4 text-meta opacity-70 leading-[1.5]">
                      {c.desc}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* TIER 2 — 협회 · 기업 8 */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>TIER 02 · 협회 · 기업</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={TIER2.length} /> ENTRIES
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>학원협회 · 소상공인 연합회 · 전문가 모임 · 미술관까지</span>
          </MaskReveal>
        </h2>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
            {TIER2.map((c, i) => (
              <ScrollReveal
                key={c.name}
                delay={i * 0.05}
                className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
              >
                <p className="text-meta opacity-50 mb-3 tabular-nums">
                  {(i + 1).toString().padStart(2, "0")}
                </p>
                <p className="text-body-lg md:text-display-md font-display leading-[1.15] tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {c.name}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* TIER 3 — 개인 텍스트 15 */}
      <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>TIER 03 · 개인 · 1인샵 · 자영업자</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            <Counter to={TIER3.length} /> ENTRIES
          </span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>15명의 1:1 마케팅 멘토링 — 직군 · 규모 불문</span>
          </MaskReveal>
        </h2>

        <div className="border-t border-[var(--line)]">
          {TIER3.map((name, i) => (
            <ScrollReveal
              key={name}
              delay={Math.min(i * 0.03, 0.3)}
              className="grid grid-cols-12 gap-x-4 py-5 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-300 group"
            >
              <span className="col-span-2 md:col-span-1 text-meta opacity-50 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="col-span-10 md:col-span-11 text-body-lg group-hover:text-[var(--accent)] transition-colors duration-300">
                {name}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
