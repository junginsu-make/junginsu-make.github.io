"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { CAREER_FULL } from "@/lib/data/career";

export function CompanyTimelineToggle() {
  const [open, setOpen] = useState(false);
  return (
    <section className="px-6 md:px-10 lg:px-16 py-20 md:py-24 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-between mb-8">
        <p className="text-meta opacity-60 tracking-[0.2em]">
          <MaskReveal>FULL TIMELINE · OPTIONAL</MaskReveal>
        </p>
        <span className="text-meta opacity-40 tabular-nums">17 ENTRIES</span>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex items-baseline gap-4 text-display-md md:text-display-lg font-display leading-[1.05] tracking-[-0.02em] hover:text-[var(--accent)] transition-colors duration-300"
      >
        <span
          className="text-meta opacity-50 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        >
          {open ? "↑" : "↓"}
        </span>
        <span>17 회사 풀 타임라인 {open ? "닫기" : "보기"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.55, ease: [0.6, 0.05, 0.3, 0.95] },
              opacity: { duration: 0.4 },
            }}
            className="overflow-hidden"
          >
            <div className="mt-12 border-t border-[var(--line)]">
              {CAREER_FULL.map((c, i) => (
                <ScrollReveal
                  key={`${c.company}-${i}`}
                  delay={Math.min(i * 0.03, 0.3)}
                >
                  <div className="grid grid-cols-12 gap-x-4 gap-y-2 py-5 border-b border-[var(--line)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--bg))] transition-colors duration-300">
                    <span className="col-span-12 md:col-span-3 text-meta opacity-60 tabular-nums">
                      {c.period}
                    </span>
                    <span className="col-span-12 md:col-span-3 font-medium">
                      {c.company}
                      {c.current && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[var(--accent)] align-middle" />
                      )}
                    </span>
                    <span className="col-span-6 md:col-span-2 text-meta opacity-70">
                      {c.role}
                    </span>
                    <span className="col-span-6 md:col-span-4 text-body opacity-80">
                      {c.impact}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
