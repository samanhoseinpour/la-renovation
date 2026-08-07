import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Covers /admin, the overview; the tile grid mirrors its 2+1 phone layout.
 *  Settings and the submissions segments carry their own loading files. */
export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-10 w-64" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={i}
            className={cn("h-24 w-full", i === 2 && "max-sm:col-span-2")}
          />
        ))}
      </div>
      <Skeleton className="mt-10 h-64 w-full" />
    </div>
  );
}
