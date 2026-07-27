/**
 * First tabbable element on every marketing page. Zero JS: Lenis's anchor
 * handler never calls preventDefault, so the native focus move to the
 * tabindex="-1" <main> survives and Lenis merely animates the scroll with
 * its -64px header offset (native scroll paths get scroll-mt-16 instead).
 * Visually it is sr-only until keyboard focus lands on it, then a standard
 * pill at z-60 — a z-50 tie would paint the header above it.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[60] inline-flex h-8 items-center rounded-full border border-border bg-background px-3.5 text-sm font-medium text-foreground shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      Skip to content
    </a>
  );
}
