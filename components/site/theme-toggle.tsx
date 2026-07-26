"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Both icons are always rendered and swapped purely with the `dark:` variant.
 * That avoids the usual next-themes mounted-state dance: there is no render
 * that depends on knowing the theme, so there is no hydration mismatch and no
 * flash of the wrong icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-transform duration-200 ease-editorial dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-transform duration-200 ease-editorial dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
