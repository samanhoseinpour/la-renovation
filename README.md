# Araz Construction Group

Marketing site for Araz Construction Group, a Southern California general contractor building sustainable energy infrastructure (EV charging, geothermal) alongside commercial, civil, and multifamily projects across the region. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home: full-bleed viewport hero, a who-we-are intro, the seven divisions as a photo-card grid beside an intro rail that pins on desktop, a process strip, a Southern California coverage band, an auto-scrolling team marquee, an FAQ teaser, a partners band and a closing CTA panel over jobsite photography; the featured-projects and client-notes sections are gated off until real material lands (see Publish gates)
- `/projects` and `/projects/[slug]` — currently a noindexed coming-soon page: the demo portfolio sits behind `published.projects`, the detail slugs 404, and the route stays out of the nav, footer and both sitemaps. The portfolio components (featured index, before/after compare gallery, lightbox, matched client notes) stay in the repo and return when the flag flips
- `/services` and `/services/[slug]` — index of the seven divisions in the client's canonical order (energy, commercial, civil, multifamily, concrete, preconstruction, single-family) with a sticky image pane, process timeline, a delivery-model band on who does the work (in-house crews versus named licensed partners) and a three-question featured FAQ, closed by a brand statement; division pages carry the narrative and included scopes, five of them an in-depth band (energy's covers charging lead times and ground-source systems), two a brand statement, and each division its own closing CTA. The four legacy renovation slugs redirect permanently to `/services`
- `/about` — company story, mission and vision, team, a six-value approach closed by a brand statement, and commitments, each an anchored section (`#story`, `#mission`, `#team`, `#approach`, `#commitments`), closing with a careers band into `/careers` and the shared partners band
- `/contact` — enquiry form grouped under visible labels ("About you" / "The project"): tap-to-toggle chips pick any number of project types, radio chips the stage, and the message is optional; the browser pre-checks the same zod schema the server enforces, so errors show inline on submit and clear per field as they're fixed. Backed by a server action that stores the enquiry, then notifies the office by email (see Contact form delivery)
- `/faq` — every question grouped by topic behind an xl-and-up topic rail, each group rendered through the shared `FaqList`
- `/careers` — values grid and a general-application panel; no openings to list, so there's no listings table
- `/licenses` — how to verify a contractor's license, plus a bond/insurance summary; exists on disk but isn't linked from the footer or sitemap until the real CSLB number lands
- `/privacy`, `/terms`, `/accessibility` — legal pages sharing one structured long-form renderer
- `/sitemap` — a compact columned directory of every page, grouped into pages, projects, services and legal; `/sitemap.xml` serves its raw XML to everyone, crawlers and curious visitors alike, with no redirect between the two; `/llms.txt` is the same map in markdown for AI assistants, honoring the same publish gates
- `/styleguide` — internal design reference (tokens, type scale, components)
- `/admin` — private, noindexed area for the two principals and the site administrator: an overview, a searchable and pageable submissions inbox with bulk actions and CSV export, a ⌘K command palette, and a settings page, behind better-auth sign-in
- Every unmatched URL — a chrome-less 404 with the wordmark holding its header slot: a brand plumb line drops onto a survey marker above a per-section verdict (projects, services, about and the rest each carry their own message, picked from the dead URL on the client), the attempted address prints struck through in the mono face, and two exits lead back to the office and the sitemap

## Where things live

