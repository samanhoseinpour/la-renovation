import type { Metadata } from "next";

import { SubmissionList } from "@/components/admin/submission-list";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countFailedDeliveries,
  countSubmissionsByStatus,
  listSubmissionsPage,
  type InboxCursor,
  type InboxFilter,
} from "@/lib/db/submissions";
import { RANGE_PRESETS, rangeStart, type RangePreset } from "@/lib/la-ranges";

export const metadata: Metadata = { title: "Submissions" };

const FILTERS: ReadonlySet<string> = new Set([
  "all",
  "new",
  "read",
  "archived",
  "failed",
]);

const RANGES: ReadonlySet<string> = new Set(RANGE_PRESETS);

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

// Next hands back string[] for a duplicated key; take the first and let the
// whitelists keep malformed URLs on the degrade path instead of throwing.
function first(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    q?: string | string[];
    range?: string | string[];
    before?: string | string[];
  }>;
}) {
  // Defense in depth: the layout checked too, but pages guard themselves.
  await requireAdmin();

  const params = await searchParams;
  const status = first(params.status);
  const rawRange = first(params.range);
  const rawBefore = first(params.before);
  const active =
    status && FILTERS.has(status) ? (status as InboxFilter) : "all";
  const range =
    rawRange && RANGES.has(rawRange) ? (rawRange as RangePreset) : "all";
  const q =
    first(params.q)
      ?.replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 200) || undefined;
  const before = parseCursor(rawBefore);

  const [page, counts, failed] = await Promise.all([
    listSubmissionsPage({
      filter: active,
      q,
      start: rangeStart(range),
      before,
    }),
    countSubmissionsByStatus(),
    countFailedDeliveries(),
  ]);

  return (
    <SubmissionList
      page={page}
      counts={counts}
      failed={failed}
      active={active}
      q={q}
      range={range}
      before={before ? rawBefore : undefined}
    />
  );
}
