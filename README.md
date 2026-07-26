# LA Renovation

Marketing site for LA Renovation, a design-build studio renovating Los Angeles homes. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home: full-bleed viewport hero, featured projects, services, studio stats, client notes
- `/projects` and `/projects/[slug]` — portfolio index (one featured project over a supporting grid) and case studies
- `/services` and `/services/[slug]` — service list with a sticky image pane that follows the hovered or focused row, process timeline, FAQ
- `/about` — studio story and stats
- `/contact` — enquiry form (project type and budget included) backed by a server action with email delivery
- `/styleguide` — internal design reference (tokens, type scale, components)

## Where things live

- `app/(site)/` — public routes, sharing one layout with header and footer
- `components/layout/` — `Container`, `Section`, `ArrowLink` primitives
- `components/motion/` — `Reveal` entrance animation, Lenis smooth scroll, reduced-motion-aware provider
- `components/sections/` — page sections, composed by the route files
- `components/site/` — header, mega menu, mobile nav, footer, theme toggle
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `content/` — projects, services and studio copy, the image manifest and the nav-panel projection
- `lib/site.ts` — single source of truth for name, nav, contact details and license
- `lib/delivery.ts` — email delivery boundary used by the contact action

Site copy and data live in `content/` and `lib/site.ts`, not in components. Photography is temporary Unsplash placeholder imagery; when real project photos land, swap the allowed host in `next.config.ts`.

## Navigation

Desktop navigation is an animated mega menu: Projects and Services open a full-width panel under the header listing the actual work, with a live image that follows the hovered row. The header hides on scroll down and returns on scroll up, staying pinned while a menu is open. On mobile the same items expand in place inside the sheet. Panel data is projected from `content/` by `content/nav.ts`, so the menu stays in sync with the portfolio.

## Contact form delivery

The contact action sends enquiries through Resend. Connect it via the Vercel
Marketplace (or set `RESEND_API_KEY` in `.env.local`); until the key exists the
form shows an honest "email us directly" error instead of a fake success.
`CONTACT_FROM_EMAIL` overrides the onboarding sender once the studio's domain
is verified.

## Design system

Design tokens (color, type scale, spacing, radii) are defined in `app/globals.css`. The `/styleguide` route renders them live. Light theme is the default; dark mode is available through the header toggle.

## License

MIT — see [LICENSE](./LICENSE).
