"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { setSubmissionStatus } from "@/app/admin/(dashboard)/submissions/actions";

/**
 * Marks a new submission read once, from an effect. Never during server
 * render: Link prefetch would mark rows read from hover.
 */
export function MarkReadOnOpen({ id }: { id: string }) {
  const router = useRouter();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    setSubmissionStatus(id, "read")
      .then(() => {
        // This view rendered before the flip, so the sidebar badge and tab
        // counts in it are already stale; refresh pulls the new numbers.
        router.refresh();
      })
      .catch((error) => console.error("[admin] Mark-read failed:", error));
  }, [id, router]);
  return null;
}
