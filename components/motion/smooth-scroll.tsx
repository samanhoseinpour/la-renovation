"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import "lenis/dist/lenis.css";

// Smooth scrolling only where it adds something: mouse-driven desktop
// sessions. Touch devices keep native (already smooth) scrolling, and
// reduced-motion users are excluded — the CSS guard can't stop Lenis.
const QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

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
      } else if (!mq.matches && lenis) {
        lenis.destroy();
        lenis = undefined;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      lenis?.destroy();
    };
  }, []);

  return null;
}
