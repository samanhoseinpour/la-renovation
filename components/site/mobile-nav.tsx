"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The sheet closes from the link's own onClick rather than an effect on
  // pathname — setState inside an effect causes a cascading render, and the
  // click is the actual event we care about.
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
        }
      >
        <Menu />
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader className="px-gutter pt-6">
          <SheetTitle className="text-eyebrow text-muted-foreground">
            Menu
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col px-gutter pt-6">
          {site.nav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "border-b border-border py-5 text-h3 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
