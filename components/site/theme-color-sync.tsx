"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Keeps the browser-chrome color on theme. A static themeColor pair keyed to
 * prefers-color-scheme would be wrong here: the site ignores the OS setting
 * (defaultTheme="light", no enableSystem), so the html class written by the
 * header toggle is the only truth, and next-themes ships no meta writer.
 * Reading --background off the root element keeps this token-driven — a
 * palette edit in globals.css flows through with no color literal in TS.
 * The pathname dependency re-asserts the value after Next re-renders the
 * static viewport meta on client navigation. The viewport export in
 * app/layout.tsx stays as the SSR / pre-hydration value.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const background = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    if (!background) return;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = background;
  }, [resolvedTheme, pathname]);

  return null;
}
