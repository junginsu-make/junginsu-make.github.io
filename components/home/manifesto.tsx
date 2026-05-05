"use client";
import { PinSection } from "@/components/motion/pin-section";
import { KineticText } from "@/components/motion/kinetic-text";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { WordHighlight } from "@/components/motion/word-highlight";

export function Manifesto() {
  return (
    <PinSection className="relative overflow-hidden">
      <div className="h-screen flex items-center justify-center px-6 md:px-10 lg:px-16">
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
                다시 태어났다
              </MaskReveal>
            </span>
          </KineticText>
        </h1>
      </div>
    </PinSection>
  );
}
