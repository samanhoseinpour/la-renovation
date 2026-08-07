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
import { cn } from "@/lib/utils";

const initialContactState: ContactState = { status: "idle" };

// Editorial underline field. The focused border doubles as the focus
// indicator, which is why the ring can go. `md:text-base` keeps the fields
// at 16px on desktop too — the base-nova md:text-sm is for dense UI.
// pointer-coarse:h-12 re-wins over the Input primitive's pointer-coarse:h-11,
// which would otherwise out-cascade this field's plain h-12 on touch.
const underlineField =
  "h-12 pointer-coarse:h-12 rounded-none border-0 border-b border-b-border bg-transparent px-0 text-base shadow-none md:text-base dark:bg-transparent focus-visible:border-b-foreground focus-visible:ring-0";

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
 * Adapted from @shadcnblocks/contact20: kept the editorial title band with
 * the office details opposite and the borderless underline fields, then
 * regrouped the fields under visible labels ("About you" / "The project"),
 * swapped both selects for native checkbox and radio chips, and added a
 * client preflight over the same zod schema the server action runs — errors
 * appear on submit and clear per field once the visitor fixes them. The form
 * still posts without JavaScript: the action validates everything again and
 * echoes values back so nothing typed is lost; on success the whole form
 * swaps for a confirmation panel.
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
  // region inserted together with its text is not reliably read.
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (state.status === "success") successHeadingRef.current?.focus();
  }, [state.status]);

  // Monotonic mount time for the server action's minimum-fill trap; set in
  // an effect so it is unambiguously the client's clock.
  const mountedAt = useRef<number | null>(null);
  const paceRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

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

  return (
    <div>
      {/* Side-by-side only from xl: at lg the office grid's shrink-0 flex
          base (~840px, the email's single-line width doubled by equalized
          1fr tracks) exceeds the container and clips at the viewport. */}
      <div className="flex flex-col justify-between gap-12 xl:flex-row xl:items-end xl:gap-16">
        <div className="max-w-md">
          <p className="text-eyebrow text-muted-foreground">{page.eyebrow}</p>
          <h1 className="mt-6 text-display-2 text-balance">{page.title}</h1>
          <p className="mt-6 text-lead text-muted-foreground">{page.lead}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {page.commitment}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:shrink-0 xl:gap-16">
          <div>
            <h2 className="text-eyebrow text-muted-foreground">
              {page.officeHeading}
            </h2>
            <address className="mt-4 text-lg leading-snug font-medium not-italic">
              {site.contact.address.street ? (
                <>
                  {site.contact.address.street}
                  <br />
                </>
              ) : null}
              {site.contact.address.city
                ? `${site.contact.address.city}, `
                : ""}
              {site.contact.address.state}
              {site.contact.address.zip ? ` ${site.contact.address.zip}` : ""}
            </address>
            <p className="mt-3 text-sm text-muted-foreground">
              {site.contact.hours}
            </p>
          </div>
          <div>
            <a
              href={site.contact.phoneHref}
              className="text-eyebrow tabular text-muted-foreground transition-colors duration-200 ease-editorial hover:text-foreground"
            >
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="mt-3 block text-h3 wrap-anywhere underline-offset-8 hover:underline"
            >
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>

      {state.status === "success" ? (
        <div
          role="status"
          className="mt-16 border-t border-border pt-12 lg:mt-24"
        >
          <p className="text-eyebrow text-muted-foreground">
            {copy.success.eyebrow}
          </p>
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-6 max-w-2xl text-h2 text-balance outline-none"
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
        </div>
      ) : (
        <form
          action={formAction}
          onSubmit={handleSubmit}
          // noValidate: the zod messages under each field are the one error
          // voice; native bubbles would compete with them. The required and
          // type attributes stay for semantics, and a pre-hydration submit
          // round-trips into the server-validated echo.
          noValidate
          className="mt-16 lg:mt-24"
        >
          <p className="max-w-2xl text-muted-foreground">{page.formIntro}</p>

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

          <div className="mt-12 grid gap-12">
            <div>
              <h2 className="text-eyebrow text-muted-foreground">
                {copy.groups.about.heading}
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {copy.groups.about.note}
              </p>

              <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">{copy.fields.name.label}</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    required
                    autoComplete="name"
                    defaultValue={values.name}
                    className={underlineField}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    onBlur={(event) =>
                      revalidateField("name", event.currentTarget.form)
                    }
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="text-sm text-destructive"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contact-email">
                    {copy.fields.email.label}
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={values.email}
                    className={underlineField}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    onBlur={(event) =>
                      revalidateField("email", event.currentTarget.form)
                    }
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="text-sm text-destructive"
                    >
                      {errors.email}
                    </p>
                  )}
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
                    autoComplete="tel"
                    defaultValue={values.phone}
                    className={underlineField}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "contact-phone-error" : undefined
                    }
                    onBlur={(event) =>
                      revalidateField("phone", event.currentTarget.form)
                    }
                  />
                  {errors.phone && (
                    <p
                      id="contact-phone-error"
                      className="text-sm text-destructive"
                    >
                      {errors.phone}
                    </p>
                  )}
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
                    defaultValue={values.company}
                    className={underlineField}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={
                      errors.company ? "contact-company-error" : undefined
                    }
                    onBlur={(event) =>
                      revalidateField("company", event.currentTarget.form)
                    }
                  />
                  {errors.company && (
                    <p
                      id="contact-company-error"
                      className="text-sm text-destructive"
                    >
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-eyebrow text-muted-foreground">
                {copy.groups.project.heading}
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {copy.groups.project.note}
              </p>

              <div className="mt-8 grid gap-10">
                <fieldset
                  aria-describedby={
                    errors.services
                      ? "contact-services-help contact-services-error"
                      : "contact-services-help"
                  }
                >
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
                  {errors.services && (
                    <p
                      id="contact-services-error"
                      className="mt-2 text-sm text-destructive"
                    >
                      {errors.services}
                    </p>
                  )}
                </fieldset>

                <fieldset
                  aria-describedby={
                    errors.stage
                      ? "contact-stage-help contact-stage-error"
                      : "contact-stage-help"
                  }
                >
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
                  {errors.stage && (
                    <p
                      id="contact-stage-error"
                      className="mt-2 text-sm text-destructive"
                    >
                      {errors.stage}
                    </p>
                  )}
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
                    defaultValue={values.message}
                    className={cn(underlineField, "h-auto min-h-32")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={cn(
                      "contact-message-help",
                      errors.message && "contact-message-error",
                    )}
                    onBlur={(event) =>
                      revalidateField("message", event.currentTarget.form)
                    }
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="text-sm text-destructive"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Button
              ref={submitRef}
              type="submit"
              size="xl"
              variant="brand"
              disabled={isPending}
            >
              {isPending ? copy.submitting : copy.submit}
              <ArrowRight data-icon="inline-end" />
            </Button>

            {/* aria-live so the result is announced without moving focus. */}
            <p aria-live="polite" className="text-sm text-destructive">
              {summaryText}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
