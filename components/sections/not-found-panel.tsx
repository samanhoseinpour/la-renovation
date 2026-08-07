"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  getNotFoundCopy,
  notFoundActions,
  notFoundFallback,
} from "@/content/not-found";

/**
 * The 404 verdict: a plumb line of brand steel drops from under the wordmark
 * onto a survey marker above the message, and the dead address prints struck
 * through beneath the headline. Copy comes from content/not-found.ts, keyed
 * by the section the visitor was in.
 *
 * The route is statically prerendered, so the path is only knowable on the
 * client; copy stays on the fallback until after hydration (matching the
 * server HTML, so no mismatch), then switches to the section verdict. The
 * drop itself is a CSS keyframe pair (globals.css): it plays before
 * hydration, costs no JavaScript, and ends visible without it.
 */
const emptySubscribe = () => () => {};

export function NotFoundPanel() {
  const pathname = usePathname();
  // False for the server snapshot and the hydration render, true right after:
  // the copy swap happens in the store re-render, before paint.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const copy = hydrated ? getNotFoundCopy(pathname) : notFoundFallback;
  const eyebrow = copy.label ? `Error 404 / ${copy.label}` : "Error 404";

  return (
    <Section size="lg" className="w-full">
      <Container>
        <div className="relative">
          {/* The plumb line. Taller than any viewport and clipped by <main>'s
              overflow-y-clip, so it always reads as dropping from beneath the
              wordmark regardless of how tall the centered gap is. scaleY from
              an offscreen top origin lands the visible tip in the slow tail
              of the ease; the reduced-motion clamp collapses it to instantly
              visible. */}
          <span
            aria-hidden
            className="animate-plumb-line absolute bottom-full left-0 mb-7 h-svh w-px bg-brand"
          />
          {/* Survey marker at the line's landing point, centered on its end. */}
          <span
            aria-hidden
            className="animate-plumb-marker absolute bottom-full left-0 mb-7 size-1.5 -translate-x-[2.5px] translate-y-1/2 bg-brand"
          />

          <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-display-1 text-balance">
            {copy.heading}
          </h1>

          {/* Fixed-height slot: the address appears only after hydration,
              and reserving the line keeps the centered block from shifting
              when it does. */}
          <div className="mt-8 flex h-5 items-center">
            {hydrated && pathname && (
              <p className="max-w-full truncate font-mono text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                {pathname}
              </p>
            )}
          </div>
          <p className="mt-6 max-w-md text-lead text-muted-foreground">
            {copy.lead}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ArrowLink href={notFoundActions.home.href}>
              {notFoundActions.home.label}
            </ArrowLink>
            <ArrowLink href={notFoundActions.sitemap.href}>
              {notFoundActions.sitemap.label}
            </ArrowLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