- `app/(site)/` — public routes, sharing one layout with header and footer
- `components/layout/` — `Container`, `Section`, `ArrowLink` primitives
- `components/motion/` — Lenis smooth scroll, dynamically imported on desktop pointers only; phones and reduced-motion sessions never download it
- `components/sections/` — page sections, composed by the route files; `company-intro`, `division-showcase`, `process-strip`, `coverage-band`, `team-marquee` and `faq-teaser` compose the expanded home; `delivery-model` is the `/services` self-perform band; `division-deep-dive` is the in-depth band on division pages and `statement-band` the centered single-voice brand line on `/services`, `/about` and two division pages; `office-commitments` and `careers-band` extend `/about`; `partner-strip` is the partners band closing both home and `/about`; `compare-slider` + `compare-gallery` power the before/after viewer, `gallery-lightbox` the full-screen photo viewer, `faq-topics` the xl-gated topic rail on `/faq`, `careers-overview` the values grid and application panel on `/careers`, `legal-article` the structured renderer shared by `/privacy`, `/terms` and `/accessibility`, `sitemap-directory` the columned page index on `/sitemap`, `not-found-panel` the 404 body composed by `app/not-found.tsx`
- `components/site/` — header, mega menu, mobile nav, footer, theme toggle, skip link, scroll-progress hairline, overlay scroll thumb, back-to-top button, theme-color sync
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `content/` — `home.ts` owns all home copy, including the hero's; `services.ts` also carries the `/services` page copy, the delivery-model band and each division's optional in-depth band, statement and closing CTA; `about.ts` also carries the commitments and careers-band copy; `office.ts` the process phases, CTA variants, brand statements and the contact page and form copy; alongside projects, team and office copy, the image manifest and the nav-panel projection; `partners.ts` the partner strip's intro and roster; `faq.ts`, `careers.ts`, `legal.ts` and `licenses.ts` back the six support routes; `sitemap.ts` projects the site tree for `/sitemap`; `not-found.ts` holds the per-section 404 verdicts and both exit labels
- `lib/site.ts` — single source of truth for name, nav, contact details, license and external profiles
- `lib/delivery.ts` — shared Resend transport for the contact action and admin invite/reset email
- `lib/seo.tsx` — the JSON-LD graph builders behind every route's structured data
- `lib/og/template.tsx` — the shared social-card template (Archivo TTFs vendored in `assets/fonts/`)
- `scripts/` — the image pipeline (AVIF migration, size auditing and blur-up generation)

Site copy and data live in `content/` and `lib/site.ts`, not in components. Copy stays in a no-figures register: no prices, durations, square footage or invented history anywhere on the site. The one exception is the home hero lead, which is the client's own positioning paragraph kept verbatim.

## Navigation

Desktop navigation is an animated mega menu with a Home link up front: Services and About each open a full-width panel under the header (Projects rejoins them once the portfolio publishes), with a live image that follows the hovered row. The triggers are links too — hover opens the panel, click goes straight to the section route; on touch, where there is no hover, a tap opens the panel instead. The About panel links to the anchored sections of `/about`; anchor landings clear the sticky header from both same-page and cross-page navigation. The header hides on scroll down and returns on scroll up, staying pinned while a menu is open. On mobile the same three groups expand in place inside the sheet. Panel data is projected from `content/` by `content/nav.ts`, so the menu stays in sync with the portfolio.

A steel hairline along the top of the viewport tracks reading position. The native scrollbar is hidden — its opaque gutter would sit as a light strip beside the full-bleed photo bands — and a slim steel thumb floats over the right edge of the content in its place on desktop. A back-to-top button fades in once the page is about two screens deep — smooth-scrolling through Lenis on desktop, instantly for reduced-motion users. Keyboard users get a skip-to-content link ahead of the header.

## Contact form delivery

Submissions are stored first and emailed second. A valid enquiry is written to Postgres with a delivery-state column, then one notification email goes to the office inbox through Resend with the sender's address as reply-to; when several project types are picked, the subject carries the first plus a count and the body lists them all. If the email leg fails, the lead still exists and the admin inbox flags the failed delivery. Without a `DATABASE_URL` the action falls back to the email-only path; without either, the form shows an honest error instead of a fake success. Spam defense stays invisible: a honeypot, a minimum-fill-time trap, and a durable rate limit keyed on HMAC-hashed addresses that clear after an hour.

Connect Resend via the Vercel Marketplace (or set `RESEND_API_KEY` in `.env.local`); `CONTACT_FROM_EMAIL` overrides the onboarding sender once the company's domain is verified.

## Admin

