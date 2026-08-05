"use client";

import { useRef } from "react";
import { m, useScroll } from "motion/react";

import { Reveal } from "@/components/motion/reveal";
import type { ProcessPhase } from "@/content/office";

/**
 * Adapted from @shadcnblocks/timeline4 over the timeline19 rows it replaces:
 * a left rail with a scroll-scrubbed brand fill, index roundels sitting on
 * the rail, and the hairline editorial grid kept for each phase. The rail
 * pours as the sequence crosses the viewport center; each roundel lights
 * its ring as its row reaches the center band, so fill and markers agree
 * regardless of row height.
 */
export function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-y-0 left-4 w-px bg-border">
        <m.div
          className="h-full w-full origin-top bg-brand"
          style={{ scaleY: scrollYProgress }}
        />
      </div>

      <ol ref={trackRef} role="list">
        {phases.map((phase, index) => (
          <li
            key={phase.index}
            className="relative border-t border-border py-8 pl-12 lg:py-10 lg:pl-16"
          >
            <span className="absolute left-4 top-7 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-border bg-background text-eyebrow text-muted-foreground lg:top-10">
              <m.span
                aria-hidden
                className="absolute -inset-px rounded-full border border-brand"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
              />
              {phase.index}
            </span>
            <Reveal delay={Math.min(index * 0.05, 0.2)}>
              <div className="grid gap-3 lg:grid-cols-11 lg:gap-8">
                <h3 className="text-h3 lg:col-span-4">{phase.title}</h3>
                <p className="max-w-xl text-muted-foreground lg:col-span-6 lg:col-start-6">
                  {phase.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
