"use client";

import { m } from "motion/react";

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
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}
