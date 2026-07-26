// No "use client": the boundary is SiteHeader; this stays a client module by
// import, which keeps the function props out of the RSC serialization check.
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowLink } from "@/components/layout/arrow-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavPanels } from "@/content/nav";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  panels: NavPanels;
  onOpenChange?: (open: boolean) => void;
};

export function MobileNav({ panels, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  // Same gap the mega menu covers: back/forward navigates the page underneath
  // while the sheet stays up, and Base UI's dismissal never sees it.
  useEffect(() => {
    const closeOnHistoryNav = () => {
      setOpen(false);
      onOpenChange?.(false);
    };
    window.addEventListener("popstate", closeOnHistoryNav);
    return () => window.removeEventListener("popstate", closeOnHistoryNav);
  }, [onOpenChange]);

  // The sheet closes from the link's own onClick rather than an effect on
  // pathname — setState inside an effect causes a cascading render, and the
  // click is the actual event we care about.
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
        }
      >
        <Menu />
      </SheetTrigger>

      {/* The data-[side=right] prefix matters: the sheet's own w-3/4 carries
          that variant, and a bare w-full loses to it — the drawer opened at
          75% width on phones with a strip of page showing through. */}
      <SheetContent
        side="right"
        className="data-[side=right]:w-full sm:data-[side=right]:max-w-sm"
      >
        <SheetHeader className="px-gutter pt-6">
          <SheetTitle className="text-eyebrow text-muted-foreground">
            Menu
          </SheetTitle>
        </SheetHeader>

        {/* min-h-0 + overflow: an expanded section plus the contact block can
            outgrow a short phone; the nav is the scroll region, and the
            sheet's data-lenis-prevent already covers it. */}
        <nav
          aria-label="Mobile"
          className="min-h-0 flex-1 overflow-y-auto px-gutter pt-6"
        >
          <Accordion multiple={false}>
            {site.nav.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              if (item.panel) {
                const panel = panels[item.panel];
                return (
                  <AccordionItem
                    key={item.href}
                    value={item.panel}
                    // Explicit border: the item's not-last:border-b sees this
                    // as the accordion's last child — the plain links below
                    // are direct children of the root, not items.
                    className="border-b border-border"
                  >
                    <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                      {/* Size on a span, not the trigger: the trigger's own
                          text-sm now loses to text-h3 in the merge, but the
                          span keeps the label's type independent of whatever
                          the accordion primitive bakes in next. */}
                      <span
                        className={cn(
                          "text-h3 transition-colors",
                          isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 [&_a]:no-underline">
                      {panel.items.map((sub) => {
                        const isCurrent = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => handleOpenChange(false)}
                            aria-current={isCurrent ? "page" : undefined}
                            className={cn(
                              "flex items-baseline gap-3 py-2.5 text-base transition-colors",
                              isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            <span className="text-eyebrow tabular">
                              {sub.index}
                            </span>
                            {sub.title}
                          </Link>
                        );
                      })}
                      <ArrowLink
                        href={panel.allHref}
                        onClick={() => handleOpenChange(false)}
                        className="mt-4"
                      >
                        {panel.allLabel}
                      </ArrowLink>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleOpenChange(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block border-b border-border py-5 text-h3 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </Accordion>
        </nav>

        <div className="mt-auto px-gutter pb-10">
          <p className="text-eyebrow text-muted-foreground">Studio</p>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-3 block text-sm hover:underline"
          >
            {site.contact.email}
          </a>
          <a
            href={site.contact.phoneHref}
            className="mt-1 block text-sm tabular hover:underline"
          >
            {site.contact.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
