"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { CONTENT_REFS } from "@/lib/data/content-refs";

export function ContentHero() {
  const byCategory = CONTENT_REFS.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = [
    { to: CONTENT_REFS.length, label: "Recent Content", note: "최근 운영 사례" },
    { to: byCategory.instagram ?? 0, label: "Instagram", note: "카드뉴스 · 릴스" },
    { to: byCategory.youtube ?? 0, label: "YouTube", note: "Shorts" },
    { to: byCategory.blog ?? 0, label: "Naver Blog", note: "장문 SEO" },
  ];

  return (
    <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
      <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
        <MaskReveal>CONTENT · MULTI-CHANNEL</MaskReveal>
      </p>

      <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.03em]">
        <MaskRevealStagger text="콘텐츠 운영" letterDelay={0.05} />
      </h1>

      <p className="mt-10 text-body-xl md:text-display-md font-display max-w-[860px] leading-[1.2]">
        <MaskReveal delay={0.6}>
          <span>
            기획 · 카피 · 이미지 · 숏폼 · SEO를{" "}
            <WordHighlight delay={1.0}>한 명이</WordHighlight> — AI 멀티
            파이프라인
          </span>
        </MaskReveal>
      </p>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {stats.map((s, i) => (
          <ScrollReveal
            key={s.label}
            delay={i * 0.1}
            className="border-t border-[var(--line)] pt-6"
          >
            <p className="text-display-xl md:text-display-mega font-display leading-none tracking-[-0.04em] glow-pulse">
              <Counter to={s.to} />
            </p>
            <p className="text-meta opacity-70 mt-5 tracking-[0.1em]">
              {s.label}
            </p>
            <p className="text-meta opacity-40 mt-2">{s.note}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
