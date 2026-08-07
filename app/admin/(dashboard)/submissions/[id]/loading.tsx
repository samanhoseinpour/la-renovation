import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the detail page: back pill and triage links, title with badge,
 *  actions circle, the metadata band, message, reply CTA. */
export default function SubmissionLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40 rounded-full pointer-coarse:h-11" />
        <Skeleton className="h-7 w-36 rounded-full pointer-coarse:h-11" />
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-56" />
          <Skeleton className="mt-3 h-5 w-24 rounded-4xl" />
        </div>
        <Skeleton className="size-8 rounded-full pointer-coarse:size-11" />
      </div>
      <div className="mt-8 grid gap-x-10 gap-y-4 border-y border-border py-6 sm:grid-cols-2 sm:gap-y-5">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-5 w-40" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-28 w-full" />
      <Skeleton className="mt-10 h-9 w-44 rounded-full pointer-coarse:h-11" />
    </div>
  );
}
