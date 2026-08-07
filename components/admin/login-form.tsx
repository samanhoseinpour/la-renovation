"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { adminLogin } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  // Which surface failed, not a message: the slot maps it to copy, and the
  // generic credentials error flags both fields (no user enumeration).
  const [error, setError] = useState<"credentials" | "passkey" | null>(null);
  const [pending, setPending] = useState(false);

  // Conditional UI: the browser offers saved passkeys inside the email
  // field's autofill (autoComplete="username webauthn"). Fire and forget;
  // unsupported browsers skip it.
  useEffect(() => {
    if (!window.PublicKeyCredential?.isConditionalMediationAvailable) return;
    let cancelled = false;
    void window.PublicKeyCredential.isConditionalMediationAvailable().then(
      (available) => {
        if (!available || cancelled) return;
        void authClient.signIn.passkey(
          { autoFill: true },
          { onSuccess: () => router.push("/admin/submissions") },
        );
      },
    );
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setPending(true);
    const { error: signInError } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setPending(false);
    if (signInError) {
      setError("credentials");
      return;
    }
    router.push("/admin/submissions");
  }

  async function handlePasskey() {
    setError(null);
    const result = await authClient.signIn.passkey();
    if (result?.error) {
      setError("passkey");
      return;
    }
    router.push("/admin/submissions");
  }

  return (
    <div>
      <h1 className="text-h2">{adminLogin.title}</h1>
      <p className="mt-4 text-muted-foreground">{adminLogin.lead}</p>
      <form onSubmit={handleSubmit}>
        <div className="mt-10 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="login-email">{adminLogin.emailLabel}</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="username webauthn"
              className="h-11"
              aria-invalid={error === "credentials" || undefined}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">{adminLogin.passwordLabel}</Label>
            <PasswordInput
              id="login-password"
              name="password"
              required
              autoComplete="current-password"
              className="h-11"
              aria-invalid={error === "credentials" || undefined}
            />
          </div>
        </div>
        <div className="mt-8 grid gap-4">
          {/* min-h reserves the line so an appearing error shifts nothing,
              the strength meter's trick. */}
          <p aria-live="polite" className="min-h-5 text-sm text-destructive">
            {error === "credentials"
              ? adminLogin.error
              : error === "passkey"
                ? adminLogin.passkeyError
                : null}
          </p>
          <Button
            type="submit"
            variant="brand"
            size="xl"
            className="w-full"
            disabled={pending}
          >
            {pending ? adminLogin.submitting : adminLogin.submit}
            <ArrowRight data-icon="inline-end" />
          </Button>
          <div aria-hidden className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              {adminLogin.or}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full"
            onClick={handlePasskey}
          >
            <KeyRound data-icon="inline-start" />
            {adminLogin.passkey}
          </Button>
        </div>
      </form>
      <Link
        href="/admin/reset-password"
        className="mt-8 block text-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        {adminLogin.forgot}
      </Link>
    </div>
  );
}
