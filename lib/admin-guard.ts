import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "./auth";

/**
 * The real security boundary for /admin. proxy.ts only checks cookie
 * presence for UX. Await this in the (dashboard) layout, EVERY protected
 * page, and as the first line of EVERY admin server action: actions are
 * plain POST endpoints reachable without rendering any layout, and layouts
 * do not re-run on soft navigation. react cache() dedupes the session read
 * to one per request.
 */
export const requireAdmin = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin" || session.user.banned) {
    redirect("/admin/login");
  }
  return session;
});
