"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitContact } from "@/app/(site)/contact/actions";
import {
  CONTACT_FIELDS,
  contactSchema,
  readContactForm,
  type ContactField,
  type ContactState,
} from "@/app/(site)/contact/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormCopy, ContactPageCopy } from "@/content/office";
import { site } from "@/lib/site";

const initialContactState: ContactState = { status: "idle" };

// Checkbox- and radio-backed pill. The input is sr-only, so the label wears
// both states: checked = filled brand, focus = the quiet ring treatment via
// has-focus-visible. py instead of a fixed height lets a long division title
// wrap on a narrow phone rather than overflow the pill.
const chip =
  "inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-sm transition-colors duration-200 ease-editorial select-none pointer-coarse:py-3 hover:border-muted-foreground has-checked:border-brand has-checked:bg-brand has-checked:text-brand-foreground has-focus-visible:border-ring has-focus-visible:ring-1 has-focus-visible:ring-ring";

type ContactOfficeProps = {
  page: ContactPageCopy;
  copy: ContactFormCopy;
  services: { slug: string; title: string }[];
  /** Project-type option for enquiries that don't fit a named service. */
  serviceFallback: string;
  stages: readonly string[];
};

/**
 * Adapted from @shadcnblocks/contact20, since rebuilt: a sticky intro rail
 * (title, lead, office details) beside the form column on lg+, wearing the
 * admin login's field recipe — boxed h-11 inputs with placeholders and
 * reserved min-h-5 error slots so messages never shift the layout. The
 * fields stay grouped under visible labels ("About you" / "The project")
 * with checkbox and radio chips for the selects, and a client preflight
 * runs the same zod schema as the server action — errors appear on submit
 * and clear per field once the visitor fixes them. The form still posts
 * without JavaScript: the action validates everything again and echoes
 * values back so nothing typed is lost. On success the form column swaps
 * for a confirmation panel whose send-another button acknowledges that
 * success state and restores a fresh form.
 */
