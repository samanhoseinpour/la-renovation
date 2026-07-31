import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { ProcessPhase } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/feature181: kept the columns-on-a-hairline
 * anatomy with index markers; dropped the oversized faded numerals, duration
 * badges and per-column body copy — this is a titles-only teaser of the five
 * phases, with the detail living on /services' ProcessTimeline.
 */
export function ProcessStrip({
  intro,
  phases,
}: {
  intro: SectionIntro;
  phases: ProcessPhase[];
}) {
  return (
    <div>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
            <p className="mt-6 max-w-2xl text-h2 text-balance">{intro.heading}</p>
          </div>
          {intro.link && (
            <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
          )}
        </div>
      </Reveal>

      <ol role="list" className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {phases.map((phase, index) => (
          <li key={phase.index} className="border-t border-border pt-6">
            <Reveal delay={Math.min(index * 0.05, 0.2)}>
              <span className="grid size-8 place-items-center rounded-full border border-border text-eyebrow text-muted-foreground">
                {phase.index}
              </span>
              <h3 className="mt-4 text-h3">{phase.title}</h3>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
