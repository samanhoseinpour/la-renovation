import { adminLoading } from "@/content/admin";

/**
 * The admin loading state: a slow-breathing brand orb. CSS only (keyframes
 * in globals.css); the global reduced-motion clamp plus motion-reduce here
 * park it as a static blob.
 */
export function OrbLoader() {
  return (
    <div
      role="status"
      aria-label={adminLoading.label}
      className="flex min-h-[50vh] items-center justify-center"
    >
      <span
        aria-hidden
        className="size-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--brand)_0%,transparent_72%)] blur-[2px] motion-safe:animate-[orb-pulse_2.6s_ease-in-out_infinite] motion-reduce:animate-none"
      />
    </div>
  );
}
