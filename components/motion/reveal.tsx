"use client";

import { m, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds. Keep the h1/primary CTA at or under 0.2. */
  delay?: number;
  /** Entrance travel in px. Transforms don't affect layout, so no CLS. */
  y?: number;
  /**
   * "in-view" animates when scrolled into the viewport (once); "mount" runs
   * on load and is reserved for above-the-fold hero sequences.
   */
  mode?: "in-view" | "mount";
};

/**
 * The only entrance animation on the site. data-reveal is the hook for the
 * <noscript> guard in app/layout.tsx that keeps content visible without JS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  mode = "in-view",
}: RevealProps) {
  const visible = { opacity: 1, y: 0 };

  // Duration and ease are spelled out because motion replaces (not merges)
  // the MotionConfig default the moment a transition prop exists; passing
  // `{ delay }` alone silently reverts to the library's 0.3s spring.
  const transition: Transition = {
    delay,
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <m.div
      data-reveal
      className={cn(className)}
      initial={{ opacity: 0, y }}
      {...(mode === "mount"
        ? { animate: visible }
        : {
            whileInView: visible,
            viewport: { once: true, amount: 0.2, margin: "0px 0px -10% 0px" },
          })}
      transition={transition}
    >
      {children}
    </m.div>
  );
}
