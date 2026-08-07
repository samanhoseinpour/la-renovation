import type { Metadata } from "next";

import { AuthShell } from "@/components/admin/auth-shell";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell>
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
