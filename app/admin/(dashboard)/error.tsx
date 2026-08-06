"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { adminError } from "@/content/admin";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // Same convention as app/error.tsx: Next 16.2 prefers unstable_retry over
  // the older `reset` prop — it re-renders the failed segment on the server
  // rather than only resetting client state.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-h2">{adminError.title}</h1>
      <p className="mt-4 text-muted-foreground">{adminError.body}</p>
      <Button
        variant="outline"
        className="mt-8"
        onClick={() => unstable_retry()}
      >
        {adminError.retry}
      </Button>
    </div>
  );
}
