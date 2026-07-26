export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No email provider is configured.");
    this.name = "DeliveryNotConfiguredError";
  }
}

export type Enquiry = {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  /** Studio inbox the enquiry is sent to. */
  to: string;
};

/**
 * Sends a contact enquiry to the studio inbox.
 *
 * The provider is provisioned through the Vercel Marketplace (Resend);
 * connecting it puts RESEND_API_KEY in the environment. Until that key
 * exists this throws DeliveryNotConfiguredError and the contact action
 * shows an honest "email us directly" error — never a fake success.
 *
 * Plain fetch rather than the provider SDK: one endpoint doesn't justify a
 * dependency, and swapping providers means swapping only this function.
 */
export async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new DeliveryNotConfiguredError();

  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.service ? `Project type: ${enquiry.service}` : null,
    enquiry.budget ? `Budget: ${enquiry.budget}` : null,
    "",
    enquiry.message,
  ].filter((line): line is string => line !== null);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // onboarding@resend.dev needs no verified domain but will only deliver to
      // the Resend account owner's own address — anything else 403s. It is a
      // smoke-test sender, not a fallback: going live means verifying the studio
      // domain and setting CONTACT_FROM_EMAIL, or enquiries land in the generic
      // "something went wrong" branch with a perfectly valid API key.
      from:
        process.env.CONTACT_FROM_EMAIL ??
        "LA Renovation <onboarding@resend.dev>",
      to: [enquiry.to],
      reply_to: enquiry.email,
      subject: `Enquiry from ${enquiry.name}`,
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Delivery failed: ${response.status} ${await response.text()}`);
  }
}
