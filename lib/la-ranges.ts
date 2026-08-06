/**
 * LA-local date boundaries with native Intl only, no date library. The
 * office runs on America/Los_Angeles (components/admin/dates.ts pins its
 * display formatting the same way), so export ranges and the overview's
 * 7-day tile draw their midnights there, not in UTC.
 */

const LA = "America/Los_Angeles";

export type RangePreset = "today" | "7d" | "30d" | "month" | "all";

// Offset of LA from UTC at a given instant: format the instant in LA,
// reinterpret those wall-clock parts as UTC, diff the two.
function laOffsetMs(at: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: LA,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(at)
      .map((part) => [part.type, part.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - at.getTime();
}

// UTC instant of LA-local midnight for an LA calendar date. The two-pass
// loop converges across DST transitions: guess with one offset, correct
// with the offset at the guess.
function laMidnightUtc(year: number, month: number, day: number): Date {
  let ts = Date.UTC(year, month - 1, day, 8);
  for (let i = 0; i < 2; i += 1) {
    ts = Date.UTC(year, month - 1, day) - laOffsetMs(new Date(ts));
  }
  return new Date(ts);
}

// Today's LA calendar date; en-CA formats as YYYY-MM-DD.
function laToday(now: Date): [number, number, number] {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: LA,
  })
    .format(now)
    .split("-")
    .map(Number);
  return [year, month, day];
}

/**
 * Inclusive lower bound for a preset; null means unbounded. The 7d/30d
 * windows run from LA midnight N-1 days back through now, so today counts,
 * and the overview tile reuses this so tile and export always agree.
 */
export function rangeStart(preset: RangePreset, now = new Date()): Date | null {
  if (preset === "all") return null;
  const [year, month, day] = laToday(now);
  if (preset === "today") return laMidnightUtc(year, month, day);
  if (preset === "month") return laMidnightUtc(year, month, 1);
  const back = preset === "7d" ? 6 : 29;
  // Date.UTC normalizes day underflow, so month/year rollovers are free.
  const shifted = new Date(Date.UTC(year, month - 1, day - back));
  return laMidnightUtc(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
  );
}

/** YYYY-MM-DD in LA, for the export filename. */
export function laDateStamp(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: LA }).format(now);
}
