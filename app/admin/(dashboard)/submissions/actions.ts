"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-guard";
import {
  deleteSubmission as deleteSubmissionRow,
  setSubmissionStatus as setSubmissionStatusRow,
} from "@/lib/db/submissions";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["new", "read", "archived"]);

// Server actions are plain POST endpoints: every one re-verifies the
// session first (house rule; see lib/admin-guard.ts).

export async function setSubmissionStatus(
  id: string,
  status: z.infer<typeof statusSchema>,
): Promise<void> {
  await requireAdmin();
  await setSubmissionStatusRow(idSchema.parse(id), statusSchema.parse(status));
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string): Promise<void> {
  await requireAdmin();
  await deleteSubmissionRow(idSchema.parse(id));
  revalidatePath("/admin/submissions");
}
