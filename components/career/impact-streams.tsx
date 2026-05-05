"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { IMPACT_STREAMS } from "@/lib/data/career";

export function ImpactStreams() {
  return (
    <section className="px-6 md:px-10 lg:px-16 pt-40 pb-24 md:pb-32 border-b border-[var(--line)]">
      <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
        <MaskReveal>CAREER · IMPACT STREAMS</MaskReveal>
      </p>

      <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.03em]">
        <MaskRevealStagger text="17년 4개월" letterDelay={0.05} />
      </h1>

      <p className="mt-10 text-body-xl md:text-display-md font-display max-w-[820px] leading-[1.2]">
        <MaskReveal delay={0.6}>
          <span>
            17 회사보다{" "}
            <WordHighlight delay={1.0}>6 임팩트 스트림</WordHighlight>으로 본
            경력
          </span>
        </MaskReveal>
      </p>

      <div className="mt-16 text-body opacity-70 leading-[1.7] lg:whitespace-nowrap">
        <MaskReveal delay={0.85}>
          <span>
            영업 · 마케팅 · 강사 17년. AI 시대를 만나 풀사이클 빌더로 다시 태어났다.
            아래 6 스트림은 회사 단위가 아니라 임팩트 단위로 묶은 경력.
          </span>
        </MaskReveal>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        <ScrollReveal className="border-t border-[var(--line)] pt-6">
          <p className="text-display-xl font-display leading-none glow-pulse">
            <Counter to={6} />
          </p>
          <p className="text-meta opacity-70 mt-4">임팩트 스트림</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="border-t border-[var(--line)] pt-6">
          <p className="text-display-xl font-display leading-none glow-pulse">
            <Counter to={17} />
          </p>
          <p className="text-meta opacity-70 mt-4">회사 · 기관</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2} className="border-t border-[var(--line)] pt-6">
          <p className="text-display-xl font-display leading-none glow-pulse">
            <Counter to={9} />
          </p>
          <p className="text-meta opacity-70 mt-4">자격증</p>
        </ScrollReveal>
        <ScrollReveal delay={0.3} className="border-t border-[var(--line)] pt-6">
          <p className="text-display-xl font-display leading-none glow-pulse">
            <Counter to={7} suffix=".5년" />
          </p>
          <p className="text-meta opacity-70 mt-4">강사 (병행)</p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ImpactStreamsList() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>STREAMS · 06</MaskReveal>
        </p>
        <span className="text-meta opacity-40">회사 X · 임팩트 O</span>
      </div>

      <div className="space-y-20 md:space-y-28">
        {IMPACT_STREAMS.map((s) => (
          <article
            key={s.id}
            className="grid md:grid-cols-12 gap-8 md:gap-12 border-t border-[var(--line)] pt-10 md:pt-14"
          >
            <div className="md:col-span-2">
              <p className="text-display-lg font-display opacity-15 leading-none tabular-nums">
                {s.number}
              </p>
            </div>

            <div className="md:col-span-10">
              <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em]">
                <MaskReveal>{s.title}</MaskReveal>
              </h2>

              <ul className="mt-10 space-y-5">
                {s.bullets.map((b, j) => (
                  <ScrollReveal key={j} delay={j * 0.06}>
                    <li className="flex gap-4 md:gap-6 items-baseline text-body md:text-body-lg leading-[1.6]">
                      <span className="text-meta opacity-40 tabular-nums shrink-0 w-8">
                        {(j + 1).toString().padStart(2, "0")}
                      </span>
                      <span>{b}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>

              <ScrollReveal delay={0.3} className="mt-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-meta opacity-50">
                  <span className="h-px w-8 bg-current" />
                  {s.companies.map((c, j) => (
                    <span key={j}>
                      {c}
                      {j < s.companies.length - 1 && (
                        <span className="opacity-40 ml-3"> · </span>
                      )}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
