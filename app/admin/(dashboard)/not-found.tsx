import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { adminNotFound } from "@/content/admin";
import { cn } from "@/lib/utils";

/**
 * Catches notFound() inside the dashboard (bad submission ids, mostly) so it
 * renders in the admin chrome instead of falling through to the public 404.
 */
export default function AdminNotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-h3">{adminNotFound.title}</p>
      <p className="mt-3 text-muted-foreground">{adminNotFound.body}</p>
      <div className="mt-8">
        <Link
          href="/admin/submissions"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {adminNotFound.cta}
        </Link>
      </div>
    </div>
  );
}
