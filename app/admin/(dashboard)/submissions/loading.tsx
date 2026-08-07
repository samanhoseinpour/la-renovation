import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the inbox chrome at real heights: title, tab strip, toolbar,
 *  select-all, then flush border-b rows, so the stream-in barely moves. */
export default function SubmissionsLoading() {
  return (
    <div>
      <Skeleton className="h-10 w-64" />
      <div className="mt-4 flex items-center gap-x-5 border-b border-border py-3 sm:mt-6 sm:gap-x-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-16" />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Skeleton className="h-8 min-w-0 flex-1 basis-64 pointer-coarse:h-11 sm:max-w-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-28 pointer-coarse:h-11" />
          <Skeleton className="h-7 w-28 pointer-coarse:h-11" />
        </div>
      </div>
      <div className="mt-6 flex min-h-8 items-center">
        <Skeleton className="size-4 rounded-[4px]" />
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border py-3.5 sm:py-4"
        >
          <Skeleton className="size-4 shrink-0 rounded-[4px]" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
