"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatRelative } from "@/components/admin/dates";
import { requireAdmin } from "@/lib/admin-guard";
import {
  bulkDeleteSubmissions,
  bulkSetSubmissionStatus,
  deleteSubmission as deleteSubmissionRow,
  getSubmission,
  listSubmissionsPage,
  markDelivered,
  markDeliveryFailed,
  setSubmissionStatus as setSubmissionStatusRow,
} from "@/lib/db/submissions";
import { DeliveryNotConfiguredError, deliverEnquiry } from "@/lib/delivery";
import { site } from "@/lib/site";
import {
  submissionStatusSchema,
  uuidListSchema,
  uuidSchema,
} from "@/lib/validation";

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
  status: z.infer<typeof submissionStatusSchema>,
): Promise<void> {
  await requireAdmin();
  const parsed = uuidSchema.parse(id);
  await setSubmissionStatusRow(parsed, submissionStatusSchema.parse(status));
  revalidateInbox(parsed);
}

export async function deleteSubmission(id: string): Promise<void> {
  await requireAdmin();
  await deleteSubmissionRow(uuidSchema.parse(id));
  revalidateInbox();
}

export async function bulkSetStatus(
  ids: string[],
  status: z.infer<typeof submissionStatusSchema>,
): Promise<void> {
  await requireAdmin();
  await bulkSetSubmissionStatus(
    uuidListSchema.parse(ids),
    submissionStatusSchema.parse(status),
  );
  revalidateInbox();
}

export async function bulkDelete(ids: string[]): Promise<void> {
  await requireAdmin();
  await bulkDeleteSubmissions(uuidListSchema.parse(ids));
  revalidateInbox();
}

/** Top matches for the command palette; same cleaning as the inbox page. */
export async function searchSubmissionsForPalette(
  q: string,
): Promise<
  { id: string; name: string; company: string | null; when: string }[]
> {
  await requireAdmin();
  const cleaned = z
    .string()
    .parse(q)
    .replace(/\p{Cc}/gu, "")
    .trim()
    .slice(0, 200);
  if (!cleaned) return [];
  const page = await listSubmissionsPage({
    filter: "all",
    q: cleaned,
    limit: 5,
  });
  return page.items.map((item) => ({
    id: item.id,
    name: item.name,
    company: item.company,
    when: formatRelative(item.createdAt),
  }));
}

export async function retryDelivery(id: string): Promise<void> {
  await requireAdmin();
  const submission = await getSubmission(uuidSchema.parse(id));
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
      services: submission.services ?? undefined,
      stage: submission.stage ?? undefined,
      message: submission.message ?? undefined,
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
