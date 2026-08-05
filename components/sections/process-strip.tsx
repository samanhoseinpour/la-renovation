"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { ProcessPhase } from "@/content/office";

/**
 * Adapted from @shadcnblocks/feature181 crossed with timeline4: the five
 * phase columns keep their index markers, but timeline4's scroll-scrubbed
 * progress line now runs horizontally through them on lg+, pouring brand
 * steel left to right as the section crosses the viewport. Markers sit on
 * the line and switch on as the fill reaches their column; below lg the
 * line collapses back to per-column hairlines and the markers still light
 * in scroll order.
 */
export function ProcessStrip({
  intro,
  phases,
}: {
  intro: SectionIntro;
  phases: ProcessPhase[];
}) {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "start 0.35"],
  });

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

      <div className="relative mt-14 lg:mt-20">
        <div aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-border lg:block">
          <m.div
            className="h-full w-full origin-left bg-brand"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        <ol
          ref={trackRef}
          role="list"
          className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {phases.map((phase, index) => (
            <li
              key={phase.index}
              className="relative border-t border-border pt-6 lg:border-t-0 lg:pt-8"
            >
              <PhaseMarker
                progress={scrollYProgress}
                index={index}
                count={phases.length}
                label={phase.index}
                className="lg:absolute lg:top-0 lg:-translate-y-1/2"
              />
              <Reveal delay={Math.min(index * 0.05, 0.2)}>
                <h3 className="mt-4 text-h3 lg:mt-8">{phase.title}</h3>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Index roundel that lights a brand ring once the pour line reaches it. */
function PhaseMarker({
  progress,
  index,
  count,
  label,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  label: string;
  className?: string;
}) {
  const start = index / count;
  const active = useTransform(progress, [start, start + 0.5 / count], [0, 1]);

  return (
    <span
      className={`relative grid size-8 place-items-center rounded-full border border-border bg-background text-eyebrow text-muted-foreground ${className ?? ""}`}
    >
      <m.span
        aria-hidden
        className="absolute -inset-px rounded-full border border-brand"
        style={{ opacity: active }}
      />
      {label}
    </span>
  );
}
