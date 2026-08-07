import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { adminInbox } from "@/content/admin";
import { cn } from "@/lib/utils";

export function AdminEmpty({
  variant,
  cta,
}: {
  variant: "all" | "filtered" | "failed";
  /** Optional exit: clear the filters, or step off a stale cursor page. */
  cta?: { label: string; href: string };
}) {
  const copy = adminInbox.empty[variant];
  return (
    <div className="py-16 text-center sm:py-24">
      {/* Real heading: the page h1 sits above, so the outline stays sound. */}
      <h2 className="text-h3">{copy.title}</h2>
      <p className="mt-3 text-muted-foreground">{copy.body}</p>
      {cta && (
        <div className="mt-6">
          <Link
            href={cta.href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {cta.label}
          </Link>
        </div>
      )}
    </div>
  );
}
