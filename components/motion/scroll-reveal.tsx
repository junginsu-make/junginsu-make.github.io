"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration, delay, ease: [0.6, 0.05, 0.3, 0.95] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
