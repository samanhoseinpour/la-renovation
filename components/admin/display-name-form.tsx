"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { NAME_MAX_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";
import { displayNameSchema } from "@/lib/validation";

type FormState = "idle" | "pending" | "saved" | "invalid" | "failed";

const FEEDBACK: Partial<Record<FormState, string>> = {
  saved: adminSettings.profile.success,
  invalid: adminSettings.profile.errorInvalid,
  failed: adminSettings.profile.error,
};

export function DisplayNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState(initialName);

  const trimmed = name.trim();
  const unchanged = trimmed === initialName;

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // The schema mirrors the server hook's rule (trim, 1 to 80); unchanged
    // stays a silent no-op like the disabled button implies.
    const parsed = displayNameSchema.safeParse(name);
    if (!parsed.success) {
      setState("invalid");
      return;
    }
    if (parsed.data === initialName) return;
    setState("pending");
    const { error } = await authClient.updateUser({ name: parsed.data });
    if (error) {
      setState(error.code === "INVALID_NAME" ? "invalid" : "failed");
      return;
    }
    setName(parsed.data);
    setState("saved");
    // The response already rewrote the session cookie, so the refresh
    // re-renders the layout and this page with the new name immediately.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="profile-name">{adminSettings.profile.nameLabel}</Label>
        <Input
          id="profile-name"
          name="name"
          required
          maxLength={NAME_MAX_LENGTH}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <Button
        type="submit"
        variant="brand"
        disabled={state === "pending" || !trimmed || unchanged}
      >
        {state === "pending"
          ? adminSettings.profile.submitting
          : adminSettings.profile.submit}
      </Button>
      <p
        aria-live="polite"
        // min-h-5 reserves the line so feedback never shifts the card.
        className={cn(
          "min-h-5 text-sm",
          state === "saved" ? "text-muted-foreground" : "text-destructive",
        )}
      >
        {FEEDBACK[state] ?? null}
      </p>
    </form>
  );
}
