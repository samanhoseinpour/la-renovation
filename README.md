# LA Renovation

Marketing site for LA Renovation, a design-build studio renovating Los Angeles homes. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — home: hero, featured projects, services, studio stats, client notes
- `/projects` and `/projects/[slug]` — portfolio index and case studies
- `/services` and `/services/[slug]` — service offerings, process timeline, FAQ
- `/about` — studio story and stats
- `/contact` — contact form backed by a server action
- `/styleguide` — internal design reference (tokens, type scale, components)

## Where things live

- `app/(site)/` — public routes, sharing one layout with header and footer
- `components/layout/` — `Container`, `Section`, `ArrowLink` primitives
- `components/motion/` — `Reveal` entrance animation, Lenis smooth scroll, reduced-motion-aware provider
- `components/sections/` — page sections, composed by the route files
- `components/site/` — header, nav, footer, theme toggle
- `components/ui/` — shadcn/ui primitives (base-nova style)
- `content/` — projects, services and studio copy plus the image manifest
- `lib/site.ts` — single source of truth for name, nav, contact details and license

Site copy and data live in `content/` and `lib/site.ts`, not in components. Photography is temporary Unsplash placeholder imagery; when real project photos land, swap the allowed host in `next.config.ts`.

## Design system

Design tokens (color, type scale, spacing, radii) are defined in `app/globals.css`. The `/styleguide` route renders them live. Light theme is the default; dark mode is available through the header toggle.

## License

MIT — see [LICENSE](./LICENSE).
