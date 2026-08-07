import { ArrowLink } from "@/components/layout/arrow-link";
import type { SectionIntro } from "@/content/home";
import type { ProcessPhase } from "@/content/office";

/**
 * Adapted from @shadcnblocks/feature181 crossed with timeline4: the five
 * phase columns keep their index markers strung on a brand line through them
 * on lg+; below lg the line collapses back to per-column hairlines. The
 * scroll-scrubbed pour retired with the motion runtime (PSI, 2026-08): line
 * and rings render lit, and the section is server markup with no JavaScript.
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
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
          <p className="mt-6 max-w-2xl text-h2 text-balance">{intro.heading}</p>
        </div>
        {intro.link && (
          <ArrowLink href={intro.link.href}>{intro.link.label}</ArrowLink>
        )}
      </div>

      <div className="relative mt-14 lg:mt-20">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 hidden h-px bg-brand lg:block"
        />

        <ol
          role="list"
          className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {phases.map((phase) => (
            <li
              key={phase.index}
              className="relative border-t border-border pt-6 lg:border-t-0 lg:pt-8"
            >
              <PhaseMarker
                label={phase.index}
                className="lg:absolute lg:top-0 lg:-translate-y-1/2"
              />
              <h3 className="mt-4 text-h3 lg:mt-8">{phase.title}</h3>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Index roundel ringed in brand, sitting on the line on lg+. */
function PhaseMarker({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`relative grid size-8 place-items-center rounded-full border border-brand bg-background text-eyebrow text-muted-foreground ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
