"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";

/**
 * 숫자가 올라가는 카운터.
 *
 * 기본은 화면 가운데쯤 들어왔을 때 시작한다. 다만 푸터 맨 아랫줄처럼 그 밴드
 * (뷰포트 상하 30%를 제외한 가운데 40%) 안에 영영 들어오지 않는 자리도 있다.
 * 거기서는 조건이 만족되지 않아 0 에 멈춘 채로 남는다 — startOnMount 로 연다.
 */
export function Counter({
  to,
  suffix = "",
  duration = 1.6,
  format,
  startOnMount = false,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
  /** 스크롤을 기다리지 않고 붙자마자 센다. */
  startOnMount?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30% 0px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (n) => {
    const value = Math.round(n);
    return (format ? format(value) : value.toLocaleString()) + suffix;
  });

  useEffect(() => {
    if (startOnMount || inView) {
      animate(mv, to, {
        duration,
        ease: [0.6, 0.05, 0.3, 0.95],
      });
    }
  }, [startOnMount, inView, mv, to, duration]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
