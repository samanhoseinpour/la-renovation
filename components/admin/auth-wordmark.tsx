import Link from "next/link";

/**
 * The site header's typographic lockup, centered above the auth cards.
 * Identity rather than copy, so the strings stay literal the way
 * site-header's do.
 */
export function AuthWordmark() {
  return (
    <Link href="/" className="mb-8 block text-center">
      <span className="block text-base leading-none font-bold tracking-[0.2em]">
        ARAZ
      </span>
      <span className="mt-1 block text-[9px] leading-none font-medium tracking-[0.42em] opacity-70">
        CONSTRUCTION GROUP
      </span>
    </Link>
  );
}
