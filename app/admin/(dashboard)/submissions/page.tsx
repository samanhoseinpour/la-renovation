import type { Metadata } from "next";

import { SubmissionList } from "@/components/admin/submission-list";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countSubmissionsByStatus,
  listSubmissionsPage,
  type InboxCursor,
  type InboxFilter,
} from "@/lib/db/submissions";

export const metadata: Metadata = { title: "Submissions" };

const FILTERS: ReadonlySet<string> = new Set([
  "all",
  "new",
  "read",
  "archived",
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Postgres timestamptz text: "2026-08-07 02:15:33.123456+00".
const TS_RE =
  /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d{1,6})?([+-]\d{2}(:?\d{2})?|Z)?$/;

/**
 * ?before= is "<created_at text>_<uuid>". The uuid tail is fixed-length, so
 * split from the end; anything malformed degrades to page one rather than
 * erroring on a hand-edited URL.
 */
function parseCursor(raw?: string): InboxCursor | undefined {
  if (!raw || raw.length < 38 || raw.length > 80) return undefined;
  const id = raw.slice(-36);
  const ts = raw.slice(0, -37);
  if (raw.slice(-37, -36) !== "_") return undefined;
  if (!UUID_RE.test(id) || !TS_RE.test(ts)) return undefined;
  return { ts, id };
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; before?: string }>;
}) {
  // Defense in depth: the layout checked too, but pages guard themselves.
  await requireAdmin();

  const { status, q: rawQ, before: rawBefore } = await searchParams;
  const active =
    status && FILTERS.has(status) ? (status as InboxFilter) : "all";
  const q =
    rawQ
      ?.replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 200) || undefined;
  const before = parseCursor(rawBefore);

  const [page, counts] = await Promise.all([
    listSubmissionsPage({ filter: active, q, before }),
    countSubmissionsByStatus(),
  ]);

  return (
    <SubmissionList
      page={page}
      counts={counts}
      active={active}
      q={q}
      before={before ? rawBefore : undefined}
    />
  );
}
