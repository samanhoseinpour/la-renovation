"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { projectTypeFallback } from "@/content/office";
import { getAllServices } from "@/content/services";
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
import {
  CONTACT_FIELDS,
  contactSchema,
  readContactForm,
  type ContactState,
} from "./schema";

// z.enum needs a non-empty tuple: the canonical division titles plus the
// fallback, assembled once at module load (the trailing fallback guarantees
// the non-empty part).
const serviceOptions = [
  ...getAllServices().map((service) => service.title),
  projectTypeFallback,
];

// The shared schema stays shape-only so content/services.ts never enters the
// client chunk; the title enum lands here, where a crafted POST is the
// audience — the chips cannot produce an unknown value.
const serverContactSchema = contactSchema.extend({
  services: z
    .array(
      z.enum(serviceOptions as [string, ...string[]], {
        errorMap: () => ({ message: "Please pick project types from the list." }),
      }),
    )
    .max(8, "Please pick project types from the list.")
    .transform((list) => [...new Set(list)])
    .optional(),
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
  const values = readContactForm(formData);

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

  const parsed = serverContactSchema.safeParse(values);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const field of CONTACT_FIELDS) {
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