export function ContactOffice({
  page,
  copy,
  services,
  serviceFallback,
  stages,
}: ContactOfficeProps) {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  // Client preflight errors shadow the server's until the next round trip;
  // null means "nothing client-side yet", so a fresh server echo shows.
  const [clientErrors, setClientErrors] = useState<Partial<
    Record<ContactField, string>
  > | null>(null);
  // useActionState has no reset, so the confirmation panel stays until the
  // visitor dismisses it. Identity comparison works because every action
  // round trip deserializes a fresh state object: `state !== acknowledged`
  // is exactly "a success not yet dismissed", and the next success is a new
  // object that re-shows the panel on its own.
  const [acknowledged, setAcknowledged] = useState<ContactState | null>(null);
  const showSuccess = state.status === "success" && state !== acknowledged;
  const errors = clientErrors ?? state.fieldErrors ?? {};
  const values = state.values ?? {};
  // After a first failed attempt (either side), fields revalidate on blur so
  // red ink clears as it's fixed; before that, typing stays quiet.
  const attempted = clientErrors !== null || Boolean(state.fieldErrors);

  const summaryText =
    state.status === "error" && !state.fieldErrors
      ? state.message
      : Object.keys(errors).length > 0
        ? clientErrors
          ? copy.errorSummary
          : state.message
        : null;

  // Send keyboard and screen-reader users straight to the first problem. On
  // form-level errors (rate limit, delivery down) there is no field to go to,
  // and the disabled pending button has already dropped focus to <body> — put
  // it back on the re-enabled submit; the live region announces the message.
  const submitRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (state.status !== "error") return;
    if (!state.fieldErrors) {
      submitRef.current?.focus();
      return;
    }
    const first = CONTACT_FIELDS.find((field) => state.fieldErrors?.[field]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
  }, [state]);

  // On success the form (and the focused submit button) unmounts, dropping
  // focus to <body>; moving it to the confirmation heading both restores the
  // user's place and makes screen readers announce the outcome — a live
  // region inserted together with its text is not reliably read. Keyed on
  // showSuccess, not state.status: after a dismissal the status stays
  // "success", and only the identity check sees the next submit.
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (showSuccess) successHeadingRef.current?.focus();
  }, [showSuccess]);

  // The fresh form mounts on the render after a dismissal, so focus has to
  // wait for the effect. Each dismissal stores a distinct state object, so
  // a reset after every success re-fires this.
  useEffect(() => {
    if (acknowledged) document.getElementById("contact-name")?.focus();
  }, [acknowledged]);

  // Monotonic mount time for the server action's minimum-fill trap; set in
  // an effect so it is unambiguously the client's clock. A send-another
  // reset keeps the original mark on purpose — elapsed time only grows, so
  // a second enquiry still clears the trap.
  const mountedAt = useRef<number | null>(null);
  const paceRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  // Seed the fresh form once per page load with the chip a division CTA
  // named in ?service=. Ref-guarded rather than dep-driven because a
  // send-another reset must not re-apply anything, and idle-only because a
  // pre-hydration POST mounts with a server echo that already holds the
  // visitor's own choices. The chip values are titles, so the services prop
  // is the slug lookup; an unknown slug falls through silently, and property
  // writes fire no React events, so revalidation stays quiet.
  const formRef = useRef<HTMLFormElement>(null);
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (state.status !== "idle") return;
    const form = formRef.current;
    if (!form) return;

    const slug = new URLSearchParams(window.location.search).get("service");
    const title = services.find((service) => service.slug === slug)?.title;
    if (title) {
      for (const chip of form.querySelectorAll<HTMLInputElement>(
        'input[name="services"]',
      )) {
        if (chip.value === title) chip.checked = true;
      }
    }
  }, [state.status, services]);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (mountedAt.current !== null && paceRef.current) {
      paceRef.current.value = String(
        Math.round(performance.now() - mountedAt.current),
      );
    }
    const parsed = contactSchema.safeParse(
      readContactForm(new FormData(event.currentTarget)),
    );
    if (!parsed.success) {
      event.preventDefault();
      const flat = parsed.error.flatten().fieldErrors;
      const next: Partial<Record<ContactField, string>> = {};
      for (const field of CONTACT_FIELDS) {
        const first = flat[field]?.[0];
        if (first) next[field] = first;
      }
      setClientErrors(next);
      const first = CONTACT_FIELDS.find((field) => next[field]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setClientErrors(null);
  }

  function revalidateField(field: ContactField, form: HTMLFormElement | null) {
    if (!attempted || !form) return;
    const parsed = contactSchema.safeParse(readContactForm(new FormData(form)));
    const message = parsed.success
      ? undefined
      : parsed.error.flatten().fieldErrors[field]?.[0];
    setClientErrors((current) => {
      const next = { ...(current ?? state.fieldErrors ?? {}) };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function handleReset() {
    setClientErrors(null);
    setAcknowledged(state);
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-eyebrow text-muted-foreground">{page.eyebrow}</p>
        <h1 className="mt-6 text-display-2 text-balance">{page.title}</h1>
        <p className="mt-6 text-lead text-muted-foreground">{page.lead}</p>
        <p className="mt-4 text-sm text-muted-foreground">{page.commitment}</p>

        <div className="mt-12 border-t border-border pt-10">
          <h2 className="text-eyebrow text-muted-foreground">
            {page.officeHeading}
          </h2>
          <address className="mt-4 text-base leading-snug font-medium not-italic">
            {site.contact.address.street ? (
              <>
                {site.contact.address.street}
                <br />
              </>
            ) : null}
            {site.contact.address.city ? `${site.contact.address.city}, ` : ""}
            {site.contact.address.state}
            {site.contact.address.zip ? ` ${site.contact.address.zip}` : ""}
          </address>
          <p className="mt-3 text-sm text-muted-foreground">
            {site.contact.hours}
          </p>
          <div className="mt-8 grid justify-items-start gap-3">
            <a
              href={site.contact.phoneHref}
              className="text-eyebrow tabular text-muted-foreground transition-colors duration-200 ease-editorial hover:text-foreground"
            >
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="text-lg font-medium wrap-anywhere underline-offset-4 hover:underline"
            >
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {showSuccess ? (
          <div role="status">
            <p className="text-eyebrow text-muted-foreground">
              {copy.success.eyebrow}
            </p>
            <h2
              ref={successHeadingRef}
              tabIndex={-1}
              className="mt-6 text-h2 text-balance outline-none"
            >
              {state.message}
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              {copy.success.urgentPrefix}{" "}
              <a
                href={site.contact.phoneHref}
                className="tabular underline underline-offset-4"
              >
                {site.contact.phone}
              </a>{" "}
              {copy.success.urgentSuffix}
            </p>
            <div className="mt-10">
              <Button
                type="button"
                variant="outline"
                size="xl"
                onClick={handleReset}
              >
                {copy.success.again}
              </Button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            action={formAction}
            onSubmit={handleSubmit}
            // noValidate: the zod messages under each field are the one error
            // voice; native bubbles would compete with them. The required and
            // type attributes stay for semantics, and a pre-hydration submit
            // round-trips into the server-validated echo.
            noValidate
          >
            <p className="text-muted-foreground">{page.formIntro}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.requiredHint}
            </p>

            {/* Honeypot. display:none (not sr-only): browser autofill fills
                rendered-but-clipped fields, and a real name like "company" is
                an autofill token — an autofilled visitor would get a fake
                success while their enquiry silently dropped. Naive bots fill
                every input regardless of CSS, so this still catches them. */}
            <div hidden>
              <label htmlFor="contact-form-hint">Leave this field empty</label>
              <input
                id="contact-form-hint"
                name="form_hint"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
              <input ref={paceRef} type="hidden" name="form_ts" defaultValue="" />
            </div>

            {/* The permanent min-h-5 error slots under every field are part
                of the vertical rhythm: the gaps below stay small on purpose
                so slot + gap reads as one normal spacing step, not two. */}
            <div className="mt-8 grid gap-4">
              <div>
                <h2 className="text-eyebrow text-muted-foreground">
                  {copy.groups.about.heading}
                </h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  {copy.groups.about.note}
                </p>

                <div className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    {/* gap-1 tucks the asterisk against the label text —
                        Label's own flex gap-2 would push it 8px out — and
                        aria-hidden keeps it silent: the required attribute
                        already announces the state. */}
                    <Label htmlFor="contact-name" className="gap-1">
                      {copy.fields.name.label}
                      <span aria-hidden="true" className="text-brand">
                        *
                      </span>
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder={copy.fields.name.placeholder}
                      defaultValue={values.name}
                      className="h-11"
                      aria-invalid={Boolean(errors.name) || undefined}
                      aria-describedby="contact-name-error"
                      onBlur={(event) =>
                        revalidateField("name", event.currentTarget.form)
                      }
                    />
                    <p
                      id="contact-name-error"
                      className="min-h-5 text-sm text-destructive"
                    >
                      {errors.name}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact-email" className="gap-1">
                      {copy.fields.email.label}
                      <span aria-hidden="true" className="text-brand">
                        *
                      </span>
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={copy.fields.email.placeholder}
                      defaultValue={values.email}
                      className="h-11"
                      aria-invalid={Boolean(errors.email) || undefined}
                      aria-describedby="contact-email-error"
                      onBlur={(event) =>
                        revalidateField("email", event.currentTarget.form)
                      }
                    />
                    <p
                      id="contact-email-error"
                      className="min-h-5 text-sm text-destructive"
                    >
                      {errors.email}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <Label htmlFor="contact-phone">
                        {copy.fields.phone.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {copy.optionalTag}
                      </span>
                    </div>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={copy.fields.phone.placeholder}
                      defaultValue={values.phone}
                      className="h-11"
                      aria-invalid={Boolean(errors.phone) || undefined}
                      aria-describedby="contact-phone-error"
                      onBlur={(event) =>
                        revalidateField("phone", event.currentTarget.form)
                      }
                    />
                    <p
                      id="contact-phone-error"
                      className="min-h-5 text-sm text-destructive"
                    >
                      {errors.phone}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <Label htmlFor="contact-company">
                        {copy.fields.company.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {copy.optionalTag}
                      </span>
                    </div>
                    <Input
                      id="contact-company"
                      name="company"
                      autoComplete="organization"
                      placeholder={copy.fields.company.placeholder}
                      defaultValue={values.company}
                      className="h-11"
                      aria-invalid={Boolean(errors.company) || undefined}
                      aria-describedby="contact-company-error"
                      onBlur={(event) =>
                        revalidateField("company", event.currentTarget.form)
                      }
                    />
                    <p
                      id="contact-company-error"
                      className="min-h-5 text-sm text-destructive"
                    >
                      {errors.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h2 className="text-eyebrow text-muted-foreground">
                  {copy.groups.project.heading}
                </h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  {copy.groups.project.note}
                </p>

                <div className="mt-6 grid gap-4">
                  <fieldset aria-describedby="contact-services-help contact-services-error">
                    <legend className="text-sm font-medium">
                      {copy.fields.services.legend}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {copy.optionalTag}
                      </span>
                    </legend>
                    <p
                      id="contact-services-help"
                      className="mt-2 text-sm text-muted-foreground"
                    >
                      {copy.fields.services.help}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[...services.map((service) => service.title), serviceFallback].map(
                        (title, index) => (
                          <label key={title} className={chip}>
                            <input
                              id={index === 0 ? "contact-services" : undefined}
                              type="checkbox"
                              name="services"
                              value={title}
                              defaultChecked={values.services?.includes(title)}
                              className="sr-only"
                              onChange={(event) =>
                                revalidateField(
                                  "services",
                                  event.currentTarget.form,
                                )
                              }
                            />
                            {title}
                          </label>
                        ),
                      )}
                    </div>
                    <p
                      id="contact-services-error"
                      className="mt-2 min-h-5 text-sm text-destructive"
                    >
                      {errors.services}
                    </p>
                  </fieldset>

                  <fieldset aria-describedby="contact-stage-help contact-stage-error">
                    <legend className="text-sm font-medium">
                      {copy.fields.stage.legend}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {copy.optionalTag}
                      </span>
                    </legend>
                    <p
                      id="contact-stage-help"
                      className="mt-2 text-sm text-muted-foreground"
                    >
                      {copy.fields.stage.help}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stages.map((stage, index) => (
                        <label key={stage} className={chip}>
                          <input
                            id={index === 0 ? "contact-stage" : undefined}
                            type="radio"
                            name="stage"
                            value={stage}
                            defaultChecked={values.stage === stage}
                            className="sr-only"
                            onChange={(event) =>
                              revalidateField("stage", event.currentTarget.form)
                            }
                          />
                          {stage}
                        </label>
                      ))}
                    </div>
                    <p
                      id="contact-stage-error"
                      className="mt-2 min-h-5 text-sm text-destructive"
                    >
                      {errors.stage}
                    </p>
                  </fieldset>

                  <div className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <Label htmlFor="contact-message">
                        {copy.fields.message.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {copy.optionalTag}
                      </span>
                    </div>
                    <p
                      id="contact-message-help"
                      className="text-sm text-muted-foreground"
                    >
                      {copy.fields.message.help}
                    </p>
                    <Textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder={copy.fields.message.placeholder}
                      defaultValue={values.message}
                      className="min-h-32"
                      aria-invalid={Boolean(errors.message) || undefined}
                      aria-describedby="contact-message-help contact-message-error"
                      onBlur={(event) =>
                        revalidateField("message", event.currentTarget.form)
                      }
                    />
                    <p
                      id="contact-message-error"
                      className="min-h-5 text-sm text-destructive"
                    >
                      {errors.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              {/* aria-live so the result is announced without moving focus. */}
              <p aria-live="polite" className="min-h-5 text-sm text-destructive">
                {summaryText}
              </p>
              <Button
                ref={submitRef}
                type="submit"
                size="xl"
                variant="brand"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? copy.submitting : copy.submit}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
