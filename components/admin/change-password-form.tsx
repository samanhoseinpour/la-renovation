"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { PasswordStrength } from "@/components/admin/password-strength";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";

type FormState =
  | "idle"
  | "pending"
  | "saved"
  | "same"
  | "wrongCurrent"
  | "failed";

const FEEDBACK: Partial<Record<FormState, string>> = {
  saved: adminSettings.password.success,
  same: adminSettings.password.errorSame,
  wrongCurrent: adminSettings.password.errorCurrent,
  failed: adminSettings.password.error,
};

export function ChangePasswordForm() {
  const [state, setState] = useState<FormState>("idle");
  const [next, setNext] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("current") ?? "");
    const newPassword = String(data.get("next") ?? "");
    // Cheap local check first; the server hook enforces the same rule.
    if (currentPassword === newPassword) {
      setState("same");
      return;
    }
    setState("pending");
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      setState(
        error.code === "PASSWORD_UNCHANGED"
          ? "same"
          : error.code === "INVALID_PASSWORD"
            ? "wrongCurrent"
            : "failed",
      );
      return;
    }
    form.reset();
    setNext("");
    setState("saved");
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password-current">
          {adminSettings.password.currentLabel}
        </Label>
        <PasswordInput
          id="password-current"
          name="current"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-next">{adminSettings.password.newLabel}</Label>
        <PasswordInput
          id="password-next"
          name="next"
          required
          minLength={MIN_PASSWORD_LENGTH}
          autoComplete="new-password"
          onChange={(event) => setNext(event.target.value)}
        />
      </div>
      <PasswordStrength password={next} />
      <Button type="submit" variant="brand" disabled={state === "pending"}>
        {state === "pending"
          ? adminSettings.password.submitting
          : adminSettings.password.submit}
      </Button>
      <p
        aria-live="polite"
        className={cn(
          "text-sm",
          state === "saved" ? "text-muted-foreground" : "text-destructive",
        )}
      >
        {FEEDBACK[state] ?? null}
      </p>
    </form>
  );
}
