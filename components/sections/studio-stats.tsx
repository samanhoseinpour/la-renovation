import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { Stat } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/stats8: kept the heading + four-column figure
 * grid; dropped its report link, replaced py-32/container with Section and
 * Container, and put each figure behind a hairline rule so the row reads as
 * a table, not a scoreboard.
 */
export function StudioStats({
  eyebrow,
  heading,
  stats,
  surface = "default",
}: {
  eyebrow: string;
  heading: string;
  stats: Stat[];
  surface?: "default" | "muted";
}) {
  return (
    <Section size="default" surface={surface}>
      <Container>
        <div className="flex items-baseline justify-between gap-8">
          <h2 className="text-eyebrow text-muted-foreground">{eyebrow}</h2>
        </div>
        <p className="mt-6 max-w-2xl text-h2">{heading}</p>

        <Reveal>
          <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border pt-5">
                <dd className="tabular text-h1">{stat.value}</dd>
                <dt className="mt-3 max-w-[24ch] text-sm text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
