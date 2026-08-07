import { z } from "zod";

import { adminExport } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-guard";
import { csvDocument } from "@/lib/csv";
import type { Submission } from "@/lib/db/schema";
import {
  getSubmissionsByIds,
  listSubmissionsForExport,
} from "@/lib/db/submissions";
import { laDateStamp, rangeStart } from "@/lib/la-ranges";
import {
  inboxFilterSchema,
  rangeSchema,
  uuidListSchema,
} from "@/lib/validation";

// Same primitives as the inbox page, opposite policy: malformed input 400s
// here (a route handler answers machines), while the page degrades silently.
const paramsSchema = z.object({
  status: inboxFilterSchema.default("all"),
  range: rangeSchema.default("all"),
  q: z.string().trim().max(200).optional(),
  ids: z
    .string()
    .transform((value) => value.split(","))
    .pipe(uuidListSchema)
    .optional(),
});

const HEADER = Object.values(adminExport.columns) as string[];

function toRow(row: Submission): (string | null)[] {
  return [
    row.id,
    row.createdAt.toISOString(),
    row.name,
    row.email,
    row.phone,
    row.company,
    row.services?.join("; ") ?? null,
    row.stage,
    row.message,
    row.status,
    row.delivery,
    row.deliveryError,
    row.deliveredAt ? row.deliveredAt.toISOString() : null,
    row.updatedAt.toISOString(),
  ];
}

export async function GET(request: Request): Promise<Response> {
  // First awaited call, house rule. An unauthenticated hit gets
  // requireAdmin's login redirect: the export is a top-level navigation, so
  // a human lands on the sign-in form instead of a dead response body.
  await requireAdmin();

  const search = new URL(request.url).searchParams;
  const parsed = paramsSchema.safeParse({
    status: search.get("status") ?? undefined,
    range: search.get("range") ?? undefined,
    q: search.get("q") || undefined,
    ids: search.get("ids") || undefined,
  });
  if (!parsed.success) return new Response("Bad request.", { status: 400 });
  const { status, range, q, ids } = parsed.data;

  // A checked selection wins over the filter view.
  const rows = ids
    ? await getSubmissionsByIds(ids)
    : await listSubmissionsForExport({
        filter: status,
        q,
        start: rangeStart(range),
      });

  // Zero matches still returns a header-only file: honest, and it opens.
  return new Response(csvDocument(HEADER, rows.map(toRow)), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="araz-submissions-${laDateStamp()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
