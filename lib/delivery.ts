import { site } from "./site";

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No email provider is configured.");
    this.name = "DeliveryNotConfiguredError";
  }
}

type OutgoingEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

/**
 * Shared Resend transport for enquiries and auth email.
 *
 * The provider is provisioned through the Vercel Marketplace (Resend);
 * connecting it puts RESEND_API_KEY in the environment. Until that key
 * exists this throws DeliveryNotConfiguredError and callers show an honest
 * error state — never a fake success.
 *
 * Plain fetch rather than the provider SDK: one endpoint doesn't justify a
 * dependency, and swapping providers means swapping only this function.
 */
async function sendEmail(message: OutgoingEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new DeliveryNotConfiguredError();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // onboarding@resend.dev needs no verified domain but will only deliver
      // to the Resend account owner's own address — anything else 403s. It is
      // a smoke-test sender, not a fallback: going live means verifying the
      // office domain and setting CONTACT_FROM_EMAIL, or sends land in the
      // generic "something went wrong" branch with a perfectly valid API key.
      from:
        process.env.CONTACT_FROM_EMAIL ??
        "Araz Construction Group <onboarding@resend.dev>",
      to: [message.to],
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Delivery failed: ${response.status} ${await response.text()}`,
    );
  }
}

export type Enquiry = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  stage?: string;
  message: string;
  /** Office inbox the enquiry is sent to. */
  to: string;
  /** Stored row id; optional so the DB-down fallback path still sends. */
  submissionId?: string;
};

/** Sends a contact enquiry to the office inbox. */
export async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.company ? `Company: ${enquiry.company}` : null,
    enquiry.service ? `Project type: ${enquiry.service}` : null,
    enquiry.stage ? `Stage: ${enquiry.stage}` : null,
    "",
    enquiry.message,
  ].filter((line): line is string => line !== null);

  if (enquiry.submissionId) {
    lines.push(
      "",
      `View in the site admin: ${site.url}/admin/submissions/${enquiry.submissionId}`,
    );
  }

  await sendEmail({
    to: enquiry.to,
    replyTo: enquiry.email,
    subject: enquiry.service
      ? `Enquiry from ${enquiry.name} · ${enquiry.service}`
      : `Enquiry from ${enquiry.name}`,
    text: lines.join("\n"),
  });
}

/** Auth email (invites, password resets) on the same transport. */
export async function deliverAuthEmail(message: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  await sendEmail(message);
}
