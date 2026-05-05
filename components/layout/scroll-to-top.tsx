"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type Lenis from "lenis";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const threshold = window.innerHeight * 0.5;
      setVisible(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="페이지 맨 위로"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.6, 0.05, 0.3, 0.95] }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="6,14 12,8 18,14" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
