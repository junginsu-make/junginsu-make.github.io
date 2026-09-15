"use client";
import { useEffect, useRef } from "react";

/**
 * 히어로 배경 영상.
 *
 * **이 화면의 주인공은 글자다.** 영상은 배경이라 시선을 가져가면 안 된다.
 * 그래서 작게 두고 오른쪽 아래에 붙인다 — 글자가 놓인 왼쪽은 비워 둔다.
 *
 * **파일을 직접 건다.** 유튜브 임베드는 iframe 이라 로고·컨트롤·관련영상이 끼어들고
 * 자동재생·무한반복을 깨끗하게 못 시킨다. 스크립트도 무거워 첫 화면이 느려진다.
 *
 * **포스터를 먼저 칠하고 영상은 나중에 붙인다.** 히어로는 LCP 요소라 영상이
 * 받아지길 기다리면 첫 화면이 늦어진다. 포스터(17KB)로 즉시 칠하고, 화면에
 * 들어왔을 때 src 를 붙인다.
 *
 * **src 를 붙인 뒤 load() · play() 를 직접 부른다.** 나중에 붙이면 autoPlay
 * 속성만으로는 재생이 시작되지 않는다.
 */

/**
 * 크기와 바닥 여백은 globals.css 의 `.hero-video` 에서 정한다.
 *
 * **화면 폭마다 달라야 한다.** 좁은 화면에서는 object-cover 가 더 확대해 잘라내
 * 같은 배율이라도 피사체가 훨씬 크게 잡힌다. 게다가 모바일에는 하단 탭바가 있어
 * 바닥 여백도 더 필요하다. 인라인 style 로는 미디어 쿼리를 못 쓰므로 변수로 뺐다.
 */
const TRANSFORM = "translateY(calc(-1 * var(--hv-gap))) scale(var(--hv-scale))";

/**
 * 글자 쪽(왼쪽)은 진하게, 영상이 있는 오른쪽은 옅게 덮는다.
 * 균일한 막을 씌우면 글자를 지키려다 영상까지 안 보이게 된다.
 * 야경이라 원본이 이미 어둡다 — 진하게 씌우면 화면이 통째로 검게 눌린다.
 */
const SCRIM =
  "linear-gradient(90deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.42) 42%, rgba(0,0,0,0.06) 74%, rgba(0,0,0,0) 100%)";

/**
 * 축소하면 가장자리가 직선으로 드러난다. 안쪽에서 녹여 배경과 잇는다.
 *
 * **오른쪽은 녹이지 않는다.** 영상을 오른쪽에 붙였기 때문에 그 변이 화면 끝과
 * 맞물린다. 거기까지 흐리면 화면 오른쪽에 검은 띠가 생긴다.
 *
 * 가로·세로 두 장을 겹쳐 교집합으로 쓴다. 타원(radial)으로 하면 모서리가
 * 둥글게 잘려 화면 가운데만 남는다.
 */
const FADE_X = "linear-gradient(to right, transparent 0%, #000 18%, #000 100%)";
const FADE_Y = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 93%, transparent 100%)";
const EDGE_FADE = `${FADE_X}, ${FADE_Y}`;

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

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
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster="/hero/hero-poster.jpg"
        className="hero-video absolute inset-0 w-full h-full object-cover"
        style={{
          // 오른쪽 아래 모서리를 고정하고 줄인 뒤, 바닥에서 살짝 띄운다.
          // 가운데 정렬이면 떠 보이고, 바닥에 딱 붙이면 눌려 보인다.
          transform: TRANSFORM,
          transformOrigin: "right bottom",
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <source data-src="/hero/hero.webm" type="video/webm" />
        <source data-src="/hero/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: SCRIM }} />
    </div>
  );
}
