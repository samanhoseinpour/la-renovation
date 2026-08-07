import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { SitemapGroup } from "@/content/sitemap";

type SitemapDirectoryProps = {
  groups: SitemapGroup[];
};

/**
 * The /sitemap directory: every group side by side in one compact columned
 * index, so the page stays near one screen as routes accumulate. Rows keep
 * the mega panel's index-and-title shorthand, not its full ledger rows.
 * Server-only.
 */
export function SitemapDirectory({ groups }: SitemapDirectoryProps) {
  return (
    <Section size="sm">
      <Container>
        <div className="grid grid-cols-1 gap-x-gutter gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-eyebrow text-muted-foreground">
                {group.label}
              </h2>
              {/* role="list": the list-style reset strips list semantics in VoiceOver */}
              <ul role="list" className="mt-5 border-t border-border pt-3">
                {group.entries.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className="group/row grid grid-cols-[2.75rem_1fr] items-baseline py-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="text-eyebrow tabular text-muted-foreground transition-colors duration-200 ease-editorial group-hover/row:text-foreground group-focus-visible/row:text-foreground">
                        {entry.index}
                      </span>
                      <span className="text-base font-medium">
                        {entry.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
