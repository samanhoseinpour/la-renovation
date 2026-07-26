import Link from "next/link";

import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/site/mobile-nav";
import { SiteNav } from "@/components/site/site-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * Rethemed from @shadcnblocks/navbar1: the responsive shell and mobile-sheet
 * pattern carried over; the mega-menu, CDN logo and auth buttons did not.
 *
 * Translucency is CSS-only (no scroll listener) so there is nothing to
 * hydrate. Tailwind emits -webkit-backdrop-filter, so this works in Safari.
 * `overflow-x: clip` on <html> (globals.css) is what keeps `sticky` working
 * in Safari — `overflow-x: hidden` there would silently break it.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container as="div" className="flex h-16 items-center justify-between gap-8">
        <Link
          href="/"
          className="rounded-sm text-lg font-semibold tracking-tight leading-none outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {site.name}
        </Link>

        <SiteNav className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            className="hidden md:inline-flex"
            render={<Link href="/contact" />}
            nativeButton={false}
          >
            Book a call
          </Button>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
