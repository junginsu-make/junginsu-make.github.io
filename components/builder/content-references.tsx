"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "@/components/mockups/phone-mockup";
import { MonitorMockup } from "@/components/mockups/monitor-mockup";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  BUILDER_CONTENT_REFS,
  type BuilderContentRef,
} from "@/lib/data/content-refs";
import { cn } from "@/lib/utils";

/** SNS 카드뉴스 캐러셀 — PhoneMockup 안 좌우 화살표 + 자동 롤링 */
function SnsCarouselCard({
  ref,
}: {
  ref: Extract<BuilderContentRef, { type: "sns" }>;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = ref.slides;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 2400);
    return () => clearInterval(t);
  }, [paused, total]);

  const goPrev = () => setIdx((i) => (i - 1 + total) % total);
  const goNext = () => setIdx((i) => (i + 1) % total);

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full max-w-[300px] md:max-w-[340px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <PhoneMockup>
          {/* 검정 배경 — 4:5 카드 letterbox 자연스럽게 */}
          <div className="absolute inset-0 bg-black" />
          <AnimatePresence mode="sync">
            <motion.img
              key={idx}
              src={`/content-refs/sns/${ref.slug}/${idx + 1}.${ref.ext}`}
              alt={`${ref.title} 슬라이드 ${idx + 1}`}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </AnimatePresence>

          {/* 진행 인디케이터 — 상단 도트 bar */}
          <div className="absolute top-9 md:top-10 left-4 right-4 flex gap-1 z-20 pointer-events-none">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-0.5 bg-white/35 overflow-hidden rounded-full"
              >
                {i === idx && (
                  <motion.div
                    key={`bar-${idx}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0 : 1 }}
                    transition={{ duration: paused ? 0 : 2.4, ease: "linear" }}
                    className="h-full bg-white origin-left"
                  />
                )}
                {i < idx && <div className="h-full bg-white/65" />}
              </div>
            ))}
          </div>

          {/* 좌측 화살표 — 마케팅 강의 사진 carousel과 동일 패턴/사이즈 */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 슬라이드"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="12,4 6,10 12,16" />
            </svg>
          </button>
          {/* 우측 화살표 */}
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 슬라이드"
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/85 backdrop-blur-sm text-[var(--fg)] border border-[var(--line)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg z-20"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,4 14,10 8,16" />
            </svg>
          </button>

          {/* 인덱스 라벨 */}
          <div
            className="absolute bottom-5 left-4 px-2 py-0.5 text-[10px] tracking-[0.15em] text-white backdrop-blur-sm bg-black/40 z-20 font-mono"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
          >
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </PhoneMockup>
      </div>
      <div className="mt-5 text-center">
        <p className="text-meta opacity-50 mb-2">SNS · CARD SERIES</p>
        <h3 className="text-body-lg font-display tracking-[-0.01em]">
          {ref.title}
        </h3>
        <p className="text-meta opacity-60 mt-2">{ref.caption}</p>
      </div>
    </div>
  );
}

/** 블로그 데스크탑 캡처 — MonitorMockup */
function BlogCaptureCard({
  ref,
}: {
  ref: Extract<BuilderContentRef, { type: "blog-google" | "blog-naver" }>;
}) {
  const isNaver = ref.type === "blog-naver";
  const url = isNaver
    ? (ref as Extract<BuilderContentRef, { type: "blog-naver" }>).url
    : undefined;
  const urlLabel = isNaver
    ? "blog.naver.com/wjddlstn486"
    : "Google Blog · SEO Draft";
  return (
    <div className="flex flex-col">
      <MonitorMockup url={urlLabel}>
        <img
          src={ref.capture}
          alt={`${ref.title} 캡처`}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </MonitorMockup>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-meta opacity-50 mb-2">
            {isNaver ? "NAVER · BLOG" : "GOOGLE · BLOG"}
          </p>
          <h3 className="text-body-lg font-display tracking-[-0.01em] truncate">
            {ref.title}
          </h3>
          <p className="text-meta opacity-60 mt-2">{ref.caption}</p>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[var(--line)] text-meta hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            바로가기 ↗
          </a>
        )}
      </div>
    </div>
  );
}

/** YouTube Shorts — PhoneMockup + 가운데 재생 버튼 → 클릭 시 iframe embed */
function ShortsVideoCard({
  ref,
}: {
  ref: Extract<BuilderContentRef, { type: "shorts" }>;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${ref.videoId}/maxresdefault.jpg`;
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[300px] md:max-w-[340px]">
        <PhoneMockup>
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${ref.videoId}?autoplay=1&rel=0&playsinline=1`}
              title={ref.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full"
              aria-label={`${ref.title} 재생`}
            >
              <img
                src={thumb}
                alt={ref.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // maxresdefault 없으면 hqdefault fallback
                  const img = e.currentTarget;
                  if (!img.src.includes("hqdefault")) {
                    img.src = `https://img.youtube.com/vi/${ref.videoId}/hqdefault.jpg`;
                  }
                }}
              />
              {/* 어둡게 + 재생 버튼 */}
              <span
                aria-hidden
                className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"
              />
              <span
                aria-hidden
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-full bg-[var(--accent)] text-white shadow-[0_0_0_8px_rgba(255,107,2,0.25)] group-hover:scale-110 transition-transform duration-300"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </PhoneMockup>
      </div>
      <div className="mt-5 text-center">
        <p className="text-meta opacity-50 mb-2">YOUTUBE · SHORTS</p>
        <h3 className="text-body-lg font-display tracking-[-0.01em]">
          {ref.title}
        </h3>
        <p className="text-meta opacity-60 mt-2">{ref.caption}</p>
      </div>
    </div>
  );
}

