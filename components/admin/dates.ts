import { adminDates } from "@/content/admin";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelative(date: Date): string {
  const delta = date.getTime() - Date.now();
  for (const [unit, ms] of UNITS) {
    if (Math.abs(delta) >= ms) {
      return relative.format(Math.round(delta / ms), unit);
    }
  }
  return adminDates.justNow;
}

// Office-local time: the people reading the inbox are in California.
const full = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Los_Angeles",
});

export function formatFull(date: Date): string {
  return full.format(date);
}
