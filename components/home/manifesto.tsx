"use client";
import { PinSection } from "@/components/motion/pin-section";
import { KineticText } from "@/components/motion/kinetic-text";
import { MANIFESTO, HERO_META } from "@/lib/data/home";

export function Manifesto() {
  return (
    <PinSection className="relative overflow-hidden">
      <div className="h-screen flex items-end px-6 md:px-10 lg:px-16 pb-20 md:pb-32">
        <h1 className="text-display-mega font-display max-w-[18ch] leading-[0.88]">
          <KineticText>{MANIFESTO}</KineticText>
        </h1>
        <div className="absolute bottom-10 right-6 md:right-10 lg:right-16 text-meta opacity-70">
          {HERO_META.name} / {HERO_META.birth} / {HERO_META.city}
        </div>
      </div>
    </PinSection>
  );
}
