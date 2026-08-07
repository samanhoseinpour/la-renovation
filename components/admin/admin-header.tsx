"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { CommandPaletteButton } from "@/components/admin/command-palette";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminNav, adminPalette } from "@/content/admin";

// The platform never changes mid-session; subscribe is a permanent no-op.
const subscribeNever = () => () => {};

/**
 * The dashboard's inset header: sidebar trigger (finally labeled, via
 * tooltip), a pathname-derived page title, and the palette button. Gutters
 * mirror the content wrapper (px-4 md:px-8) so the trigger and the page h1
 * stay on the same vertical line.
 */
export function AdminHeader() {
  const pathname = usePathname();
  const { state } = useSidebar();

  // Server render assumes Apple; the client snapshot corrects on hydration.
  // A boolean snapshot is stable across calls, so no caching dance needed,
  // and the strings only appear in tooltip/kbd chrome.
  const apple = useSyncExternalStore(
    subscribeNever,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent),
    () => true,
  );

  // Explicit annotation widens the as-const tuple union (the documented
  // content-module gotcha) so flatMap can unify the two group shapes.
  const items: { label: string; href: string }[] = adminNav.groups.flatMap(
    (group) => [...group.items],
  );
  // Same rule as the sidebar's active check: "/admin" must exact-match or it
  // would claim every route; otherwise longest prefix wins, so a submission
  // detail titles as "Submissions". Unknown paths (in-chrome 404) fall back
  // to the badge.
  const match =
    pathname === "/admin"
      ? items.find((item) => item.href === "/admin")
      : items
          .filter(
            (item) => item.href !== "/admin" && pathname.startsWith(item.href),
          )
          .sort((a, b) => b.href.length - a.href.length)[0];
  const title = match?.label ?? adminNav.badge;

  const triggerLabel =
    state === "collapsed" ? adminNav.sidebar.expand : adminNav.sidebar.collapse;
  const triggerShortcut = apple
    ? adminNav.sidebar.shortcutMac
    : adminNav.sidebar.shortcutOther;

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-8">
      <Tooltip>
        {/* -ml aligns the icon glyph, not the ghost button's padding box,
            to the gutter; the coarse variant tracks the 44px button. */}
        <TooltipTrigger
          render={<SidebarTrigger className="-ml-1.5 pointer-coarse:-ml-3.5" />}
        />
        <TooltipContent side="bottom" align="start">
          {`${triggerLabel} (${triggerShortcut})`}
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-4" />
      <span className="truncate text-sm font-medium">{title}</span>
      <CommandPaletteButton
        shortcut={
          apple ? adminPalette.shortcutMac : adminPalette.shortcutOther
        }
      />
    </header>
  );
}
