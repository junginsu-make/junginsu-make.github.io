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
const TURN_FRAME_MS = 125;
const TURN_TO_FRONT_FRAMES = [0, 1, 2, 3, 4, 8, 12, 12];

type WalkingCharacterProps = {
  className?: string;
  animated?: boolean;
  pose?: "walk" | "turn-front" | "front";
};

export function WalkingCharacter({
  className,
  animated = true,
  pose = "walk",
}: WalkingCharacterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const spriteUrl = useMemo(
    () => (pose === "walk" ? WALK_SPRITE_URL : FRONT_SPRITE_URL),
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

    if (pose === "turn-front") {
      const start = performance.now();

      const renderTurn = (now: number) => {
        const elapsed = now - start;
        const index = Math.min(
          TURN_TO_FRONT_FRAMES.length - 1,
          Math.floor(elapsed / TURN_FRAME_MS),
        );
        setFrame(TURN_TO_FRONT_FRAMES[index]);

        if (index < TURN_TO_FRONT_FRAMES.length - 1) {
          raf = requestAnimationFrame(renderTurn);
        }
      };

      raf = requestAnimationFrame(renderTurn);

      return () => {
        cancelAnimationFrame(raf);
      };
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
