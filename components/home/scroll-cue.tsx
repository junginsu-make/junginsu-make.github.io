"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type Lenis from "lenis";

/**
 * 히어로 아래로 내려가는 표시.
 *
 * 첫 화면이 한 화면을 꽉 채우기 때문에, 아래에 더 있다는 신호가 없으면 여기서
 * 멈추는 사람이 생긴다. 모양은 「맨 위로」 버튼과 같게 맞추고 화살표만 뒤집었다.
 *
 * **다음 섹션 위치를 직접 계산하지 않는다.** 히어로는 ScrollTrigger 로 고정돼
 * 있어 pin-spacer 가 끼어든다. 실제 다음 섹션의 화면상 위치를 읽어 거기로 보낸다.
 */
export function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 조금이라도 내려가면 역할이 끝난다.
    function onScroll() {
      setVisible(window.scrollY < window.innerHeight * 0.35);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    // 히어로(1번) 다음에 오는 첫 섹션으로 보낸다.
    const next = document.querySelector("main > :nth-child(2)") as HTMLElement | null;
    const target = next
      ? window.scrollY + next.getBoundingClientRect().top
      : window.scrollY + window.innerHeight;

    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.1 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="다음 섹션으로 이동"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.6, 0.05, 0.3, 0.95] }}
          /*
            모바일은 가운데에 둘 수 없다 — 챗 마스코트가 그 자리에 있어 겹친다
            (실측 390px: 마스코트 x 100~200, 가운데 버튼 x 173~217).
            그래서 모바일은 오른쪽, PC 는 가운데. 하단 탭바(56px)도 피해 올린다.
          */
          className="absolute z-20 right-5 md:right-auto md:left-1/2 md:-translate-x-1/2 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-10 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)]/55 backdrop-blur-md text-[var(--fg)] border border-[var(--line)]/50 hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* 「맨 위로」 화살표를 뒤집은 것 */}
            <polyline points="4,7 10,13 16,7" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
