"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 히어로 배경 영상.
 *
 * **파일을 직접 건다.** 유튜브 임베드는 iframe 이라 로고·컨트롤·관련영상이 끼어들고
 * 자동재생·무한반복을 깨끗하게 못 시킨다. 스크립트도 무거워 첫 화면이 느려진다.
 *
 * **포스터를 먼저 칠하고 영상은 나중에 붙인다.** 히어로는 LCP 요소라 영상이
 * 받아지길 기다리면 첫 화면이 늦어진다. 포스터(약 25KB)로 즉시 칠하고, 화면에
 * 들어왔을 때 src 를 붙인다.
 *
 * **src 를 붙인 뒤 load() · play() 를 직접 부른다.** 나중에 붙이면 autoPlay
 * 속성만으로는 재생이 시작되지 않는다.
 */

/** 비교용 — ?bg=b 로 두 번째 영상을 본다. 고른 뒤에는 이 분기를 지운다. */
type Variant = "a" | "b";

/**
 * 글자 쪽(왼쪽)은 진하게, 인물이 있는 오른쪽은 옅게 덮는다.
 * 균일한 막을 씌우면 글자를 지키려다 영상까지 안 보이게 된다.
 */
const SCRIM =
  "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.66) 38%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.28) 100%)";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant>("a");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("bg");
    if (q === "b") setVariant("b");
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // 움직임을 줄이라고 한 사람에게는 포스터만 보여준다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      v.querySelectorAll("source").forEach((s) => {
        const src = s.dataset.src;
        if (src) s.src = src;
      });
      v.load();
      void v.play().catch(() => {
        /* 자동재생이 막히면 포스터가 남는다 — 화면이 비지는 않는다 */
      });
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [variant]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        key={variant}
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={`/hero/hero-${variant}-poster.jpg`}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source data-src={`/hero/hero-${variant}.webm`} type="video/webm" />
        <source data-src={`/hero/hero-${variant}.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: SCRIM }} />
    </div>
  );
}
