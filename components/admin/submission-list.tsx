import Link from "next/link";

import { AdminEmpty } from "@/components/admin/admin-empty";
import { formatRelative } from "@/components/admin/dates";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { Badge } from "@/components/ui/badge";
import { adminInbox } from "@/content/admin";
import type { Submission } from "@/lib/db/schema";
import type { InboxFilter, SubmissionStatus } from "@/lib/db/submissions";
import { cn } from "@/lib/utils";

export function SubmissionList({
  items,
  counts,
  active,
}: {
  items: Submission[];
  counts: Record<SubmissionStatus, number>;
  active: InboxFilter;
}) {
  const filters: { key: InboxFilter; label: string; count: number }[] = [
    {
      key: "all",
      label: adminInbox.filters.all,
      count: counts.new + counts.read + counts.archived,
    },
    { key: "new", label: adminInbox.filters.new, count: counts.new },
    { key: "read", label: adminInbox.filters.read, count: counts.read },
    {
      key: "archived",
      label: adminInbox.filters.archived,
      count: counts.archived,
    },
  ];

  return (
    <div>
      <h1 className="text-h2">{adminInbox.title}</h1>

      <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-3 text-sm">
        {filters.map((filter) => (
          <Link
            key={filter.key}
            href={
              filter.key === "all"
                ? "/admin/submissions"
                : `/admin/submissions?status=${filter.key}`
            }
            className={cn(
              "transition-colors",
              active === filter.key
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {filter.label} <span className="tabular">{filter.count}</span>
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <AdminEmpty variant={active === "all" ? "all" : "filtered"} />
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 border-b border-border"
              >
                <Link
                  href={`/admin/submissions/${item.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4 py-4"
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
                        "block truncate",
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
                  {item.service && (
                    <Badge variant="secondary" className="max-sm:hidden">
                      {item.service}
                    </Badge>
                  )}
                  {item.delivery !== "sent" && (
                    <Badge
                      variant={
                        item.delivery === "failed" ? "destructive" : "outline"
                      }
                    >
                      {adminInbox.delivery[item.delivery]}
                    </Badge>
                  )}
                  <span className="tabular shrink-0 text-sm text-muted-foreground">
                    {formatRelative(item.createdAt)}
                  </span>
                </Link>
                <SubmissionActions id={item.id} status={item.status} />
              </li>
            ))}
          </ul>
          {items.length === 200 && (
            <p className="mt-6 text-sm text-muted-foreground">
              {adminInbox.capNote}
            </p>
          )}
        </>
      )}
    </div>
  );
}
