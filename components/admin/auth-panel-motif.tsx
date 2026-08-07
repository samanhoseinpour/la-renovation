/**
 * The 404's plumb line and survey marker, re-anchored to the auth panel's
 * tagline block. The h-svh overshoot is clipped by the pane's
 * overflow-hidden so the line reads as dropping from beneath the lockup row
 * at any pane height. Pure CSS since the motion runtime left (PSI, 2026-08):
 * the keyframes in globals.css play without JavaScript and end visible, so
 * this is plain server markup now, not a client leaf.
 */
export function AuthPanelMotif() {
  return (
    <>
      <span
        aria-hidden
        className="animate-plumb-line absolute bottom-full left-0 mb-7 h-svh w-px bg-brand"
      />
      <span
        aria-hidden
        className="animate-plumb-marker absolute bottom-full left-0 mb-7 size-1.5 -translate-x-[2.5px] translate-y-1/2 bg-brand"
      />
    </>
  );
}
