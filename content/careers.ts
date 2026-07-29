export type CareersValue = {
  title: string;
  body: string;
};

/** PageHeader lead for /careers. */
export const careersIntro =
  "We self-perform the scopes most contractors broker out, so the people here spend their days building rather than coordinating. Field and office both.";

export const careersValues: CareersValue[] = [
  {
    title: "Build, don't broker",
    body: "Earthwork, concrete, structure, energy systems — the scopes that decide a project run under this roof, and the people who run them work here. You'd be building the critical path, not administering it.",
  },
  {
    title: "Field and office, one schedule",
    body: "Estimates are priced by people who have poured concrete. Schedules are built by people who have kept one. The distance between the trailer and the office stays short on purpose.",
  },
  {
    title: "Scope comes early",
    body: "Nobody spends a year holding a clipboard. Responsibility arrives as fast as you show you can carry it, with someone close enough to help when it gets heavy.",
  },
];

/** Closing invitation. The page renders the contact email alongside it. */
export const generalApplication = {
  heading: "Introduce yourself.",
  body: "There are no openings listed right now. Crews here grow when the work does. If you're in the trades or in preconstruction and this sounds like the way you'd want to work, send a resume or a few lines about what you've built. Every application gets read by someone who builds, and we remember the good ones when a spot opens.",
};
