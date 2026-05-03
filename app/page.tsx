import { LenisProvider } from "@/components/motion/lenis-provider";
import { KineticText } from "@/components/motion/kinetic-text";
import { Counter } from "@/components/motion/counter";
import { Magnetic } from "@/components/motion/magnetic";
import { PinSection } from "@/components/motion/pin-section";
import { SweepLink } from "@/components/motion/color-sweep";

export default function Home() {
  return (
    <LenisProvider>
      <PinSection>
        <div className="min-h-screen flex items-center justify-center px-6">
          <h1 className="text-display-lg">
            <KineticText>모션 프리미티브 동작 중</KineticText>
          </h1>
        </div>
      </PinSection>

      <section className="min-h-screen flex flex-col items-center justify-center gap-12 px-6">
        <p className="text-display-mega">
          <Counter to={84} />
        </p>
        <Magnetic strength={0.5}>
          <SweepLink
            href="/about"
            className="border border-current px-8 py-4 text-meta hover:bg-current hover:text-[var(--bg)] transition-colors"
          >
            컬러 스윕 테스트 →
          </SweepLink>
        </Magnetic>
      </section>
    </LenisProvider>
  );
}
