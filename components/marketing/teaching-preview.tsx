"use client";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SweepLink } from "@/components/motion/color-sweep";
import { WordHighlight } from "@/components/motion/word-highlight";
import { TIER1, TIER2, TIER3 } from "@/lib/data/teaching";

type Props = {
  heroPhoto?: string;
};

/**
 * 마케팅 페이지의 강의 요약 섹션.
 * /marketing/teaching 별도 페이지에 풀 정보 있지만, 강의는 마케팅 신뢰의 핵심
 * 자료이므로 마케팅 페이지에서도 요약 노출.
 *
 * 차별화: 다른 섹션의 grid·card 패턴 X. 좌(이미지·메트릭) + 우(스플릿 카운터·태그).
 */
export function TeachingPreview({ heroPhoto }: Props) {
  const totalCount = TIER1.length + TIER2.length + TIER3.length;
  const featured = TIER1.slice(0, 6).map((t) => t.name);

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TEACHING · 마케팅 신뢰의 자료</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          7년 6개월 · {totalCount} 강의처
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] max-w-none lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            마케팅을{" "}
            <WordHighlight delay={0.5}>가르치는 사람</WordHighlight>이 직접
            운영도 한다
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-body-lg opacity-75 max-w-[920px] leading-[1.6] mb-16">
          정부 부처·대학·창업지원센터·협회·기업·자영업자·1인샵까지 — 모든
          현장에서 직접 강의한 7년 6개월. 이 자체가 17년 마케팅 운영 경력을
          외부에서 검증한 자료.
        </p>
      </ScrollReveal>

      {/* 좌(이미지) + 우(스플릿 카운터) 비대칭 레이아웃 — 다른 섹션 grid card 패턴과 차별화 */}
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* LEFT — 강의 사진 (대형) */}
        <ScrollReveal className="md:col-span-7">
          <div className="relative aspect-[16/10] overflow-hidden border border-[var(--line)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]">
            {heroPhoto ? (
              <picture>
                <source
                  srcSet={heroPhoto.replace(/\.(jpe?g|png|webp)$/i, ".avif")}
                  type="image/avif"
                />
                <source
                  srcSet={heroPhoto.replace(/\.(jpe?g|png)$/i, ".webp")}
                  type="image/webp"
                />
                <img
                  src={heroPhoto}
                  alt="강의 현장"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover ken-burns-slow"
                />
              </picture>
            ) : (
              <div className="h-full w-full grid place-items-center text-meta opacity-30">
                LOADING
              </div>
            )}

            {/* 그라디언트 가독성 */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            <div
              className="absolute bottom-5 left-5 right-5 text-[#F4F0E6]"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              <p className="text-meta opacity-80 tracking-[0.2em] mb-3">
                LIVE TEACHING · 56장 자동 캐러셀
              </p>
              <p className="text-display-md font-display leading-[1.1] tracking-[-0.02em]">
                정부 부처·대학·창업지원센터까지
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT — 스플릿 카운터 + 태그 */}
        <div className="md:col-span-5 space-y-10">
          {/* 7년 6개월 큰 카운터 */}
          <ScrollReveal delay={0.15}>
            <p className="text-display-xl md:text-display-mega font-display leading-none tracking-[-0.04em] tabular-nums">
              <Counter to={7} suffix=".5" />
              <span className="text-display-md">년</span>
            </p>
            <p className="text-meta opacity-70 mt-4 tracking-[0.15em]">
              병행 강의 누적
            </p>
          </ScrollReveal>

          {/* 3 Tier 카운터 */}
          <ScrollReveal delay={0.25}>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-8">
              <div>
                <p className="text-display-md font-display leading-none tabular-nums text-[var(--accent)]">
                  <Counter to={TIER1.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 01
                  <br />
                  <span className="opacity-60">정부·대학·AI</span>
                </p>
              </div>
              <div>
                <p className="text-display-md font-display leading-none tabular-nums">
                  <Counter to={TIER2.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 02
                  <br />
                  <span className="opacity-60">협회·기업</span>
                </p>
              </div>
              <div>
                <p className="text-display-md font-display leading-none tabular-nums">
                  <Counter to={TIER3.length} />
                </p>
                <p className="text-meta opacity-70 mt-3 leading-[1.4]">
                  TIER 03
                  <br />
                  <span className="opacity-60">개인·1인샵</span>
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 대표 강의처 6 */}
          <ScrollReveal delay={0.35}>
            <div className="border-t border-[var(--line)] pt-8">
              <p className="text-meta opacity-60 mb-5 tracking-[0.2em]">
                FEATURED · TIER 01
              </p>
              <ul className="space-y-2.5">
                {featured.map((name, i) => (
                  <motion.li
                    key={name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.06,
                      ease: [0.6, 0.05, 0.3, 0.95],
                    }}
                    className="flex items-baseline gap-3 text-body opacity-85"
                  >
                    <span className="text-meta opacity-40 tabular-nums shrink-0 w-6">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* CTA → /marketing/teaching */}
          <ScrollReveal delay={0.5}>
            <SweepLink
              href="/marketing/teaching"
              className="group inline-flex items-baseline gap-3 text-body-lg border-b border-[var(--fg)] pb-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              <span>56장 강의 사진 + Tier 02·03 풀 리스트</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </SweepLink>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
