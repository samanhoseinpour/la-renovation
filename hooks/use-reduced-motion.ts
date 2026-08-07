import * as React from "react"

// Replaces the motion library's useReducedMotion now that the dependency is
// gone. Same shape as use-mobile.ts: useSyncExternalStore over matchMedia,
// because media-query state is external browser state and setting React state
// inside an effect body trips react-hooks/set-state-in-effect.
const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// Motion-on for SSR/first paint: the consumers only park or skip decorative
// motion when this is true, and false matches motion's pre-detection null.
function getServerSnapshot() {
  return false
}

export function useReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
