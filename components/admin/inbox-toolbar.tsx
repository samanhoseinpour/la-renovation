"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { inboxHref, type InboxView } from "@/components/admin/inbox-params";
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
import { RANGE_PRESETS, type RangePreset } from "@/lib/la-ranges";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 275;

/**
 * Search and view controls. The search input navigates as you type: a
 * debounced router.replace with scroll pinned, inside a transition so the
 * current list stays visible while the next result streams in (no skeleton
 * flash). Every navigation drops ?before=; a stale cursor under a narrowed
 * view would render a misleading page. The export form stays a native GET
 * (a top-level download) mirroring the applied view.
 */
export function InboxToolbar({
  active,
  q,
  range,
}: {
  active: InboxFilter;
  q?: string;
  range: RangePreset;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(q ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Base view for navigations built inside a debounce closure: the ref holds
  // the latest committed props, so a timeout set before a tab click still
  // lands on the tab the admin is looking at.
  const view = useRef<InboxView>({ status: active, q, range });
  // The last q this island wrote; an external change (Back, tabs, Clear)
  // syncs the input, while our own round trip completing never clobbers
  // newer keystrokes.
  const lastWritten = useRef(q ?? "");

  useEffect(() => {
    view.current = { status: active, q, range };
  }, [active, q, range]);

  useEffect(() => {
    if ((q ?? "") !== lastWritten.current) {
      // An external change (Back, Clear, a tab link) owns the view now; a
      // debounce still in flight would resurrect the overwritten input.
      clearTimeout(timer.current);
      setValue(q ?? "");
      lastWritten.current = q ?? "";
    }
  }, [q]);

  // A pending debounce must not fire after the island unmounts.
  useEffect(() => () => clearTimeout(timer.current), []);

  function navigate(next: Partial<InboxView>, history: "replace" | "push") {
    // Any navigation supersedes a pending debounce; without this a range
    // pick inside the window gets clobbered by the stale replace.
    clearTimeout(timer.current);
    const href = inboxHref({ ...view.current, ...next, before: undefined });
    if (href === inboxHref({ ...view.current, before: undefined })) return;
    if ("q" in next) lastWritten.current = next.q ?? "";
    startTransition(() => {
      router[history](href, { scroll: false });
    });
  }

  function search(raw: string) {
    navigate({ q: raw.trim() || undefined }, "replace");
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          clearTimeout(timer.current);
          search(value);
        }}
        className="flex min-w-0 flex-1 basis-64 items-center gap-2 sm:max-w-md"
      >
        <Input
          type="search"
          name="q"
          value={value}
          maxLength={200}
          onChange={(event) => {
            const next = event.target.value;
            setValue(next);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => search(next), DEBOUNCE_MS);
          }}
          placeholder={adminInbox.search.placeholder}
          aria-label={adminInbox.search.placeholder}
        />
        {/* The delay means a fast response never flashes the dot. */}
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full bg-muted-foreground opacity-0 transition-opacity delay-100 duration-200",
            isPending && "opacity-100",
          )}
        />
        <span role="status" className="sr-only">
          {isPending ? adminInbox.search.searching : null}
        </span>
        {q && (
          <Link
            href={inboxHref({ status: active, range })}
            className="text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
          >
            {adminInbox.search.clear}
          </Link>
        )}
      </form>

      <div className="flex items-center gap-2">
        {/* items gives SelectValue its labels; without it Base UI serializes
            the raw preset token ("7d") into the trigger. */}
        <Select
          items={adminInbox.range.presets}
          value={range}
          onValueChange={(next) =>
            navigate({ range: next as RangePreset }, "push")
          }
        >
          <SelectTrigger size="sm" aria-label={adminInbox.range.label}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_PRESETS.map((preset) => (
              <SelectItem key={preset} value={preset}>
                {adminInbox.range.presets[preset]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <form
          method="get"
          action="/admin/submissions/export"
          className="flex items-center gap-2"
        >
          {active !== "all" && (
            <input type="hidden" name="status" value={active} />
          )}
          {q && <input type="hidden" name="q" value={q} />}
          {range !== "all" && (
            <input type="hidden" name="range" value={range} />
          )}
          <Button type="submit" variant="outline" size="sm">
            {adminInbox.exportCsv.button}
          </Button>
        </form>
      </div>
    </div>
  );
}
