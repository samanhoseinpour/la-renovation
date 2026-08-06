import { createHmac } from "node:crypto";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { getDb } from "./index";
import { submissions, type Submission } from "./schema";

export type SubmissionStatus = "new" | "read" | "archived";
export type InboxFilter = SubmissionStatus | "all";

export type NewEnquiry = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  stage?: string;
  message: string;
};

export function hashClientIp(ip: string): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not set.");
  return createHmac("sha256", secret).update(ip).digest("hex");
}

const RATE_MAX = 5;

/**
 * Prune, count and conditionally record one hit in a single statement: one
 * neon-http round trip, no transaction (the HTTP driver has none). Zero
 * returned rows means the caller is over the limit. The count-then-insert
 * pair can race under concurrent requests and admit an extra submission;
 * acceptable at this volume.
 */
export async function consumeRateLimit(
  ipHash: string,
): Promise<"ok" | "limited"> {
  const db = getDb();
  const result = await db.execute(sql`
    WITH pruned AS (
      DELETE FROM rate_limit_hits
      WHERE created_at < now() - interval '1 hour'
    )
    INSERT INTO rate_limit_hits (ip_hash)
    SELECT ${ipHash}
    WHERE (
      SELECT count(*) FROM rate_limit_hits
      WHERE ip_hash = ${ipHash}
        AND created_at >= now() - interval '1 hour'
    ) < ${RATE_MAX}
    RETURNING id
  `);
  return result.rows.length > 0 ? "ok" : "limited";
}

export async function insertSubmission(data: NewEnquiry): Promise<string> {
  const [row] = await getDb()
    .insert(submissions)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      service: data.service || null,
      stage: data.stage || null,
      message: data.message,
    })
    .returning({ id: submissions.id });
  return row.id;
}

export async function markDelivered(id: string): Promise<void> {
  await getDb()
    .update(submissions)
    .set({ delivery: "sent", deliveredAt: new Date(), deliveryError: null })
    .where(eq(submissions.id, id));
}

export async function markDeliveryFailed(
  id: string,
  error: string,
): Promise<void> {
  await getDb()
    .update(submissions)
    .set({ delivery: "failed", deliveryError: error.slice(0, 1000) })
    .where(eq(submissions.id, id));
}

export const INBOX_PAGE_SIZE = 50;

/** Keyset cursor: created_at as Postgres text (full microseconds) plus id. */
export type InboxCursor = { ts: string; id: string };

export type InboxRow = Submission & { cursor: string };

export type InboxPage = { items: InboxRow[]; hasMore: boolean };

// \ % _ are LIKE metacharacters; backslash is Postgres's default escape.
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function inboxConditions(filter: InboxFilter, q?: string): SQL[] {
  const conds: SQL[] = [];
  if (filter !== "all") conds.push(eq(submissions.status, filter));
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    const search = or(
      ilike(submissions.name, pattern),
      ilike(submissions.email, pattern),
      ilike(submissions.company, pattern),
      ilike(submissions.message, pattern),
    );
    if (search) conds.push(search);
  }
  return conds;
}

/**
 * One inbox page, newest first. Ordering is (created_at DESC, id DESC) and
 * the continuation predicate is the matching row-value comparison, so pages
 * neither skip nor repeat rows even when timestamps collide. The cursor is
 * created_at::text because a JS Date round-trip truncates Postgres's
 * microseconds and could skip sub-millisecond siblings at a page boundary.
 */
export async function listSubmissionsPage(args: {
  filter: InboxFilter;
  q?: string;
  before?: InboxCursor;
  limit?: number;
}): Promise<InboxPage> {
  const { filter, q, before, limit = INBOX_PAGE_SIZE } = args;
  const conds = inboxConditions(filter, q);
  if (before) {
    conds.push(
      sql`(${submissions.createdAt}, ${submissions.id}) < (${before.ts}::timestamptz, ${before.id}::uuid)`,
    );
  }
  const rows = await getDb()
    .select({
      ...getTableColumns(submissions),
      cursor: sql<string>`${submissions.createdAt}::text`,
    })
    .from(submissions)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(submissions.createdAt), desc(submissions.id))
    // One extra row answers hasMore without a second count query.
    .limit(limit + 1);
  return { items: rows.slice(0, limit), hasMore: rows.length > limit };
}

export async function listSubmissionsForExport(args: {
  filter: InboxFilter;
  q?: string;
  start?: Date | null;
}): Promise<Submission[]> {
  const conds = inboxConditions(args.filter, args.q);
  if (args.start) conds.push(gte(submissions.createdAt, args.start));
  return getDb()
    .select()
    .from(submissions)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(submissions.createdAt), desc(submissions.id))
    // Guardrail, not pagination: far above any real enquiry volume.
    .limit(10_000);
}

export async function getSubmissionsByIds(
  ids: string[],
): Promise<Submission[]> {
  if (ids.length === 0) return [];
  return getDb()
    .select()
    .from(submissions)
    .where(inArray(submissions.id, ids))
    .orderBy(desc(submissions.createdAt), desc(submissions.id));
}

// Bulk mutations are single statements on purpose: neon-http has no
// transactions, and inArray over ids that a parallel admin already deleted
// is a harmless no-op.

export async function bulkSetSubmissionStatus(
  ids: string[],
  status: SubmissionStatus,
): Promise<void> {
  if (ids.length === 0) return;
  await getDb()
    .update(submissions)
    .set({ status })
    .where(inArray(submissions.id, ids));
}

export async function bulkDeleteSubmissions(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await getDb().delete(submissions).where(inArray(submissions.id, ids));
}

export async function countSubmissionsSince(start: Date): Promise<number> {
  const [row] = await getDb()
    .select({ total: count() })
    .from(submissions)
    .where(gte(submissions.createdAt, start));
  return row.total;
}

export async function countFailedDeliveries(): Promise<number> {
  const [row] = await getDb()
    .select({ total: count() })
    .from(submissions)
    .where(eq(submissions.delivery, "failed"));
  return row.total;
}

export async function listRecentSubmissions(
  limit: number,
): Promise<Submission[]> {
  return getDb()
    .select()
    .from(submissions)
    .orderBy(desc(submissions.createdAt), desc(submissions.id))
    .limit(limit);
}

export async function countSubmissionsByStatus(): Promise<
  Record<SubmissionStatus, number>
> {
  const rows = await getDb()
    .select({ status: submissions.status, total: count() })
    .from(submissions)
    .groupBy(submissions.status);
  const totals: Record<SubmissionStatus, number> = {
    new: 0,
    read: 0,
    archived: 0,
  };
  for (const row of rows) totals[row.status] = row.total;
  return totals;
}

export async function getSubmission(
  id: string,
): Promise<Submission | undefined> {
  const rows = await getDb()
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
  return rows[0];
}

export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<void> {
  await getDb()
    .update(submissions)
    .set({ status })
    .where(eq(submissions.id, id));
}

export async function deleteSubmission(id: string): Promise<void> {
  await getDb().delete(submissions).where(eq(submissions.id, id));
}
