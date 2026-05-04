"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function MaskReveal({
  children,
  delay = 0,
  duration = 0.9,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  // 위에서 아래로 reveal: y 110% → 0
  return (
    <span
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
    >
      <motion.span
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration, delay, ease: [0.6, 0.05, 0.3, 0.95] }}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** 글자별 stagger — 짧은 디스플레이 카피용 */
export function MaskRevealStagger({
  text,
  className = "",
  letterDelay = 0.025,
  duration = 0.7,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  letterDelay?: number;
  duration?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {Array.from(text).map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{
              duration,
              delay: startDelay + i * letterDelay,
              ease: [0.6, 0.05, 0.3, 0.95],
            }}
            className="inline-block will-change-transform"
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
