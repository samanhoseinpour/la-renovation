"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import type {
  ContactField,
  ContactState,
} from "@/app/(site)/contact/actions";
import { submitContact } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const initialContactState: ContactState = { status: "idle" };

const FIELD_ORDER: ContactField[] = [
  "name",
  "email",
  "phone",
  "service",
  "stage",
  "message",
];

// Editorial underline field. The focused border doubles as the focus
// indicator, which is why the ring can go. `md:text-base` keeps the fields
// at 16px on desktop too — the base-nova md:text-sm is for dense UI.
// Placeholders stay at full muted-foreground: they are the only visible
// label of each field, so the token's AA contrast is load-bearing.
const underlineField =
  "h-12 rounded-none border-0 border-b border-b-border bg-transparent px-0 text-base shadow-none md:text-base dark:bg-transparent placeholder:text-muted-foreground focus-visible:border-b-foreground focus-visible:ring-0";

type ContactStudioProps = {
  title: string;
  lead: string;
  services: { slug: string; title: string }[];
  /** Project-type option for enquiries that don't fit a named service. */
  serviceFallback: string;
  stages: readonly string[];
};

/**
 * Adapted from @shadcnblocks/contact20: kept the editorial title band with
 * the studio details opposite and the borderless underline fields. Replaced
 * its react-hook-form client state with the progressively enhanced server
 * action (useActionState), dropped its SCREAMING-CAPS treatment for the house
 * type scale, and extended the field set with phone, project type and stage.
 * Failed validation echoes values back so nothing typed is lost; on success
 * the whole form swaps for a confirmation panel.
 */
export function ContactStudio({
  title,
  lead,
  services,
  serviceFallback,
  stages,
}: ContactStudioProps) {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  );
  const fieldErrors = state.fieldErrors ?? {};
  const values = state.values ?? {};

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
    const first = FIELD_ORDER.find((field) => state.fieldErrors?.[field]);
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

  return (
    <div>
      <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end lg:gap-16">
        <div className="max-w-md">
          <p className="text-eyebrow text-muted-foreground">Contact</p>
          <h1 className="mt-6 text-display-2 text-balance">{title}</h1>
          <p className="mt-6 text-lead text-muted-foreground">{lead}</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:shrink-0 lg:gap-16">
          <div>
            <h2 className="text-eyebrow text-muted-foreground">Studio</h2>
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
        <div role="status" className="mt-16 border-t border-border pt-12 lg:mt-24">
          <p className="text-eyebrow text-muted-foreground">Enquiry received</p>
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-6 max-w-2xl text-h2 text-balance outline-none"
          >
            {state.message}
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            If it&rsquo;s urgent, call{" "}
            <a
              href={site.contact.phoneHref}
              className="tabular underline underline-offset-4"
            >
              {site.contact.phone}
            </a>{" "}
            during studio hours.
          </p>
        </div>
      ) : (
        <form action={formAction} className="mt-16 lg:mt-24">
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
          </div>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="contact-name" className="sr-only">
                Name
              </Label>
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Name*"
                defaultValue={values.name}
                className={underlineField}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={
                  fieldErrors.name ? "contact-name-error" : undefined
                }
              />
              {fieldErrors.name && (
                <p
                  id="contact-name-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contact-email" className="sr-only">
                Email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email*"
                defaultValue={values.email}
                className={underlineField}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "contact-email-error" : undefined
                }
              />
              {fieldErrors.email && (
                <p
                  id="contact-email-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contact-phone" className="sr-only">
                Phone
              </Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone (optional)"
                defaultValue={values.phone}
                className={underlineField}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={
                  fieldErrors.phone ? "contact-phone-error" : undefined
                }
              />
              {fieldErrors.phone && (
                <p
                  id="contact-phone-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contact-service" className="sr-only">
                Project type
              </Label>
              <Select name="service" defaultValue={values.service}>
                <SelectTrigger
                  id="contact-service"
                  className={cn(
                    underlineField,
                    // data-[size=default]:h-12 must carry the same variant as
                    // the trigger's own data-[size=default]:h-8 — a bare h-12
                    // loses on specificity and the select renders 32px tall
                    // beside 48px inputs.
                    // dark:hover:bg-transparent kills the trigger's baked
                    // dark:hover:bg-input/50 — a grey fill on hover reads as
                    // a box, and this is styled as a borderless underline.
                    "w-full data-[size=default]:h-12 data-[placeholder]:text-muted-foreground dark:hover:bg-transparent",
                  )}
                  aria-invalid={Boolean(fieldErrors.service)}
                  aria-describedby={
                    fieldErrors.service ? "contact-service-error" : undefined
                  }
                >
                  <SelectValue placeholder="Project type" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.slug} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                  <SelectItem value={serviceFallback}>
                    {serviceFallback}
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Unreachable from the select itself, but the action can still
                  reject a crafted value — and the focus effect above sends the
                  user here, so there has to be something to read. */}
              {fieldErrors.service && (
                <p
                  id="contact-service-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.service}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contact-stage" className="sr-only">
                Project stage
              </Label>
              <Select name="stage" defaultValue={values.stage}>
                <SelectTrigger
                  id="contact-stage"
                  className={cn(
                    underlineField,
                    // data-[size=default]:h-12 must carry the same variant as
                    // the trigger's own data-[size=default]:h-8 — a bare h-12
                    // loses on specificity and the select renders 32px tall
                    // beside 48px inputs.
                    // dark:hover:bg-transparent kills the trigger's baked
                    // dark:hover:bg-input/50 — a grey fill on hover reads as
                    // a box, and this is styled as a borderless underline.
                    "w-full data-[size=default]:h-12 data-[placeholder]:text-muted-foreground dark:hover:bg-transparent",
                  )}
                  aria-invalid={Boolean(fieldErrors.stage)}
                  aria-describedby={
                    fieldErrors.stage ? "contact-stage-error" : undefined
                  }
                >
                  <SelectValue placeholder="Project stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.stage && (
                <p
                  id="contact-stage-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.stage}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <Label htmlFor="contact-message" className="sr-only">
                About the project
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Where is the property, what are you hoping to do, and roughly when?*"
                defaultValue={values.message}
                className={cn(underlineField, "h-auto min-h-32")}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={
                  fieldErrors.message ? "contact-message-error" : undefined
                }
              />
              {fieldErrors.message && (
                <p
                  id="contact-message-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {fieldErrors.message}
                </p>
              )}
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
              {isPending ? "Sending…" : "Send enquiry"}
              <ArrowRight data-icon="inline-end" />
            </Button>

            {/* aria-live so the result is announced without moving focus. */}
            <p aria-live="polite" className="text-sm text-destructive">
              {state.status === "error" ? state.message : null}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
