import { Reveal } from "@/components/motion/reveal";
import type { ProcessPhase } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/timeline19: kept the vertical phase sequence,
 * dropped the framer-motion animated progress line and dot rail — the scroll
 * tracking cost more than the effect earned. Phases now read as static
 * hairline rows: index eyebrow, title, description, each revealed in turn.
 */
export function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  return (
    <div>
      {phases.map((phase, index) => (
        <Reveal key={phase.index} delay={Math.min(index * 0.05, 0.2)}>
          <div className="grid gap-3 border-t border-border py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
            <p className="text-eyebrow text-muted-foreground lg:col-span-1">
              {phase.index}
            </p>
            <h3 className="text-h3 lg:col-span-4">{phase.title}</h3>
            <p className="max-w-xl text-muted-foreground lg:col-span-6 lg:col-start-7">
              {phase.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
