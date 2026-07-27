"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { MegaNav } from "@/components/site/mega-nav";
import { MobileNav } from "@/components/site/mobile-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import type { NavPanels } from "@/content/nav";
import { cn } from "@/lib/utils";

/**
 * Rethemed from @shadcnblocks/navbar1: the responsive shell and mobile-sheet
 * pattern carried over. Desktop nav is the mega menu; this element is the
 * anchor its full-bleed panel positions against.
 *
 * Over the home hero the header runs transparent inside the hero's dark token
 * scope (the `dark` class flips every child — nav, toggle, CTA pill — to
 * on-image colors with zero per-component styling). It returns to the solid
 * translucent bar once the hero's bottom edge clears the header strip, and is
 * forced solid while a panel is open so the panel never hangs off a
 * transparent bar.
 *
 * The bar hides on scroll down and returns on scroll up. Hiding is a
 * paint-only translate: layout height never changes, so Lenis's -64px anchor
 * offset stays valid, and hit-testing follows the transform, so the offscreen
 * bar cannot swallow clicks. `focus-within:translate-y-0` reveals it when
 * keyboard focus lands inside (skip links, tabbing) with no JS.
 *
 * `overflow-x: clip` on <html> (globals.css) is what keeps `sticky` working
 * in Safari — `overflow-x: hidden` there would silently break it. No
 * `will-change` here: combined with `backdrop-filter`, Safari drops the blur.
 */
export function SiteHeader({ panels }: { panels: NavPanels }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Home route first-paints the transparent dark bar (correct at scrollY 0
  // where fresh loads start); the IntersectionObserver's first callback
  // corrects scroll-restored reloads.
  const [overHero, setOverHero] = useState(isHome);
  const [hidden, setHidden] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const hero = document.getElementById("home-hero");
    if (!hero) return;

    // An observer rather than a scroll listener: it fires only at the
    // boundary, and it works under Lenis, which drives native window scroll.
    // The -64px top margin is the h-16 header strip.
    const observer = new IntersectionObserver(
      // Records arrive oldest-first and can batch under main-thread load;
      // only the newest crossing reflects where the hero actually is.
      (entries) => setOverHero(entries[entries.length - 1].isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        // Always visible near the top; also swallows iOS negative overscroll.
        if (y < 80) {
          setHidden(false);
          lastY = y;
          return;
        }
        const delta = y - lastY;
        if (delta > 8) {
          setHidden(true);
          lastY = y;
        } else if (delta < -8) {
          setHidden(false);
          lastY = y;
        }
        // |delta| <= 8: lastY holds, so micro-scrolls accumulate instead of
        // jittering the bar.
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Derived rather than reset in the effect: off the home page the observer
  // never attaches, and isHome alone forces the solid bar.
  const heroBar = isHome && overHero && !panelOpen;
  // An open panel or sheet pins the bar — it must never slide out from under
  // its own anchored popup.
  const pinned = panelOpen || sheetOpen;

  return (
    <header
      ref={headerRef}
      // data-on-hero lets descendants (mega-nav) opt into on-image styling
      // via in-data-[on-hero]: — the dark class alone can't distinguish
      // "over the photo" from the real dark theme.
      data-on-hero={heroBar ? "" : undefined}
      className={cn(
        // Tailwind v4 translate utilities set the `translate` property, so the
        // transition list must name it — `transition-transform` would snap.
        "sticky top-0 z-50 border-b transition-[translate,color,background-color,border-color] duration-300 ease-editorial",
        hidden && !pinned && "-translate-y-full focus-within:translate-y-0",
        heroBar
          ? "dark border-transparent bg-transparent"
          : "border-border bg-background/80 backdrop-blur-md",
      )}
    >
      <Container as="div" className="flex h-16 items-center justify-between gap-8">
        <Link
          href="/"
          className="rounded-sm text-lg font-semibold tracking-tight leading-none text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Araz Construction Group — home"
        >
          <span className="block text-base font-bold leading-none tracking-[0.2em]">ARAZ</span>
          <span className="mt-1 block text-[9px] font-medium leading-none tracking-[0.42em] opacity-70">
            CONSTRUCTION GROUP
          </span>
        </Link>

        <MegaNav
          panels={panels}
          anchorRef={headerRef}
          onOpenChange={setPanelOpen}
          className="hidden md:flex"
        />

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
            <MobileNav panels={panels} onOpenChange={setSheetOpen} />
          </div>
        </div>
      </Container>
    </header>
  );
}
