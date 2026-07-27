import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ArrowLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Renders an outbound glyph and adds rel/target. */
  external?: boolean;
};

/**
 * The editorial call-to-action: a label plus a boxed arrow that steps forward
 * on hover. Deliberately not a Button variant; it reads as text, not a control.
 */
export function ArrowLink({
  href,
  external = false,
  className,
  children,
  ...props
}: ArrowLinkProps) {
  const Glyph = external ? ArrowUpRight : ArrowRight;

  return (
    <Link
      href={href}
      className={cn(
        // -my cancels the padding in layout; the padding still counts toward
        // the hit box, so the target clears 44px without shifting anything.
        "group/arrow -my-2 inline-flex items-center gap-3 py-2 text-sm font-medium text-foreground",
        "rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {/* border-transparent rather than border-current/0: an opacity modifier
          on `current` compiles to a color-mix() over currentcolor, which
          crashes Safari < 17. */}
      <span className="border-b border-transparent pb-0.5 transition-colors duration-200 ease-editorial group-hover/arrow:border-foreground">
        {children}
      </span>
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full border border-foreground/30 transition-colors duration-200 ease-editorial group-hover/arrow:border-foreground"
      >
        <Glyph className="size-3.5 transition-transform duration-200 ease-editorial group-hover/arrow:translate-x-px" />
      </span>
    </Link>
  );
}
