"use client";

import { useEffect, useRef } from "react";

import { setSubmissionStatus } from "@/app/admin/(dashboard)/submissions/actions";

/**
 * Marks a new submission read once, from an effect. Never during server
 * render: Link prefetch would mark rows read from hover.
 */
export function MarkReadOnOpen({ id }: { id: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    setSubmissionStatus(id, "read").catch((error) =>
      console.error("[admin] Mark-read failed:", error),
    );
  }, [id]);
  return null;
}
