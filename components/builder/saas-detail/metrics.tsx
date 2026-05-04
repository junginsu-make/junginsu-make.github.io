"use client";
import { Counter } from "@/components/motion/counter";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { SaaSDetail } from "@/lib/data/saas";

/** "2,769" → 2769 / "80+" → 80 / "5단계" → 5 / "제안서+PRD" → null */
function parseMetricValue(raw: string): { num: number | null; suffix: string } {
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return { num: null, suffix: "" };
  const num = parseInt(match[1].replace(/,/g, ""), 10);
  if (Number.isNaN(num)) return { num: null, suffix: "" };
  return { num, suffix: match[2] };
}

export function SaasMetrics({ saas }: { saas: SaaSDetail }) {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-16 md:mb-20">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>METRICS · 운영 지표</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">
          {saas.metrics.length.toString().padStart(2, "0")} KPI
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
        {saas.metrics.map((m, i) => {
          const { num, suffix } = parseMetricValue(m.value);
          return (
            <ScrollReveal
              key={m.label}
              delay={i * 0.1}
              className="border-t border-[var(--line)] pt-6"
            >
              <p className="text-display-xl md:text-display-mega font-display leading-none tracking-[-0.04em] glow-pulse">
                {num !== null ? <Counter to={num} suffix={suffix} /> : m.value}
              </p>
              <p className="text-meta opacity-70 mt-5 tracking-[0.1em]">{m.label}</p>
            </ScrollReveal>
          );
        })}
      </div>

      {/* 기술 스택 chip */}
      <ScrollReveal delay={0.3} className="mt-20 md:mt-24">
        <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">TECH STACK</p>
        <div className="flex flex-wrap gap-2">
          {saas.techStack.map((t) => (
            <span
              key={t}
              className="text-meta border border-[var(--line)] px-3 py-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              {t}
            </span>
          ))}
        </div>
      </ScrollReveal>

      {/* 외부 링크: live + (조건부) GitHub repo path는 텍스트만 — 절대 룰 5 (외부 GitHub 노출 X) */}
      <ScrollReveal delay={0.45} className="mt-16 grid md:grid-cols-2 gap-6 text-meta">
        <a
          href={saas.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-baseline justify-between border-b border-[var(--line)] pb-3 hover:border-[var(--accent)] transition-colors duration-300"
        >
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">
            LIVE URL
          </span>
          <span className="font-mono opacity-90 group-hover:text-[var(--accent)] transition-colors">
            {saas.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
          </span>
        </a>

        {saas.developer && (
          <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-3">
            <span className="opacity-60">DEVELOPER</span>
            <span className="font-mono opacity-90">{saas.developer}</span>
          </div>
        )}

        {saas.contactEmail && (
          <a
            href={`mailto:${saas.contactEmail}`}
            className="group flex items-baseline justify-between border-b border-[var(--line)] pb-3 hover:border-[var(--accent)] transition-colors duration-300 md:col-span-2"
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              CONTACT
            </span>
            <span className="font-mono opacity-90 group-hover:text-[var(--accent)] transition-colors">
              {saas.contactEmail}
            </span>
          </a>
        )}
      </ScrollReveal>
    </section>
  );
}
