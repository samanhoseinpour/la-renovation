import { Skeleton } from "@/components/ui/skeleton";

export default function SubmissionLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-8 h-10 w-72" />
      <Skeleton className="mt-8 h-40 w-full" />
    </div>
  );
}
