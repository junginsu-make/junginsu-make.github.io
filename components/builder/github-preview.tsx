"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SweepLink } from "@/components/motion/color-sweep";
import { GITHUB_CATEGORIES, GITHUB_TOTAL } from "@/lib/data/github";

export function GithubPreview() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          GITHUB · PUBLIC INVENTORY
        </p>
        <span className="text-meta opacity-40">2026-05-04</span>
      </div>

      <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
        <div className="md:col-span-5">
          <p className="text-display-mega font-display leading-none tracking-[-0.04em]">
            <Counter to={GITHUB_TOTAL} />
          </p>
          <p className="text-meta opacity-60 mt-4">
            REPOS · 외부 공개 (private 41 별도)
          </p>
        </div>

        <div className="md:col-span-7">
          <h2 className="text-display-md font-display leading-[1.05] max-w-[560px]">
            <MaskReveal>
              <span>5 카테고리로 정리한 대표 시스템과 학습 스택</span>
            </MaskReveal>
          </h2>
        </div>
      </div>

      <div className="mt-16 md:mt-20 grid md:grid-cols-5 gap-px bg-[var(--line)] border border-[var(--line)]">
        {GITHUB_CATEGORIES.map((cat, i) => (
          <ScrollReveal
            key={cat.id}
            delay={i * 0.06}
            className="bg-[var(--bg)] p-6 md:p-7 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="text-display-md font-display leading-none opacity-30 group-hover:text-[var(--accent)] group-hover:opacity-100 transition-[color,opacity] duration-500">
                {cat.id}
              </span>
              <span className="text-display-md font-display leading-none tabular-nums">
                {cat.count}
              </span>
            </div>

            <p className="text-meta opacity-70 leading-[1.55]">{cat.name}</p>

            <ul className="mt-5 space-y-1 text-meta opacity-45 group-hover:opacity-70 transition-opacity duration-500">
              {cat.examples.slice(0, 3).map((ex) => (
                <li key={ex} className="truncate font-mono">
                  {ex}
                </li>
              ))}
              {cat.examples.length > 3 && (
                <li className="opacity-50">
                  +{cat.examples.length - 3} more
                </li>
              )}
            </ul>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4} className="mt-16">
        <SweepLink
          href="/builder/github"
          className="inline-flex items-center gap-3 text-body-lg border-b border-[var(--fg)] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-300"
        >
          <span>43 레포 카테고리·메타·노트 전체 보기</span>
          <span aria-hidden>→</span>
        </SweepLink>
      </ScrollReveal>
    </section>
  );
}
