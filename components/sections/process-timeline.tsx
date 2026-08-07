import type { ProcessPhase } from "@/content/office";

/**
 * Adapted from @shadcnblocks/timeline4 over the timeline19 rows it replaces:
 * a left brand rail with index roundels sitting on it, and the hairline
 * editorial grid kept for each phase. The scroll-scrubbed pour retired with
 * the motion runtime (PSI, 2026-08): rail and rings render lit, and the
 * timeline is server markup with no JavaScript.
 */
export function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-y-0 left-4 w-px bg-brand" />

      <ol role="list">
        {phases.map((phase) => (
          <li
            key={phase.index}
            className="relative border-t border-border py-8 pl-12 lg:py-10 lg:pl-16"
          >
            <span className="absolute left-4 top-7 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-brand bg-background text-eyebrow text-muted-foreground lg:top-10">
              {phase.index}
            </span>
            <div className="grid gap-3 lg:grid-cols-11 lg:gap-8">
              <h3 className="text-h3 lg:col-span-4">{phase.title}</h3>
              <p className="max-w-xl text-muted-foreground lg:col-span-6 lg:col-start-6">
                {phase.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
