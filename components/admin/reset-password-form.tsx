"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { PasswordStrength } from "@/components/admin/password-strength";
import { Reveal } from "@/components/motion/reveal";
import { adminReset } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";

/** With a token: the invite/reset landing. Without: request a link. */
export function ResetPasswordForm({ token }: { token?: string }) {
  return token ? <SetPassword token={token} /> : <RequestReset />;
}

function SetPassword({ token }: { token: string }) {
  const [state, setState] = useState<
    "idle" | "pending" | "saved" | "invalid" | "same"
  >("idle");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("pending");
    const { error } = await authClient.resetPassword({
      newPassword: String(form.get("password") ?? ""),
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
      <Reveal mode="mount">
        <h1 className="text-h2">{adminReset.setTitle}</h1>
        <p aria-live="polite" className="mt-4 text-muted-foreground">
          {state === "saved" ? adminReset.saved : adminReset.setLead}
        </p>
      </Reveal>
      {state === "saved" ? (
        <Reveal mode="mount" className="mt-10">
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: "brand", size: "xl" }),
              "w-full",
            )}
          >
            {adminReset.savedCta}
          </Link>
        </Reveal>
      ) : (
        <form onSubmit={handleSubmit}>
          <Reveal mode="mount" delay={0.08} className="mt-10 grid gap-5">
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
                aria-invalid={state === "same" || undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordStrength password={password} />
            </div>
          </Reveal>
          <Reveal mode="mount" delay={0.16} className="mt-8 grid gap-4">
            <p aria-live="polite" className="min-h-5 text-sm text-destructive">
              {state === "invalid"
                ? adminReset.invalid
                : state === "same"
                  ? adminReset.samePassword
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
          </Reveal>
        </form>
      )}
    </div>
  );
}

function RequestReset() {
  const [state, setState] = useState<"idle" | "pending" | "sent" | "failed">(
    "idle",
  );

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("pending");
    // Success copy is the same whether the account exists (no enumeration);
    // only a transport-level failure surfaces, so the form stays usable.
    const { error } = await authClient.requestPasswordReset({
      email: String(form.get("email") ?? ""),
      redirectTo: "/admin/reset-password",
    });
    setState(error ? "failed" : "sent");
  }

  return (
    <div>
      <Reveal mode="mount">
        <h1 className="text-h2">{adminReset.requestTitle}</h1>
        <p aria-live="polite" className="mt-4 text-muted-foreground">
          {state === "sent" ? adminReset.requestSent : adminReset.requestLead}
        </p>
      </Reveal>
      {state === "sent" ? (
        <Reveal mode="mount" className="mt-10">
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: "brand", size: "xl" }),
              "w-full",
            )}
          >
            {adminReset.backToLogin}
          </Link>
        </Reveal>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Reveal mode="mount" delay={0.08} className="mt-10 grid gap-5">
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
                />
              </div>
            </Reveal>
            <Reveal mode="mount" delay={0.16} className="mt-8 grid gap-4">
              <p
                aria-live="polite"
                className="min-h-5 text-sm text-destructive"
              >
                {state === "failed" ? adminReset.requestError : null}
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
            </Reveal>
          </form>
          <Reveal mode="mount" delay={0.16}>
            <Link
              href="/admin/login"
              className="mt-8 block text-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {adminReset.backToLogin}
            </Link>
          </Reveal>
        </>
      )}
    </div>
  );
}
