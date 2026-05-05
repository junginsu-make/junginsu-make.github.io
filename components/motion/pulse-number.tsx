"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Marketing 페이지 큰 강조 숫자(7404%, 79억+, +29 등)에 미세 호흡(pulse) 부여.
 * 1.015 max scale로 거의 안 보일 정도 — "성장·살아있음" 시그너처.
 * framer-motion이 prefers-reduced-motion 자동 대응.
 *
 * Revert: 사용처에서 PulseNumber → 그냥 children으로 unwrap, 이 파일 삭제.
 */
export function PulseNumber({
  children,
  className,
  duration = 2.4,
  intensity = 1.015,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  intensity?: number;
}) {
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", transformOrigin: "center" }}
      animate={{ scale: [1, intensity, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}
