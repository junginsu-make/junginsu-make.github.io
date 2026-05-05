"use client";
import { useEffect, useState } from "react";
import { PinSection } from "@/components/motion/pin-section";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MaskRevealStagger } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

type LeftBg = {
  src: string;
  alt: string;
  ext: "jpg" | "JPG";
  isPdf?: boolean;
};

const LEFT_BG_CYCLE: LeftBg[] = [
  {
    src: "/marketing-portfolio/page-01",
    alt: "TMON ROAS 7404% 차트 (개인 포토폴리오 2023.03.02)",
    ext: "jpg",
    isPdf: true,
  },
  {
    src: "/photos/teaching/20201112_183042",
    alt: "마케팅 강의 현장 — 영화적 구도",
    ext: "jpg",
  },
  {
    src: "/photos/teaching/DSC01363",
    alt: "호텔 연회장 60명+ 심층 마케팅 세미나",
    ext: "JPG",
  },
];

export function Duality() {
  const [leftIdx, setLeftIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // 자동 cycle 5초 — hover 시 일시 정지
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setLeftIdx((i) => (i + 1) % LEFT_BG_CYCLE.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <PinSection>
      <div className="h-screen px-6 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 relative overflow-hidden border border-[var(--line)]">
        {/* 좌: 마케터 — TMON ROAS 차트 + 강의 사진 cycle */}
        <div
          className="relative bg-[var(--color-paper)] dark:bg-[#1a1a1a]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {LEFT_BG_CYCLE.map((bg, i) => (
            <picture key={bg.src}>
              <source srcSet={`${bg.src}.avif`} type="image/avif" />
              <source srcSet={`${bg.src}.webp`} type="image/webp" />
              <img
                src={`${bg.src}.${bg.ext}`}
                alt={bg.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-out ${
                  i === leftIdx ? "opacity-100" : "opacity-0"
                } ${
                  bg.isPdf
                    ? "object-contain bg-white p-4 md:p-8"
                    : "object-cover"
                }`}
                style={
                  i === leftIdx && !bg.isPdf
                    ? { animation: "ken-burns-slow 8s ease-out forwards" }
                    : undefined
                }
              />
            </picture>
          ))}
          {/* 텍스트 영역 그라디언트 오버레이 (가독성 보호) */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/55 to-transparent pointer-events-none" />
          {/* 오버레이 — 카피 (mix-blend-difference 제거, 그라디언트로 가독 확보) */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 text-white">
            <ScrollReveal delay={0.2}>
              <p className="text-meta opacity-80">A 면</p>
            </ScrollReveal>
            <h3 className="text-display-md font-display mt-2 drop-shadow-lg">
              <MaskRevealStagger text="마케터" startDelay={0.4} />
            </h3>
            <div className="text-body-lg mt-4 drop-shadow-md">
              <ScrollReveal delay={0.6}>
                <p className="lg:whitespace-nowrap">
                  TMON ROAS{" "}
                  <WordHighlight delay={1.2}>7404%</WordHighlight> · 광고운영 79억 + 마케팅 강의(<WordHighlight delay={1.4}>31</WordHighlight>)
                </p>
              </ScrollReveal>
            </div>
          </div>
          {/* 우하단 cycle 인디케이터 + 수동 prev/next 버튼 */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 mix-blend-difference text-[var(--color-ink)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLeftIdx(
                  (i) => (i - 1 + LEFT_BG_CYCLE.length) % LEFT_BG_CYCLE.length,
                );
              }}
              className="w-9 h-9 rounded-full border border-current/40 hover:bg-current/10 transition-colors flex items-center justify-center text-base leading-none"
              aria-label="이전 이미지"
            >
              ‹
            </button>
            <span className="text-meta opacity-60 tabular-nums">
              {leftIdx + 1} / {LEFT_BG_CYCLE.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLeftIdx((i) => (i + 1) % LEFT_BG_CYCLE.length);
              }}
              className="w-9 h-9 rounded-full border border-current/40 hover:bg-current/10 transition-colors flex items-center justify-center text-base leading-none"
              aria-label="다음 이미지"
            >
              ›
            </button>
          </div>
        </div>
        {/* 우: AI 빌더 */}
        <div className="relative bg-[var(--color-ink-dark)] text-[var(--color-paper-dark)]">
          <picture>
            <source srcSet="/ai-builder/saas-mosaic.avif" type="image/avif" />
            <source srcSet="/ai-builder/saas-mosaic.webp" type="image/webp" />
            <img
              src="/ai-builder/saas-mosaic.jpg"
              alt="SaaS 6 Live 모자이크 — Lumio · OS Agent · Propintel · Tickpoint · Architect · MKT-Auto"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
            />
          </picture>
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
            <ScrollReveal delay={0.2}>
              <p className="text-meta opacity-60">B 면</p>
            </ScrollReveal>
            <h3 className="text-display-md font-display mt-2">
              <MaskRevealStagger text="AI 빌더" startDelay={0.4} />
            </h3>
            <ScrollReveal delay={0.6}>
              <p className="text-body-lg mt-4 lg:whitespace-nowrap">
                Vibe Coding <WordHighlight delay={1.0}>43</WordHighlight> · {" "}
                SaaS <WordHighlight delay={1.3}>6</WordHighlight> Live ·
                자동화 시나리오 <WordHighlight delay={1.6}>81</WordHighlight>
              </p>
            </ScrollReveal>
          </div>
        </div>
        {/* 중앙 캡슐 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--color-orange)] text-white px-10 py-6 md:px-14 md:py-8 rounded-full shadow-2xl">
            <p className="text-display-md font-display lg:whitespace-nowrap">
              <MaskRevealStagger
                text="한 사람, 두 면"
                startDelay={1.2}
                duration={0.8}
                letterDelay={0.05}
              />
            </p>
          </div>
        </div>
        </div>
      </div>
    </PinSection>
  );
}
