"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const [state, setState] = useState<"idle" | "pending" | "saved" | "failed">(
    "idle",
  );

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("pending");
    const { error } = await authClient.changePassword({
      currentPassword: String(data.get("current") ?? ""),
      newPassword: String(data.get("next") ?? ""),
      revokeOtherSessions: true,
    });
    if (error) {
      setState("failed");
      return;
    }
    form.reset();
    setState("saved");
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password-current">
          {adminSettings.password.currentLabel}
        </Label>
        <Input
          id="password-current"
          name="current"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-next">{adminSettings.password.newLabel}</Label>
        <Input
          id="password-next"
          name="next"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" variant="brand" disabled={state === "pending"}>
        {state === "pending"
          ? adminSettings.password.submitting
          : adminSettings.password.submit}
      </Button>
      <p
        aria-live="polite"
        className={cn(
          "text-sm",
          state === "failed" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {state === "saved"
          ? adminSettings.password.success
          : state === "failed"
            ? adminSettings.password.error
            : null}
      </p>
    </form>
  );
}
