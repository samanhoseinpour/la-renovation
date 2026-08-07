import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { formatFull } from "@/components/admin/dates";
import { RetryDelivery } from "@/components/admin/retry-delivery";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { adminInbox, adminSubmission } from "@/content/admin";
import type { Submission } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function SubmissionDetail({
  submission,
  adjacent,
}: {
  submission: Submission;
  /** Neighbors in global inbox order; null means this end of the inbox. */
  adjacent: { newer: string | null; older: string | null };
}) {
  // Absent optionals render nothing, same convention as the public site.
  // Typed explicitly: adminSubmission.fields is `as const`, so without this
  // annotation each array entry narrows to its own literal `label` type and
  // the filter predicate below can't unify them into one assignable shape.
  const fields: { label: string; value: string | null }[] = [
    { label: adminSubmission.fields.email, value: submission.email },
    { label: adminSubmission.fields.phone, value: submission.phone },
    { label: adminSubmission.fields.company, value: submission.company },
    {
      label: adminSubmission.fields.services,
      value: submission.services?.length
        ? submission.services.join(", ")
        : null,
    },
    { label: adminSubmission.fields.stage, value: submission.stage },
    {
      label: adminSubmission.fields.received,
      value: formatFull(submission.createdAt),
    },
  ];
  const meta = fields.filter((entry): entry is { label: string; value: string } =>
    Boolean(entry.value),
  );

  const triage: {
    id: string | null;
    label: string;
    icon: typeof ChevronLeft;
    edge: "inline-start" | "inline-end";
  }[] = [
    {
      id: adjacent.newer,
      label: adminSubmission.nav.newer,
      icon: ChevronLeft,
      edge: "inline-start",
    },
    {
      id: adjacent.older,
      label: adminSubmission.nav.older,
      icon: ChevronRight,
      edge: "inline-end",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* -ml-3 keeps the pill's label optically on the h1's left edge. */}
        <Link
          href="/admin/submissions"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-3 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden />
          {adminSubmission.actions.back}
        </Link>
        <div className="-mr-3 flex shrink-0 items-center gap-1">
          {triage.map(({ id, label, icon: Icon, edge }) =>
            id ? (
              <Link
                key={label}
                href={`/admin/submissions/${id}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                {edge === "inline-start" && (
                  <Icon data-icon="inline-start" aria-hidden />
                )}
                {label}
                {edge === "inline-end" && (
                  <Icon data-icon="inline-end" aria-hidden />
                )}
              </Link>
            ) : (
              // The end of the inbox: keep the slot so nothing shifts.
              <span
                key={label}
                aria-hidden
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "pointer-events-none text-muted-foreground opacity-50",
                )}
              >
                {edge === "inline-start" && <Icon data-icon="inline-start" />}
                {label}
                {edge === "inline-end" && <Icon data-icon="inline-end" />}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h2 wrap-anywhere">{submission.name}</h1>
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
          delivery={submission.delivery}
          afterDelete="back"
        />
      </div>

      <dl className="mt-8 grid gap-x-10 gap-y-4 border-y border-border py-6 sm:grid-cols-2 sm:gap-y-5">
        {meta.map((entry) => (
          // min-w-0 + wrap-anywhere: grid items size to min-content, and a
          // long email is one unbroken token that would otherwise push the
          // page sideways on a phone.
          <div key={entry.label} className="min-w-0">
            <dt className="text-eyebrow text-muted-foreground">
              {entry.label}
            </dt>
            <dd className="mt-1 wrap-anywhere">{entry.value}</dd>
          </div>
        ))}
      </dl>

      {/* wrap-break-word, not wrap-anywhere: ordinary prose keeps its word
          breaks and only a pasted-URL monster splits. */}
      {submission.message && (
        <p className="mt-8 leading-relaxed wrap-break-word whitespace-pre-wrap">
          {submission.message}
        </p>
      )}

      {submission.delivery === "failed" && (
        <div className="mt-8 grid justify-items-start gap-3">
          {submission.deliveryError && (
            // SMTP errors are long unbroken tokens; break them anywhere.
            <p className="min-w-0 text-sm text-destructive wrap-anywhere">
              {adminSubmission.fields.delivery}: {submission.deliveryError}
            </p>
          )}
          <RetryDelivery id={submission.id} />
        </div>
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
