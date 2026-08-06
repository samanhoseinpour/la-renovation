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
import { adminReset } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/** With a token: the invite/reset landing. Without: request a link. */
export function ResetPasswordForm({ token }: { token?: string }) {
  return token ? <SetPassword token={token} /> : <RequestReset />;
}

function SetPassword({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "pending" | "saved" | "invalid">(
    "idle",
  );

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("pending");
    const { error } = await authClient.resetPassword({
      newPassword: String(form.get("password") ?? ""),
      token,
    });
    setState(error ? "invalid" : "saved");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
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
              <Input
                id="reset-password"
                name="password"
                type="password"
                required
                minLength={12}
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              disabled={state === "pending"}
            >
              {state === "pending" ? adminReset.submitting : adminReset.submit}
            </Button>
            <p aria-live="polite" className="text-sm text-destructive">
              {state === "invalid" ? adminReset.invalid : null}
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
    <Card className="w-full max-w-sm">
      <CardHeader>
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
