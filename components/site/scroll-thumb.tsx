"use client";

import { useEffect, useRef } from "react";

/**
 * Overlay scroll thumb. The native root bar is hidden (globals.css): its
 * gutter sits beside the viewport and can only paint page background, which
 * glares next to the full-bleed photo bands. This pill floats over the
 * content instead — the one thing a classic bar can never do. Indicator
 * only (pointer-events: none); wheel, keys, Lenis and back-to-top do the
 * moving.
 *
 * Same contract as scroll-progress: CSS vars written straight onto the node
 * each frame so scrolling never re-renders React, fresh scrollHeight reads
 * because images load in, and it keeps updating under reduced motion — it
 * is position feedback mapping 1:1 to user scrolling, not decorative
 * motion. Desktop-gated (md): phones never had a classic gutter, and a
 * z-60 pill would ride over the z-50 nav sheet.
 */
export function ScrollThumb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    let raf = 0;
    let max = 0;
    let trackH = 0;
    let thumbH = 0;

    const update = () => {
      // A non-positive max is a page too short to scroll — no thumb at all,
      // like a healthy overlay bar.
      if (max <= 0) {
        track.style.setProperty("--thumb-h", "0px");
        return;
      }
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      track.style.setProperty("--thumb-h", `${thumbH}px`);
      track.style.setProperty("--thumb-y", `${p * (trackH - thumbH)}px`);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    // Same contract as scroll-progress: layout reads live here, off the
    // scroll path, re-run by the body observer as content height changes
    // and by resize for viewport changes. Scrolled frames read only scrollY
    // and write CSS vars — no interleaved read/write reflow.
    const measure = () => {
      const scrollH = document.documentElement.scrollHeight;
      max = scrollH - window.innerHeight;
      trackH = track.clientHeight;
      // Proportional like a real thumb, with a floor so very long pages
      // still show a pill, not a speck; progress spends the leftover run.
      thumbH = Math.max(trackH * (window.innerHeight / scrollH), 40);
      onScroll();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    // Scroll restoration and mid-page reloads start mid-document.
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-y-2 right-1.5 z-60 hidden w-1 md:block"
    >
      <div className="w-full rounded-full bg-brand/80 h-(--thumb-h,0px) translate-y-(--thumb-y,0px)" />
    </div>
  );
}
