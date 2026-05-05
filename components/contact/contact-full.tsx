"use client";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

const PRIMARY_EMAIL = "9843ohs@gmail.com";

const CHANNELS = [
  {
    label: "MAIN",
    address: "9843ohs@gmail.com",
    note: "프로젝트 · SaaS 운영 전반",
    href: "mailto:9843ohs@gmail.com",
  },
  {
    label: "직무 · 이직",
    address: "junginsuai@gmail.com",
    note: "이직 제안 · 헤드헌터",
    href: "mailto:junginsuai@gmail.com",
  },
  {
    label: "강의 · 1인 미디어",
    address: "sbcyberpass@gmail.com",
    note: "솔직한 인쌤 블로그 · 강의 문의",
    href: "mailto:sbcyberpass@gmail.com",
  },
];

const RESOURCES = [
  {
    label: "이력서",
    href: "/정인수 이력서_260505.pdf",
    download: "정인수 이력서.pdf",
    meta: "PDF · 마지막 갱신 2026-05",
  },
  {
    label: "TMON ROAS 운영 보고서",
    href: "/marketing-portfolio/page-01.jpg",
    meta: "PNG · 7404% 검증 차트",
  },
];

const TIMEZONE = "Asia/Seoul (KST · UTC+9)";

export function ContactFull() {
  return (
    <section className="min-h-screen flex flex-col">
      {/* HERO */}
      <div className="px-6 md:px-10 lg:px-16 pt-40 pb-16 md:pb-24 flex-1">
        <p className="text-meta opacity-60 mb-12 tracking-[0.2em]">
          <MaskReveal>CONTACT · COLLABORATION</MaskReveal>
        </p>

        <h1 className="text-display-mega font-display leading-[0.92] tracking-[-0.03em]">
          <MaskRevealStagger text="시작하자" letterDelay={0.05} />
        </h1>

        <p className="mt-10 text-body-xl md:text-display-md font-display max-w-[820px] leading-[1.2]">
          <MaskReveal delay={0.6}>
            <span>
              한 명이 17년 마케팅과{" "}
              <WordHighlight delay={1.0}>풀사이클 빌드</WordHighlight>를
              동시에 한다
            </span>
          </MaskReveal>
        </p>

        {/* MAIN 메일 거대 카피 */}
        <div className="mt-20 md:mt-24">
          <Magnetic strength={0.15} className="inline-block">
            <a
              href={`mailto:${PRIMARY_EMAIL}`}
              className="group inline-flex items-baseline gap-4 text-display-lg md:text-display-mega font-display leading-[0.95] tracking-[-0.04em] hover:text-[var(--accent)] transition-colors duration-500"
            >
              <span className="break-all">{PRIMARY_EMAIL}</span>
              <span
                className="text-display-md md:text-display-lg transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3"
                aria-hidden
              >
                ↗
              </span>
            </a>
          </Magnetic>

          <p className="mt-6 text-meta opacity-60 leading-[1.7] max-w-[640px]">
            메인 메일 — 프로젝트 의뢰 · SaaS 운영 · 기술 문의 모두 여기로.
            평일 보통 12시간 내 회신.
          </p>
        </div>

        {/* 3 CHANNELS */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
          {CHANNELS.map((c, i) => (
            <ScrollReveal
              key={c.label}
              delay={i * 0.1}
              className="bg-[var(--bg)] p-7 md:p-8 group transition-colors duration-500 hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--bg))]"
            >
              <p className="text-meta opacity-50 mb-6 tracking-[0.15em]">
                {c.label}
              </p>
              <a
                href={c.href}
                className="font-mono text-body-lg group-hover:text-[var(--accent)] transition-colors duration-300 break-all"
              >
                {c.address}
              </a>
              <p className="mt-4 text-meta opacity-60 leading-[1.5]">{c.note}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* RESOURCES + TIMEZONE */}
        <div className="mt-24 md:mt-32 grid md:grid-cols-12 gap-8 md:gap-12 border-t border-[var(--line)] pt-12">
          <ScrollReveal className="md:col-span-7">
            <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">
              RESOURCES
            </p>
            <div className="space-y-4">
              {RESOURCES.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  {...(r.download ? { download: r.download } : { target: "_blank", rel: "noreferrer" })}
                  className="group flex items-baseline justify-between border-b border-[var(--line)] py-3 hover:border-[var(--accent)] transition-colors duration-300"
                >
                  <span className="text-body-lg group-hover:text-[var(--accent)] transition-colors duration-300">
                    {r.label}
                    <span className="opacity-50 ml-3 text-meta">↗</span>
                  </span>
                  <span className="text-meta opacity-50">{r.meta}</span>
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="md:col-span-5">
            <p className="text-meta opacity-60 mb-6 tracking-[0.2em]">
              TIMEZONE
            </p>
            <p className="font-mono text-body-lg">{TIMEZONE}</p>
            <p className="mt-4 text-meta opacity-60 leading-[1.5]">
              평일 09:00–22:00 KST 응답. 그 외 12시간 내 회신.
            </p>
          </ScrollReveal>
        </div>

        {/* FOOTNOTE */}
        <ScrollReveal delay={0.4} className="mt-24 md:mt-32 max-w-[680px]">
          <p className="text-meta opacity-50 leading-[1.7]">
            ※ 외부 Vibe Coding 저장소 링크는 노출하지 않습니다.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
