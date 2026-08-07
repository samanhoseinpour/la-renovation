"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

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
    let importing = false;
    let disposed = false;

    // Re-evaluated live so plugging in a mouse (or toggling reduced motion)
    // creates/destroys the instance without a reload. The library is
    // import()-ed on first match: phones and reduced-motion sessions never
    // download it, and its stylesheet is inlined in globals.css so no second
    // render-blocking CSS file ships either. `.then` + re-check instead of an
    // async sync(): the query can flip and the effect can clean up while the
    // module is in flight, and neither may race a construction it can't see.
    const sync = () => {
      if (mq.matches && !lenis && !importing) {
        importing = true;
        import("lenis")
          .then(({ default: LenisImpl }) => {
            importing = false;
            if (disposed || !mq.matches || lenis) return;
            lenis = new LenisImpl({
              autoRaf: true,
              // A touch under the 0.1 default: longer glide without input lag.
              lerp: 0.08,
              // Handle anchor clicks internally, clearing the h-16 sticky header.
              anchors: { offset: -64 },
            });
            activeLenis = lenis;
          })
          .catch(() => {
            // A failed fetch leaves native scrolling; the next query flip retries.
            importing = false;
          });
      } else if (!mq.matches && lenis) {
        lenis.destroy();
        lenis = undefined;
        activeLenis = null;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      disposed = true;
      mq.removeEventListener("change", sync);
      lenis?.destroy();
      activeLenis = null;
    };
  }, []);

  return null;
}
