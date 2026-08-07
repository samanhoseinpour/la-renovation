"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { PasswordStrength } from "@/components/admin/password-strength";
import { adminReset } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";
import { emailSchema, passwordSchema } from "@/lib/validation";

/** With a token: the invite/reset landing. Without: request a link. */
export function ResetPasswordForm({ token }: { token?: string }) {
  return token ? <SetPassword token={token} /> : <RequestReset />;
}

function SetPassword({ token }: { token: string }) {
  const [state, setState] = useState<
    "idle" | "pending" | "saved" | "invalid" | "same" | "tooShort"
  >("idle");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse(String(form.get("password") ?? ""));
    if (!parsed.success) {
      setState("tooShort");
      return;
    }
    setState("pending");
    const { error } = await authClient.resetPassword({
      newPassword: parsed.data,
      token,
    });
    if (error) {
      // The same-password guard rejects without consuming the token, so the
      // form stays usable; anything else means the link itself is dead.
      setState(error.code === "PASSWORD_UNCHANGED" ? "same" : "invalid");
      return;
    }
    setState("saved");
  }

  return (
    <div>
      <h1 className="text-h2">{adminReset.setTitle}</h1>
      <p aria-live="polite" className="mt-4 text-muted-foreground">
        {state === "saved" ? adminReset.saved : adminReset.setLead}
      </p>
      {state === "saved" ? (
        <div className="mt-10">
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: "brand", size: "xl" }),
              "w-full",
            )}
          >
            {adminReset.savedCta}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-10 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="reset-password">{adminReset.passwordLabel}</Label>
              <PasswordInput
                id="reset-password"
                name="password"
                required
                autoFocus
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                className="h-11"
                aria-invalid={
                  state === "same" || state === "tooShort" || undefined
                }
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordStrength password={password} />
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            <p aria-live="polite" className="min-h-5 text-sm text-destructive">
              {state === "invalid"
                ? adminReset.invalid
                : state === "same"
                  ? adminReset.samePassword
                  : state === "tooShort"
                    ? adminReset.tooShort
                    : null}
            </p>
            <Button
              type="submit"
              variant="brand"
              size="xl"
              className="w-full"
              disabled={state === "pending"}
            >
              {state === "pending" ? adminReset.submitting : adminReset.submit}
            </Button>
            {state === "invalid" && (
              // Same route without the token renders the request form.
              <Link
                href="/admin/reset-password"
                className="text-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {adminReset.invalidCta}
              </Link>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function RequestReset() {
  const [state, setState] = useState<
    "idle" | "pending" | "sent" | "failed" | "invalidEmail"
  >("idle");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = emailSchema.safeParse(String(form.get("email") ?? ""));
    if (!parsed.success) {
      setState("invalidEmail");
      return;
    }
    setState("pending");
    // Success copy is the same whether the account exists (no enumeration);
    // only a transport-level failure surfaces, so the form stays usable.
    const { error } = await authClient.requestPasswordReset({
      email: parsed.data,
      redirectTo: "/admin/reset-password",
    });
    setState(error ? "failed" : "sent");
  }

  return (
    <div>
      <h1 className="text-h2">{adminReset.requestTitle}</h1>
      <p aria-live="polite" className="mt-4 text-muted-foreground">
        {state === "sent" ? adminReset.requestSent : adminReset.requestLead}
      </p>
      {state === "sent" ? (
        <div className="mt-10">
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: "brand", size: "xl" }),
              "w-full",
            )}
          >
            {adminReset.backToLogin}
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mt-10 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="reset-email">{adminReset.emailLabel}</Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  className="h-11"
                  aria-invalid={state === "invalidEmail" || undefined}
                />
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              <p
                aria-live="polite"
                className="min-h-5 text-sm text-destructive"
              >
                {state === "failed"
                  ? adminReset.requestError
                  : state === "invalidEmail"
                    ? adminReset.emailInvalid
                    : null}
              </p>
              <Button
                type="submit"
                variant="brand"
                size="xl"
                className="w-full"
                disabled={state === "pending"}
              >
                {state === "pending"
                  ? adminReset.requestSubmitting
                  : adminReset.requestSubmit}
              </Button>
            </div>
          </form>
          <Link
            href="/admin/login"
            className="mt-8 block text-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {adminReset.backToLogin}
          </Link>
        </>
      )}
    </div>
  );
}
