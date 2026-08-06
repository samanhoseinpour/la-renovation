import Link from "next/link";

import { AdminEmpty } from "@/components/admin/admin-empty";
import { formatRelative } from "@/components/admin/dates";
import { InboxToolbar } from "@/components/admin/inbox-toolbar";
import {
  RowCheckbox,
  SelectAllCheckbox,
  SelectionProvider,
} from "@/components/admin/selection";
import { SelectionBar } from "@/components/admin/selection-bar";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { adminInbox } from "@/content/admin";
import type {
  InboxFilter,
  InboxPage,
  SubmissionStatus,
} from "@/lib/db/submissions";
import { cn } from "@/lib/utils";

function inboxHref(filter: InboxFilter, q?: string, before?: string): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("status", filter);
  if (q) params.set("q", q);
  if (before) params.set("before", before);
  const query = params.toString();
  return query ? `/admin/submissions?${query}` : "/admin/submissions";
}

export function SubmissionList({
  page,
  counts,
  active,
  q,
  before,
}: {
  page: InboxPage;
  counts: Record<SubmissionStatus, number>;
  active: InboxFilter;
  q?: string;
  /** Raw cursor of the current page, when it sits behind one. */
  before?: string;
}) {
  // Counts stay the global per-status totals even under search: cheap,
  // honest, and labeled as status counts rather than result counts.
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
  const last = page.items.at(-1);

  return (
    <div>
      <h1 className="text-h2">{adminInbox.title}</h1>

      <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-3 text-sm">
        {filters.map((filter) => (
          <Link
            key={filter.key}
            href={inboxHref(filter.key, q)}
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

      <InboxToolbar active={active} q={q} />

      {page.items.length === 0 ? (
        <AdminEmpty variant={active === "all" && !q ? "all" : "filtered"} />
      ) : (
        <SelectionProvider
          key={`${active}|${q ?? ""}|${before ?? ""}`}
          visibleIds={page.items.map((item) => item.id)}
        >
          <div className="mt-6 flex min-h-8 flex-wrap items-center gap-3">
            <SelectAllCheckbox />
            <SelectionBar />
          </div>
          <ul>
            {page.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 border-b border-border"
              >
                <RowCheckbox id={item.id} name={item.name} />
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
                <SubmissionActions
                  id={item.id}
                  status={item.status}
                  delivery={item.delivery}
                />
              </li>
            ))}
          </ul>
          {(page.hasMore || before) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {page.hasMore && last && (
                <Link
                  href={inboxHref(active, q, `${last.cursor}_${last.id}`)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  {adminInbox.pagination.older}
                </Link>
              )}
              {before && (
                <Link
                  href={inboxHref(active, q)}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  {adminInbox.pagination.newest}
                </Link>
              )}
            </div>
          )}
        </SelectionProvider>
      )}
    </div>
  );
}
