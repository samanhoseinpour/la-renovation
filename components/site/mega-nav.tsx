// No "use client": the boundary is SiteHeader; this stays a client module by
// import, which keeps the function props out of the RSC serialization check.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MegaPanel } from "@/components/site/mega-panel";
import {
  NavigationMenu,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import type { NavPanels } from "@/content/nav";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Over the home hero (header stamps data-on-hero) items go literal white:
// the photo zone is theme-invariant, and grey muted-foreground can't hold
// contrast over a bright image. Carried over from the retired SiteNav.
const onHeroStyle =
  "in-data-[on-hero]:text-white/80 in-data-[on-hero]:hover:text-white";
const onHeroActiveStyle = "text-foreground in-data-[on-hero]:text-white";

type MegaNavProps = {
  panels: NavPanels;
  /** The sticky header — the full-bleed panel anchors to its bottom edge. */
  anchorRef: React.RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * Desktop navigation. Items with a `panel` open a mega panel; the rest are
 * plain links in the same roving list. The panel is portaled to <body> —
 * inside the header, `backdrop-filter` would become the containing block for
 * the fixed positioner, and the home hero's `dark` scope would leak in.
 */
export function MegaNav({
  panels,
  anchorRef,
  onOpenChange,
  className,
}: MegaNavProps) {
  const pathname = usePathname();
  const [value, setValue] = useState<string | null>(null);

  const handleValueChange = (next: string | null) => {
    setValue(next);
    onOpenChange?.(next != null);
  };

  // Link clicks close via closeOnClick; this covers back/forward navigation
  // while a panel is open, which Base UI's own dismissal doesn't see.
  useEffect(() => {
    const closeOnHistoryNav = () => {
      setValue(null);
      onOpenChange?.(false);
    };
    window.addEventListener("popstate", closeOnHistoryNav);
    return () => window.removeEventListener("popstate", closeOnHistoryNav);
  }, [onOpenChange]);

  return (
    <NavigationMenu
      aria-label="Primary"
      value={value}
      onValueChange={handleValueChange}
      // Long enough for the pointer to cross the header strip between the
      // trigger and the panel; the z-50 header paints above the portal, so a
      // hover bridge cannot cover that gap.
      closeDelay={200}
      className={className}
    >
      <NavigationMenuList className="gap-8">
        {site.nav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (item.panel) {
            const panel = panels[item.panel];
            return (
              <NavigationMenuItem key={item.href} value={item.panel}>
                {/* The trigger doubles as a link: hover or ArrowDown opens
                    the panel, click navigates to the section route.
                    preventBaseUIHandler suppresses the internal click-toggle
                    and the explicit close keeps the panel from lingering over
                    the next page. Touch has no hover, so taps keep the stock
                    open/toggle behavior — the route stays reachable through
                    the panel's "All …" link. */}
                <NavigationMenuTrigger
                  render={<Link href={item.href} />}
                  nativeButton={false}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.nativeEvent instanceof PointerEvent &&
                      event.nativeEvent.pointerType === "touch"
                    ) {
                      event.preventDefault();
                      return;
                    }
                    event.preventBaseUIHandler();
                    handleValueChange(null);
                  }}
                  className={cn(onHeroStyle, isActive && onHeroActiveStyle)}
                >
                  {item.label}
                </NavigationMenuTrigger>
                {/* keepMounted: panel links reach the SSR HTML for crawlers
                    and the first open skips the mount cost. Width comes from
                    the header anchor, not the viewport, so it excludes the
                    scrollbar and both panels morph height only. */}
                <NavigationMenuContent
                  keepMounted
                  className="w-(--anchor-width,100vw)"
                >
                  <MegaPanel
                    items={panel.items}
                    allHref={panel.allHref}
                    allLabel={panel.allLabel}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                render={<Link href={item.href} />}
                closeOnClick
                active={isActive}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  navigationMenuTriggerStyle(),
                  onHeroStyle,
                  isActive && onHeroActiveStyle,
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>

      <NavigationMenuPortal>
        <NavigationMenuBackdrop />
        <NavigationMenuPositioner
          anchor={anchorRef}
          positionMethod="fixed"
          side="bottom"
          sideOffset={0}
          align="center"
          collisionAvoidance={{ side: "none", align: "none" }}
          // Default is 5, and the size middleware subtracts it from
          // --available-width, which max-w clamps to — the "full-bleed" panel
          // would float 5px off each edge.
          collisionPadding={0}
        >
          <NavigationMenuPopup>
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}
