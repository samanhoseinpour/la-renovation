import Link from "next/link";
import type { ReactNode } from "react";

import { AuthPanelMotif } from "@/components/admin/auth-panel-motif";
import { adminAuthPanel } from "@/content/admin";
import { site } from "@/lib/site";

/**
 * Split hero shared by /admin/login and /admin/reset-password: an
 * always-dark brand panel beside the card-free form column. The `dark`
 * class scopes the panel the way coverage-band does, so plain tokens
 * resolve to the dark palette in either site theme; when the theme is
 * already dark, the hairline seam is what separates the panes. Phones keep
 * only the h-16 band. Lockup strings are identity, not copy, matching the
 * site header's literal spans.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      <div className="dark flex shrink-0 flex-col border-b border-border bg-background text-foreground lg:w-[42%] lg:border-b-0 lg:border-r">
        {/* h-16 matches the site header's slot, so the mark holds still
            when arriving from the public pages. */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 lg:px-gutter">
          <Link
            href="/"
            aria-label="Araz Construction Group, home"
            className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="block text-base font-bold leading-none tracking-[0.2em]">
              ARAZ
            </span>
            <span className="mt-1 block text-[9px] font-medium leading-none tracking-[0.42em] opacity-70">
              CONSTRUCTION GROUP
            </span>
          </Link>
          <span className="text-eyebrow text-muted-foreground lg:hidden">
            {adminAuthPanel.eyebrow}
          </span>
        </div>
        {/* overflow-hidden is the motif's clip region, playing the role of
            the 404's overflow-y-clip main. */}
        <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-end lg:px-gutter lg:pb-14">
          <div className="relative">
            <AuthPanelMotif />
            <p className="text-eyebrow text-muted-foreground">
              {adminAuthPanel.eyebrow}
            </p>
            <p className="mt-6 text-display-2 text-balance">
              {site.tagline}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  );
}
