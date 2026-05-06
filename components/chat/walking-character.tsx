"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SPRITE_URL = "/characters/autosprite-blink.png";
const COLUMNS = 5;
const FRAME_MS = 140;
const WALK_FRAMES = [0, 1, 15, 16, 17, 18];
const STATIC_FRAME = 0;

type WalkingCharacterProps = {
  className?: string;
  animated?: boolean;
};

export function WalkingCharacter({
  className,
  animated = true,
}: WalkingCharacterProps) {
  const ref = useRef<HTMLSpanElement>(null);

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

    const render = (now: number) => {
      const sequenceIndex = Math.floor(now / FRAME_MS) % WALK_FRAMES.length;
      setFrame(animated ? WALK_FRAMES[sequenceIndex] : STATIC_FRAME);
      if (animated) {
        raf = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      frame = -1;
      setFrame(STATIC_FRAME);
    });

    resizeObserver.observe(el);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [animated]);

  return (
    <span
      ref={ref}
      className={cn("block bg-no-repeat", className)}
      style={{ backgroundImage: `url(${SPRITE_URL})` }}
      aria-hidden
    />
  );
}
