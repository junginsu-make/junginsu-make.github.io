"use client";
import { PinSection } from "@/components/motion/pin-section";
import { ScrollCue } from "@/components/home/scroll-cue";
import { HeroVideo } from "@/components/home/hero-video";
import { KineticText } from "@/components/motion/kinetic-text";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

export function Manifesto() {
  return (
    <PinSection className="relative overflow-hidden">
      <HeroVideo />
      {/*
        justify-start — 왼쪽 정렬을 못박는다.
        원래 justify-center 였는데, 넓은 화면에서 max-w 가 걸리면 글자 덩어리가
        30px 쯤 안쪽으로 밀렸다(1920px 실측). 오른쪽이 영상으로 차면서 그 밀림이
        눈에 띄었다.
      */}
      {/*
        모바일은 글자를 위로 올린다. 가운데 정렬이면 글자 위 242px · 아래 329px 이
        비어 화면의 68% 가 빈 칸이었다(390x844 실측). 아래는 영상 띠 자리다.
      */}
      <div className="relative z-10 h-screen flex items-start pt-[14vh] md:items-center md:pt-0 justify-start px-6 md:px-10 lg:px-16 xl:px-24">
        <h1 className="text-display-xl font-display max-w-[18ch] leading-[0.92] tracking-[-0.03em] text-left">
          <KineticText>
            {/* 1행 */}
            <span className="block">
              <MaskReveal delay={0.2} duration={1.0}>
                AI 시대를 만난{" "}
              </MaskReveal>
              <MaskReveal delay={0.4} duration={1.0}>
                17년 <WordHighlight delay={1.4}>Marketer</WordHighlight>가,
              </MaskReveal>
            </span>
            {/* 2행 */}
            <span className="block">
              <MaskReveal delay={0.7} duration={1.0}>
                <WordHighlight delay={1.9}>AI Builder</WordHighlight>로
              </MaskReveal>{" "}
              <MaskReveal delay={1.0} duration={1.0}>
                다시 태어났습니다
              </MaskReveal>
            </span>
          </KineticText>
        </h1>
      </div>
      <ScrollCue />
    </PinSection>
  );
}
