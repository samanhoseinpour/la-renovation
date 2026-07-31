# Araz Construction Group

Marketing site for Araz Construction Group, a Southern California general contractor building multifamily, commercial, and civil projects across the region. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home: full-bleed viewport hero, a who-we-are intro, the seven divisions as a photo-card grid beside an intro rail that pins on desktop, a process strip, a Southern California coverage band, an auto-scrolling team marquee, an FAQ teaser and a closing CTA panel over jobsite photography; the featured-projects and client-notes sections are gated off until real material lands (see Publish gates)
- `/projects` and `/projects/[slug]` — currently a noindexed coming-soon page: the demo portfolio sits behind `published.projects`, the detail slugs 404, and the route stays out of the nav, footer and both sitemaps. The portfolio components (featured index, before/after compare gallery, lightbox, matched client notes) stay in the repo and return when the flag flips
- `/services` and `/services/[slug]` — index of the seven divisions (multifamily, commercial, civil, energy, concrete, single-family, preconstruction) with a sticky image pane, process timeline, a delivery-model band on who does the work (in-house crews versus named licensed partners) and a three-question featured FAQ; division pages carry the narrative and included scopes. The four legacy renovation slugs redirect permanently to `/services`
- `/about` — company story, mission and vision, team, approach and commitments, each an anchored section (`#story`, `#mission`, `#team`, `#approach`, `#commitments`), closing with a careers band into `/careers`
- `/contact` — enquiry form (project type and project stage) backed by a server action with email delivery
- `/faq` — every question grouped by topic behind an xl-and-up topic rail, each group rendered through the shared `FaqList`
- `/careers` — values grid and a general-application panel; no openings to list, so there's no listings table
- `/licenses` — how to verify a contractor's license, plus a bond/insurance summary; exists on disk but isn't linked from the footer or sitemap until the real CSLB number lands
- `/privacy`, `/terms`, `/accessibility` — legal pages sharing one structured long-form renderer
- `/sitemap` — a compact columned directory of every page, grouped into pages, projects, services and legal; browsers that open `/sitemap.xml` land here through an Accept-header redirect while crawlers still receive the XML
- `/styleguide` — internal design reference (tokens, type scale, components)
- Every unmatched URL — a chrome-less 404 with the wordmark holding its header slot: a brand plumb line drops onto a survey marker above a per-section verdict (projects, services, about and the rest each carry their own message, picked from the dead URL on the client), the attempted address prints struck through in the mono face, and two exits lead back to the studio and the sitemap

## Where things live

- `app/(site)/` — public routes, sharing one layout with header and footer
- `components/layout/` — `Container`, `Section`, `ArrowLink` primitives
- `components/motion/` — `Reveal` entrance animation, Lenis smooth scroll, reduced-motion-aware provider
- `components/sections/` — page sections, composed by the route files; `company-intro`, `division-showcase`, `process-strip`, `coverage-band`, `team-marquee` and `faq-teaser` compose the expanded home; `delivery-model` is the `/services` self-perform band; `studio-commitments` and `careers-band` extend `/about`; `compare-slider` + `compare-gallery` power the before/after viewer, `gallery-lightbox` the full-screen photo viewer, `faq-topics` the xl-gated topic rail on `/faq`, `careers-overview` the values grid and application panel on `/careers`, `legal-article` the structured renderer shared by `/privacy`, `/terms` and `/accessibility`, `sitemap-directory` the columned page index on `/sitemap`, `not-found-panel` the 404 body composed by `app/not-found.tsx`
- `components/site/` — header, mega menu, mobile nav, footer, theme toggle, skip link, scroll-progress hairline, overlay scroll thumb, back-to-top button, theme-color sync
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `content/` — `home.ts` owns all home copy, including the hero's; `services.ts` also carries the `/services` page copy and delivery-model band; `about.ts` also carries the commitments and careers-band copy; alongside projects, team and studio copy, the image manifest and the nav-panel projection; `faq.ts`, `careers.ts`, `legal.ts` and `licenses.ts` back the six support routes; `sitemap.ts` projects the site tree for `/sitemap`; `not-found.ts` holds the per-section 404 verdicts and both exit labels
- `lib/site.ts` — single source of truth for name, nav, contact details and license
- `lib/delivery.ts` — email delivery boundary used by the contact action
- `scripts/` — the image pipeline (AVIF migration and size auditing)

