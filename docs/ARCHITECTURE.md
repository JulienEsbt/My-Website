# Architecture

My-Website is a bilingual React application built with Vite and deployed on Vercel. The route registry lazy-loads each page with its French and English translation namespace.

## Main boundaries

- `src/app` owns routing and the application shell.
- `src/pages` contains route-level composition.
- `src/features` contains page-specific user interfaces.
- `src/components/common` contains reusable layout, navigation, feedback, media, SEO, and accessibility behavior.
- `src/data` contains versioned editorial and portfolio data.
- `src/services` isolates browser-side provider adapters such as Mapbox and RPC access.
- `server` contains server-only contact and blockchain-status handlers exposed by `api`.
- `src/config` is the source of truth for routes, navigation, external links, networks, SEO, and media references.

Heavy travel and Web3 features are lazy-loaded. Provider calls stay outside presentation components when they are reusable or security-sensitive.

## Content flows

Reflections are stored as localized metadata plus MDX articles. Travel entries and photo-album manifests are versioned data; private source photographs are not committed. The Journal combines verified project, travel, and reflection entries into one chronological feed.

The production build generates:

- static SEO documents for indexable routes;
- `rss.xml` and `atom.xml` from the same Journal source;
- a Vite client bundle checked against performance budgets.

## External services

- Vercel hosts the application, functions, analytics, and Speed Insights.
- Cloudflare R2 serves sanitized responsive media derivatives.
- Mapbox renders the travel map.
- Alchemy-compatible RPC endpoints power the experimental Web3 views.
- EmailJS is called server-side for contact delivery.

Browser-prefixed `VITE_` values are public configuration. Server credentials never use that prefix.

## Quality gate

`npm run check` verifies formatting, linting, TypeScript, tests, sensitive-file rules, the production build, generated SEO, bundle budgets, and production dependency audit.
