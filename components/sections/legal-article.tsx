import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { LegalDoc } from "@/content/legal";

// Explicit locale and UTC: `new Date("2026-07-28")` lands on UTC midnight, so
// formatting in the server's zone would print the day before west of Greenwich
// and drift between server and client renders.
const updatedFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

function slugify(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * No source block: LegalDoc is already structured, so it maps straight onto
 * elements with the house tokens inside the prose measure — a registry
 * long-form layout would drag in prose styles the site deliberately doesn't
 * carry. PageHeader owns the h1, so the article opens on the updated line.
 */
export function LegalArticle({ doc }: { doc: LegalDoc }) {
  return (
    <Section as="article" size="sm">
      <Container width="prose">
        <div>
          <p className="text-eyebrow text-muted-foreground">
            Last updated {updatedFormat.format(new Date(doc.updated))}
          </p>
          <p className="mt-8 text-lead text-muted-foreground">{doc.intro}</p>
        </div>

        {doc.sections.map((section) => {
          const id = slugify(section.heading);

          return (
            <section key={section.heading} aria-labelledby={id} className="mt-14">
              <h2 id={id} className="scroll-mt-16 text-h3 text-balance">
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-5 leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}

              {section.items ? (
                <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </Container>
    </Section>
  );
}
