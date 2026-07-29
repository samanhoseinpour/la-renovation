import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import type { SitemapGroup } from "@/content/sitemap";

type SitemapDirectoryProps = {
  groups: SitemapGroup[];
};

/**
 * The /sitemap directory: the mega-panel row list re-rendered as a static
 * page, one group per section. Server-only — no image pane, so none of the
 * menu's hover state comes along.
 */
export function SitemapDirectory({ groups }: SitemapDirectoryProps) {
  return (
    <>
      {groups.map((group) => (
        <Section key={group.label} size="sm">
          <Container>
            <Reveal>
              <h2 className="text-eyebrow text-muted-foreground">
                {group.label}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              {/* role="list": the list-style reset strips list semantics in VoiceOver */}
              <ul role="list" className="mt-10 border-b border-border">
                {group.entries.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className="group/row grid grid-cols-[3.5rem_1fr] items-baseline gap-x-6 border-t border-border py-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:grid-cols-[3.5rem_1fr_auto]"
                    >
                      <span className="text-eyebrow tabular text-muted-foreground transition-colors duration-200 ease-editorial group-hover/row:text-foreground group-focus-visible/row:text-foreground">
                        {entry.index}
                      </span>
                      <span className="text-h3">{entry.title}</span>
                      {entry.meta ? (
                        <span className="hidden text-eyebrow text-muted-foreground sm:block">
                          {entry.meta}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>
      ))}
    </>
  );
}
