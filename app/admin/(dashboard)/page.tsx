import type { Metadata } from "next";

import { AdminOverview } from "@/components/admin/overview";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countFailedDeliveries,
  countSubmissionsByStatus,
  countSubmissionsSince,
  listRecentSubmissions,
} from "@/lib/db/submissions";
import { listTeamLastSignIns } from "@/lib/db/team";
import { rangeStart } from "@/lib/la-ranges";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminIndexPage() {
  await requireAdmin();

  // rangeStart is only null for "all"; the fallback is unreachable.
  const weekStart = rangeStart("7d") ?? new Date(0);
  const [counts, week, failed, latest, team] = await Promise.all([
    countSubmissionsByStatus(),
    countSubmissionsSince(weekStart),
    countFailedDeliveries(),
    listRecentSubmissions(8),
    listTeamLastSignIns(),
  ]);

  return (
    <AdminOverview
      counts={counts}
      week={week}
      failed={failed}
      latest={latest}
      team={team}
    />
  );
}
