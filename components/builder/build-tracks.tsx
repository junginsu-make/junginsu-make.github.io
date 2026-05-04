"use client";
import { motion } from "framer-motion";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { cn } from "@/lib/utils";
import { BUILD_TRACKS } from "@/lib/data/builder-stack";

export function BuildTracks() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-12 md:mb-16">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>TWO TRACKS · DUAL CRAFT</MaskReveal>
        </p>
        <span className="text-meta opacity-40">VIBE CODING + MAKE.COM</span>
      </div>

      <h2 className="text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] mb-12 max-w-[920px]">
        <MaskReveal>
          <span>
            직접 <WordHighlight delay={0.5}>코드</WordHighlight>도 쓰고,
            노코드 <WordHighlight delay={0.85}>자동화</WordHighlight>도 짠다
          </span>
        </MaskReveal>
      </h2>

      <ScrollReveal delay={0.2}>
        <p className="text-body-lg opacity-75 max-w-[820px] leading-[1.6] mb-16">
          AI 빌더의 두 영역. 어느 한 쪽도 부속이 아니라 둘 다 메인 도구.
          좌·우 비교로 한눈에.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
        {BUILD_TRACKS.map((t, i) => (
          <ScrollReveal
            key={t.id}
            delay={i * 0.15}
            className={cn(
              "bg-[var(--bg)] p-8 md:p-12 group transition-colors duration-500",
              t.color === "accent"
                ? "hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
                : "hover:bg-[color-mix(in_oklab,var(--fg)_4%,var(--bg))]",
            )}
          >
            {/* Header — TRACK 번호만 (glyph 제거) */}
            <div className="mb-8">
              <span className="text-meta opacity-50 tracking-[0.2em] tabular-nums">
                TRACK · {t.number}
              </span>
            </div>

            {/* Title + subtitle */}
            <h3
              className={cn(
                "text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.025em] transition-colors duration-300",
                t.color === "accent"
                  ? "group-hover:text-[var(--accent)]"
                  : "",
              )}
            >
              {t.title}
            </h3>
            <p className="mt-3 text-body-lg opacity-70 italic">{t.subtitle}</p>

            {/* divider with motion */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.6, 0.05, 0.3, 0.95],
              }}
              className={cn(
                "my-8 h-px origin-left",
                t.color === "accent" ? "bg-[var(--accent)]" : "bg-current",
              )}
            />

            {/* Bullets */}
            <ul className="space-y-3.5">
              {t.bullets.map((b, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-body opacity-80 leading-[1.55]"
                >
                  <span className="text-meta opacity-40 tabular-nums shrink-0 w-6 mt-1">
                    {String(j + 1).padStart(2, "0")}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Metric — value 더 크게 + label 가독성 개선 */}
            <div
              className={cn(
                "mt-10 pt-8 border-t-2",
                t.color === "accent"
                  ? "border-[var(--accent)]/60"
                  : "border-[var(--fg)]/30",
              )}
            >
              <p
                className={cn(
                  "text-display-lg md:text-display-xl font-display leading-none tracking-[-0.04em] tabular-nums",
                  t.color === "accent"
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg)]",
                )}
              >
                {t.metric.value}
              </p>
              <p
                className={cn(
                  "text-body-lg font-medium mt-4 tracking-[0.05em] leading-[1.4]",
                  t.color === "accent" ? "" : "opacity-90",
                )}
              >
                {t.metric.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
