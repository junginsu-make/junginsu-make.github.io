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
    const out: Placed[] = [];

    for (const item of items) {
      const span = Math.min(item.span, cols);
      const width = colW * span + gap * (span - 1);
      const h = width / item.ratio;

      let col = 0;
      let top = Infinity;
      if (span === 1) {
        // 가장 낮은 열.
        for (let c = 0; c < cols; c++) {
          if (heights[c] < top) {
            top = heights[c];
            col = c;
          }
        }
      } else {
        // 붙어 있는 두 열 쌍 중에서 고른다.
        // 높이만 보면 한쪽이 훨씬 낮은 쌍을 골라 그 차이만큼 구멍이 남는다.
        // 그래서 두 열의 높이 차를 벌점으로 더해, 나란한 쌍을 선호하게 한다.
        let best = Infinity;
        for (let c = 0; c <= cols - span; c++) {
          const hi = Math.max(heights[c], heights[c + 1]);
          const waste = hi - Math.min(heights[c], heights[c + 1]);
          const score = hi + waste * 0.9;
          if (score < best) {
            best = score;
            top = hi;
            col = c;
          }
        }
      }

      out.push({ left: col * (colW + gap), top, width, height: h });
      for (let c = col; c < col + span; c++) heights[c] = top + h + gap;
    }

    setPlaced(out);
    setHeight(Math.max(0, ...heights) - gap);
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
      style={{ height: height || undefined }}
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
            className="group overflow-hidden rounded-xl bg-[var(--bg)] ring-1 ring-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.45)] opacity-0 translate-y-5 transition-[opacity,transform,box-shadow] duration-700 ease-out data-[shown=1]:opacity-100 data-[shown=1]:translate-y-0 hover:ring-white/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
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
