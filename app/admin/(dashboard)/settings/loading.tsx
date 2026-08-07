import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the settings page: a title over four stacked cards. */
export default function SettingsLoading() {
  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}
