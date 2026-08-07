import Link from "next/link";

import { AdminEmpty } from "@/components/admin/admin-empty";
import { formatFull, formatRelative } from "@/components/admin/dates";
import { inboxHref } from "@/components/admin/inbox-params";
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
import type { RangePreset } from "@/lib/la-ranges";
import { cn } from "@/lib/utils";

export function SubmissionList({
  page,
  counts,
  failed,
  active,
  q,
  range,
  before,
  after,
}: {
  page: InboxPage;
  counts: Record<SubmissionStatus, number>;
  failed: number;
  active: InboxFilter;
  q?: string;
  range: RangePreset;
  /** Raw cursors of the current page, when it sits behind one. */
  before?: string;
  after?: string;
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
  // Quiet while the pipeline is healthy; always present when it's the view,
  // so a bookmarked failed URL keeps its active tab at zero.
  if (failed > 0 || active === "failed") {
    filters.push({
      key: "failed",
      label: adminInbox.filters.failed,
      count: failed,
    });
  }

  const first = page.items[0];
  const last = page.items.at(-1);
  const cursored = Boolean(before || after);
  // On an after-page hasMore points newer; everywhere else it points older.
  const showNewer = Boolean(first) && (before ? true : Boolean(after) && page.hasMore);
  const showOlder = Boolean(last) && (after ? true : page.hasMore);

  return (
    <div>
      <h1 className="text-h2">{adminInbox.title}</h1>

      {/* One scrollable row at every width; the sub-md edge bleed doubles as
          the scroll affordance. */}
      <nav
        aria-label={adminInbox.filtersLabel}
        className="-mx-4 mt-4 overflow-x-auto border-b border-border px-4 scrollbar-none sm:mt-6 md:mx-0 md:px-0"
      >
        <div className="flex items-center gap-x-5 text-sm whitespace-nowrap sm:gap-x-6">
          {filters.map((filter) => (
            <Link
              key={filter.key}
              href={inboxHref({ status: filter.key, q, range })}
              aria-current={active === filter.key ? "page" : undefined}
              className={cn(
                "py-3 transition-colors",
                active === filter.key
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label} <span className="tabular">{filter.count}</span>
            </Link>
          ))}
        </div>
      </nav>

      <InboxToolbar active={active} q={q} range={range} />

      {page.items.length === 0 ? (
        cursored ? (
          // A stale cursor page is a dead end without a way back to page one.
          <AdminEmpty
            variant="filtered"
            cta={{
              label: adminInbox.pagination.newest,
              href: inboxHref({ status: active, q, range }),
            }}
          />
        ) : active === "all" && !q && range === "all" ? (
          <AdminEmpty variant="all" />
        ) : active === "failed" && !q && range === "all" ? (
          <AdminEmpty variant="failed" />
        ) : (
          <AdminEmpty
            variant="filtered"
            cta={{
              label: adminInbox.empty.filtered.cta,
              href: inboxHref({ status: "all" }),
            }}
          />
        )
      ) : (
        <SelectionProvider
          key={`${active}|${q ?? ""}|${range}|${before ?? ""}|${after ?? ""}`}
          visibleIds={page.items.map((item) => item.id)}
        >
          {q && (
            // The tab counts stay global; this line answers the search.
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              <span className="tabular">
                {page.items.length}
                {page.hasMore ? "+" : ""}
              </span>{" "}
              {page.items.length === 1
                ? adminInbox.search.matchOne
                : adminInbox.search.matchMany}
            </p>
          )}
          <div className="mt-6 flex min-h-8 items-center gap-3">
            <SelectAllCheckbox />
          </div>
          {/* Row li is flex-wrap solely so the actions error span
              (basis-full) can drop below the row; every other child is
              width-constrained, so nothing else ever wraps. */}
          <ul aria-label={adminInbox.title}>
            {page.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-x-2 border-b border-border sm:gap-x-3"
              >
                <RowCheckbox id={item.id} name={item.name} />
                <Link
                  href={`/admin/submissions/${item.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3 py-3.5 sm:gap-4 sm:py-4"
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      item.status === "new" ? "bg-brand" : "bg-transparent",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-x-3">
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          item.status === "new" && "font-medium",
                        )}
                      >
                        {item.status === "new" && (
                          <span className="sr-only">
                            {adminInbox.unread}:{" "}
                          </span>
                        )}
                        {item.name}
                        {item.company ? ` · ${item.company}` : ""}
                      </span>
                      <time
                        dateTime={item.createdAt.toISOString()}
                        title={formatFull(item.createdAt)}
                        className="tabular shrink-0 text-xs text-muted-foreground sm:text-sm"
                      >
                        {formatRelative(item.createdAt)}
                      </time>
                    </span>
                    <span className="mt-0.5 flex items-center gap-x-2">
                      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                        {item.message}
                      </span>
                      {item.services && item.services.length > 0 && (
                        // max-w keeps a many-chip pick from crushing the
                        // message preview; extra badges wrap right-aligned.
                        <span className="flex max-w-56 shrink-0 flex-wrap justify-end gap-1 max-sm:hidden">
                          {item.services.map((title) => (
                            <Badge key={title} variant="secondary">
                              {title}
                            </Badge>
                          ))}
                        </span>
                      )}
                      {item.delivery !== "sent" && (
                        // Stays visible at every width: it is the failed
                        // view's whole point.
                        <Badge
                          variant={
                            item.delivery === "failed"
                              ? "destructive"
                              : "outline"
                          }
                          className="shrink-0"
                        >
                          {adminInbox.delivery[item.delivery]}
                        </Badge>
                      )}
                    </span>
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
          {(showNewer || showOlder || cursored) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {showNewer && first && (
                <Link
                  href={inboxHref({
                    status: active,
                    q,
                    range,
                    after: `${first.cursor}_${first.id}`,
                  })}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  {adminInbox.pagination.newer}
                </Link>
              )}
              {showOlder && last && (
                <Link
                  href={inboxHref({
                    status: active,
                    q,
                    range,
                    before: `${last.cursor}_${last.id}`,
                  })}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  {adminInbox.pagination.older}
                </Link>
              )}
              {cursored && (
                <Link
                  href={inboxHref({ status: active, q, range })}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  {adminInbox.pagination.newest}
                </Link>
              )}
            </div>
          )}
          {/* Must stay the provider's last child: the bar is sticky-bottom
              and only floats because it renders at the end of the flow. */}
          <SelectionBar />
        </SelectionProvider>
      )}
    </div>
  );
}
