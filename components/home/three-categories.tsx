"use client";
import { SweepLink } from "@/components/motion/color-sweep";

const CATEGORIES = [
  {
    href: "/career",
    number: "01",
    label: "경력 · 자격",
    img: "/photos/profile-hero.png",
    caption: "17년 마케팅 + AI 강의 + 풀사이클 빌더",
  },
  {
    href: "/marketing",
    number: "02",
    label: "마케팅",
    img: "/photos/teaching/IMG_1187.JPG",
    caption: "KOICA · 광고 운영 10년 · 31 강의처",
  },
  {
    href: "/builder",
    number: "03",
    label: "AI Builder",
    img: "/captured/tickpoint/home/desktop.jpg",
    caption: "GitHub 84 · make.com 4 핵심 · 6 라이브 SaaS",
  },
];

export function ThreeCategories() {
  return (
    <section className="min-h-screen px-6 md:px-10 lg:px-16 py-32">
      <p className="text-meta opacity-50 mb-8">3 분류로 보는 정인수</p>
      <h2 className="text-display-lg font-display mb-20 max-w-2xl">
        한 사람을 이해하는 가장 빠른 방법.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {CATEGORIES.map((c) => (
          <SweepLink
            key={c.href}
            href={c.href}
            className="group relative block aspect-[3/4] overflow-hidden border border-[var(--line)]"
          >
            <img
              src={c.img}
              alt={c.label}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-700 ease-out"
            />
            <div className="relative h-full flex flex-col justify-between p-6 md:p-8 group-hover:text-paper-dark group-hover:mix-blend-difference transition-all duration-700">
              <p className="text-meta opacity-50">{c.number}</p>
              <div>
                <h3 className="text-display-md font-display">{c.label}</h3>
                <p className="text-meta mt-3 opacity-70">{c.caption}</p>
                <p className="text-meta opacity-40 mt-6">→ 더 깊이 보기</p>
              </div>
            </div>
          </SweepLink>
        ))}
      </div>
    </section>
  );
}
