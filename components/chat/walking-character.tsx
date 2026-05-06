"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SPRITE_URL = "/characters/autosprite-blink.png";
const FRAME_COUNT = 25;
const COLUMNS = 5;
const FRAME_MS = 140;

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
      setFrame(animated ? Math.floor(now / FRAME_MS) % FRAME_COUNT : 12);
      if (animated) {
        raf = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      frame = -1;
      setFrame(animated ? 0 : 12);
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
