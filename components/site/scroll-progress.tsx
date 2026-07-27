"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-position hairline pinned to the viewport top. Fixed rather than a
 * child of the header: the header translates away on scroll down, which is
 * exactly when progress is changing. z-[60] clears the z-50 header and sheet
 * — the 2px strip painting over the sheet's top edge is the accepted cost.
 *
 * Progress is written as a CSS custom property straight onto the node each
 * animation frame (the compare-slider pattern), so scrolling never re-renders
 * React; scaleX keeps the update compositor-only. No transition on the fill —
 * it must track the scrollbar exactly, and the reduced-motion clamp would
 * zero one anyway. The bar keeps updating under reduced motion on purpose:
 * it is position feedback mapping 1:1 to user scrolling, not decorative
 * motion.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      // Read fresh every frame: scrollHeight moves as images load in.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // A non-positive max is a page too short to scroll; the clamp also
      // swallows iOS rubber-banding at both ends.
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      ref.current?.style.setProperty("--progress", String(p));
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    // Scroll restoration and mid-page reloads start mid-document.
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
      <div className="h-full w-full origin-left bg-brand [transform:scaleX(var(--progress,0))]" />
    </div>
  );
}
