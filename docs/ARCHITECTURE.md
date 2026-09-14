# Architecture

My-Website is a bilingual React application built with Vite and deployed on Vercel. The route registry lazy-loads each page with its French and English translation namespace.

## Main boundaries

- `src/app` owns routing and the application shell.
- `src/pages` contains route-level composition.
- `src/features` contains page-specific user interfaces.
- `src/components/common` contains reusable layout, navigation, feedback, media, SEO, and accessibility behavior.
- `src/data` contains versioned editorial and portfolio data.
- `src/services` isolates browser-side provider adapters such as Mapbox and RPC access.
- `server` contains server-only contact, blockchain-status and reader-comment handlers exposed by `api`. Comment persistence lives in `server/comments/store.js`, with its schema in `server/comments/schema.sql`.
- `src/config` is the source of truth for routes, navigation, external links, networks, SEO, and media references.

Heavy travel and Web3 features are lazy-loaded. Provider calls stay outside presentation components when they are reusable or security-sensitive.

## Content flows

Reflections are stored as localized metadata plus MDX articles. Travel entries and photo-album manifests are versioned data; private source photographs are not committed. Publication records combine verified project, travel and reflection entries for RSS and Atom. The former Journal page is retired; its URLs redirect to the homepage.

The production build generates:

- static SEO documents for indexable routes;
- `rss.xml` and `atom.xml` from the publication records;
- a Vite client bundle checked against performance budgets.

## External services

- Vercel hosts the application, functions, analytics, and Speed Insights.
- Cloudflare R2 serves sanitized responsive media derivatives.
- Mapbox renders the travel map.
- Alchemy-compatible RPC endpoints power the experimental Web3 views.
- EmailJS is called server-side for contact delivery.
- Neon PostgreSQL persists public reader comments, passage anchors and publication limits. Preview and Production use separate connection URLs and database branches.
- Comment notifications are enabled only in Production when `COMMENTS_NOTIFY_EMAIL=true`.

Browser-prefixed `VITE_` values are public configuration. Server credentials never use that prefix.

## Reader comments

The browser calls `/api/comments`; database credentials and moderation secrets stay on the server. General comments appear below the article; passage comments are grouped using the quoted text and its surrounding context. Author notes remain separate, versioned editorial content approved by Julien.

See [comments-setup.md](comments-setup.md) for database setup and moderation, and [vercel-configuration.md](vercel-configuration.md) for environment configuration.

## Quality gate

`npm run check` verifies formatting, linting, TypeScript, tests, sensitive-file rules, the production build, generated SEO, bundle budgets, and production dependency audit.

`npm run test:e2e` runs the Playwright browser journeys after a build. GitHub Actions runs both checks. Browser tests cover navigation, comments, responsive layouts and scroll transitions; they do not certify live provider configuration.
