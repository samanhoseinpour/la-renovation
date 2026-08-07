import Link from "next/link";

import { AdminAvatar } from "@/components/admin/admin-avatar";
import { formatRelative } from "@/components/admin/dates";
import { adminOverview } from "@/content/admin";
import type { Submission } from "@/lib/db/schema";
import type { SubmissionStatus } from "@/lib/db/submissions";
import type { TeamLastSignIn } from "@/lib/db/team";
import { cn } from "@/lib/utils";

const TILE_CLASS = "rounded-xl border border-border p-5";

/**
 * The admin's front page: three real counts, the newest enquiries, and who
 * signed in when. Numbers are stat tiles on purpose, not charts; there is
 * nothing here a series would say better.
 */
export function AdminOverview({
  counts,
  week,
  failed,
  latest,
  team,
}: {
  counts: Record<SubmissionStatus, number>;
  week: number;
  failed: number;
  latest: Submission[];
  team: TeamLastSignIn[];
}) {
  const tiles: { label: string; value: number; href: string | null }[] = [
    {
      label: adminOverview.tiles.newCount,
      value: counts.new,
      href: "/admin/submissions?status=new",
    },
    { label: adminOverview.tiles.week, value: week, href: "/admin/submissions" },
    {
      label: adminOverview.tiles.failed,
      value: failed,
      href: "/admin/submissions?status=failed",
    },
  ];

  return (
    <div className="grid content-start gap-10">
      <h1 className="text-h2">{adminOverview.title}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => {
          const body = (
            <>
              <p className="text-eyebrow text-muted-foreground">
                {tile.label}
              </p>
              <p className="tabular mt-2 text-3xl font-medium">{tile.value}</p>
            </>
          );
          return tile.href ? (
            <Link
              key={tile.label}
              href={tile.href}
              className={cn(TILE_CLASS, "transition-colors hover:bg-muted/50")}
            >
              {body}
            </Link>
          ) : (
            <div key={tile.label} className={TILE_CLASS}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="text-h3">{adminOverview.latest.title}</h2>
          {latest.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {adminOverview.latest.empty}
            </p>
          ) : (
            <ul className="mt-2">
              {latest.map((item) => (
                <li key={item.id} className="border-b border-border">
                  <Link
                    href={`/admin/submissions/${item.id}`}
                    className="flex items-center gap-4 py-3"
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
                    <span className="tabular shrink-0 text-sm text-muted-foreground">
                      {formatRelative(item.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Link
              href="/admin/submissions"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {adminOverview.latest.viewAll}
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-h3">{adminOverview.team.title}</h2>
          <ul className="mt-4 grid gap-3">
            {team.map((member) => (
              <li key={member.id} className="flex items-center gap-3">
                <AdminAvatar email={member.email} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-sm">{member.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {member.lastSignIn
                      ? `${adminOverview.team.lastSeen} ${formatRelative(member.lastSignIn)}`
                      : adminOverview.team.never}
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
