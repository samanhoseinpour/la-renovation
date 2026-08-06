"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-guard";
import {
  bulkDeleteSubmissions,
  bulkSetSubmissionStatus,
  deleteSubmission as deleteSubmissionRow,
  getSubmission,
  markDelivered,
  markDeliveryFailed,
  setSubmissionStatus as setSubmissionStatusRow,
} from "@/lib/db/submissions";
import { DeliveryNotConfiguredError, deliverEnquiry } from "@/lib/delivery";
import { site } from "@/lib/site";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["new", "read", "archived"]);
// The selection UI can only produce a page's worth of ids; 100 leaves slack.
const idsSchema = z.array(z.string().uuid()).min(1).max(100);

// Server actions are plain POST endpoints: every one re-verifies the
// session first (house rule; see lib/admin-guard.ts).

function revalidateInbox(id?: string) {
  revalidatePath("/admin/submissions");
  // The overview's tiles and latest list read the same rows.
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/submissions/${id}`);
  else revalidatePath("/admin/submissions/[id]", "page");
}

export async function setSubmissionStatus(
  id: string,
  status: z.infer<typeof statusSchema>,
): Promise<void> {
  await requireAdmin();
  const parsed = idSchema.parse(id);
  await setSubmissionStatusRow(parsed, statusSchema.parse(status));
  revalidateInbox(parsed);
}

export async function deleteSubmission(id: string): Promise<void> {
  await requireAdmin();
  await deleteSubmissionRow(idSchema.parse(id));
  revalidateInbox();
}

export async function bulkSetStatus(
  ids: string[],
  status: z.infer<typeof statusSchema>,
): Promise<void> {
  await requireAdmin();
  await bulkSetSubmissionStatus(
    idsSchema.parse(ids),
    statusSchema.parse(status),
  );
  revalidateInbox();
}

export async function bulkDelete(ids: string[]): Promise<void> {
  await requireAdmin();
  await bulkDeleteSubmissions(idsSchema.parse(ids));
  revalidateInbox();
}

export async function retryDelivery(id: string): Promise<void> {
  await requireAdmin();
  const submission = await getSubmission(idSchema.parse(id));
  // Only failed sends retry; a stale button after success lands here too.
  if (!submission || submission.delivery !== "failed") {
    throw new Error("Not retryable.");
  }
  try {
    await deliverEnquiry({
      name: submission.name,
      email: submission.email,
      phone: submission.phone ?? undefined,
      company: submission.company ?? undefined,
      service: submission.service ?? undefined,
      stage: submission.stage ?? undefined,
      message: submission.message,
      to: site.contact.email,
      submissionId: submission.id,
    });
  } catch (error) {
    const reason =
      error instanceof DeliveryNotConfiguredError
        ? "Email delivery is not configured."
        : error instanceof Error
          ? error.message
          : String(error);
    await markDeliveryFailed(submission.id, reason);
    revalidateInbox(submission.id);
    throw new Error("Delivery failed.");
  }
  await markDelivered(submission.id);
  revalidateInbox(submission.id);
}
