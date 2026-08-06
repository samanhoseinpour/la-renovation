import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatFull } from "@/components/admin/dates";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { adminInbox, adminSubmission } from "@/content/admin";
import type { Submission } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function SubmissionDetail({ submission }: { submission: Submission }) {
  // Absent optionals render nothing, same convention as the public site.
  // Typed explicitly: adminSubmission.fields is `as const`, so without this
  // annotation each array entry narrows to its own literal `label` type and
  // the filter predicate below can't unify them into one assignable shape.
  const fields: { label: string; value: string | null }[] = [
    { label: adminSubmission.fields.email, value: submission.email },
    { label: adminSubmission.fields.phone, value: submission.phone },
    { label: adminSubmission.fields.company, value: submission.company },
    { label: adminSubmission.fields.service, value: submission.service },
    { label: adminSubmission.fields.stage, value: submission.stage },
    {
      label: adminSubmission.fields.received,
      value: formatFull(submission.createdAt),
    },
  ];
  const meta = fields.filter((entry): entry is { label: string; value: string } =>
    Boolean(entry.value),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/submissions"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {adminSubmission.actions.back}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2">{submission.name}</h1>
          <div className="mt-3">
            <Badge
              variant={
                submission.delivery === "failed" ? "destructive" : "secondary"
              }
            >
              {adminInbox.delivery[submission.delivery]}
            </Badge>
          </div>
        </div>
        <SubmissionActions
          id={submission.id}
          status={submission.status}
          afterDelete="back"
        />
      </div>

      <dl className="mt-8 grid gap-x-10 gap-y-5 border-y border-border py-6 sm:grid-cols-2">
        {meta.map((entry) => (
          <div key={entry.label}>
            <dt className="text-eyebrow text-muted-foreground">
              {entry.label}
            </dt>
            <dd className="mt-1">{entry.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 leading-relaxed whitespace-pre-wrap">
        {submission.message}
      </p>

      {submission.delivery === "failed" && submission.deliveryError && (
        <p className="mt-8 text-sm text-destructive">
          {adminSubmission.fields.delivery}: {submission.deliveryError}
        </p>
      )}

      <div className="mt-10">
        <a
          href={`mailto:${submission.email}?subject=${encodeURIComponent(adminSubmission.replySubject)}`}
          className={cn(buttonVariants({ variant: "brand", size: "lg" }))}
        >
          {adminSubmission.actions.reply}
          <ArrowUpRight data-icon="inline-end" />
        </a>
      </div>
    </div>
  );
}
