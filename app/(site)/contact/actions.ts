"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { DatabaseNotConfiguredError } from "@/lib/db";
import { DeliveryNotConfiguredError, deliverEnquiry } from "@/lib/delivery";
import {
  consumeRateLimit,
  hashClientIp,
  insertSubmission,
  markDelivered,
  markDeliveryFailed,
} from "@/lib/db/submissions";
import { site } from "@/lib/site";

const FIELDS = [
  "name",
  "email",
  "phone",
  "company",
  "service",
  "stage",
  "message",
] as const;

export type ContactField = (typeof FIELDS)[number];

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back so a failed submission never wipes what was typed. */
  values?: Partial<Record<ContactField, string>>;
};

// NOTE: a "use server" module may only export async functions, so the initial
// state lives with the form component rather than here.

// Every single-line field is printed as a labeled line of the notification
// email, and name also feeds its subject; interior control characters would
// let a hand-rolled POST forge extra lines there, so they collapse to spaces.
// The message keeps its newlines — it is the one intentionally multiline field.
const singleLine = (value: string) =>
  value.replace(/[\p{Cc}\u2028\u2029]+/gu, " ").trim();

const schema = z.object({
  // name feeds the delivery subject line and email becomes a mail header, so
  // both are bounded here where the failure is actionable — an oversized value
  // reaching Resend would surface as the generic delivery error instead.
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(200, "That name looks too long.")
    .transform(singleLine),
  email: z
    .string()
    .trim()
    .min(1, "We need an email to reply to.")
    .max(254, "That email looks too long.")
    .email("That email looks wrong."),
  phone: z
    .string()
    .trim()
    .max(40, "That number looks too long.")
    .transform(singleLine)
    .optional(),
  company: z
    .string()
    .trim()
    .max(200, "That company name looks too long.")
    .transform(singleLine)
    .optional(),
  // The selects can't produce an over-long value, but a hand-rolled POST can,
  // and every field error has to be renderable somewhere — see the messages
  // under both selects in contact-office.tsx.
  service: z
    .string()
    .trim()
    .max(80, "Please choose a project type from the list.")
    .transform(singleLine)
    .optional(),
  stage: z
    .string()
    .trim()
    .max(40, "Please choose a project stage from the list.")
    .transform(singleLine)
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two about the project, please.")
    .max(5000, "That's a bit long for a first message. The key points will do."),
});

const SUCCESS: ContactState = {
  status: "success",
  message: "Thank you. We'll be in touch within two working days.",
};

/**
 * Key for the limiter above. Never the *first* x-forwarded-for entry: that end
 * of the list is whatever the caller sent, so a script bypasses its own limit by
 * rotating one header. The platform's own value is x-real-ip; the fallback takes
 * the last forwarded-for hop, which is the one the closest proxy appended.
 */
function clientIp(headerList: Headers): string {
  const real = headerList.get("x-real-ip")?.trim();
  if (real) return real;
  const hops = headerList.get("x-forwarded-for")?.split(",") ?? [];
  return hops[hops.length - 1]?.trim() || "unknown";
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = Object.fromEntries(
    FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as Record<ContactField, string>;

  // Honeypot: the display:none "form_hint" field (a name no browser autofill
  // heuristic classifies — never a real token like "company"). Bots that fill
  // it get a success screen and nothing to iterate against.
  if (String(formData.get("form_hint") ?? "") !== "") {
    return SUCCESS;
  }

  // Minimum-fill trap: JS sets form_ts to elapsed ms since mount, measured
  // with performance.now() so nothing stale is baked into the statically
  // cached page. Under three seconds is bot pace for a seven-field form.
  // An absent or malformed value must pass — the form works without JS and
  // a human is never rejected for a field that does not exist.
  const pace = String(formData.get("form_ts") ?? "");
  if (/^\d+$/.test(pace) && Number(pace) < 3_000) {
    return SUCCESS;
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const field of FIELDS) {
      const first = flat[field]?.[0];
      if (first) fieldErrors[field] = first;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  const ip = clientIp(await headers());
  try {
    if ((await consumeRateLimit(hashClientIp(ip))) === "limited") {
      return {
        status: "error",
        message: `That's a few messages in a row. Email us at ${site.contact.email} instead.`,
        values,
      };
    }
  } catch (error) {
    // Fail open: the honeypot and time trap still stand, and a lead-gen
    // form must never bounce a customer because the limiter's storage is
    // down or unconfigured.
    console.warn("[contact] Rate limit unavailable:", error);
  }

  // Store first, send second: once the row exists the enquiry is safe and
  // visible in the admin inbox, so a delivery failure downgrades to a
  // delivery-status note instead of a lost lead.
  let submissionId: string | undefined;
  try {
    submissionId = await insertSubmission(parsed.data);
  } catch (error) {
    // Email-only degradation is reserved for a missing DATABASE_URL. Any
    // other insert failure is an outage: bounce with the values intact
    // rather than let a lead silently skip the system of record.
    if (!(error instanceof DatabaseNotConfiguredError)) {
      console.error("[contact] Submission not stored:", error);
      return {
        status: "error",
        message: `Something went wrong on our side. Email us at ${site.contact.email} and we'll pick it up there.`,
        values,
      };
    }
    console.warn("[contact] Submission not stored:", error);
  }

  try {
    await deliverEnquiry({
      ...parsed.data,
      to: site.contact.email,
      submissionId,
    });
  } catch (error) {
    if (submissionId) {
      const reason =
        error instanceof DeliveryNotConfiguredError
          ? "Email delivery is not configured."
          : error instanceof Error
            ? error.message
            : String(error);
      console.error("[contact] Delivery failed after store:", error);
      await markDeliveryFailed(submissionId, reason).catch((updateError) =>
        console.error(
          "[contact] Could not record the delivery failure:",
          updateError,
        ),
      );
      return SUCCESS;
    }
    if (error instanceof DeliveryNotConfiguredError) {
      return {
        status: "error",
        message: `The form isn't connected up yet. Email us directly at ${site.contact.email}.`,
        values,
      };
    }
    console.error("[contact] Delivery failed:", error);
    return {
      status: "error",
      message: `Something went wrong on our side. Email us at ${site.contact.email} and we'll pick it up there.`,
      values,
    };
  }

  if (submissionId) {
    await markDelivered(submissionId).catch((error) =>
      console.error("[contact] Could not record the delivery:", error),
    );
  }

  return SUCCESS;
}
