import type { Metadata } from "next";

import { AuthWordmark } from "@/components/admin/auth-wordmark";
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
      <div className="w-full max-w-sm">
        <AuthWordmark />
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
