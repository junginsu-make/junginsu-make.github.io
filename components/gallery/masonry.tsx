"use client";
import { useEffect, useRef } from "react";
import type { GalleryItem } from "@/lib/gallery";

/**
 * 결과물 격자.
 *
 * **가로로 긴 것은 두 칸을 차지한다.** 처음에는 CSS columns 로 짰는데, 그러면
 * 칸 너비가 전부 같아서 16:9 결과물이 세로 포스터와 같은 폭으로 들어가 우표만
 * 하게 보였다. grid 에 `col-span-2` 를 쓰면 가로 결과물이 제 크기를 찾는다.
 *
 * **높이는 원본 비율 그대로 둔다.** 잘라 맞추면 결과물이 아니라 썸네일이 된다.
 * 대신 행마다 높이가 달라 아래쪽에 틈이 생기는데, 이건 `grid-auto-rows` 를
 * 잘게 쪼개고 각 칸이 제 높이만큼 행을 먹도록 해서 메운다(자바스크립트 없이는
 * 안 되는 계산이라 붙여 둔다).
 *
 * **영상은 화면에 들어올 때 재생한다.** 스무 개를 한꺼번에 틀면 디코더가 밀린다.
 */
export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /**
     * 각 타일이 제 높이만큼 행을 차지하게 한다.
     * grid-auto-rows 가 1px + gap 이므로, 높이를 그 단위로 환산해 span 을 준다.
     */
    function layout() {
      const style = getComputedStyle(root!);
      const row = parseFloat(style.getPropertyValue("grid-auto-rows")) || 1;
      const gap = parseFloat(style.getPropertyValue("row-gap")) || 0;
      root!.querySelectorAll<HTMLElement>("[data-tile]").forEach((el) => {
        const media = el.firstElementChild as HTMLElement | null;
        const h = media ? media.getBoundingClientRect().height : el.getBoundingClientRect().height;
        if (!h) return;
        el.style.gridRowEnd = `span ${Math.max(1, Math.ceil((h + gap) / (row + gap)))}`;
      });
    }

    // 이미지·영상은 나중에 도착한다. 도착할 때마다 다시 잰다.
    const ro = new ResizeObserver(layout);
    ro.observe(root);
    root.querySelectorAll("img, video").forEach((el) => {
      ro.observe(el);
      el.addEventListener("load", layout);
      el.addEventListener("loadedmetadata", layout);
    });
    layout();

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
      ro.disconnect();
      reveal.disconnect();
      play.disconnect();
    };
  }, [items]);

  return (
    <div
      ref={rootRef}
      className="gallery-masonry grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3"
    >
      {items.map((item, i) => (
        <figure
          key={item.src}
          data-tile
          style={{ transitionDelay: `${(i % 10) * 45}ms` }}
          className={[
            "overflow-hidden rounded-lg bg-[var(--line)]/30",
            "opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out",
            "data-[shown=1]:opacity-100 data-[shown=1]:translate-y-0",
            item.span === 2 ? "col-span-2" : "",
          ].join(" ")}
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
