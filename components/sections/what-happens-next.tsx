import type { ProcessPhase } from "@/content/studio";

/**
 * Adapted from @shadcnblocks/feature207: kept the numbered workflow with
 * hairline rules; dropped its py-32/container shell and <Separator> rows in
 * favor of a three-column grid with a border-t per cell, and swapped the demo
 * copy for typed ProcessPhase props. Layout (Section/eyebrow) stays with the
 * page.
 */
export function WhatHappensNext({ steps }: { steps: ProcessPhase[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-12 lg:grid-cols-3">
      {steps.map((step) => (
        <li key={step.index} className="border-t border-border pt-6">
          <p className="text-eyebrow text-muted-foreground">{step.index}</p>
          <h3 className="mt-4 text-h3">{step.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
