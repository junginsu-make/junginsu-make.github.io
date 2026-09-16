"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

/**
 * 결과물 격자 — 열 높이를 추적해 가장 낮은 곳에 채우는 masonry.
 *
 * **CSS 로는 안 된다.** columns 는 칸 너비가 전부 같아 16:9 결과물이 우표만
 * 해지고, grid 는 dense 를 켜도 구멍이 13% 남았다(실측). 두 칸짜리가 섞이면
 * CSS 가 메울 수 없는 자리가 생긴다. 그래서 자리를 직접 계산한다.
 *
 * **비율은 파일명에서 읽어 온다.** 이미지를 받기 전에 자리를 잡아야 격자가
 * 흔들리지 않는다(scripts/build-gallery.ts 가 `-r203` 처럼 적어 준다).
 */

/** 화면 폭 → 열 수. Tailwind 의 md(768) · xl(1280) 기준과 맞춘다. */
function columnsFor(width: number) {
  if (width < 768) return 2;
  if (width < 1280) return 4;
  return 6;
}

type Placed = { left: number; top: number; width: number; height: number };

export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [height, setHeight] = useState(0);

  const layout = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const total = root.clientWidth;
    if (!total) return;

    const cols = columnsFor(window.innerWidth);
    const gap = window.innerWidth < 768 ? 8 : 12;
    const colW = (total - gap * (cols - 1)) / cols;

    const heights = new Array(cols).fill(0);
    const out: Placed[] = new Array(items.length);

    /** 두 칸짜리가 들어갈 가장 나은 쌍. 두 열의 높이 차를 벌점으로 더한다. */
    function bestPair() {
      let col = 0;
      let top = Infinity;
      let best = Infinity;
      for (let c = 0; c <= cols - 2; c++) {
        const hi = Math.max(heights[c], heights[c + 1]);
        const waste = hi - Math.min(heights[c], heights[c + 1]);
        const score = hi + waste * 0.9;
        if (score < best) {
          best = score;
          top = hi;
          col = c;
        }
      }
      return { col, top, waste: top - Math.min(heights[col], heights[col + 1]) };
    }

    /** 가장 낮은 열. */
    function lowest() {
      let lo = 0;
      for (let c = 0; c < cols; c++) if (heights[c] < heights[lo]) lo = c;
      return lo;
    }

    function place(i: number, col: number, top: number, span: number) {
      const width = colW * span + gap * (span - 1);
      const h = width / items[i].ratio;
      out[i] = { left: col * (colW + gap), top, width, height: h };
      for (let c = col; c < col + span; c++) heights[c] = top + h + gap;
    }

    // 앞에서부터 꺼내되, 두 칸짜리가 큰 구멍을 만들 때는 뒤에서 한 칸짜리를
    // 당겨와 낮은 쪽을 먼저 채운다 — CSS grid 의 dense 와 같은 생각이다.
    const queue = items.map((_, i) => i);
    while (queue.length) {
      const span = Math.min(items[queue[0]].span, cols);

      if (span === 2) {
        const { col, top, waste } = bestPair();
        if (waste > colW * 0.3) {
          const at = queue.findIndex((qi, k) => k > 0 && k < 10 && items[qi].span === 1);
          if (at > 0) {
            const i = queue.splice(at, 1)[0];
            const lo = lowest();
            place(i, lo, heights[lo], 1);
            continue;
          }
        }
        place(queue.shift()!, col, top, 2);
        continue;
      }

      const lo = lowest();
      place(queue.shift()!, lo, heights[lo], 1);
    }

    setPlaced(out);
    // 가장 낮은 열에 맞춘다. 마지막 줄은 채울 타일이 없어 들쭉날쭉한데,
    // 가장 높은 열에 맞추면 그 아래가 통째로 빈 칸으로 남는다.
    // 튀어나온 부분은 아래쪽 페이드가 받아 준다.
    setHeight(Math.max(0, Math.min(...heights) - gap));
  }, [items]);

  useEffect(() => {
    layout();
    const ro = new ResizeObserver(layout);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", layout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, [layout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !placed.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 떠오르는 등장 — 스크롤로 들어온 것만.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "1";
          reveal.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    // 영상은 보이는 것만 튼다. 스무 개를 한꺼번에 틀면 디코더가 밀린다.
    const play = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            v.querySelectorAll("source").forEach((s) => {
              if (s.dataset.src && !s.src) s.src = s.dataset.src;
            });
            if (!v.dataset.loaded) {
              v.load();
              v.dataset.loaded = "1";
            }
            void v.play().catch(() => {
              /* 자동재생이 막히면 포스터가 남는다 */
            });
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "300px 0px" },
    );

    root.querySelectorAll<HTMLElement>("[data-tile]").forEach((el) => {
      if (reduce) el.dataset.shown = "1";
      else reveal.observe(el);
    });
    if (!reduce) root.querySelectorAll("video").forEach((v) => play.observe(v));

    return () => {
      reveal.disconnect();
      play.disconnect();
    };
  }, [placed.length]);

  return (
    <div
      ref={rootRef}
      className="gallery-masonry relative w-full"
      style={{
        height: height || undefined,
        // 마지막 줄에서 튀어나온 타일을 배경색으로 서서히 덮는다.
        // 잘라내면 결과물이 뭉텅 잘린 것처럼 보이고, 그대로 두면 바닥이 들쭉날쭉하다.
        maskImage: "linear-gradient(to bottom, #000 calc(100% - 180px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 180px), transparent 100%)",
      }}
    >
      {items.map((item, i) => {
        const pos = placed[i];
        return (
          <figure
            key={item.src}
            data-tile
            style={{
              position: "absolute",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              width: pos?.width ?? 0,
              height: pos?.height ?? 0,
              transitionDelay: `${(i % 10) * 40}ms`,
              visibility: pos ? "visible" : "hidden",
            }}
            className="gallery-tile group overflow-hidden rounded-xl bg-[var(--bg)] opacity-0 translate-y-5 transition-[opacity,transform,box-shadow] duration-700 ease-out data-[shown=1]:opacity-100 data-[shown=1]:translate-y-0"
          >
            {item.kind === "video" ? (
              <video
                muted
                loop
                playsInline
                preload="none"
                poster={item.poster}
                className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.03]"
              >
                {item.webm ? <source data-src={item.webm} type="video/webm" /> : null}
                <source data-src={item.src} type="video/mp4" />
              </video>
            ) : (
              // next/image 가 unoptimized 라 이점이 없다. 원본 비율을 그대로 쓴다.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
          </figure>
        );
      })}
    </div>
  );
}
