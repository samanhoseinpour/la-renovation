"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

// NOTE: a "use server" module may only export async functions, so the initial
// state lives with the form component rather than here.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * NOT WIRED FOR DELIVERY YET.
 *
 * This validates and accepts the submission but does not send anything —
 * there is no email provider configured. Before launch this must either post
 * to a transactional email service or write to a CRM, otherwise enquiries are
 * silently dropped.
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!email) fieldErrors.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "That email looks wrong.";
  if (message.length < 10)
    fieldErrors.message = "A sentence or two about the project, please.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  console.warn(
    "[contact] Submission accepted but NOT delivered — no email provider is configured.",
  );

  return {
    status: "success",
    message: "Thank you — we'll be in touch within two working days.",
  };
}
