"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Site-wide motion context. LazyMotion + domAnimation keeps the animation
 * runtime to the small feature set (~half the full bundle); `strict` throws
 * in dev if anyone imports `motion.div` instead of `m.div`, which would
 * silently pull the full runtime back in.
 *
 * MotionConfig reducedMotion="user" is the JS-side counterpart of the CSS
 * prefers-reduced-motion guard in globals.css — the CSS guard cannot stop
 * JS-driven animation. Transforms are disabled for those users; opacity
 * fades remain, which is the intended degradation.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        // Matches --ease-editorial in globals.css.
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
