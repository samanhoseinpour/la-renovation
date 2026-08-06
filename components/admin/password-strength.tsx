"use client";

import { useEffect, useState } from "react";

import { adminStrength } from "@/content/admin";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";

type Checker = InstanceType<typeof import("@zxcvbn-ts/core").ZxcvbnFactory>;

let checkerPromise: Promise<Checker> | null = null;

// One fetch per page load, shared by every meter instance. The dictionary
// chunk is large, so it stays an async import: nothing outside the admin
// password forms ever references it, and they only pull it on the first
// keystroke.
function loadChecker(): Promise<Checker> {
  checkerPromise ??= Promise.all([
    import("@zxcvbn-ts/core"),
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en"),
  ]).then(
    ([core, common, en]) =>
      new core.ZxcvbnFactory({
        dictionary: { ...common.dictionary, ...en.dictionary },
        graphs: common.adjacencyGraphs,
        translations: en.translations,
      }),
  );
  return checkerPromise;
}

const TIERS = [
  { segments: 1, label: adminStrength.weak, color: "bg-destructive" },
  { segments: 2, label: adminStrength.fair, color: "bg-muted-foreground" },
  { segments: 3, label: adminStrength.good, color: "bg-brand/70" },
  { segments: 4, label: adminStrength.strong, color: "bg-brand" },
] as const;

function tierIndex(score: number, length: number): number {
  // Never call a password the server would reject anything but weak.
  if (length < MIN_PASSWORD_LENGTH) return 0;
  return score <= 1 ? 0 : score - 1;
}

/**
 * Advisory strength meter; it never blocks submit, the server owns the
 * floor. Renders its full height from mount so appearing feedback shifts
 * no layout.
 */
export function PasswordStrength({ password }: { password: string }) {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    // No reset on empty: the render guard below already ignores the stale
    // score once the field is cleared, and every non-empty change recomputes.
    if (!password) return;
    let stale = false;
    // Debounced, and capped at 64 chars: zxcvbn is superlinear in length.
    const timer = setTimeout(() => {
      void loadChecker().then((checker) => {
        if (!stale) setScore(checker.check(password.slice(0, 64)).score);
      });
    }, 150);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [password]);

  const tier =
    password && score !== null ? TIERS[tierIndex(score, password.length)] : null;

  return (
    <div className="grid gap-1.5">
      <div
        role="meter"
        aria-label={adminStrength.label}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={tier ? tier.segments : 0}
        aria-valuetext={tier?.label}
        className="grid grid-cols-4 gap-1"
      >
        {TIERS.map((entry, index) => (
          <span
            key={entry.label}
            className={cn(
              "h-1 rounded-full bg-border transition-colors",
              tier && index < tier.segments && tier.color,
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {tier?.label}
      </p>
    </div>
  );
}
