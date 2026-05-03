"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";

export function Counter({
  to,
  suffix = "",
  duration = 1.6,
  format,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30% 0px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (n) => {
    const value = Math.round(n);
    return (format ? format(value) : value.toLocaleString()) + suffix;
  });

  useEffect(() => {
    if (inView) {
      animate(mv, to, {
        duration,
        ease: [0.6, 0.05, 0.3, 0.95],
      });
    }
  }, [inView, mv, to, duration]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
