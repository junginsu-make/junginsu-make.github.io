"use client";
import { useEffect, useRef } from "react";

/**
 * 커서를 늦게 따라오는 링. 전 페이지에 하나만 띄운다.
 *
 * 설계 문서 §6 「마그네틱 커서 + 커서 follower」의 follower 쪽 — 표에는 있었지만
 * 그동안 만들어지지 않았다(체크리스트 840).
 *
 * **기본 커서를 숨기지 않는다.** 숨기면 클릭할 곳을 못 찾는 사람이 생긴다.
 * 링은 장식이고 판단은 기본 커서가 한다.
 *
 * **transform 만 건드린다.** 위치를 left/top 으로 옮기면 매 프레임 레이아웃이
 * 다시 계산된다. 히어로 글자 파동에서 그렇게 했다가 10fps 까지 떨어뜨렸다.
 */

/** 커서를 따라가는 속도 (0~1). 낮을수록 더 늘어진다. */
const LERP = 0.18;
/** 평소 지름 (px). */
const SIZE = 26;
/** 누를 수 있는 것 위에서의 배율. */
const HOVER_SCALE = 2.1;
/** 누르고 있는 동안의 배율. */
const PRESS_SCALE = 0.8;

/** 이 위에서는 링이 커진다. */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, label[for], .cursor-magnetic';

export function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 손가락으로 쓰는 기기에는 커서가 없다. 마우스가 있는 기기만.
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let scale = 1;
    let targetScale = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        // 첫 움직임 전에는 보이지 않는다 — 엉뚱한 자리에서 튀어나오지 않게.
        x = tx;
        y = ty;
        el.style.opacity = "1";
      }
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      targetScale = hit ? HOVER_SCALE : 1;
      el.dataset.on = hit ? "1" : "0";
    };

    const onDown = () => {
      targetScale = PRESS_SCALE;
    };
    const onUp = () => {
      targetScale = el.dataset.on === "1" ? HOVER_SCALE : 1;
    };
    const onLeave = () => {
      el.style.opacity = "0";
      shown = false;
    };

    const tick = () => {
      x += (tx - x) * LERP;
      y += (ty - y) * LERP;
      scale += (targetScale - scale) * 0.2;
      el.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-on="0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: "9999px",
        border: "1.5px solid var(--accent)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        willChange: "transform",
        transition: "opacity 220ms ease, background-color 220ms ease, border-color 220ms ease",
      }}
      className="cursor-follower"
    />
  );
}
