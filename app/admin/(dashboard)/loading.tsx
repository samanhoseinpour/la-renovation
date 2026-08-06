import { Skeleton } from "@/components/ui/skeleton";

/** Covers /admin (overview) and /admin/settings, the segments without
 *  their own loading file. Tiles-then-body approximates both layouts. */
export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-10 w-64" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="mt-10 h-64 w-full" />
    </div>
  );
}
