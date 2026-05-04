"use client";
import { PinSection } from "@/components/motion/pin-section";
import { KineticText } from "@/components/motion/kinetic-text";
import { MaskReveal, MaskRevealStagger } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";
import { HERO_META } from "@/lib/data/home";

export function Manifesto() {
  return (
    <PinSection className="relative overflow-hidden">
      <div className="h-screen flex items-center px-6 md:px-10 lg:px-16">
        <h1 className="text-display-xl font-display max-w-[18ch] leading-[0.92] tracking-[-0.03em]">
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
                다시 태어났다
              </MaskReveal>
            </span>
          </KineticText>
        </h1>
        <div className="absolute bottom-10 right-6 md:right-10 lg:right-16 text-meta opacity-70">
          <MaskRevealStagger
            text={`${HERO_META.name} / ${HERO_META.birth} / ${HERO_META.city}`}
            startDelay={1.6}
            letterDelay={0.02}
            duration={0.5}
          />
        </div>
      </div>
    </PinSection>
  );
}
