import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthWordmark } from "@/components/admin/auth-wordmark";
import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  // Belt to proxy.ts's braces: a signed-in admin skips the form even if the
  // proxy's optimistic cookie check was fooled.
  const session = await auth.api.getSession({ headers: await headers() });
  // Mirror requireAdmin's exact condition: a valid session without the admin
  // role must land on the form, not ping-pong against the guard's redirect.
  if (session?.user.role === "admin" && !session.user.banned) {
    redirect("/admin/submissions");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <AuthWordmark />
        <LoginForm />
      </div>
    </main>
  );
}
