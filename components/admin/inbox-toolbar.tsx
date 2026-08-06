import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminInbox } from "@/content/admin";
import type { InboxFilter } from "@/lib/db/submissions";

/**
 * Search and export controls: two plain GET forms, zero client state.
 * Search is a deliberate Enter-key act rather than typeahead, consistent
 * with the server-driven inbox; submitting naturally drops any ?before=
 * cursor, which is correct (a new query restarts paging). The export form
 * mirrors the current view and downloads in place.
 */
export function InboxToolbar({
  active,
  q,
}: {
  active: InboxFilter;
  q?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
      <form
        method="get"
        action="/admin/submissions"
        className="flex min-w-0 flex-1 basis-64 items-center gap-2 sm:max-w-md"
      >
        {active !== "all" && (
          <input type="hidden" name="status" value={active} />
        )}
        <Input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder={adminInbox.search.placeholder}
          aria-label={adminInbox.search.placeholder}
        />
        <Button type="submit" variant="outline" size="sm">
          {adminInbox.search.submit}
        </Button>
        {q && (
          <Link
            href={
              active === "all"
                ? "/admin/submissions"
                : `/admin/submissions?status=${active}`
            }
            className="text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
          >
            {adminInbox.search.clear}
          </Link>
        )}
      </form>

      <form
        method="get"
        action="/admin/submissions/export"
        className="flex items-center gap-2"
      >
        {active !== "all" && (
          <input type="hidden" name="status" value={active} />
        )}
        {q && <input type="hidden" name="q" value={q} />}
        <Select name="range" defaultValue="30d">
          <SelectTrigger size="sm" aria-label={adminInbox.exportCsv.rangeLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(adminInbox.exportCsv.ranges).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline" size="sm">
          {adminInbox.exportCsv.button}
        </Button>
      </form>
    </div>
  );
}
