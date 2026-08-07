import Link from "next/link";

import { AdminAvatar } from "@/components/admin/admin-avatar";
import { formatFull, formatRelative } from "@/components/admin/dates";
import { inboxHref } from "@/components/admin/inbox-params";
import { ArrowLink } from "@/components/layout/arrow-link";
import { adminOverview } from "@/content/admin";
import type { Submission } from "@/lib/db/schema";
import type { SubmissionStatus } from "@/lib/db/submissions";
import type { TeamLastSignIn } from "@/lib/db/team";
import { cn } from "@/lib/utils";

const TILE_CLASS = "rounded-xl border border-border bg-card p-4 sm:p-5";

/**
 * The admin's front page: three real counts, the newest enquiries, and who
 * signed in when. Numbers are stat tiles on purpose, not charts; there is
 * nothing here a series would say better.
 */
export function AdminOverview({
  counts,
  week,
  prevWeek,
  failed,
  latest,
  team,
}: {
  counts: Record<SubmissionStatus, number>;
  week: number;
  prevWeek: number;
  failed: number;
  latest: Submission[];
  team: TeamLastSignIn[];
}) {
  const delta = week - prevWeek;
  const { weekDelta } = adminOverview.tiles;
  const weekSub =
    delta === 0
      ? weekDelta.flat
      : `${delta > 0 ? weekDelta.up : weekDelta.down} ${Math.abs(delta)} ${weekDelta.tail}`;

  const tiles: {
    label: string;
    value: number;
    sub?: string;
    href: string | null;
  }[] = [
    {
      label: adminOverview.tiles.newCount,
      value: counts.new,
      href: inboxHref({ status: "new" }),
    },
    {
      label: adminOverview.tiles.week,
      value: week,
      sub: weekSub,
      // The tile counts seven days, so it links to the seven-day view.
      href: inboxHref({ status: "all", range: "7d" }),
    },
    {
      label: adminOverview.tiles.failed,
      value: failed,
      href: inboxHref({ status: "failed" }),
    },
  ];

  return (
    <div className="grid content-start gap-10">
      <h1 className="text-h2">{adminOverview.title}</h1>

      {/* 2+1 below sm: two tiles up top, the last one full width. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {tiles.map((tile, index) => {
          const wide = index === tiles.length - 1;
          const body = (
            <>
              <p className="text-eyebrow text-muted-foreground">
                {tile.label}
              </p>
              <p className="tabular mt-2 text-3xl font-medium">{tile.value}</p>
              {tile.sub && (
                <p className="mt-1 text-xs text-muted-foreground">{tile.sub}</p>
              )}
            </>
          );
          return tile.href ? (
            <Link
              key={tile.label}
              href={tile.href}
              className={cn(
                TILE_CLASS,
                wide && "max-sm:col-span-2",
                "outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            >
              {body}
            </Link>
          ) : (
            <div
              key={tile.label}
              className={cn(TILE_CLASS, wide && "max-sm:col-span-2")}
            >
              {body}
            </div>
          );
        })}
      </div>

      {/* min-w-0 on both sections: a grid item's min-width:auto asks for the
          content's intrinsic width, and the truncate rows' nowrap lines
          propagate their full single-line length up through it, inflating
          the track past the viewport. Zeroing the automatic minimum is what
          lets truncate actually clamp. */}
      <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr] lg:gap-10">
        <section className="min-w-0">
          <h2 className="text-h3">{adminOverview.latest.title}</h2>
          {latest.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {adminOverview.latest.empty}
            </p>
          ) : (
            <ul className="mt-1">
              {latest.map((item) => (
                <li key={item.id} className="border-b border-border">
                  <Link
                    href={`/admin/submissions/${item.id}`}
                    className="flex items-center gap-4 rounded-sm py-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        item.status === "new" ? "bg-brand" : "bg-transparent",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm",
                          item.status === "new" && "font-medium",
                        )}
                      >
                        {item.name}
                        {item.company ? ` · ${item.company}` : ""}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {item.message}
                      </span>
                    </span>
                    <time
                      dateTime={item.createdAt.toISOString()}
                      title={formatFull(item.createdAt)}
                      className="tabular shrink-0 text-xs text-muted-foreground sm:text-sm"
                    >
                      {formatRelative(item.createdAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {/* mt-6 optically reads as 16px: ArrowLink's -my-2 eats 8px. */}
          <div className="mt-6">
            <ArrowLink href="/admin/submissions">
              {adminOverview.latest.viewAll}
            </ArrowLink>
          </div>
        </section>

        <section className="min-w-0">
          <h2 className="text-h3">{adminOverview.team.title}</h2>
          <ul className="mt-4 grid gap-3">
            {team.map((member) => (
              <li key={member.id} className="flex items-center gap-3">
                <AdminAvatar email={member.email} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{member.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {member.lastSignIn ? (
                      <>
                        {adminOverview.team.lastSeen}{" "}
                        <time
                          dateTime={member.lastSignIn.toISOString()}
                          title={formatFull(member.lastSignIn)}
                        >
                          {formatRelative(member.lastSignIn)}
                        </time>
                      </>
                    ) : (
                      adminOverview.team.never
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
