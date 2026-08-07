import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { Commitment } from "@/content/about";

type OfficeCommitmentsProps = {
  id?: string;
  items: Commitment[];
};

/**
 * Adapted from @shadcnblocks/feature42: kept the typographic value rows with
 * no icons; traded its three-column grid for full-width label-beside-body
 * rows on OfficeMission's seven-column geometry (commitments read as the
 * mission's tonal siblings, one register down at h3 scale), trimmed four
 * items to three, and replaced its shell with Section/Container and
 * semantic tokens.
 */
export function OfficeCommitments({ id, items }: OfficeCommitmentsProps) {
  return (
    // scroll-mt-16 clears the h-16 sticky header on anchor navigation — same
    // 64px as the Lenis `anchors: { offset: -64 }` and the header's
    // IntersectionObserver rootMargin (components/motion/smooth-scroll.tsx,
    // components/site/site-header.tsx).
    <Section id={id} size="default" surface="muted" className="scroll-mt-16">
      <Container>
        <h2 className="text-eyebrow text-muted-foreground">Commitments</h2>

        <div className="mt-14">
          {items.map((item) => (
            <div
              key={item.title}
              className="grid gap-6 border-t border-border py-10 lg:grid-cols-7 lg:gap-12"
            >
              <h3 className="text-h3 lg:col-span-2">{item.title}</h3>
              <p className="max-w-2xl text-lead text-muted-foreground lg:col-span-4 lg:col-start-4">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
