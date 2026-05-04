"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import {
  GITHUB_CATEGORIES,
  GITHUB_TOTAL,
  GOLDEN_PRINCIPLES,
} from "@/lib/data/github";

export function GithubFull() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
        <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
          <MaskReveal>GITHUB · PUBLIC INVENTORY · 2026-05-04</MaskReveal>
        </p>

        <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.04em] tabular-nums">
          <MaskRevealStagger text={String(GITHUB_TOTAL)} letterDelay={0.05} />
        </h1>

        <p className="mt-10 text-body-xl md:text-display-md font-display max-w-[860px] leading-[1.2]">
          <MaskReveal delay={0.6}>
            <span>
              외부 공개 <WordHighlight delay={1.0}>43</WordHighlight> 레포 ·
              비공개 41 (클라이언트·실험)
            </span>
          </MaskReveal>
        </p>

        <ScrollReveal delay={0.6} className="mt-12 max-w-[680px]">
          <p className="text-meta opacity-60 leading-[1.7]">
            ※ 2026-05-04 기준 <span className="font-mono">api.github.com/users/junginsu-make</span>{" "}
            → public_repos 43 직접 조회. 모든 카운트는 합산 X — make.com 81 (4
            핵심) 와 별도 정체성.
          </p>
        </ScrollReveal>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {GITHUB_CATEGORIES.map((cat, i) => (
            <ScrollReveal
              key={cat.id}
              delay={i * 0.08}
              className="border-t border-[var(--line)] pt-6"
            >
              <p className="text-display-md font-display leading-none tabular-nums">
                <Counter to={cat.count} />
              </p>
              <p className="text-meta opacity-70 mt-4 tracking-[0.1em]">
                {cat.id}
              </p>
              <p className="text-meta opacity-40 mt-1 leading-[1.4]">
                {cat.name.split(" (")[0]}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5 카테고리 풀 */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>CATEGORIES · 05 GROUPS</MaskReveal>
          </p>
          <span className="text-meta opacity-40 tabular-nums">
            {GITHUB_TOTAL} REPOS
          </span>
        </div>

        <div className="space-y-16 md:space-y-24">
          {GITHUB_CATEGORIES.map((cat) => (
            <article
              key={cat.id}
              className="grid md:grid-cols-12 gap-8 border-t border-[var(--line)] pt-10 md:pt-14"
            >
              <div className="md:col-span-2">
                <p className="text-display-lg font-display opacity-15 leading-none">
                  {cat.id}
                </p>
              </div>
              <div className="md:col-span-7">
                <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-[-0.02em]">
                  <MaskReveal>{cat.name}</MaskReveal>
                </h2>

                <ScrollReveal delay={0.15} className="mt-8">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {cat.examples.map((ex) => (
                      <li
                        key={ex}
                        className="font-mono text-meta opacity-70 hover:opacity-100 transition-opacity duration-300"
                      >
                        ./{ex}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </div>
              <div className="md:col-span-3 md:text-right">
                <p className="text-display-xl font-display leading-none tabular-nums">
                  <Counter to={cat.count} />
                </p>
                <p className="text-meta opacity-50 mt-3">REPOS</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 12 GOLDEN PRINCIPLES — 코드 철학 */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p className="text-meta opacity-60 tracking-[0.2em]">
            <MaskReveal>GOLDEN PRINCIPLES · 12</MaskReveal>
          </p>
          <span className="text-meta opacity-40">개발 철학</span>
        </div>

        <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[820px]">
          <MaskReveal>
            <span>43 레포에 일관 적용된 12 코드 원칙</span>
          </MaskReveal>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {GOLDEN_PRINCIPLES.map((p, i) => (
            <ScrollReveal
              key={p}
              delay={Math.min(i * 0.04, 0.3)}
              className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
            >
              <p className="text-meta opacity-50 mb-4 tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </p>
              <p className="text-body-lg font-medium leading-[1.3] group-hover:text-[var(--accent)] transition-colors duration-300">
                {p}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
