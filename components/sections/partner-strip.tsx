import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { SectionIntro } from "@/content/home";
import type { Partner } from "@/content/partners";

/**
 * Adapted from @shadcnblocks/logos1's static four-logo strip, rebuilt on
 * logos13's bordered-cell idea as a collapsed-hairline plate grid: card
 * surfaces sharing 1px border lines, one registration cross pinning each
 * corner of the sheet. The block's dark:invert img is replaced by a CSS mask
 * over bg-foreground: every mark is pre-normalized to black plus alpha
 * (public/images/partners), so one token paints it on any surface in either
 * theme. Each plate is one outbound link, the bare domain as its title-block
 * caption; the sheet reveals as a single object, no per-cell stagger.
 *
 * The sheet has to stay a rectangle: a short final row leaves border-colored
 * holes, not card surface. Desktop runs one column per partner, and the
 * two-column layout closes an odd roster by letting the last plate span it.
 *
 * Phones get one plate per row. A caption like flooringandrenovations.com
 * measures ~180px in the mono face and cannot wrap, roughly twice the text
 * width a two-up cell leaves at this gutter; an unbreakable string also sets
 * the grid track's auto minimum, so the sheet stretches rather than clips.
 * min-w-0 plus truncate contains that if a longer domain ever lands.
 *
 * Five stacked plates get tall, so the phone padding steps down to p-4 and
 * min-h-34 sits right on the tallest ink (the 1.6-scaled portrait badge) plus
 * its chrome. A larger scale needs a matching min-h, or that row alone grows
 * and the sheet's rows go ragged.
 */
export function PartnerStrip({
  intro,
  partners,
}: {
  intro: SectionIntro;
  partners: Partner[];
}) {
  return (
    <div>
      <Reveal>
        <h2 className="text-eyebrow text-muted-foreground">{intro.eyebrow}</h2>
        <p className="mt-6 max-w-2xl text-h2 text-balance">{intro.heading}</p>
        {intro.lead && (
          <p className="mt-6 max-w-xl text-muted-foreground">{intro.lead}</p>
        )}
      </Reveal>

      <Reveal className="mt-14">
        <div className="relative grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {[
            "-top-[5px] -left-[5px]",
            "-top-[5px] -right-[5px]",
            "-bottom-[5px] -left-[5px]",
            "-bottom-[5px] -right-[5px]",
          ].map((corner) => (
            <svg
              key={corner}
              aria-hidden
              viewBox="0 0 10 10"
              className={`absolute size-2.5 text-muted-foreground/70 ${corner}`}
            >
              <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1" />
            </svg>
          ))}

          {partners.map((partner) => {
            const mask = `url("${partner.logo.src}")`;
            const ink: CSSProperties = {
              // Cap height per breakpoint via --partner-cap, tuned per mark so
              // the lockups read at one visual weight.
              height: `calc(var(--partner-cap) * ${partner.scale ?? 1})`,
              aspectRatio: `${partner.logo.width} / ${partner.logo.height}`,
              maskImage: mask,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: mask,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            };

            return (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/partner relative flex min-h-34 min-w-0 flex-col bg-card p-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset sm:min-h-48 sm:p-8 sm:max-lg:last:col-span-2 [--partner-cap:2.75rem] xl:[--partner-cap:3.25rem]"
              >
                <span className="flex w-full flex-1 items-center justify-start sm:justify-center">
                  <span
                    aria-hidden
                    style={ink}
                    className="block max-w-full bg-foreground/70 transition-colors duration-200 ease-editorial group-hover/partner:bg-foreground"
                  />
                </span>
                <span className="sr-only">{partner.name}</span>
                <span className="mt-4 flex items-center justify-between gap-4 sm:mt-6">
                  <span className="min-w-0 truncate font-mono text-xs tracking-tight text-muted-foreground transition-colors duration-200 ease-editorial group-hover/partner:text-foreground">
                    {partner.domain}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground/70 transition-[color,translate] duration-200 ease-editorial group-hover/partner:translate-x-px group-hover/partner:-translate-y-px group-hover/partner:text-foreground"
                  />
                </span>
              </a>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
