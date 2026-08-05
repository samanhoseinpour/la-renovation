"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useReducedMotion } from "motion/react";
import Marquee from "react-fast-marquee";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { BlurProps } from "@/content/images";
import type { TeamMember } from "@/content/team";

export type MarqueeMember = TeamMember & {
  /** Resolved blur-up for `photo`, empty for members without one; computed
      by the server shell in team-marquee.tsx. */
  photoBlur: BlurProps;
};

/**
 * Adapted from @shadcnblocks/logos3: the react-fast-marquee autoFill loop,
 * recast from a logo row into the roster filmstrip. Edge fades come from a
 * mask instead of the block's gradient prop so both themes keep their own
 * surface. autoFill clones cards, so the moving rail is aria-hidden and a
 * visually hidden list carries the roster; reduced motion parks the strip
 * (the global CSS clamp backstops the same).
 *
 * Hover pause is pointer-only, so a skip-link-style toggle covers keyboard
 * users (WCAG 2.2.2): sr-only until focus lands on it, then a pill over the
 * rail. It sits outside the aria-hidden wrapper — focusables inside one are
 * a contradiction — and drops out entirely under reduced motion, where the
 * strip is already parked and the control would be dead tab weight.
 */
export function TeamMarqueeRail({
  intro,
  members,
}: {
  intro: SectionIntro;
  members: MarqueeMember[];
}) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

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

      <ul role="list" className="sr-only">
        {members.map((member) => (
          <li key={member.name}>
            {member.name}, {member.role}
          </li>
        ))}
      </ul>

      <Reveal className="relative mt-14">
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPaused((current) => !current)}
            className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-10 inline-flex h-8 items-center rounded-full border border-border bg-background px-3.5 text-sm font-medium text-foreground shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {paused ? "Play team photos" : "Pause team photos"}
          </button>
        )}
        {/* rfm centers its flex tracks, which lets a two-line role shove its
            card off the shared top edge; pin both containers to flex-start.
            The ! is load-bearing: rfm injects its CSS un-layered at runtime,
            which outranks anything in @layer utilities. */}
        <div
          aria-hidden
          className="[mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%_-_3rem),transparent)] [&_.rfm-marquee]:items-start! [&_.rfm-initial-child-container]:items-start!"
        >
          <Marquee
            autoFill
            pauseOnHover
            speed={30}
            play={!reducedMotion && !paused}
          >
            {members.map((member) => (
              <div key={member.name} className="mx-2.5 w-40 sm:w-48">
                <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                  {member.photo ? (
                    <Image
                      src={member.photo.src}
                      alt=""
                      {...member.photoBlur}
                      fill
                      sizes="(min-width: 640px) 12rem, 10rem"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound
                      aria-hidden
                      strokeWidth={1.25}
                      className="size-12 text-muted-foreground/50"
                    />
                  )}
                </div>
                <p className="mt-3 text-sm font-medium">{member.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </Reveal>
    </div>
  );
}
