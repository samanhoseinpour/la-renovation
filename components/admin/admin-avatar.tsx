import { UserRound } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

import { adminAvatars } from "@/content/admin";
import { cn } from "@/lib/utils";

function maskStyle(src: string): CSSProperties {
  const mask = `url("${src}")`;
  return {
    maskImage: mask,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: mask,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  };
}

/**
 * Identity avatar for the admin accounts: team portrait, ink-mask logo, or
 * the house UserRound glyph when an email has no entry. Hand-rolled instead
 * of a ui/avatar primitive because only the photo case is an image at all.
 */
export function AdminAvatar({
  email,
  size = 32,
  className,
}: {
  email: string;
  size?: number;
  className?: string;
}) {
  const entry = adminAvatars[email.toLowerCase()];
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {entry?.kind === "photo" ? (
        <Image
          src={entry.src}
          alt={entry.alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : entry?.kind === "mask" ? (
        <>
          {/* The inset keeps the wide wordmark off the circular clip. */}
          <span
            aria-hidden
            className="absolute inset-[18%] bg-foreground"
            style={maskStyle(entry.src)}
          />
          <span className="sr-only">{entry.alt}</span>
        </>
      ) : (
        <UserRound
          aria-hidden
          strokeWidth={1.25}
          className="size-[55%] text-muted-foreground/50"
        />
      )}
    </span>
  );
}
