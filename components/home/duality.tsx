"use client";
import { PinSection } from "@/components/motion/pin-section";

export function Duality() {
  return (
    <PinSection>
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        {/* 좌: 강사 */}
        <div className="relative bg-[var(--color-paper)] dark:bg-[#1a1a1a]">
          <img
            src="/photos/teaching/IMG_1187.JPG"
            alt="KOICA 강의"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 text-[var(--color-ink)]">
            <p className="text-meta opacity-60">A 면</p>
            <h3 className="text-display-md font-display mt-2">강사 · 블로거</h3>
            <p className="text-body-lg mt-4 max-w-md">
              KOICA · 정부 부처 · 대학 · 소상공인 · 31 강의처
            </p>
            <p className="text-meta opacity-50 mt-6">sbcyberpass@naver.com</p>
          </div>
        </div>
        {/* 우: AI 빌더 */}
        <div className="relative bg-[var(--color-ink-dark)] text-[var(--color-paper-dark)]">
          <img
            src="/captured/tickpoint/home/desktop.jpg"
            alt="Tickpoint 라이브 SaaS"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
            <p className="text-meta opacity-60">B 면</p>
            <h3 className="text-display-md font-display mt-2">AI 빌더</h3>
            <p className="text-body-lg mt-4 max-w-md">
              GitHub 84 · 6 라이브 SaaS · make.com 4 핵심 시나리오
            </p>
            <p className="text-meta opacity-50 mt-6">9843ohs@gmail.com</p>
          </div>
        </div>
        {/* 중앙 카피 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--color-orange)] text-white px-10 py-6 md:px-14 md:py-8 rounded-full shadow-2xl">
            <p className="text-display-md font-display whitespace-nowrap">
              한 사람, 두 면
            </p>
          </div>
        </div>
      </div>
    </PinSection>
  );
}
