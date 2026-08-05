import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Style guide",
  description: "Design system reference for the Araz Construction Group site.",
  robots: { index: false, follow: false },
};

const TYPE_SCALE = [
  {
    cls: "text-display-1",
    label: "display-1",
    range: "44 → 96px · 700",
    sample: "Ground to grid",
  },
  {
    cls: "text-display-2",
    label: "display-2",
    range: "34 → 64px · 700",
    sample: "Built from the ground up",
  },
  {
    cls: "text-h1",
    label: "h1",
    range: "30 → 52px · 650",
    sample: "Harbor Boulevard Mixed-Use",
  },
  {
    cls: "text-h2",
    label: "h2",
    range: "25 → 40px · 600",
    sample: "Sitework before structure",
  },
  {
    cls: "text-h3",
    label: "h3",
    range: "21 → 28px · 600",
    sample: "Close the seams",
  },
  {
    cls: "text-lead",
    label: "lead",
    range: "18 → 21px",
    sample: "We build energy, commercial, civil, and multifamily projects across Southern California.",
  },
  {
    cls: "text-base",
    label: "base",
    range: "16px",
    sample:
      "Every project starts with the site: soil, utilities, access, zoning. The budget and the drawings arrive together.",
  },
  {
    cls: "text-sm text-muted-foreground",
    label: "sm / muted",
    range: "14px",
    sample: "Secondary copy, captions and metadata.",
  },
  {
    cls: "text-eyebrow text-muted-foreground",
    label: "eyebrow",
    range: "12px",
    sample: "001 / Anaheim / Mixed-use",
  },
];

const SURFACES = [
  { cls: "bg-background", name: "background", note: "#F3F3F1 / #16181A" },
  { cls: "bg-card", name: "card", note: "#FFFFFF / #1C1F23" },
  { cls: "bg-muted", name: "muted", note: "#ECECE9 / #1E2226" },
  { cls: "bg-secondary", name: "secondary", note: "paper step / graphite step" },
  { cls: "bg-accent", name: "accent", note: "menu hover only" },
  { cls: "bg-foreground", name: "foreground", note: "#16181A / #F3F3F1" },
];

const BRAND = [
  { cls: "bg-brand", name: "brand", note: "steel — limited accent use" },
  { cls: "bg-brand/10", name: "brand/10", note: "tint surface" },
  { cls: "bg-destructive", name: "destructive", note: "semantic only" },
  { cls: "bg-border", name: "border", note: "decorative hairline" },
  { cls: "bg-input", name: "input", note: "3.62:1 / 3.45:1 — WCAG 1.4.11" },
  { cls: "bg-ring", name: "ring", note: "focus indicator" },
];

const CHARTS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

const SPACING = [
  { cls: "w-gutter", name: "gutter", range: "20 → 64px" },
  { cls: "w-section-sm", name: "section-sm", range: "48 → 72px" },
  { cls: "w-section", name: "section", range: "64 → 104px" },
  { cls: "w-section-lg", name: "section-lg", range: "80 → 128px" },
];

const RADII = [
  { cls: "rounded-sm", name: "sm" },
  { cls: "rounded-md", name: "md" },
  { cls: "rounded-lg", name: "lg" },
  { cls: "rounded-xl", name: "xl" },
  { cls: "rounded-2xl", name: "2xl" },
  { cls: "rounded-3xl", name: "3xl" },
  { cls: "rounded-full", name: "full" },
];

