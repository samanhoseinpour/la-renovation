"use client";

import { useActionState } from "react";

import type { ContactState } from "@/app/(site)/contact/actions";
import { submitContact } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialContactState: ContactState = { status: "idle" };

/**
 * base-nova inputs already ship `text-base md:text-sm`, which is what stops
 * iOS Safari zooming the viewport on focus — don't override that down to
 * text-sm on mobile.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-xl" noValidate>
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            className="h-11"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-11"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">About the project</Label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Where is the property, what are you hoping to do, and roughly when?"
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
          />
          {fieldErrors.message && (
            <p id="message-error" className="text-sm text-destructive">
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button type="submit" size="xl" disabled={isPending}>
          {isPending ? "Sending…" : "Send enquiry"}
        </Button>

        {/* aria-live so the result is announced without moving focus. */}
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "text-sm text-foreground"
              : "text-sm text-destructive"
          }
        >
          {state.status !== "idle" ? state.message : null}
        </p>
      </div>
    </form>
  );
}
