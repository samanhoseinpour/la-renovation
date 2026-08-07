"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getLenis } from "@/components/motion/smooth-scroll";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Floating return-to-top control. It earns its place only after two viewports
 * of scroll — closer to the top, the header (one scroll-up away) covers the
 * job — and hides again below 1.75 viewports; the quarter-viewport hysteresis
 * band keeps trackpad inertia at the boundary from flickering the fade.
 *
 * z-40 on purpose: the mobile sheet and its overlay (z-50) must cover it.
 * The outline variant gets an opaque dark override — stock dark:bg-input/30
 * washes out over project photos and the inverted contact panel. `visibility`
 * rides the transition list so the hidden button leaves tab order and the
 * accessibility tree when the fade ends, with no inert/display juggling;
 * pointer-events-none covers the fade-out window before it flips.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      const next = visibleRef.current
        ? y >= window.innerHeight * 1.75
        : y > window.innerHeight * 2;
      if (next !== visibleRef.current) {
        visibleRef.current = next;
        setVisible(next);
      }
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      // Lenis existing implies reduced motion is off (its media query).
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    }
    // Send the keyboard/AT reading position where the page just went;
    // preventScroll keeps the focus move from snapping past the animation.
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 bottom-4 z-40 shadow-md md:right-6 md:bottom-6",
        "transition-[color,background-color,border-color,box-shadow,translate,opacity,visibility]",
        "dark:bg-background dark:hover:bg-muted",
        !visible && "pointer-events-none invisible translate-y-2 opacity-0",
      )}
    >
      <ArrowUp aria-hidden />
    </Button>
  );
}
