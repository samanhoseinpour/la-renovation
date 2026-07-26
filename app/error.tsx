"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  // Next.js 16.2 prefers unstable_retry over the older `reset` prop — it
  // re-renders the failed segment on the server rather than only resetting
  // the client boundary.
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center">
      <Section size="lg" className="w-full">
        <Container>
          <p className="text-eyebrow text-muted-foreground">Something failed</p>
          <h1 className="mt-6 max-w-2xl text-display-2">
            We hit an unexpected problem.
          </h1>
          <p className="mt-6 max-w-md text-lead text-muted-foreground">
            The page couldn&rsquo;t be rendered. Trying again often clears it.
          </p>
          {error.digest && (
            <p className="mt-4 text-sm tabular text-muted-foreground">
              Reference: {error.digest}
            </p>
          )}
          <div className="mt-10">
            <Button size="xl" onClick={() => unstable_retry()}>
              Try again
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
