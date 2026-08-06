"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { PasswordStrength } from "@/components/admin/password-strength";
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
    <Card className="w-full">
      <CardHeader>
        <p className="text-eyebrow text-muted-foreground">
          {adminReset.eyebrow}
        </p>
        <CardTitle className="text-h3">{adminReset.setTitle}</CardTitle>
        <CardDescription aria-live="polite">
          {state === "saved" ? adminReset.saved : adminReset.setLead}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === "saved" ? (
          <Link
            href="/admin/login"
            className={cn(buttonVariants({ variant: "brand" }))}
          >
            {adminReset.savedCta}
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-password">{adminReset.passwordLabel}</Label>
              <PasswordInput
                id="reset-password"
                name="password"
                required
                autoFocus
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <PasswordStrength password={password} />
            <Button
              type="submit"
              variant="brand"
              disabled={state === "pending"}
            >
              {state === "pending" ? adminReset.submitting : adminReset.submit}
            </Button>
            <p aria-live="polite" className="text-sm text-destructive">
              {state === "invalid"
                ? adminReset.invalid
                : state === "same"
                  ? adminReset.samePassword
                  : null}
            </p>
            {state === "invalid" && (
              // Same route without the token renders the request form.
              <Link
                href="/admin/reset-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {adminReset.invalidCta}
              </Link>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function RequestReset() {
  const [state, setState] = useState<"idle" | "pending" | "sent">("idle");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("pending");
    // Same response either way: whether an account exists is not disclosed.
    await authClient.requestPasswordReset({
      email: String(form.get("email") ?? ""),
      redirectTo: "/admin/reset-password",
    });
    setState("sent");
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <p className="text-eyebrow text-muted-foreground">
          {adminReset.eyebrow}
        </p>
        <CardTitle className="text-h3">{adminReset.requestTitle}</CardTitle>
        <CardDescription aria-live="polite">
          {state === "sent" ? adminReset.requestSent : adminReset.requestLead}
        </CardDescription>
      </CardHeader>
      {state !== "sent" && (
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">{adminReset.emailLabel}</Label>
              <Input
                id="reset-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              disabled={state === "pending"}
            >
              {state === "pending"
                ? adminReset.requestSubmitting
                : adminReset.requestSubmit}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
