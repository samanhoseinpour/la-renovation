import type { Metadata } from "next";
import type { ReactNode } from "react";

import { site } from "@/lib/site";

// Session reads make these routes dynamic anyway; explicit so a refactor
// can't quietly reintroduce caching on an authenticated surface.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s · Admin · ${site.name}` },
  robots: { index: false, follow: false },
};

/**
 * Shared shell for every /admin route INCLUDING the public login and
 * reset pages, which is why there is deliberately no auth check here:
 * the (dashboard) group's layout and lib/admin-guard.ts own that.
 * data-admin scopes the native-scrollbar restore in globals.css.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div data-admin className="flex min-h-svh flex-1 flex-col">{children}</div>;
}
