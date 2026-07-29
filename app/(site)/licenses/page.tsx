import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { PageHeader } from "@/components/sections/page-header";
import { licensesIntro, licensesStance } from "@/content/licenses";
import { ctaVariants } from "@/content/studio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Licensing & insurance",
  description:
    "How to verify a California contractor's license, and the paperwork we hand over before anyone signs.",
  alternates: { canonical: "/licenses" },
  // Unindex until the CSLB number lands and this route is wired into the nav/sitemap.
  robots: { index: false },
};

export default function LicensesPage() {
  // Every value is unset until the client supplies the real one, so the list
  // filters down to nothing and the block below drops out entirely rather
  // than rendering an empty <dl>.
  const facts = [
    { label: "CSLB license", value: site.license },
    { label: "Bond", value: site.licensing.bond },
    { label: "General liability", value: site.licensing.liability },
    { label: "Workers' comp", value: site.licensing.workersComp },
  ].filter((fact): fact is { label: string; value: string } =>
    Boolean(fact.value),
  );

  return (
    <>
      <PageHeader
        eyebrow="Licensing & insurance"
        title="Verify before you hire."
        lead={licensesIntro}
      />

      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl space-y-6">
              {licensesStance.map((paragraph) => (
                <p key={paragraph} className="text-lead">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {facts.length > 0 && (
            <Reveal>
              <div className="mt-20">
                <h2 className="text-eyebrow text-muted-foreground">On file</h2>
                <dl className="mt-6 max-w-xl border-t border-border">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex justify-between gap-6 border-b border-border py-4"
                    >
                      <dt className="text-sm text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="text-sm tabular text-right">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      <ContactCta copy={ctaVariants.licenses} />
    </>
  );
}