`/admin` is a private, noindexed area for the two principals and the site administrator, laid out to hold up as well on a phone as on a desktop. The whole area runs in an icon-rail sidebar that collapses to a slim strip of tooltipped icons instead of disappearing and remembers its state across reloads, under a sticky header carrying the page title and a ⌘K command palette — jump between pages and inbox views, toggle the theme, sign out, or search submissions from anywhere. It opens on an overview: three stat tiles backed by real counts (new enquiries, the last seven days with a week-over-week comparison, failed notification emails), the newest submissions, and each admin's last recorded sign-in, most recent first. The submissions inbox searches across name, email, company and message text as you type — trigram-indexed, debounced, with the current list staying put while results stream in and a match count shown while a search is active — and filters by status, failed email delivery and office-local date range (today, last 7 or 30 days, this month, all time) through a single scrollable filter row. It pages on a keyset cursor in both directions instead of capping the list, and handles bulk work through row checkboxes with select-all feeding a bottom action bar that stays in thumb reach: mark read or unread, archive, delete behind a confirm, or export to CSV. Exports cover either the checked rows or exactly the view on screen (status, search and date range together), with spreadsheet formula injection neutralized. A submission whose notification email failed carries a resend action that records an honest new failure reason if the retry fails too, and the overview's failed-email tile links straight to that view. The detail page steps through the inbox with newer and older links, and long unbroken values — emails, pasted URLs, SMTP errors — wrap instead of pushing the page sideways. Settings opens with a profile card where each admin can change their display name, then the passkey manager with dialog-based renaming, the password form, and an active-sessions card with per-session revoke and a sign-out-everywhere-else button; sessions show timestamps only, because device details are deliberately never stored.

The sign-in and reset pages share a split-hero shell: an always-dark brand panel with the wordmark, tagline and plumb-line motif beside a card-free form column. Auth is better-auth with email and password as the primary method, passkeys for day-to-day sign-in, and no public signup. Every password field has a show/hide toggle, and every sign-in, reset and settings form pre-checks its input against the same shared zod rules the server enforces, feeding the reserved inline error slots instead of browser bubbles. Both set-password surfaces carry a zxcvbn-powered strength meter that lazy-loads only on admin routes — honest about below-minimum passwords ("Too short") and self-healing if its dictionary chunk ever fails to load — and the server refuses a new password that matches the current one on both the change and reset paths; a rejected reset attempt leaves the link usable. Admin identity comes from a static avatar map: team portraits for the principals, the Perseus Studio wordmark as a theme-proof ink mask for the site administrator.

Protection is layered: `proxy.ts` provides the UX redirect while `requireAdmin()` in `lib/admin-guard.ts` is the actual boundary, awaited first by every protected layout, page, server action and the CSV export route. Auth endpoints are rate-limited on the same footing as the contact form: better-auth's limiter runs on a custom Postgres storage that HMAC-hashes its keys, the sign-in, reset and password-change paths carry their own rules, and a session hook keeps the raw address and user agent off session rows, so no raw network address is ever at rest. Accounts are created only by `npm run db:seed` (`scripts/seed-admins.mts`), which emails set-password invite links. Account fields are locked server-side: email, role and ban state cannot be changed through any endpoint, display-name updates are validated and rate-limited, and the admin plugin's user-management grants are emptied so no admin can manage another admin's account.

## Database

Neon Postgres through the Vercel Marketplace, Drizzle ORM on the neon-http driver. App schema lives in `lib/db/schema.ts`, the generated better-auth schema in `lib/db/auth-schema.ts` (`npm run auth:schema`), and committed SQL migrations in `drizzle/` are the record. Scripts: `db:generate`, `db:migrate`, `db:push` (dev loop only), `db:studio`, `db:seed`. Local dev points `DATABASE_URL` at a Neon development branch; `.env.example` lists every variable.

A committed `.npmrc` pins `legacy-peer-deps=true`: better-call, a better-auth dependency, carries an optional zod peer that conflicts under npm's default resolver. That covers local installs, CI, and Vercel deploys alike.

## Measurement

The root layout mounts Vercel Web Analytics — cookieless, aggregate page counts with nothing stored on the visitor's device. It's enabled per-project in the Vercel dashboard and no-ops locally. Speed Insights was deliberately not purchased (it's a paid add-on; Search Console's Core Web Vitals report covers field data for free). `/privacy` describes exactly what measurement collects, so that page must move in the same commit as any measurement change.

## Search & AI visibility

Every route ships complete metadata: a unique title on the shared `Page · Araz Construction Group` template with the page heading mirroring the title's core, a hand-written description, a canonical URL, and an Open Graph card generated per page from the design tokens — dark canvas, Archivo, the page title over the brand rule — by `lib/og/template.tsx`. The cards are PNG on purpose (AVIF share images still fail on most platforms) and small enough for WhatsApp's preview ceiling. `app/apple-icon.tsx` renders the monogram tile iOS and iMessage fall back to, and `app/manifest.ts` completes the icon set.

