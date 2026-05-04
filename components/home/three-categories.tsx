"use client";
import { useState } from "react";
import { SweepLink } from "@/components/motion/color-sweep";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MaskRevealStagger } from "@/components/motion/mask-reveal";

type Category = {
  href: string;
  number: string;
  label: string;
  img: string;
  imgWebp: string;
  imgAvif: string;
  caption: string;
};

const CATEGORIES: Category[] = [
  {
    href: "/career",
    number: "01",
    label: "경력 · 자격",
    img: "/photos/profile-hero.png",
    imgWebp: "/photos/profile-hero.webp",
    imgAvif: "/photos/profile-hero.avif",
    caption: "17년 마케팅 + AI 강의 + 풀사이클 빌더",
  },
  {
    href: "/marketing",
    number: "02",
    label: "마케팅",
    img: "/photos/teaching/IMG_1187.JPG",
    imgWebp: "/photos/teaching/IMG_1187.webp",
    imgAvif: "/photos/teaching/IMG_1187.avif",
    caption: "광고 운영 10년+ · 31 강의처",
  },
  {
    href: "/builder",
    number: "03",
    label: "AI Builder",
    img: "/ai-builder/os-agent-detail.jpg",
    imgWebp: "/ai-builder/os-agent-detail.webp",
    imgAvif: "/ai-builder/os-agent-detail.avif",
    caption: "바이브코딩 43 · 자동화 시나리오 81 · SaaS 6 Live",
  },
];

export function ThreeCategories() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section className="min-h-screen px-6 md:px-10 lg:px-16 py-32">
      <ScrollReveal>
        <p className="text-meta opacity-50 mb-8">3 분류로 보는 정인수</p>
      </ScrollReveal>
      <h2 className="text-display-lg font-display mb-20 max-w-2xl">
        <MaskRevealStagger
          text="한 사람을 이해하는 가장 빠른 방법."
          letterDelay={0.025}
          startDelay={0.1}
        />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {CATEGORIES.map((c, i) => {
          const isHover = hoverIdx === i;
          return (
            <ScrollReveal key={c.href} delay={0.4 + i * 0.15}>
              <SweepLink
                href={c.href}
                className="group relative block aspect-[3/4] overflow-hidden border border-[var(--line)] transition-shadow duration-500 hover:shadow-2xl"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <picture>
                  <source srcSet={c.imgAvif} type="image/avif" />
                  <source srcSet={c.imgWebp} type="image/webp" />
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: isHover
                        ? "grayscale(0%) blur(0px)"
                        : "grayscale(80%) blur(4px)",
                      opacity: isHover ? 1 : 0.5,
                      transform: isHover ? "scale(1)" : "scale(1.05)",
                      transition:
                        "filter 500ms ease-out, opacity 500ms ease-out, transform 500ms ease-out",
                    }}
                  />
                </picture>
                <div
                  className="relative h-full flex flex-col justify-between p-6 md:p-8 transition-colors duration-500"
                  style={
                    isHover
                      ? {
                          color: "var(--color-paper-dark)",
                          mixBlendMode: "difference",
                        }
                      : undefined
                  }
                >
                  <p className="text-meta opacity-50">{c.number}</p>
                  <div>
                    <h3 className="text-display-md font-display">{c.label}</h3>
                    <p className="text-meta mt-3 opacity-70">{c.caption}</p>
                    <p className="text-meta opacity-40 mt-6">→ 더 깊이 보기</p>
                  </div>
                </div>
              </SweepLink>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
