import type { Metadata } from "next";

import { ArrowLink } from "@/components/layout/arrow-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Section size="lg" className="w-full">
        <Container>
          <p className="text-eyebrow text-muted-foreground">Error 404</p>
          <h1 className="mt-6 max-w-2xl text-display-2">
            This page has been{" "}
            <em className="not-italic text-muted-foreground">
              taken back to frame.
            </em>
          </h1>
          <p className="mt-6 max-w-md text-lead text-muted-foreground">
            The page you were looking for doesn&rsquo;t exist, or it moved
            somewhere more sensible.
          </p>
          <div className="mt-10">
            <ArrowLink href="/">Back to the studio</ArrowLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
