import { z } from "zod";

import { MIN_PASSWORD_LENGTH, NAME_MAX_LENGTH } from "./auth-shared";
// Type-only on purpose: db/submissions pulls node:crypto and drizzle, and
// this module sits in client bundles (the admin forms import it).
import type { InboxCursor, InboxFilter } from "./db/submissions";
import { RANGE_PRESETS } from "./la-ranges";

/**
 * Shared zod primitives. Composition stays with each surface because the
 * degradation policies differ on purpose: the inbox page catches everything
 * into silent defaults, the export route 400s, and the forms map failures
 * onto their own copy. Keep this module client-safe: zod, constants and
 * type-only imports, nothing else.
 */

export const emailSchema = z.string().trim().min(1).max(254).email();

/**
 * The server owns the floor (minPasswordLength in lib/auth.ts); this is the
 * client preflight's copy of the same shared constant.
 */
export const passwordSchema = z.string().min(MIN_PASSWORD_LENGTH);

export const displayNameSchema = z.string().trim().min(1).max(NAME_MAX_LENGTH);

export const uuidSchema = z.string().uuid();

// The selection UI can only produce a page's worth of ids; 100 leaves slack.
export const uuidListSchema = z.array(uuidSchema).min(1).max(100);

/** Cosmetic device label; capped by plain trim-and-slice at the call sites. */
export const PASSKEY_NAME_MAX_LENGTH = 64;

export const submissionStatusSchema = z.enum(["new", "read", "archived"]);

export const INBOX_FILTERS = [
  "all",
  "new",
  "read",
  "archived",
  "failed",
] as const satisfies readonly InboxFilter[];

export const inboxFilterSchema = z.enum(INBOX_FILTERS);

export const rangeSchema = z.enum(RANGE_PRESETS);

// Postgres timestamptz text: "2026-08-07 02:15:33.123456+00".
const TS_RE =
  /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}(:?\d{2})?|Z)?$/;

/**
 * Keyset cursor: "<created_at text>_<uuid>". The uuid tail is fixed-length,
 * so split from the end; ts passes through as text so the row-value SQL
 * keeps Postgres timestamp precision.
 */
export const inboxCursorSchema = z
  .string()
  .min(38)
  .max(80)
  .transform((raw, ctx): InboxCursor => {
    const id = raw.slice(-36);
    const ts = raw.slice(0, -37);
    if (
      raw.slice(-37, -36) !== "_" ||
      !uuidSchema.safeParse(id).success ||
      !TS_RE.test(ts)
    ) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Malformed cursor." });
      return z.NEVER;
    }
    return { ts, id };
  });

/** Next hands back string[] for a duplicated query key; take the first. */
export function firstParam<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    schema,
  );
}
