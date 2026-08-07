import type { InboxFilter } from "@/lib/db/submissions";
import type { RangePreset } from "@/lib/la-ranges";

export type InboxView = {
  status: InboxFilter;
  q?: string;
  range?: RangePreset;
  before?: string;
};

/**
 * Single source for inbox URLs, shared by the server list's Links and the
 * client toolbar's navigation. Defaults are omitted so canonical views keep
 * clean addresses; `before` is only ever set by "Load older", and every
 * filter change routes through here without it.
 */
export function inboxHref(view: InboxView): string {
  const params = new URLSearchParams();
  if (view.status !== "all") params.set("status", view.status);
  if (view.q) params.set("q", view.q);
  if (view.range && view.range !== "all") params.set("range", view.range);
  if (view.before) params.set("before", view.before);
  const query = params.toString();
  return query ? `/admin/submissions?${query}` : "/admin/submissions";
}
