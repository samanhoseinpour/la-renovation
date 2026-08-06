import type { Metadata } from "next";

import { SubmissionList } from "@/components/admin/submission-list";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countSubmissionsByStatus,
  listSubmissions,
  type InboxFilter,
} from "@/lib/db/submissions";

export const metadata: Metadata = { title: "Submissions" };

const FILTERS: ReadonlySet<string> = new Set(["all", "new", "read", "archived"]);

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // Defense in depth: the layout checked too, but pages guard themselves.
  await requireAdmin();

  const { status } = await searchParams;
  const active =
    status && FILTERS.has(status) ? (status as InboxFilter) : "all";

  const [items, counts] = await Promise.all([
    listSubmissions(active),
    countSubmissionsByStatus(),
  ]);

  return <SubmissionList items={items} counts={counts} active={active} />;
}
