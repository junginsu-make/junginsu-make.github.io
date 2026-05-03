"use client";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/motion";

export function KineticText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      gsap.to(el, {
        // Fraunces SOFT (0~100) + WONK (0~1)
        "--soft": Math.max(0, Math.min(100, 50 + cx * 50)),
        "--wonk": Math.max(0, Math.min(1, cy)).toFixed(2),
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <span
      ref={ref}
      className={`kinetic-text ${className}`}
      style={{
        fontVariationSettings: "'SOFT' var(--soft, 50), 'WONK' var(--wonk, 0)",
      }}
    >
      {children}
    </span>
  );
}
