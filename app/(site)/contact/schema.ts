import { z } from "zod";

/**
 * Shared by the client preflight in contact-office.tsx and the server action
 * in actions.ts, so the echoed values and the parsed input can never drift.
 * A plain module on purpose: a "use server" file may only export async
 * functions, and the client needs the schema and reader too.
 *
 * The services element check here is shape-only: the chips cannot produce an
 * unknown title, and keeping content/services.ts out of this module keeps it
 * out of the client chunk. The action extends the field with the real title
 * enum so a crafted POST cannot store arbitrary strings.
 */

export const CONTACT_FIELDS = [
  "name",
  "email",
  "phone",
  "company",
  "services",
  "stage",
  "message",
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export type ContactValues = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  services?: string[];
  stage?: string;
  message?: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back so a failed submission never wipes what was typed. */
  values?: ContactValues;
};

// Every single-line field is printed as a labeled line of the notification
// email, and name also feeds its subject; interior control characters would
// let a hand-rolled POST forge extra lines there, so they collapse to spaces.
// The message keeps its newlines — it is the one intentionally multiline field.
const singleLine = (value: string) =>
  value.replace(/[\p{Cc}\u2028\u2029]+/gu, " ").trim();

export const contactSchema = z.object({
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
  // The chips can only produce known titles, but a hand-rolled POST can send
  // anything; the caps mirror the services column (varchar(80)[], max 8 in
  // zod only) and the action's enum extension rejects unknown values.
  services: z
    .array(
      z
        .string()
        .trim()
        .max(80, "Please pick project types from the list.")
        .transform(singleLine),
    )
    .max(8, "Please pick project types from the list.")
    .transform((list) => [...new Set(list.filter(Boolean))])
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
    .max(5000, "That's a bit long for a first message. The key points will do.")
    .transform((value) => value || undefined)
    .optional(),
});

/**
 * One FormData reader for both sides. form_hint and form_ts are deliberately
 * not read here: the spam checks in the action run before the parse and stay
 * outside the schema.
 */
export function readContactForm(formData: FormData): ContactValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    services: formData
      .getAll("services")
      .filter((entry): entry is string => typeof entry === "string"),
    stage: String(formData.get("stage") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };
}
