import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import type { NavPanelItem } from "@/content/nav";
import { cn } from "@/lib/utils";

type MegaPanelProps = {
  items: readonly NavPanelItem[];
  allHref: string;
  allLabel: string;
};

/**
 * Panel body for the mega menu: an editorial row list beside one image that
 * crossfades to the highlighted row. Hover and keyboard focus drive the same
 * state, so both input modes get the live preview; one row is always lit.
 */
export function MegaPanel({ items, allHref, allLabel }: MegaPanelProps) {
  const pathname = usePathname();
  // On a detail page the menu opens showing where the visitor already is.
  const routeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === pathname),
  );
  const [active, setActive] = useState(routeIndex);
  // keepMounted means this never remounts across client navigations, so the
  // highlight must chase the route explicitly (render-phase adjustment).
  const [seenPathname, setSeenPathname] = useState(pathname);
  if (seenPathname !== pathname) {
    setSeenPathname(pathname);
    setActive(routeIndex);
  }

  return (
    <Container
      as="div"
      className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start gap-x-gutter py-10"
    >
      <div>
        <div>
          {items.map((item, i) => (
            <NavigationMenuLink
              key={item.href}
              render={<Link href={item.href} />}
              closeOnClick
              active={item.href === pathname}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-6 border-t border-border py-5 first:border-t-0"
            >
              <span
                className={cn(
                  "text-eyebrow tabular transition-colors duration-200 ease-editorial",
                  i === active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.index}
              </span>
              <span
                className={cn(
                  "text-h3 transition-colors duration-200 ease-editorial",
                  i === active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.title}
              </span>
              <span className="text-eyebrow text-muted-foreground">
                {item.meta}
              </span>
            </NavigationMenuLink>
          ))}
        </div>

        <div className="mt-8">
          <NavigationMenuLink closeOnClick render={<ArrowLink href={allHref} />}>
            {allLabel}
          </NavigationMenuLink>
        </div>
      </div>

      {/* Decorative: the rows carry the information. All images stay stacked
          so switching is a crossfade, not a network round trip. */}
      <div
        aria-hidden="true"
        className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary"
      >
        {items.map((item, i) => (
          <Image
            key={item.href}
            src={item.image.src}
            alt=""
            fill
            sizes="(min-width: 88rem) 34rem, 38vw"
            // All lazy. keepMounted puts these in the DOM on every route, so an
            // eager hint here fires on first paint everywhere — including phones,
            // where the whole nav is display:none — competing with the page's LCP
            // for an image nobody has asked for yet. Lazy inside a hidden subtree
            // means they fetch on first open instead.
            className={cn(
              "object-cover [transition:opacity_300ms_var(--ease-editorial),scale_700ms_var(--ease-editorial)]",
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
      </div>
    </Container>
  );
}
