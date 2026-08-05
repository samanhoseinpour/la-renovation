"use client";

import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { BlurProps, SiteImage } from "@/content/images";
import { cn } from "@/lib/utils";

type CompareSliderProps = {
  before: SiteImage;
  after: SiteImage;
  /** Resolved blur-ups from the server shell (compare-gallery). */
  beforeBlur: BlurProps;
  afterBlur: BlurProps;
  sizes: string;
  label?: string;
  initial?: number;
  className?: string;
};

/**
 * Draggable before/after viewer. The divider position lives in a CSS custom
 * property written straight from pointer events, so drags never re-render;
 * React state tracks only the committed value the range input announces.
 * All pointer input goes through the frame — the range input is
 * pointer-events-none and exists for keyboard control and focus styling,
 * because its native jump-to-pointer default action reads the pointer against
 * the 36px handle box and teleports the divider.
 */
export function CompareSlider({
  before,
  after,
  beforeBlur,
  afterBlur,
  sizes,
  label,
  initial = 50,
  className,
}: CompareSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  // Touch gestures stay undecided until they move: horizontal beyond the slop
  // becomes a drag, vertical hands the gesture to the page scroll, and a tap
  // that never moves commits on pointerup. Committing on pointerdown would
  // let every scroll that lands on the frame reposition the divider.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [value, setValue] = useState(Math.round(initial));

  const setPosition = (next: number) => {
    const clamped = Math.min(100, Math.max(0, next));
    frameRef.current?.style.setProperty("--pos", `${clamped}%`);
    setValue(Math.round(clamped));
  };

  const positionFromPointer = (event: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (rect) setPosition(((event.clientX - rect.left) / rect.width) * 100);
  };

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    positionFromPointer(event);
  };

  return (
    <div
      ref={frameRef}
      style={{ "--pos": `${initial}%` } as React.CSSProperties}
      className={cn(
        "relative aspect-4/3 cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl bg-secondary select-none",
        className,
      )}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        if (event.pointerType === "mouse") beginDrag(event);
        else touchStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          positionFromPointer(event);
          return;
        }
        const start = touchStart.current;
        if (!start || !event.isPrimary) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) < 6) return;
        touchStart.current = null;
        if (Math.abs(dx) > Math.abs(dy)) beginDrag(event);
      }}
      onPointerUp={(event) => {
        if (touchStart.current && event.isPrimary) positionFromPointer(event);
        touchStart.current = null;
      }}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
    >
      <Image
        src={after.src}
        alt={after.alt}
        {...afterBlur}
        fill
        sizes={sizes}
        draggable={false}
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          {...beforeBlur}
          fill
          sizes={sizes}
          draggable={false}
          className="object-cover"
        />
      </div>
      {/* Decorative for screen readers: the alts already say which state is
          which, and in DOM order the chips would read against the wrong
          image. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 rounded-full bg-background/75 px-2.5 py-1 text-eyebrow text-foreground"
      >
        Before
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 rounded-full bg-background/75 px-2.5 py-1 text-eyebrow text-foreground"
      >
        After
      </span>
      <span
        aria-hidden
        className="absolute inset-y-0 w-px bg-background/80"
        style={{ left: "var(--pos)" }}
      />
      <span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: "var(--pos)" }}
      >
        {/* DOM order matters: the input must precede the circle so `peer`
            styling can reach it. */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(event) => setPosition(Number(event.target.value))}
          onKeyDown={(event) => {
            if (
              event.shiftKey &&
              (event.key === "ArrowLeft" || event.key === "ArrowRight")
            ) {
              event.preventDefault();
              setPosition(value + (event.key === "ArrowRight" ? 10 : -10));
            }
          }}
          aria-label={label ?? `Compare before and after: ${before.alt}`}
          aria-valuetext={`${value}% before photo revealed`}
          className="peer pointer-events-none absolute inset-0 size-full opacity-0"
        />
        <span className="grid size-9 place-items-center rounded-full border border-border bg-background shadow-sm peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
          <ChevronsLeftRight aria-hidden className="size-4 text-foreground" />
        </span>
      </span>
    </div>
  );
}
