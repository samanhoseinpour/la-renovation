import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { ServiceDeepDive } from "@/content/services";

/** Division-specific narrative band on /services/[slug], fed by `Service.deepDive`. */
export function DivisionDeepDive({ deepDive }: { deepDive: ServiceDeepDive }) {
  return (
    <Section surface="muted">
      <Container>
        <h2 className="text-eyebrow text-muted-foreground">
          {deepDive.eyebrow}
        </h2>
        <div className="mt-14">
          {deepDive.sections.map((section) => (
            <div
              key={section.title}
              className="grid gap-6 border-t border-border py-10 lg:grid-cols-7 lg:gap-12"
            >
              <h3 className="text-h3 lg:col-span-2">{section.title}</h3>
              <div className="max-w-2xl space-y-6 lg:col-span-4 lg:col-start-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-lead text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
