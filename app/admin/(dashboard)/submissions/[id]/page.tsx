import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkReadOnOpen } from "@/components/admin/mark-read-on-open";
import { SubmissionDetail } from "@/components/admin/submission-detail";
import { requireAdmin } from "@/lib/admin-guard";
import { getSubmission } from "@/lib/db/submissions";

export const metadata: Metadata = { title: "Submission" };

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const submission = await getSubmission(id);
  if (!submission) notFound();

  return (
    <>
      {submission.status === "new" && <MarkReadOnOpen id={submission.id} />}
      <SubmissionDetail submission={submission} />
    </>
  );
}
