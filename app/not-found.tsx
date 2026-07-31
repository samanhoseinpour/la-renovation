import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { NotFoundPanel } from "@/components/sections/not-found-panel";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Sits outside the (site) route group on purpose, so every 404 (unmatched
 * URLs and thrown notFound() alike) renders without the site chrome: a bare
 * page where the wordmark and the two exits are the only wayfinding. The
 * lockup occupies the same h-16 slot as the real header, so the brand mark
 * holds still when the visitor leaves for a live page.
 */
export default function NotFound() {
  return (
    <>
      <header className="h-16">
        <Container className="flex h-full items-center">
          {/* Mirrors the site-header lockup; keep the two in step. */}
          <Link
            href="/"
            className="rounded-sm text-lg font-semibold tracking-tight leading-none text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Araz Construction Group, home"
          >
            <span className="block text-base font-bold leading-none tracking-[0.2em]">
              ARAZ
            </span>
            <span className="mt-1 block text-[9px] font-medium leading-none tracking-[0.42em] opacity-70">
              CONSTRUCTION GROUP
            </span>
          </Link>
        </Container>
      </header>
      {/* overflow-y-clip crops the panel's plumb line at the top of main,
          which is what makes it hang from beneath the wordmark row. */}
      <main className="flex flex-1 items-center overflow-y-clip">
        <NotFoundPanel />
      </main>
    </>
  );
}
