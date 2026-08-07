import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { and, eq, lt, or, sql } from "drizzle-orm";

import { MIN_PASSWORD_LENGTH, NAME_MAX_LENGTH } from "./auth-shared";
import { getDb } from "./db";
import * as authSchema from "./db/auth-schema";
import { hashClientIp } from "./db/submissions";
import { deliverAuthEmail } from "./delivery";

// Relative imports throughout this module's graph on purpose: the better-auth
// CLI and the tsx seed script load it outside Next, where @/ may not resolve.

function requireBaseURL(): string {
  const url = process.env.BETTER_AUTH_URL;
  if (url) return url;
  // A silent localhost fallback in production would ship the session cookie
  // without Secure, break every passkey (rpID "localhost") and mint
  // localhost reset links — fail the deploy instead.
  if (process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_URL is required in production.");
  }
  return "http://localhost:3000";
}

const baseURL = requireBaseURL();

// The only accounts that may ever exist: the two principals plus the site
// administrator's own sign-in (user decision, 2026-08-06). Enforced at the
// database-hook level so no endpoint or plugin path can mint another; the
// public sign-up endpoint is disabled outright below, and accounts are only
// ever created by scripts/seed-admins.mts.
const ALLOWED_ADMINS = new Set([
  "reza@arazconstructiongroup.com",
  "dylan@arazconstructiongroup.com",
  "teamperseustudio@gmail.com",
]);

// Every account is an admin running only its own profile; nobody manages
// anyone else's. The plugin's default admin role grants set-email, ban,
// impersonate, delete, set-password and update over OTHER users through
// /api/auth/admin/*, so the role is redeclared with empty grants and those
// endpoints 403 for every session. requireAdmin()'s role string check, the
// banned check and defaultRole stamping are unaffected, and the seed
// script's sessionless auth.api.createUser skips permission checks.
const adminAccessControl = createAccessControl(defaultStatements);
const adminRole = adminAccessControl.newRole({ user: [], session: [] });

// better-auth keys its limiter `${ip}|${path}`, and the bundled "database"
// storage persists that verbatim — raw addresses at rest, exactly what the
// contact limiter's HMAC scheme and /privacy rule out. The custom storage
// below runs the same fixed-window algorithm over HMAC-SHA256 hashes
// (hashClientIp: same secret, same digest as the contact limiter). Missing
// secret or storage outage fails open with a warning, the contact limiter's
// policy: a broken limiter must not take sign-in down with it.
function hashRateLimitKey(key: string): string | null {
  if (!process.env.RATE_LIMIT_SECRET) {
    console.warn("[auth] RATE_LIMIT_SECRET is not set; rate limiting is off.");
    return null;
  }
  return hashClientIp(key);
}

const PRUNE_AFTER_MS = 24 * 60 * 60 * 1000;

