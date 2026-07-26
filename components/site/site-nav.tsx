"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Client component because layouts cannot read the pathname in Next 16 —
 * active state has to come from usePathname.
 */
export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("flex items-center gap-8", className)}>
      {site.nav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-eyebrow rounded-sm transition-colors duration-200 ease-editorial",
              "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