Structured data is a schema.org graph in JSON-LD, server-rendered because AI crawlers execute no JavaScript: a `GeneralContractor` organization node carrying the verified contact details, a `WebSite` node that anchors the site-name line in Google results, and per-page `WebPage`, breadcrumb, `Service` and FAQ nodes stitched together by stable `@id` anchors. Nothing unverified is asserted — the CSLB number and the social profiles each join the graph automatically once real values land in `lib/site.ts` — and gated content stays out of it until its flag flips, like every other surface.

`app/robots.ts` deliberately allows all crawlers, AI included: visibility in AI answers is the point of a marketing site, and `/llms.txt` gives assistants a markdown map of the pages. The XML sitemap lists each page's self-hosted imagery for Google Images and carries no fabricated modification dates.

## Images

Every image the live site renders is a self-hosted AVIF under `public/images/`, inside the default 150KB budget. The home hero, the intro's EV-charging photo, the About lead and the concrete division's card are the client's own photography. So are the team portraits, which sit in `public/images/team/` cropped 3:4 and kept under 100KB each; roster members without a portrait yet render a neutral person-glyph frame. Everything else — the division cards, the detail-row photos, the coverage band, the closing CTA panel and the About story set — is Unsplash placeholder photography landed locally through the same pipeline (downloaded via the images.weserv.nl proxy, since next/image fetches remote sources server-side and the dev machine can't reach Unsplash directly). The five partner logos in `public/images/partners/` are ink-normalized marks: black plus alpha, trimmed, painted with the current theme's foreground token via CSS mask, so one small AVIF serves light and dark. The pipeline lives in `scripts/`:

```bash
npm run images:migrate       # convert source photos to AVIF (supports --aspect W:H cover crops)
npm run images:audit         # dry-run size report, e.g. -- public/images/team --max-kb 100
npm run images:optimize      # re-encode anything over budget
npm run images:placeholders  # regenerate the blur-up map after imagery changes
```

Every content-driven image blur-loads Pinterest-style: `images:placeholders` renders each photo down to a ~300-byte 16px preview, committed to `content/blur-map.generated.ts` (content behind an off publish gate is skipped), and `blurProps` in `content/blur.ts` hands the matching data URI to `next/image` as its `placeholder="blur"`. The helper is server-only by design, so the generated map never ships in a client bundle: client components — the CTA panel, the team marquee, the services panorama, the compare slider, the lightbox grid and the mega menu — receive their resolved blur props from server shells. The blurred frame paints with the page and the full photo fades in over it, instead of an empty box.

The gated demo project case studies and their before/after pairs still reference Unsplash directly; they render nowhere while the publish gate is off. Swapping any image means editing one line in `content/`. When real project photography lands, the `images.unsplash.com` allowance in `next.config.ts` can go with it.

## Publish gates

`published` in `lib/site.ts` gates content that exists in the repo but isn't ready to show. `published.projects` keeps the demo portfolio dark: no nav item, no footer links, no sitemap entries, `/projects` renders a noindexed coming-soon page and the detail slugs 404. `published.testimonials` keeps the client notes off the home page until there are real clients behind them. Flip a flag to `true` and every surface comes back on its own — nothing is deleted. Same rule as the unset CSLB number: nothing unverified renders.

## Placeholders awaiting client data

- The CSLB license number (footer renders it only once set; the schema graph picks it up as an identifier the same way)
- External profiles for `site.profiles` in `lib/site.ts` — the schema graph gains `sameAs` links once real ones (LinkedIn, Google Business Profile) exist
- `app/icon.svg` is a typed "A" monogram until the real mark arrives
- The demo project case studies and client notes, gated behind `published` until real ones exist
- Real project photography to replace the self-hosted Unsplash placeholders (service imagery, four of the five About images, the second home-intro photo, the coverage band and the CTA panel) and the gated demo project galleries

## Design system

Design tokens (color, type scale, spacing, radii) are defined in `app/globals.css`. The `/styleguide` route renders them live. Light theme is the default; dark mode is available through the header toggle. The overlay scroll thumb and the browser's `theme-color` chrome follow the active theme through the same tokens.

Motion is deliberately spare, a Core Web Vitals decision: every page renders fully visible in its server HTML with no entrance animation, leaving movement to hovers, the mega panel, the team marquee, the 404's CSS plumb line and desktop smooth scrolling.

## License

MIT — see [LICENSE](./LICENSE).