Site copy and data live in `content/` and `lib/site.ts`, not in components. Copy stays in a no-figures register: no prices, durations, square footage or invented history anywhere on the site.

## Navigation

Desktop navigation is an animated mega menu with a Home link up front: Services and About each open a full-width panel under the header (Projects rejoins them once the portfolio publishes), with a live image that follows the hovered row. The triggers are links too — hover opens the panel, click goes straight to the section route; on touch, where there is no hover, a tap opens the panel instead. The About panel links to the anchored sections of `/about`; anchor landings clear the sticky header from both same-page and cross-page navigation. The header hides on scroll down and returns on scroll up, staying pinned while a menu is open. On mobile the same three groups expand in place inside the sheet. Panel data is projected from `content/` by `content/nav.ts`, so the menu stays in sync with the portfolio.

A steel hairline along the top of the viewport tracks reading position. The native scrollbar is hidden — its opaque gutter would sit as a light strip beside the full-bleed photo bands — and a slim steel thumb floats over the right edge of the content in its place on desktop. A back-to-top button fades in once the page is about two screens deep — smooth-scrolling through Lenis on desktop, instantly for reduced-motion users. Keyboard users get a skip-to-content link ahead of the header. Route changes crossfade through the View Transitions API behind Next's experimental `viewTransition` flag; browsers without support simply swap.

## Contact form delivery

The contact action sends enquiries through Resend. Connect it via the Vercel
Marketplace (or set `RESEND_API_KEY` in `.env.local`); until the key exists the
form shows an honest "email us directly" error instead of a fake success.
`CONTACT_FROM_EMAIL` overrides the onboarding sender once the company's domain
is verified.

## Images

Team portraits are self-hosted AVIFs in `public/images/team/`, cropped 3:4 and kept under 100KB each. The home hero (`public/images/home/`) and the About lead photo (`public/images/about/`) are the client's own banners, also AVIF and both inside the default 150KB budget. The pipeline lives in `scripts/`:

```bash
npm run images:migrate   # convert source photos to AVIF (supports --aspect W:H cover crops)
npm run images:audit     # dry-run size report, e.g. -- public/images/team --max-kb 100
npm run images:optimize  # re-encode anything over budget
```

Everything else is temporary Unsplash placeholder imagery, including the project case studies and their before/after pairs; swapping an image means editing one line in `content/`. When real project photography lands, update the allowed host in `next.config.ts`.

## Publish gates

`published` in `lib/site.ts` gates content that exists in the repo but isn't ready to show. `published.projects` keeps the demo portfolio dark: no nav item, no footer links, no sitemap entries, `/projects` renders a noindexed coming-soon page and the detail slugs 404. `published.testimonials` keeps the client notes off the home page until there are real clients behind them. Flip a flag to `true` and every surface comes back on its own — nothing is deleted. Same rule as the unset CSLB number: nothing unverified renders.

## Placeholders awaiting client data

- Contact email, phone and street address in `lib/site.ts`
- The CSLB license number (footer renders it only once set)
- `app/icon.svg` is a typed "A" monogram until the real mark arrives
- The demo project case studies and client notes, gated behind `published` until real ones exist
- The remaining Unsplash photography (services, project galleries, four of the five About images, the home intro diptych and the home coverage-band photo)

## Design system

Design tokens (color, type scale, spacing, radii) are defined in `app/globals.css`. The `/styleguide` route renders them live. Light theme is the default; dark mode is available through the header toggle. The overlay scroll thumb and the browser's `theme-color` chrome follow the active theme through the same tokens.

## License

MIT — see [LICENSE](./LICENSE).
