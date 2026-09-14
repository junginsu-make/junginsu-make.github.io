"use client";
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/motion";

/**
 * 커서가 지나가면 글자 굵기가 파동처럼 번진다.
 *
 * 원래는 Fraunces 의 SOFT/WONK 축만 움직였는데, Fraunces 는 라틴 전용이라
 * 히어로 글자의 대부분인 한글이 반응하지 않았다. 그래서 글자 단위로 쪼개
 * Pretendard 의 굵기축(wght)을 커서와의 거리로 민다.
 *
 * **위아래로 움직이지 않는 이유** — MaskReveal 이 `overflow-hidden` 으로 감싸고
 * 있어서 글자를 띄우면 잘린다. 굵기는 잘리지 않는다.
 *
 * **한글이라서 성립한다** — 굵기를 200→900 으로 바꿔도 한글 폭은 0.2% 만
 * 변한다(실측). 라틴은 더 움직이므로 글자 상자 폭을 처음 값으로 고정해 둔다.
 */

/** 커서 영향권 (px). 이 밖은 기본 굵기. */
const RADIUS = 240;
/** 영향권 한가운데서 더해질 굵기. */
const AMOUNT = 360;
/** 목표값으로 따라가는 속도 (0~1). 낮을수록 더 늘어진다. */
const EASE = 0.14;
/**
 * 등장 애니메이션이 끝날 때까지 기다리는 시간 (ms).
 * Manifesto 의 MaskReveal 은 delay 1.0 + duration 1.0, WordHighlight 는 1.9 에 끝난다.
 */
const SETTLE_MS = 2400;
/** 좌표를 다시 재는 주기 (프레임). 매 프레임 재면 레이아웃을 계속 강제하게 된다. */
const POSITION_REFRESH = 6;
/**
 * 굵기를 이 단위로 끊어서 쓴다.
 *
 * **성능 때문에 반드시 필요하다.** 160px 짜리 글자의 가변축을 매 프레임 다시
 * 쓰면 그때마다 글자를 새로 그린다. 38자 전부에 대해 그렇게 했더니 평균
 * 프레임이 22.9ms → 96.7ms(약 10fps)로 주저앉았다. 값이 실제로 달라진
 * 글자에만 쓰면 대부분의 프레임에서 쓰기가 0~몇 건으로 줄어든다.
 */
const QUANT = 10;

/**
 * 기준 굵기는 상수로 박지 않는다.
 * 글자마다 원래 계산된 font-weight 를 읽어 거기서 출발한다 — 상수로 박았더니
 * 히어로 전체가 원래(500)보다 얇아졌다.
 */
type Char = { el: HTMLElement; cx: number; cy: number; w: number; base: number };

/** 텍스트 노드를 글자 단위 span 으로 쪼갠다. React 트리는 건드리지 않는다. */
function splitChars(root: HTMLElement): HTMLElement[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) texts.push(node as Text);

  const out: HTMLElement[] = [];
  for (const text of texts) {
    const parent = text.parentNode;
    if (!parent) continue;
    const frag = document.createDocumentFragment();
    for (const ch of Array.from(text.data)) {
      // 공백은 그대로 둔다 — span 으로 감싸면 줄바꿈 규칙이 깨진다.
      if (!ch.trim()) {
        frag.appendChild(document.createTextNode(ch));
        continue;
      }
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.display = "inline-block";
      frag.appendChild(span);
      out.push(span);
    }
    parent.replaceChild(frag, text);
  }
  return out;
}

export function KineticText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 기존 동작 — Fraunces SOFT/WONK 는 그대로 둔다.
    const handleAxis = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      gsap.to(el, {
        "--soft": Math.max(0, Math.min(100, 50 + cx * 50)),
        "--wonk": Math.max(0, Math.min(1, cy)).toFixed(2),
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleAxis);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      return () => window.removeEventListener("mousemove", handleAxis);
    }

    // StrictMode 가 effect 를 두 번 부른다. 원본 노드를 복제해 두었다가 되돌린다.
    // (innerHTML 문자열로 왕복하지 않는다 — 마크업을 다시 파싱할 이유가 없다.)
    const original = Array.from(el.cloneNode(true).childNodes);
    const spans = splitChars(el);
    // 굵기를 건드리기 전에 원래 값을 읽어 둔다.
    const bases = spans.map((s) => parseFloat(getComputedStyle(s).fontWeight) || 400);
    let chars: Char[] = [];
    const weights = Float32Array.from(bases);
    /** 마지막으로 DOM 에 실제로 쓴 값. 같으면 다시 쓰지 않는다. */
    const written = Float32Array.from(bases, (w) => Math.round(w / QUANT) * QUANT);

    /** 좌표만 다시 잰다. 매 프레임은 과하므로 몇 프레임에 한 번 부른다. */
    function refreshPositions() {
      chars = spans.map((s, i) => {
        const r = s.getBoundingClientRect();
        return {
          el: s,
          cx: r.left + r.width / 2,
          cy: r.top + r.height / 2,
          w: r.width,
          base: bases[i],
        };
      });
    }

    /** 폭을 고정해야 굵기가 변할 때 옆 글자가 밀리지 않는다. */
    let widthsPinned = false;
    function pinWidths() {
      chars.forEach((c) => {
        c.el.style.width = `${c.w}px`;
        c.el.style.textAlign = "center";
      });
      widthsPinned = true;
    }

    let mx = -99999;
    let my = -99999;
    const handleMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });

    let needsMeasure = true;
    const invalidate = () => {
      // 화면 폭이 바뀌면 글자 크기(clamp)도 바뀌므로 폭 고정부터 풀어야 한다.
      spans.forEach((s) => {
        s.style.width = "";
      });
      widthsPinned = false;
      needsMeasure = true;
    };
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", () => {
      needsMeasure = true;
    }, { passive: true });

    // 화면 밖으로 나가면 루프를 멈춘다 — 안 보이는 글자를 매 프레임 계산할 이유가 없다.
    let visible = true;
    let raf = 0;
    let frame = 0;
    const startedAt = performance.now();

    const tick = () => {
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);

      // 등장 애니메이션이 끝나기 전에는 손대지 않는다.
      // MaskReveal 이 글자를 아래에서 끌어올리는 중이라, 이때 좌표를 재면
      // 실제 글자보다 한 줄 아래를 기준으로 파동이 계산된다.
      if (performance.now() - startedAt < SETTLE_MS) return;

      frame++;
      if (needsMeasure || !widthsPinned || frame % POSITION_REFRESH === 0) {
        refreshPositions();
        needsMeasure = false;
        if (!widthsPinned) pinWidths();
      }

      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const dx = c.cx - mx;
        const dy = c.cy - my;
        const d = Math.sqrt(dx * dx + dy * dy) / RADIUS;
        const pull = d >= 1 ? 0 : Math.exp(-d * d * 3);
        const target = c.base + pull * AMOUNT;
        weights[i] += (target - weights[i]) * EASE;

        const step = Math.round(weights[i] / QUANT) * QUANT;
        if (step !== written[i]) {
          written[i] = step;
          c.el.style.fontVariationSettings = `"wght" ${step}`;
        }
      }
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", handleAxis);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate);
      el.replaceChildren(...original);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`kinetic-text ${className}`}
      style={{
        fontVariationSettings: "'SOFT' var(--soft, 50), 'WONK' var(--wonk, 0)",
      }}
    >
      {children}
    </span>
  );
}
