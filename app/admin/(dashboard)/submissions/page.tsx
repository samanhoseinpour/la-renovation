import type { Metadata } from "next";
import { z } from "zod";

import { SubmissionList } from "@/components/admin/submission-list";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countFailedDeliveries,
  countSubmissionsByStatus,
  listSubmissionsPage,
} from "@/lib/db/submissions";
import { rangeStart } from "@/lib/la-ranges";
import {
  firstParam,
  inboxCursorSchema,
  inboxFilterSchema,
  rangeSchema,
} from "@/lib/validation";

export const metadata: Metadata = { title: "Submissions" };

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

// Every field carries .catch: a hand-edited URL degrades to defaults or page
// one, never a 400 or a throw. The export route composes the same primitives
// with the opposite policy on purpose.
const searchParamsSchema = z.object({
  status: firstParam(inboxFilterSchema).catch("all"),
  range: firstParam(rangeSchema).catch("all"),
  q: firstParam(
    z.string().transform(
      (value) => value.replace(CONTROL_CHARS, "").trim().slice(0, 200) || undefined,
    ),
  ).catch(undefined),
  before: firstParam(inboxCursorSchema).optional().catch(undefined),
  after: firstParam(inboxCursorSchema).optional().catch(undefined),
});

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    q?: string | string[];
    range?: string | string[];
    before?: string | string[];
    after?: string | string[];
  }>;
}) {
  // Defense in depth: the layout checked too, but pages guard themselves.
  await requireAdmin();

  const parsed = searchParamsSchema.parse(await searchParams);
  const { status: active, range, q, before } = parsed;
  // Same cursor shape, same degrade path; before wins if both arrive.
  const after = before ? undefined : parsed.after;

  const [page, counts, failed] = await Promise.all([
    listSubmissionsPage({
      filter: active,
      q,
      start: rangeStart(range),
      before,
      after,
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
      before={before ? `${before.ts}_${before.id}` : undefined}
      after={after ? `${after.ts}_${after.id}` : undefined}
    />
  );
}
