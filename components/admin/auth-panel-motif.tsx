"use client";

import { m } from "motion/react";

/**
 * The 404's plumb line and survey marker, re-anchored to the auth panel's
 * tagline block. The h-svh overshoot is clipped by the pane's
 * overflow-hidden so the line reads as dropping from beneath the lockup row
 * at any pane height; MotionConfig reducedMotion="user" skips the scaleY,
 * and data-reveal keeps both visible without JS.
 */
export function AuthPanelMotif() {
  return (
    <>
      <m.span
        aria-hidden
        data-reveal
        className="absolute bottom-full left-0 mb-7 h-svh w-px origin-top bg-brand"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <m.span
        aria-hidden
        data-reveal
        className="absolute bottom-full left-0 mb-7 size-1.5 -translate-x-[2.5px] translate-y-1/2 bg-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
