export const aboutIntro =
  "Araz Construction Group builds across Southern California, from the ground up.";

export const aboutStory = [
  "Araz Construction Group was built around a straightforward observation: the parts of a project that go wrong are usually the parts that get handed off.",
  "Site work goes to one contractor. Foundations to another. Structural to a third. Energy systems arrive last, designed by someone who never saw the site. Each handoff is a seam, and seams are where schedules slip and budgets move.",
  "We built this company to close those seams. Civil, concrete, foundations, structure, and energy infrastructure are divisions here, staffed, equipped, and accountable to the same schedule. When something changes in the field, one company absorbs it.",
];

export const aboutFacts = [
  { label: "Reach", value: "Southern California" },
  { label: "Divisions", value: "Seven" },
  { label: "Model", value: "Self-perform first" },
];

export const mission = {
  title: "Close the seams.",
  body: "Most of what goes wrong in construction happens where one company's work ends and another's begins. Our mission is to hold the critical scopes under one roof: one number, one schedule, one company answering for the result.",
};

export const vision = {
  title: "Ground to grid.",
  body: "A Southern California builder that takes a project from raw ground to a building with its systems running: sitework, structure, and energy engineered together rather than assembled by strangers.",
};

export const approach = [
  { title: "Price it before it's drawn", body: "Most projects are priced twice: once optimistically at the start, once accurately after the drawings are done. We price alongside design, so the cost of a decision is known when the decision is made." },
  { title: "Understand the ground first", body: "Soil, drainage, access, and utilities decide more about a budget than finishes do. We resolve them before design commits." },
  { title: "Own the critical path", body: "Earthwork, concrete, and structure set the schedule. We self-perform them so the risk sits with us instead of moving between parties while the clock runs." },
  { title: "Build the systems in", body: "Energy infrastructure is no longer an add-on. We engineer it as part of the building rather than fitting it around one." },
];

export type Commitment = { title: string; body: string };

/** #commitments on /about — written as how we work, never as records or certifications. */
export const commitments: Commitment[] = [
  {
    title: "Safety",
    body: "Planning the work includes planning how it's done without hurting anyone. Sequencing, protection, and housekeeping are part of the schedule, and anyone on site can stop work that doesn't look right without being asked to justify it later.",
  },
  {
    title: "Quality",
    body: "Quality is decided when the work is set up, not when it's inspected. We build to what the drawings intend, flag what won't hold up while it can still be corrected, and don't cover work we wouldn't stand behind.",
  },
  {
    title: "Communication",
    body: "The update you get is the one we'd want as an owner: what changed, what it touches, and what we're doing about it, delivered while there's still time to decide instead of after the fact.",
  },
];

export type AboutCareersCopy = {
  eyebrow: string;
  statement: string;
  body: string;
  link: { label: string; href: string };
};

/** Careers hinge band on /about. Deliberately not a careersValues reuse — those are /careers' own outline. */
export const aboutCareers: AboutCareersCopy = {
  eyebrow: "Careers",
  statement: "Built by people who'd rather build than broker.",
  body: "The scopes that decide a project run under this roof, and so do the people who run them. If building the critical path sounds better than administering it, we'd like to hear from you.",
  link: { label: "Explore careers", href: "/careers" },
};
