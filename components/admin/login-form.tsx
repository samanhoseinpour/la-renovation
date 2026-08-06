"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
      // One generic message: no user enumeration.
      setError(adminLogin.error);
      return;
    }
    router.push("/admin/submissions");
  }

  async function handlePasskey() {
    setError(null);
    const result = await authClient.signIn.passkey();
    if (result?.error) {
      setError(adminLogin.passkeyError);
      return;
    }
    router.push("/admin/submissions");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-h3">{adminLogin.title}</CardTitle>
        <CardDescription>{adminLogin.lead}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email">{adminLogin.emailLabel}</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="username webauthn"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">{adminLogin.passwordLabel}</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="brand" disabled={pending}>
            {pending ? adminLogin.submitting : adminLogin.submit}
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button type="button" variant="outline" onClick={handlePasskey}>
            <KeyRound data-icon="inline-start" />
            {adminLogin.passkey}
          </Button>
          <p aria-live="polite" className="text-sm text-destructive">
            {error}
          </p>
          <Link
            href="/admin/reset-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {adminLogin.forgot}
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
