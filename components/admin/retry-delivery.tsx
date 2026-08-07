"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { adminSubmission } from "@/content/admin";
import { retryDelivery } from "@/app/admin/(dashboard)/submissions/actions";

/** Visible resend control for the detail page's failed-delivery block. */
export function RetryDelivery({ id }: { id: string }) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleRetry() {
    setFailed(false);
    startTransition(async () => {
      try {
        await retryDelivery(id);
        router.refresh();
      } catch {
        setFailed(true);
        // The recorded failure reason changed even so; refresh shows it.
        router.refresh();
      }
    });
  }

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={handleRetry}
      >
        {pending
          ? adminSubmission.actions.resending
          : adminSubmission.actions.resend}
      </Button>
      {failed && (
        <span role="status" className="text-sm text-destructive">
          {adminSubmission.actions.error}
        </span>
      )}
    </span>
  );
}
