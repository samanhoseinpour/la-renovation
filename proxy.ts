import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

/**
 * UX-ONLY optimistic gate: checks session-cookie PRESENCE and verifies
 * nothing, so an expired or forged cookie passes here. The security
 * boundary is requireAdmin() in lib/admin-guard.ts, awaited by every
 * protected layout, page and server action; middleware-style auth alone
 * was bypassable as recently as CVE-2025-29927. Kept DB-free on purpose:
 * never import lib/auth.ts here.
 */
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/reset-password"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (!hasSessionCookie && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  // No signed-in bounce off /admin/login here: presence is not validity,
  // and a stale cookie that outlived its session would loop forever against
  // requireAdmin's redirect. The login page itself redirects valid sessions.
  return NextResponse.next();
}

// Zero cost on (site) and /api routes.
export const config = { matcher: ["/admin/:path*"] };
