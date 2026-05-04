"use client";
import { useEffect, useState } from "react";
import { PinSection } from "@/components/motion/pin-section";

type LeftBg = {
  src: string;
  alt: string;
  ext: "jpg" | "JPG";
  isPdf?: boolean;
};

const LEFT_BG_CYCLE: LeftBg[] = [
  {
    src: "/marketing-portfolio/page-01",
    alt: "TMON ROAS 7,404% 차트 (개인 포토폴리오 2023.03.02)",
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
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
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
                    : "object-cover opacity-60"
                }`}
                style={
                  i === leftIdx && !bg.isPdf
                    ? { animation: "ken-burns-slow 8s ease-out forwards" }
                    : undefined
                }
              />
            </picture>
          ))}
          {/* 오버레이 — 카피 */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 text-[var(--color-ink)] mix-blend-difference">
            <p className="text-meta opacity-60">A 면</p>
            <h3 className="text-display-md font-display mt-2">마케터</h3>
            <div className="text-body-lg mt-4 max-w-md space-y-1">
              <p>
                TMON ROAS{" "}
                <span className="text-[var(--color-orange)] font-medium">
                  7,404%
                </span>{" "}
                · 광고운영 79억+
              </p>
              <p>티몬 광고대행 연 40~60억 · 31 강의처</p>
            </div>
            <p className="text-meta opacity-50 mt-6">
              sbcyberpass@naver.com · junginsuai@gmail.com
            </p>
          </div>
          {/* 우하단 cycle 인디케이터 + 수동 prev/next 버튼 */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 mix-blend-difference text-[var(--color-ink)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPaused(true);
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
                setPaused(true);
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
            <source srcSet="/ai-builder/os-agent-detail.avif" type="image/avif" />
            <source srcSet="/ai-builder/os-agent-detail.webp" type="image/webp" />
            <img
              src="/ai-builder/os-agent-detail.jpg"
              alt="OS Agent — HR Agent 워크플로우 시각화 (휴가 자동 시스템 데모 실행)"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
            />
          </picture>
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
            <p className="text-meta opacity-60">B 면</p>
            <h3 className="text-display-md font-display mt-2">AI 빌더</h3>
            <p className="text-body-lg mt-4 max-w-md">
              GitHub 43 · 6 라이브 SaaS · make.com 81 시스템 (4 핵심)
            </p>
            <p className="text-meta opacity-50 mt-6">9843ohs@gmail.com</p>
          </div>
        </div>
        {/* 중앙 캡슐 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--color-orange)] text-white px-10 py-6 md:px-14 md:py-8 rounded-full shadow-2xl">
            <p className="text-display-md font-display whitespace-nowrap">
              한 사람, 두 면
            </p>
          </div>
        </div>
      </div>
    </PinSection>
  );
}