const VARIANTS = [
  "default",
  "brand",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const SIZES = ["xs", "sm", "default", "lg", "xl"] as const;

const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg", "icon-xl"] as const;

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Section size="sm" className="border-t border-border">
      <Container>
        <h2 className="text-eyebrow mb-10 text-muted-foreground">{title}</h2>
        {children}
      </Container>
    </Section>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <Section size="sm">
        <Container>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-eyebrow text-muted-foreground">
                Araz Construction Group / Design system
              </p>
              <h1 className="mt-4 text-display-2">Paper / Graphite / Steel</h1>
              <p className="mt-4 max-w-xl text-lead text-muted-foreground">
                Archivo, one family site-wide. Paper, graphite and slate with
                a single steel accent. Light is the default; toggle to check
                dark. Smooth scroll is intentionally absent on this page.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Container>
      </Section>

      <Block title="Typography">
        <div className="space-y-10">
          {TYPE_SCALE.map((step) => (
            <div key={step.label}>
              <div className="mb-3 flex items-baseline gap-4">
                <code className="text-xs text-muted-foreground">
                  {step.label}
                </code>
                <span className="text-xs text-muted-foreground tabular">
                  {step.range}
                </span>
              </div>
              <p className={step.cls}>{step.sample}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-h3">
            Emphasis is weight and colour, never italics —{" "}
            <em className="not-italic text-muted-foreground">
              from rough grade to occupancy.
            </em>
          </p>
          <p className="mt-4 text-sm tabular text-muted-foreground">
            Tabular figures: 001 002 003 · 01–07 · 92626
          </p>
        </div>
      </Block>

      <Block title="Surfaces">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SURFACES.map((s) => (
            <div key={s.name}>
              <div
                className={`aspect-4/3 w-full rounded-lg border border-border ${s.cls}`}
              />
              <p className="mt-3 text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Brand & semantic">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {BRAND.map((s) => (
            <div key={s.name}>
              <div
                className={`aspect-4/3 w-full rounded-lg border border-border ${s.cls}`}
              />
              <p className="mt-3 text-sm font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <span className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground">
            brand on brand-foreground
          </span>
          <span className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
            foreground on background
          </span>
          <span className="rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
            brand text on brand/10
          </span>
        </div>
        <p className="mt-6 max-w-xl text-sm text-muted-foreground">
          In dark mode the steel pill deliberately carries a dark label: graphite
          on lifted steel ensures AA contrast. Don&rsquo;t &ldquo;fix&rdquo; it
          to paper.
        </p>
      </Block>

      <Block title="Chart ramp">
        <div className="grid grid-cols-5 gap-4">
          {CHARTS.map((c, i) => (
            <div key={c}>
              <div
                className={`aspect-square w-full rounded-lg border border-border ${c}`}
              />
              <p className="mt-3 text-xs text-muted-foreground tabular">
                chart-{i + 1}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Spacing rhythm">
        <div className="space-y-5">
          {SPACING.map((s) => (
            <div key={s.name} className="flex items-center gap-5">
              <div className={`h-8 shrink-0 rounded-sm bg-brand ${s.cls}`} />
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground tabular">
                  {s.range}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          These are fluid. Resize the window and the bars scale with the
          viewport — the same steps drive every section&rsquo;s vertical padding
          and the page gutters.
        </p>
      </Block>

      <Block title="Radius">
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.name}>
              <div
                className={`size-20 border border-border bg-secondary ${r.cls}`}
              />
              <p className="mt-3 text-xs text-muted-foreground">{r.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          The whole ramp derives from a single{" "}
          <code className="text-foreground">--radius: 0.75rem</code> scalar.
          Buttons are pills (rounded-full); images sit at 2xl and 3xl.
        </p>
      </Block>

      <Block title="Buttons">
        <div className="space-y-10">
          {VARIANTS.map((variant) => (
            <div key={variant}>
              <p className="mb-4 text-xs text-muted-foreground">{variant}</p>
              <div className="flex flex-wrap items-center gap-4">
                {SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    Book a call
                  </Button>
                ))}
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
          <div>
            <p className="mb-4 text-xs text-muted-foreground">
              icon sizes (ghost) — icon-sm is what ships in the header
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {ICON_SIZES.map((size) => (
                <Button
                  key={size}
                  variant="ghost"
                  size={size}
                  aria-label={size}
                >
                  <ArrowRight />
                </Button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 max-w-xl text-sm text-muted-foreground">
          The default, brand and outline pills carry an ink-tinted shadow-xs;
          default and brand step up to shadow-sm on hover. Hovers deepen the
          fill with an opaque color-mix — never an opacity fade, which would
          lighten the pill and cost contrast. On coarse pointers every shipped
          size clears a 44px touch target.
        </p>
      </Block>

      <Block title="Arrow link">
        <div className="flex flex-col items-start gap-6">
          <ArrowLink href="/projects">View selected work</ArrowLink>
          <ArrowLink href="https://instagram.com" external>
            Follow on Instagram
          </ArrowLink>
        </div>
      </Block>

      <Block title="Inverted surface">
        <Section
          surface="inverted"
          size="sm"
          className="rounded-3xl px-gutter"
        >
          <p className="text-eyebrow opacity-70">Section surface=&quot;inverted&quot;</p>
          <p className="mt-4 max-w-lg text-h2">
            Flips foreground and background, so it reads correctly in both
            themes.
          </p>
        </Section>
      </Block>

      <Block title="Motion">
        <Reveal>
          <div className="rounded-3xl border border-border p-8">
            <p className="text-h3">
              Entrance reveals use one component and one curve.
            </p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              A 16px rise over 0.6s on the editorial ease, once, on entering
              the viewport. Reduced-motion users get an opacity fade only.
              Hovers stay in CSS.
            </p>
          </div>
        </Reveal>
      </Block>
    </main>
  );
}
