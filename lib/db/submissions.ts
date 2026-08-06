import { createHmac } from "node:crypto";

import { count, desc, eq, sql } from "drizzle-orm";

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

export async function listSubmissions(
  filter: InboxFilter,
): Promise<Submission[]> {
  const db = getDb();
  const query =
    filter === "all"
      ? db.select().from(submissions)
      : db.select().from(submissions).where(eq(submissions.status, filter));
  // Newest 200; real enquiry volume is low. The upgrade path is a
  // ?before=<createdAt> cursor on submissions_status_created_idx.
  return query.orderBy(desc(submissions.createdAt)).limit(200);
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
