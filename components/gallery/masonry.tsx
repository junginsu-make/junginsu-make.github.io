"use client";
import { useEffect, useRef } from "react";
import type { GalleryItem } from "@/lib/gallery";

/**
 * 결과물 격자 — 원본 비율 그대로 벽돌처럼 쌓는다.
 *
 * **CSS columns 를 쓴다.** grid 로 짜면 칸 높이를 맞추려고 잘라내야 하는데,
 * 이 페이지는 결과물의 원래 비율이 곧 내용이다. 세로 포스터와 가로 배너가
 * 섞여 있는 것 자체를 보여주는 자리다.
 *
 * **영상은 화면에 들어올 때 재생한다.** 열 몇 개를 한꺼번에 틀면 디코더가
 * 밀린다. 보이는 것만 틀고 나가면 멈춘다.
 */
export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
      { rootMargin: "0px 0px -8% 0px" },
    );

    // 영상 재생 — 보이는 것만.
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
  }, [items]);

  return (
    <div
      ref={rootRef}
      className="gallery-masonry columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-3"
    >
      {items.map((item, i) => (
        <figure
          key={item.src}
          data-tile
          style={{ transitionDelay: `${(i % 10) * 45}ms` }}
          className="mb-2 md:mb-3 break-inside-avoid overflow-hidden rounded-lg bg-[var(--line)]/30 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out data-[shown=1]:opacity-100 data-[shown=1]:translate-y-0"
        >
          {item.kind === "video" ? (
            <video
              muted
              loop
              playsInline
              preload="none"
              poster={item.poster}
              className="w-full h-auto block"
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
              className="w-full h-auto block"
            />
          )}
        </figure>
      ))}
    </div>
  );
}
