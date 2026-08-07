"use client";

import { useEffect, useState } from "react";

import { adminStrength } from "@/content/admin";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";

type Checker = InstanceType<typeof import("@zxcvbn-ts/core").ZxcvbnFactory>;

let checkerPromise: Promise<Checker> | null = null;

// One fetch per page load, shared by every meter instance. The dictionary
// chunk is large, so it stays an async import: nothing outside the admin
// password forms ever references it, and the meter warms it on mount. A
// failed load clears the cache so the next keystroke retries, instead of
// pinning a rejected promise for the rest of the session.
function loadChecker(): Promise<Checker> {
  checkerPromise ??= Promise.all([
    import("@zxcvbn-ts/core"),
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en"),
  ])
    .then(
      ([core, common, en]) =>
        new core.ZxcvbnFactory({
          dictionary: { ...common.dictionary, ...en.dictionary },
          graphs: common.adjacencyGraphs,
          translations: en.translations,
        }),
    )
    .catch((error) => {
      checkerPromise = null;
      throw error;
    });
  return checkerPromise;
}

type Rating = {
  segments: number;
  label: string;
  color: string;
};

const TIERS: readonly Rating[] = [
  { segments: 1, label: adminStrength.weak, color: "bg-destructive" },
  { segments: 2, label: adminStrength.fair, color: "bg-muted-foreground" },
  { segments: 3, label: adminStrength.good, color: "bg-brand/70" },
  { segments: 4, label: adminStrength.strong, color: "bg-brand" },
];

// The server rejects anything below the floor, so length alone decides this
// verdict; no checker needed, which is what keeps it instant. Neutral color
// on purpose: an unfinished password is information, not an alarm.
const TOO_SHORT: Rating = {
  segments: 1,
  label: adminStrength.tooShort,
  color: "bg-muted-foreground",
};

/**
 * Advisory strength meter; it never blocks submit, the server owns the
 * floor. Renders its full height from mount so appearing feedback shifts
 * no layout.
 */
export function PasswordStrength({ password }: { password: string }) {
  // The tier is snapshotted in the same closure that ran the check, so a
  // stale score can never be paired with a newer password's length.
  const [scored, setScored] = useState<Rating | null>(null);

  // Warm the dictionary chunk while the field is still empty; by the first
  // scoreable keystroke the checker is usually ready.
  useEffect(() => {
    void loadChecker().catch(() => {});
  }, []);

  useEffect(() => {
    // Below the floor the verdict renders synchronously; scoring is wasted.
    if (password.length < MIN_PASSWORD_LENGTH) return;
    let stale = false;
    // Debounced, and capped at 64 chars: zxcvbn is superlinear in length.
    const timer = setTimeout(() => {
      loadChecker()
        .then((checker) => {
          if (stale) return;
          const { score } = checker.check(password.slice(0, 64));
          setScored(TIERS[score <= 1 ? 0 : score - 1]);
        })
        // Stay blank on a failed load; loadChecker cleared its cache, so
        // the next keystroke retries.
        .catch(() => {});
    }, 150);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [password]);

  // Past the floor, the previous rating may show for the debounce interval
  // while the new one computes; a consistent, slightly late verdict beats a
  // flickering one.
  const rating = !password
    ? null
    : password.length < MIN_PASSWORD_LENGTH
      ? TOO_SHORT
      : scored;

  return (
    <div className="grid gap-1.5">
      <div
        role="meter"
        aria-label={adminStrength.label}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={rating ? rating.segments : 0}
        aria-valuetext={rating?.label}
        className="grid grid-cols-4 gap-1"
      >
        {TIERS.map((entry, index) => (
          <span
            key={entry.label}
            className={cn(
              "h-1 rounded-full bg-border transition-colors",
              rating && index < rating.segments && rating.color,
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {rating?.label}
      </p>
    </div>
  );
}
