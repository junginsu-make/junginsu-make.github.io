"use client";
import { KineticText } from "@/components/motion/kinetic-text";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-[var(--color-ink-dark)]">
      <picture>
        <source srcSet="/photos/profile-hero.avif" type="image/avif" />
        <source srcSet="/photos/profile-hero.webp" type="image/webp" />
        <img
          src="/photos/profile-hero.png"
          alt="정인수"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      {/* 하단 그라데이션 — 카피 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-dark)]/85 via-[var(--color-ink-dark)]/20 to-transparent" />
      <div className="absolute bottom-10 left-6 md:left-10 lg:left-16 max-w-3xl text-[var(--color-paper-dark)] mix-blend-difference">
        <p className="text-meta opacity-70 mb-4">ABOUT — 정인수</p>
        <h1 className="text-display-xl font-display leading-[0.95]">
          <KineticText>한 사람을 정확히 보는 가장 빠른 방법</KineticText>
        </h1>
        <p className="text-body-lg mt-6 opacity-90 max-w-xl">
          1983년생 · 서울 강북구 거주 · 영동대 사회복지학과 졸업 · 군필 · 17년
          4개월 경력
        </p>
      </div>
    </section>
  );
}
