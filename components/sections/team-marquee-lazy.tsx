"use client";

import dynamic from "next/dynamic";

import type { MarqueeMember } from "@/components/sections/team-marquee-rail";

// A client wrapper on purpose: dynamic() only code-splits from client files;
// a server component's dynamic() of a client leaf loads eagerly (see the
// lazy-loading guide in node_modules/next/dist/docs). From here the rail and
// react-fast-marquee become their own async chunk fetched after hydration,
// off the route's initial client graph. SSR stays on, so the rail's markup
// is in the server HTML and nothing shifts when the chunk lands.
const Rail = dynamic(() =>
  import("./team-marquee-rail").then((mod) => mod.TeamMarqueeRail),
);

export function TeamMarqueeLazy({ members }: { members: MarqueeMember[] }) {
  return <Rail members={members} />;
}
