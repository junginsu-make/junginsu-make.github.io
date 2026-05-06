"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

const WALK_SPRITE_URL = "/characters/walking-slowly.png";
const FRONT_SPRITE_URL = "/characters/autosprite-blink.png";
const FRAME_COUNT = 25;
const COLUMNS = 5;
const FRAME_MS = 90;
const STATIC_FRAME = 12;
const FRONT_FRAME = 12;

type WalkingCharacterProps = {
  className?: string;
  animated?: boolean;
  pose?: "walk" | "front";
};

export function WalkingCharacter({
  className,
  animated = true,
  pose = "walk",
}: WalkingCharacterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const spriteUrl = useMemo(
    () => (pose === "front" ? FRONT_SPRITE_URL : WALK_SPRITE_URL),
    [pose],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = -1;
    let raf = 0;

    const setFrame = (nextFrame: number) => {
      if (frame === nextFrame) return;
      frame = nextFrame;

      const size = el.clientWidth || 72;
      const col = frame % COLUMNS;
      const row = Math.floor(frame / COLUMNS);

      el.style.backgroundSize = `${size * COLUMNS}px ${size * COLUMNS}px`;
      el.style.backgroundPosition = `-${col * size}px -${row * size}px`;
    };

    if (pose === "front") {
      setFrame(FRONT_FRAME);
      return;
    }

    const render = (now: number) => {
      setFrame(
        animated ? Math.floor(now / FRAME_MS) % FRAME_COUNT : STATIC_FRAME,
      );
      if (animated) {
        raf = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      frame = -1;
      setFrame(animated ? 0 : STATIC_FRAME);
    });

    resizeObserver.observe(el);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [animated, pose]);

  return (
    <span
      ref={ref}
      className={cn("block bg-no-repeat", className)}
      style={{ backgroundImage: `url(${spriteUrl})` }}
      aria-hidden
    />
  );
}
