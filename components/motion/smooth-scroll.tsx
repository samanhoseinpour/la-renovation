"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import "lenis/dist/lenis.css";

// Smooth scrolling only where it adds something: mouse-driven desktop
// sessions. Touch devices keep native (already smooth) scrolling, and
// reduced-motion users are excluded — the CSS guard can't stop Lenis.
const QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// Single-instance store so site chrome (back-to-top) can drive the active
// Lenis without owning its lifecycle. Null whenever the media-query gate has
// destroyed the instance — callers fall back to native scrolling. A non-null
// return also means reduced motion is off: the query requires no-preference.
let activeLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return activeLenis;
}

export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let lenis: Lenis | undefined;

    // Re-evaluated live so plugging in a mouse (or toggling reduced motion)
    // creates/destroys the instance without a reload.
    const sync = () => {
      if (mq.matches && !lenis) {
        lenis = new Lenis({
          autoRaf: true,
          // A touch under the 0.1 default: longer glide without input lag.
          lerp: 0.08,
          // Handle anchor clicks internally, clearing the h-16 sticky header.
          anchors: { offset: -64 },
        });
        activeLenis = lenis;
      } else if (!mq.matches && lenis) {
        lenis.destroy();
        lenis = undefined;
        activeLenis = null;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      lenis?.destroy();
      activeLenis = null;
    };
  }, []);

  return null;
}
