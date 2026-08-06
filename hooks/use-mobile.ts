import * as React from "react"

const MOBILE_BREAKPOINT = 768

// useSyncExternalStore over useState+useEffect: matchMedia is external
// browser state, and setting state synchronously inside an effect body
// (rather than a subscription callback) trips react-hooks/set-state-in-effect.
function subscribe(onChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