async function consumeHashedRateLimit(
  key: string,
  rule: { window: number; max: number },
): Promise<{ allowed: boolean; retryAfter: number | null }> {
  const hashed = hashRateLimitKey(key);
  if (!hashed) return { allowed: true, retryAfter: null };
  const db = getDb();
  const table = authSchema.rateLimit;
  const now = Date.now();
  const windowStart = now - rule.window * 1000;

  // Stale rows are noise, not state: anything past the longest window is
  // done limiting and only lingers as a stored hash. Volume here is a
  // handful of admin sign-ins, so pruning inline per consume is fine.
  await db.delete(table).where(lt(table.lastRequest, now - PRUNE_AFTER_MS));

  // Mirror of better-auth's own database wrapper: one atomic
  // increment-or-reset, where a blocked request never writes.
  const allowed = await db
    .update(table)
    .set({
      count: sql`case when ${table.lastRequest} < ${windowStart} then 1 else ${table.count} + 1 end`,
      lastRequest: now,
    })
    .where(
      and(
        eq(table.key, hashed),
        or(lt(table.lastRequest, windowStart), lt(table.count, rule.max)),
      ),
    )
    .returning({ id: table.id });
  if (allowed.length > 0) return { allowed: true, retryAfter: null };

  const [row] = await db
    .select({ lastRequest: table.lastRequest })
    .from(table)
    .where(eq(table.key, hashed))
    .limit(1);
  if (!row) {
    try {
      await db
        .insert(table)
        .values({ id: randomUUID(), key: hashed, count: 1, lastRequest: now });
      return { allowed: true, retryAfter: null };
    } catch {
      // Lost the first-hit race; the row exists now, count against it.
      return consumeHashedRateLimit(key, rule);
    }
  }
  return {
    allowed: false,
    retryAfter: Math.max(
      1,
      Math.ceil((row.lastRequest + rule.window * 1000 - now) / 1000),
    ),
  };
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDb(), { provider: "pg", schema: authSchema }),
  // localhost is a trusted origin (and a valid reset-redirect target) only
  // outside production; requireBaseURL() already draws the same line.
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? ["https://arazconstructiongroup.com"]
      : ["https://arazconstructiongroup.com", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      await deliverAuthEmail({
        to: user.email,
        subject: "Set your Araz admin password",
        text: [
          "Use this link to set your admin password:",
          "",
          url,
          "",
          "The link expires in one hour. If you didn't ask for this, ignore this email.",
        ].join("\n"),
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    // Signed cookie copy of the session: RSC reads skip the DB for 60s.
    // Kept short on purpose so a ban or revocation bites within a minute.
    cookieCache: { enabled: true, maxAge: 60 },
  },
  rateLimit: {
    // On by default only in production; explicit so dev behaves the same.
    enabled: true,
    // "database" is what makes the auth CLI emit the rateLimit table into
    // the generated schema (get-tables checks it); at runtime customStorage
    // below takes precedence, keeping the shared-across-instances property
    // while never writing a raw address.
    storage: "database",
    modelName: "rateLimit",
    customStorage: {
      // get/set are better-auth's legacy non-atomic path, kept honest for
      // completeness; consume is what actually runs.
      get: async (key) => {
        const hashed = hashRateLimitKey(key);
        if (!hashed) return null;
        const [row] = await getDb()
          .select()
          .from(authSchema.rateLimit)
          .where(eq(authSchema.rateLimit.key, hashed))
          .limit(1);
        return row
          ? { key, count: row.count, lastRequest: row.lastRequest }
          : null;
      },
      set: async (key, value, update) => {
        const hashed = hashRateLimitKey(key);
        if (!hashed) return;
        const table = authSchema.rateLimit;
        if (update) {
          await getDb()
            .update(table)
            .set({ count: value.count, lastRequest: value.lastRequest })
            .where(eq(table.key, hashed));
        } else {
          await getDb().insert(table).values({
            id: randomUUID(),
            key: hashed,
            count: value.count,
            lastRequest: value.lastRequest,
          });
        }
      },
      consume: async (key, rule) => {
        try {
          return await consumeHashedRateLimit(key, rule);
        } catch (error) {
          console.warn("[auth] Rate limit unavailable:", error);
          return { allowed: true, retryAfter: null };
        }
      },
    },
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 3600, max: 3 },
      "/reset-password": { window: 3600, max: 5 },
      "/change-password": { window: 3600, max: 5 },
      "/update-user": { window: 3600, max: 10 },
    },
  },
  advanced: {
    // Platform-set header only; the first x-forwarded-for hop is
    // caller-controlled (same reasoning as clientIp() in contact/actions.ts).
    ipAddress: { ipAddressHeaders: ["x-real-ip"] },
  },
  onAPIError: {
    // Failed sign-ins and other auth errors reach Vercel's function logs;
    // the closest thing to an audit trail this v1 carries.
    onError: (error) => {
      console.error("[auth]", error);
    },
  },
  hooks: {
    // better-auth never rejects a "new" password equal to the current one
    // (verified against 1.6.26: change-password verifies the current and
    // writes, reset-password just writes), so both paths are guarded here.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/change-password") {
        const { currentPassword, newPassword } = (ctx.body ?? {}) as Record<
          string,
          unknown
        >;
        if (
          typeof currentPassword === "string" &&
          typeof newPassword === "string" &&
          currentPassword === newPassword
        ) {
          throw new APIError("BAD_REQUEST", {
            message:
              "New password must be different from the current password.",
            code: "PASSWORD_UNCHANGED",
          });
        }
        return;
      }
      // POST /reset-password only; the email's GET callback is
      // /reset-password/:token and never carries a newPassword.
      if (ctx.path === "/reset-password") {
        const body = (ctx.body ?? {}) as Record<string, unknown>;
        const queryToken = (ctx.query as Record<string, unknown> | undefined)
          ?.token;
        const token =
          typeof body.token === "string"
            ? body.token
            : typeof queryToken === "string"
              ? queryToken
              : undefined;
        const newPassword = body.newPassword;
        if (typeof token !== "string" || typeof newPassword !== "string") {
          return;
        }
        // findVerificationValue peeks without consuming, so a rejection here
        // leaves the reset link usable for another attempt.
        const verification =
          await ctx.context.internalAdapter.findVerificationValue(
            `reset-password:${token}`,
          );
        // Invalid or expired: stand down and let the endpoint answer with its
        // own INVALID_TOKEN so there is a single error surface for that case.
        if (!verification || verification.expiresAt < new Date()) return;
        const credential = (
          await ctx.context.internalAdapter.findAccounts(verification.value)
        ).find(
          (account) => account.providerId === "credential" && account.password,
        );
        // First-time set: nothing to differ from.
        if (!credential?.password) return;
        const unchanged = await ctx.context.password.verify({
          hash: credential.password,
          password: newPassword,
        });
        if (unchanged) {
          throw new APIError("BAD_REQUEST", {
            message:
              "New password must be different from the current password.",
            code: "PASSWORD_UNCHANGED",
          });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!ALLOWED_ADMINS.has(user.email.toLowerCase())) {
            throw new APIError("FORBIDDEN", {
              message: "Account creation is closed.",
            });
          }
          return { data: user };
        },
      },
      update: {
        // /update-user validates nothing in 1.6.26 (its body schema is
        // z.record(z.string(), z.any())), and this hook also backstops the
        // emptied admin grants above: set-role, the admin update-user and
        // ban-user all funnel through internalAdapter.updateUser. It sees
        // the update payload only, never which row it targets, so every
        // rule is blanket. Throwing is the only safe rejection: on a false
        // return, /update-user still refreshes the session cookie and
        // reports success.
        before: async (data) => {
          const locked =
            data.email !== undefined ||
            data.role !== undefined ||
            data.image !== undefined ||
            // Truthy-only so the plugin's expired-ban cleanup at sign-in
            // ({ banned: false, banReason: null, ... }) stays legal.
            Boolean(data.banned) ||
            Boolean(data.banReason) ||
            Boolean(data.banExpires);
          if (locked) {
            throw new APIError("FORBIDDEN", {
              message: "This account field cannot be changed.",
              code: "FIELD_LOCKED",
            });
          }
          if (data.name !== undefined) {
            const name =
              typeof data.name === "string" ? data.name.trim() : "";
            if (!name || name.length > NAME_MAX_LENGTH) {
              throw new APIError("BAD_REQUEST", {
                message: `Name must be 1 to ${NAME_MAX_LENGTH} characters.`,
                code: "INVALID_NAME",
              });
            }
            return { data: { ...data, name } };
          }
        },
      },
    },
    session: {
      create: {
        // better-auth stamps the signer's raw address and browser onto every
        // session row; /privacy says signing in sets a cookie and nothing
        // else, so neither is kept.
        before: async (session) => ({
          data: { ...session, ipAddress: "", userAgent: "" },
        }),
      },
    },
  },
  plugins: [
    adminPlugin({
      defaultRole: "admin",
      adminRoles: ["admin"],
      ac: adminAccessControl,
      roles: { admin: adminRole },
    }),
    passkey({
      rpID: new URL(baseURL).hostname,
      rpName: "Araz Construction Group Admin",
      origin: baseURL,
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    }),
    // Must stay last: rewrites Set-Cookie handling for server actions.
    nextCookies(),
  ],
});
