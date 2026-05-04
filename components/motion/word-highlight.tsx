"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * 강조 단어 wrap. viewport 진입 시:
 *  - underline draw (left → right)
 *  - shimmer (한번 스윕)
 *  - color → orange (var(--accent))
 */
export function WordHighlight({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <span ref={ref} className={`relative inline-block whitespace-nowrap ${className}`}>
      <motion.span
        initial={{ color: "var(--fg)" }}
        animate={inView ? { color: "var(--accent)" } : {}}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
        className="relative z-10"
      >
        {children}
      </motion.span>
      {/* underline */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.6, 0.05, 0.3, 0.95] }}
        className="absolute left-0 bottom-[0.05em] h-[0.06em] w-full bg-[var(--accent)] origin-left will-change-transform"
      />
      {/* shimmer overlay (한번만 스윕) */}
      <motion.span
        aria-hidden
        initial={{ x: "-100%", opacity: 0 }}
        animate={inView ? { x: "120%", opacity: [0, 0.8, 0] } : {}}
        transition={{ duration: 1.2, delay: delay + 0.7, ease: "easeOut" }}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)",
          mixBlendMode: "overlay",
        }}
      />
    </span>
  );
}
