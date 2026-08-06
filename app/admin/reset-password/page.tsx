import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <ResetPasswordForm token={token} />
    </main>
  );
}