export function ContentReferences() {
  const sns = BUILDER_CONTENT_REFS.filter((r) => r.type === "sns") as Extract<
    BuilderContentRef,
    { type: "sns" }
  >[];
  const blogs = BUILDER_CONTENT_REFS.filter((r) =>
    r.type === "blog-google" || r.type === "blog-naver",
  ) as Extract<BuilderContentRef, { type: "blog-google" | "blog-naver" }>[];
  const shorts = BUILDER_CONTENT_REFS.filter((r) => r.type === "shorts") as Extract<
    BuilderContentRef,
    { type: "shorts" }
  >[];

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-10 md:mb-14">
        <p className="text-meta tracking-[0.2em] text-[var(--accent)]">
          <MaskReveal>100% AUTOMATED · CONTENT REFERENCE</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {BUILDER_CONTENT_REFS.length} 작품
        </span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-8 lg:whitespace-nowrap">
        <MaskReveal>
          <span>
            자동화 시스템이 만든 <WordHighlight delay={0.5}>실제 콘텐츠</WordHighlight>
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 leading-[1.6] mb-16 md:mb-20 lg:whitespace-nowrap">
          100% 자동화로 생성 · 발행된 SNS 카드뉴스 · 블로그 · 숏폼 — 사이트
          안에서 직접 넘기고 재생.
        </p>
      </ScrollReveal>

      {/* 행 1: SNS 카드 시리즈 3개 (PhoneMockup) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16 mb-20 md:mb-28">
        {sns.map((s, i) => (
          <ScrollReveal key={s.slug} delay={i * 0.08}>
            <SnsCarouselCard ref={s} />
          </ScrollReveal>
        ))}
      </div>

      {/* 행 2: 블로그 2개 (MonitorMockup) — 같은 줄에 2 cols, 양쪽 여백은 섹션 px와 동일 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 mb-20 md:mb-28">
        {blogs.map((b, i) => (
          <ScrollReveal key={b.slug} delay={i * 0.1}>
            <BlogCaptureCard ref={b} />
          </ScrollReveal>
        ))}
      </div>

      {/* 행 3: YouTube Shorts (PhoneMockup × 3, 같은 줄 + 기존 중앙) */}
      {shorts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">
          {shorts.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.08}>
              <ShortsVideoCard ref={s} />
            </ScrollReveal>
          ))}
        </div>
      )}

      <ScrollReveal delay={0.3} className="mt-16 md:mt-20">
        <p className="text-meta opacity-50 leading-[1.7] lg:whitespace-nowrap">
          ※ 모든 콘텐츠는 자체 자동화 시스템으로 기획 · 생성 · 발행. 위 6 작품은
          시스템 결과물의 일부 — 이 시스템은{" "}
          <span className="text-[var(--accent)]">18+ 기업</span>에 실제 운영 중
          (인큐베이터 입주기업 포함, 자세한 클라이언트 리스트는{" "}
          <span className="text-[var(--accent)]">/marketing</span> 페이지 AI
          Content Operation).
        </p>
      </ScrollReveal>
    </section>
  );
}
