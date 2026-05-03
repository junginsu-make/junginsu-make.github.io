"use client";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";

export function PinSection({
  children,
  height = "100vh",
  className = "",
}: {
  children: React.ReactNode;
  height?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const heightValue = parseInt(height);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${heightValue}`,
      pin: true,
      pinSpacing: true,
    });
    return () => {
      trigger.kill();
    };
  }, [height]);

  return (
    <section ref={ref} className={className} style={{ minHeight: height }}>
      {children}
    </section>
  );
}
