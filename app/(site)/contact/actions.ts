"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { DeliveryNotConfiguredError, deliverEnquiry } from "@/lib/delivery";
import { site } from "@/lib/site";

const FIELDS = [
  "name",
  "email",
  "phone",
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

const schema = z.object({
  // name feeds the delivery subject line and email becomes a mail header, so
  // both are bounded here where the failure is actionable — an oversized value
  // reaching Resend would surface as the generic delivery error instead.
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(200, "That name looks too long."),
  email: z
    .string()
    .trim()
    .min(1, "We need an email to reply to.")
    .max(254, "That email looks too long.")
    .email("That email looks wrong."),
  phone: z.string().trim().max(40, "That number looks too long.").optional(),
  // The selects can't produce an over-long value, but a hand-rolled POST can,
  // and every field error has to be renderable somewhere — see the messages
  // under both selects in contact-studio.tsx.
  service: z
    .string()
    .trim()
    .max(80, "Please choose a project type from the list.")
    .optional(),
  stage: z
    .string()
    .trim()
    .max(40, "Please choose a project stage from the list.")
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

// Best-effort, per-instance limit: enough to blunt a naive script without a
// shared store. Real abuse would need edge rate limiting in front of this.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map<string, number[]>();

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
  const now = Date.now();
  // Sweep expired windows for every IP, not just the submitting one — keys
  // for addresses that never return would otherwise persist for the instance
  // lifetime.
  for (const [key, times] of recentByIp) {
    if (times.every((t) => now - t >= WINDOW_MS)) recentByIp.delete(key);
  }
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    // Store the pruned list even on the reject path, or the stale one is
    // re-filtered on every further attempt and the window never slides.
    recentByIp.set(ip, recent);
    return {
      status: "error",
      message: `That's a few messages in a row. Email us at ${site.contact.email} instead.`,
      values,
    };
  }
  recent.push(now);
  recentByIp.set(ip, recent);

  try {
    await deliverEnquiry({ ...parsed.data, to: site.contact.email });
  } catch (error) {
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

  return SUCCESS;
}
