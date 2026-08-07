import type { Metadata } from "next";

import { AdminOverview } from "@/components/admin/overview";
import { requireAdmin } from "@/lib/admin-guard";
import {
  countFailedDeliveries,
  countSubmissionsBetween,
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
  // A flat 168h back is fine for the comparison window: a DST-shifted hour
  // one week out cannot move a whole enquiry across the boundary in practice.
  const prevWeekStart = new Date(weekStart.getTime() - 7 * 86_400_000);
  const [counts, week, prevWeek, failed, latest, team] = await Promise.all([
    countSubmissionsByStatus(),
    countSubmissionsSince(weekStart),
    countSubmissionsBetween(prevWeekStart, weekStart),
    countFailedDeliveries(),
    listRecentSubmissions(8),
    listTeamLastSignIns(),
  ]);

  return (
    <AdminOverview
      counts={counts}
      week={week}
      prevWeek={prevWeek}
      failed={failed}
      latest={latest}
      team={team}
    />
  );
}
