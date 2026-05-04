"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

export function PinSection({
  children,
  height = "100vh",
  className = "",
}: {
  children: React.ReactNode;
  height?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const heightValue = parseInt(height);

    /**
     * gsap.context() — context.revert() 시 inject한 pin-spacer wrapper까지 모두 복원.
     * 미적용 시 React unmount 단계에서 GSAP가 inject한 DOM 노드와 React fiber tree
     * 간 불일치로 NotFoundError: 'removeChild' 발생.
     */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${heightValue}`,
        pin: true,
        pinSpacing: true,
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [height]);

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {children}
    </div>
  );
}
