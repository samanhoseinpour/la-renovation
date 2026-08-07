import type { Metadata } from "next";
import { z } from "zod";

import { AuthShell } from "@/components/admin/auth-shell";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { firstParam } from "@/lib/validation";

export const metadata: Metadata = { title: "Reset password" };

// No max cap on purpose: an over-long garbage token still renders the set
// form and fails server-side into the honest expired-link state, instead of
// silently swapping to the request form.
const tokenSchema = firstParam(z.string().min(1)).optional().catch(undefined);

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const token = tokenSchema.parse((await searchParams).token);
  return (
    <AuthShell>
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
