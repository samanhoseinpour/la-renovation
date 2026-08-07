import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkReadOnOpen } from "@/components/admin/mark-read-on-open";
import { SubmissionDetail } from "@/components/admin/submission-detail";
import { requireAdmin } from "@/lib/admin-guard";
import {
  getAdjacentSubmissionIds,
  getSubmission,
} from "@/lib/db/submissions";
import { uuidSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Submission" };

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const [submission, adjacent] = await Promise.all([
    getSubmission(id),
    getAdjacentSubmissionIds(id),
  ]);
  if (!submission) notFound();

  return (
    <>
      {submission.status === "new" && <MarkReadOnOpen id={submission.id} />}
      <SubmissionDetail submission={submission} adjacent={adjacent} />
    </>
  );
}
