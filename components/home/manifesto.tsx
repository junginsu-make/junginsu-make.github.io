"use client";
import { PinSection } from "@/components/motion/pin-section";
import { KineticText } from "@/components/motion/kinetic-text";
import { MANIFESTO } from "@/lib/data/home";

export function Manifesto() {
  return (
    <PinSection className="relative overflow-hidden">
      <div className="h-screen flex items-center justify-center px-6 md:px-10 lg:px-16">
        <h1 className="text-display-mega font-display max-w-[18ch] leading-[0.88] text-center">
          <KineticText>{MANIFESTO}</KineticText>
        </h1>
      </div>
    </PinSection>
  );
}
