# Araz Construction Group

Marketing site for Araz Construction Group, an Orange County general contractor building multifamily, commercial, and civil projects across Southern California. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home: full-bleed viewport hero, featured projects, the seven divisions, client notes
- `/projects` and `/projects/[slug]` — portfolio index (one featured project over a supporting grid) and case studies with a draggable before/after compare gallery, a full-screen photo lightbox, plus a matched client note where one exists
- `/services` and `/services/[slug]` — index of the seven divisions (multifamily, commercial, civil, energy, concrete, single-family, preconstruction) with a sticky image pane, process timeline and FAQ; division pages carry the narrative and included scopes. The four legacy renovation slugs redirect permanently to `/services`
- `/about` — company story, mission and vision, team, and approach, each an anchored section (`#story`, `#mission`, `#team`, `#approach`)
- `/contact` — enquiry form (project type and project stage) backed by a server action with email delivery
- `/faq` — every question grouped by topic behind an xl-and-up topic rail, each group rendered through the shared `FaqList`
- `/careers` — values grid and a general-application panel; no openings to list, so there's no listings table
- `/licenses` — how to verify a contractor's license, plus a bond/insurance summary; exists on disk but isn't linked from the footer or sitemap until the real CSLB number lands
- `/privacy`, `/terms`, `/accessibility` — legal pages sharing one structured long-form renderer
- `/sitemap` — a designed index of every page, grouped into pages, projects, services and legal; browsers that open `/sitemap.xml` land here through an Accept-header redirect while crawlers still receive the XML
- `/styleguide` — internal design reference (tokens, type scale, components)

## Where things live

- `app/(site)/` — public routes, sharing one layout with header and footer
- `components/layout/` — `Container`, `Section`, `ArrowLink` primitives
- `components/motion/` — `Reveal` entrance animation, Lenis smooth scroll, reduced-motion-aware provider
- `components/sections/` — page sections, composed by the route files; `compare-slider` + `compare-gallery` power the before/after viewer, `gallery-lightbox` the full-screen photo viewer, `faq-topics` the xl-gated topic rail on `/faq`, `careers-overview` the values grid and application panel on `/careers`, `legal-article` the structured renderer shared by `/privacy`, `/terms` and `/accessibility`, `sitemap-directory` the grouped page index on `/sitemap`
- `components/site/` — header, mega menu, mobile nav, footer, theme toggle, skip link, scroll-progress hairline, back-to-top button, theme-color sync
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `content/` — projects, services, about, team and studio copy, the image manifest and the nav-panel projection; `faq.ts`, `careers.ts`, `legal.ts` and `licenses.ts` back the six support routes; `sitemap.ts` projects the site tree for `/sitemap`
- `lib/site.ts` — single source of truth for name, nav, contact details and license
- `lib/delivery.ts` — email delivery boundary used by the contact action
- `scripts/` — the image pipeline (AVIF migration and size auditing)

Site copy and data live in `content/` and `lib/site.ts`, not in components. Copy stays in a no-figures register: no prices, durations, square footage or invented history anywhere on the site.

## Navigation

Desktop navigation is an animated mega menu with a Home link up front: Projects, Services and About each open a full-width panel under the header, with a live image that follows the hovered row. The triggers are links too — hover opens the panel, click goes straight to the section route; on touch, where there is no hover, a tap opens the panel instead. The About panel links to the anchored sections of `/about`; anchor landings clear the sticky header from both same-page and cross-page navigation. The header hides on scroll down and returns on scroll up, staying pinned while a menu is open. On mobile the same three groups expand in place inside the sheet. Panel data is projected from `content/` by `content/nav.ts`, so the menu stays in sync with the portfolio.

A steel hairline along the top of the viewport tracks reading position, and a back-to-top button fades in once the page is about two screens deep — smooth-scrolling through Lenis on desktop, instantly for reduced-motion users. Keyboard users get a skip-to-content link ahead of the header. Route changes crossfade through the View Transitions API behind Next's experimental `viewTransition` flag; browsers without support simply swap.

## Contact form delivery

The contact action sends enquiries through Resend. Connect it via the Vercel
Marketplace (or set `RESEND_API_KEY` in `.env.local`); until the key exists the
form shows an honest "email us directly" error instead of a fake success.
`CONTACT_FROM_EMAIL` overrides the onboarding sender once the company's domain
is verified.

## Images

Team portraits are self-hosted AVIFs in `public/images/team/`, cropped 3:4 and kept under 100KB each. The pipeline lives in `scripts/`:

```bash
npm run images:migrate   # convert source photos to AVIF (supports --aspect W:H cover crops)
npm run images:audit     # dry-run size report, e.g. -- public/images/team --max-kb 100
npm run images:optimize  # re-encode anything over budget
```

Everything else is temporary Unsplash placeholder imagery, including the project case studies and their before/after pairs; swapping an image means editing one line in `content/`. When real project photography lands, update the allowed host in `next.config.ts`.

## Placeholders awaiting client data

- Contact email, phone and street address in `lib/site.ts`
- The CSLB license number (footer renders it only once set)
- `app/icon.svg` is a typed "A" monogram until the real mark arrives
- Project case studies and all Unsplash photography

## Design system

Design tokens (color, type scale, spacing, radii) are defined in `app/globals.css`. The `/styleguide` route renders them live. Light theme is the default; dark mode is available through the header toggle. The scrollbar and the browser's `theme-color` chrome follow the active theme through the same tokens.

## License

MIT — see [LICENSE](./LICENSE).
