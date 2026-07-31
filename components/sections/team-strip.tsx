import Image from "next/image";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { TeamMember } from "@/content/team";

/**
 * Adapted from @shadcnblocks/team12: kept the labeled top bar with a link out
 * over a portrait row; traded the three staggered columns for a scroll-snap
 * filmstrip that carries the whole roster at small scale — a different
 * density, scale and axis from StudioTeam's four-across grid on /about.
 */
export function TeamStrip({
  intro,
  members,
}: {
  intro: SectionIntro;
  members: TeamMember[];
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

      {/* tabIndex + aria-label make the overflow rail keyboard-scrollable
          without any JS: focus it and arrow keys pan. */}
      <Reveal>
        <ul
          role="list"
          tabIndex={0}
          aria-label="Team members, horizontally scrollable"
          className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {members.map((member) => (
            <li key={member.name} className="w-40 shrink-0 snap-start sm:w-48">
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  fill
                  sizes="(min-width: 640px) 12rem, 10rem"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-medium">{member.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{member.role}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
