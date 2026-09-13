# Julien Esterbet — Portfolio

**English** · [Français](README.fr.md)

A bilingual portfolio and personal website: software projects, reflections on society and ideas, travel stories, and an experimental Web3 lab. Built with React and Vite, it brings together professional experience and personal interests while distinguishing working projects from prototypes and work in progress.

[Visit the website](https://www.julienesterbet.com) · [GitHub profile](https://github.com/JulienEsbt) · [Preview](https://recette.julienesterbet.com)

## Explore

- **Projects and experience** — selected projects, skills, approach, an HTML résumé, and case studies for Bruno Pizza — Production and this website. Agora is presented as a project in development.
- **Reflections** — searchable articles in MDX, author notes, and public comments on an entire article or a selected passage. Passage discussions appear alongside the text on desktop and in a panel on smaller screens.
- **Travel** — stories with individual URLs, photo galleries, a timeline, an interactive Mapbox map, and a 3D globe.
- **Labs Web3** — network snapshots, read-only wallet inspection by Ethereum address or ENS name, token/NFT views, external resources, and an optional on-chain donation flow.
- **French and English** — localized routes, interface and content, with language switching that preserves the reading context. RSS and Atom feeds remain available; the former Journal page has been retired.

## Stack and structure

React 18 · Vite 8 · React Router · i18next · MDX · PostgreSQL (`pg`) · ethers · Mapbox GL · React Globe GL

Vercel hosts the application and API functions. Cloudflare R2 serves optimized public media. EmailJS handles server-side email delivery. Vitest, Testing Library, Playwright, axe-core, ESLint and TypeScript checks support validation.

```text
api/                         Vercel Function entry points
server/contact/              Contact validation and email delivery
server/comments/             PostgreSQL comments, moderation and notifications
server/web3/                 Server-side blockchain status
src/app/                     Router and application shell
src/features/                Feature interfaces and interactions
src/pages/                   Route-level composition
src/components/common/       Shared navigation, media and accessibility UI
src/config/                  Routes, links, networks and media configuration
src/content/reflections/     Localized MDX articles
src/data/                    Portfolio, travel and editorial data
src/generated/               Versioned public media manifests
src/i18n/                    French and English translations
src/services/                Browser-side service adapters
scripts/                     Build, quality, SEO and media tooling
```

Pages and their translations are loaded on demand. Heavy interactive features are kept out of the initial route bundle. The build generates static HTML for indexable pages, social previews, and RSS/Atom feeds.

## How it works

### Pages, languages and content

The site is a client-side React application with static HTML generated at build time for indexable routes. That gives each article, travel story and main page a readable initial document and its own metadata, while React handles navigation and interactive features after loading. Route definitions are centralized so navigation, localized URLs and SEO generation share the same catalog.

French and English use distinct URLs: the default routes are French, and `/en` identifies English pages. Language detection applies when entering through the neutral home URL; an explicit article or language URL takes precedence. A manual language choice is remembered, and switching languages preserves the corresponding page instead of sending the reader back to the homepage.

Reflections are authored in localized MDX files, with metadata and author notes maintained separately. Travel stories combine versioned editorial data with generated photo manifests. This keeps content reviewable in Git without putting private source photographs in the public repository. Public reader contributions are different: they are stored in PostgreSQL so they can appear immediately without rebuilding the website.

### From a selected passage to a discussion

Selecting text captures the quotation together with surrounding context. The comment interface uses that context to locate the passage again and display its discussion near the relevant text. If an article changes and the passage can no longer be identified reliably, the quotation remains available rather than being silently attached to the wrong paragraph.

The browser sends comments to `/api/comments`. The server checks configuration, allowed origins and submitted fields, then uses parameterized SQL to read or write the shared database. Lists are paginated. Publication returns a private deletion token to the reader's browser; only its hash is stored in the database. Administrator moderation uses a separate server-side secret.

Rate limits are also stored in PostgreSQL, rather than in the memory of one function instance. A transaction and an advisory lock serialize checks for the same network fingerprint, so concurrent requests handled by different instances share the same limit. The two rolling windows are applied together; this limits bursts while allowing several remarks during a reading session.

### Web3: inspection and wallet actions

Wallet inspection accepts a public address or an ENS name and reads blockchain data through configured RPC providers. Network status is exposed separately through `/api/blockchain-status`. Keeping these paths separate makes it possible to distinguish a missing provider configuration or failed request from a genuinely empty result.

Reading a wallet does not require a signature or a transaction. Donations are a separate, optional interaction with the visitor's wallet: the interface presents the selected network, asset and amount before wallet confirmation. The Labs are experiments for exploring and explaining on-chain data, not a custody service.

### Media and progressive loading

The media pipeline turns private source images into responsive public derivatives and records their dimensions and URLs in versioned manifests. Components resolve those references against `VITE_MEDIA_BASE_URL`, allowing the same build logic to use a local media tree or Cloudflare R2. The public site does not need access to the original photo library.

The map, globe and other heavy views load progressively as needed. This preserves the interactive experience without making every visitor download all visualization code when opening the homepage. Reduced-motion preferences are respected by the animation layer.

## Run locally

Use **Node.js 24.x** and npm with the committed lockfile.

```bash
git clone https://github.com/JulienEsbt/My-Website.git
cd My-Website
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:3000`).

A fresh clone does not include private source photographs or the generated media tree. To display the public media, set this public origin in `.env.local`:

```dotenv
VITE_MEDIA_BASE_URL=https://media.julienesterbet.com
```

Configure only the integrations you need using [`.env.example`](.env.example). Mapbox, RPC services and comments require their corresponding configuration. The development server exposes the local API handlers: contact delivery is simulated, while configured blockchain and comment handlers use their real services. `npm run preview` serves the build and does not start those API handlers.

### Enable comments locally

Use a dedicated test PostgreSQL database or Neon branch, separate from production. Set `COMMENTS_DATABASE_URL` in `.env.local` and fill `COMMENTS_RATE_SECRET` and `COMMENTS_ADMIN_TOKEN` with two distinct, strong random secrets. Then prepare the schema:

```bash
node --env-file=.env.local scripts/setup-comments.mjs
npm run dev
```

The application connects to PostgreSQL; it does not start a database server. With Neon, the database is hosted remotely. Without the required configuration, the comments API returns an unavailable status rather than pretending to publish.

## Configuration

Values prefixed with `VITE_` are public in the browser. Keep server secrets in local ignored files or server environment settings.

| Variables                                                                                | Purpose                                                                |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `VITE_MEDIA_BASE_URL`                                                                    | Public origin for optimized media.                                     |
| `VITE_MAPBOX_TOKEN`                                                                      | Public Mapbox token restricted to authorized URLs.                     |
| `VITE_*_RPC_URL`                                                                         | Public wallet-inspection RPC endpoints; restrict them at the provider. |
| `VITE_DONATION_EVM_RECEIVER`                                                             | Public EVM donation recipient.                                         |
| `*_RPC_URL`                                                                              | Server RPC endpoints for blockchain status.                            |
| `CONTACT_ALLOWED_ORIGINS`                                                                | Origins allowed to submit the contact form.                            |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` | Server-side EmailJS configuration.                                     |
| `COMMENTS_DATABASE_URL`                                                                  | PostgreSQL connection string for the target environment.               |
| `COMMENTS_RATE_SECRET`, `COMMENTS_ADMIN_TOKEN`                                           | Private anti-abuse and moderation keys.                                |
| `COMMENTS_ALLOWED_ORIGINS`                                                               | Origins allowed to publish or remove comments.                         |
| `COMMENTS_NOTIFY_EMAIL`                                                                  | Set to `true` to enable notifications when `VERCEL_ENV=production`.    |

Comments are public immediately and use pseudonyms without accounts; pseudonyms do not verify identity. Readers can remove their contributions from the browser used to publish them, and a private moderation key enables administrator removal. Shared database limits allow **10 submissions per 15 minutes and 30 per 2 hours per network address**, represented by an HMAC fingerprint.

Production comment notifications use the contact EmailJS template and its configured recipient. Local and Preview environments do not send these notifications. Notification delivery failure does not cancel publication and is not retried automatically.

## Development checks

| Command                | Purpose                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the development server and local API handlers.                                                                                    |
| `npm run build`        | Build the site, static HTML, social previews and feeds.                                                                                 |
| `npm run preview`      | Serve the static production build locally.                                                                                              |
| `npm run check`        | Run formatting, lint, types, unit tests, sensitive-file and media-manifest checks, build, SEO, budgets and production dependency audit. |
| `npm run test:e2e`     | Run Playwright browser scenarios.                                                                                                       |
| `npm run audit`        | Audit all dependencies, including development tools.                                                                                    |
| `npm run media:remote` | Verify a sample of public media.                                                                                                        |

For browser tests, install Chromium with `npx playwright install chromium` and run `npm run build` before `npm run test:e2e`. See [`package.json`](package.json) for individual checks and media-maintenance commands. Generating media derivatives requires the private source library.

GitHub Actions runs the quality gate, browser scenarios and public-media checks on pull requests and pushes to `develop` and `main`. These checks complement manual review; they do not certify every device or external service.

## Deployment, accessibility and privacy

- `develop` produces Vercel Preview deployments; `main` is the production branch.
- Configure server variables separately for Preview and Production, with separate PostgreSQL databases or branches. Apply the comment schema to each database before using it.
- Navigation supports keyboard access, visible focus and reduced motion. Accessibility documentation describes the approach and its limits; no official RGAA certification is claimed.
- Private source photographs are excluded from Git. Public derivatives are resized, compressed and stripped of source metadata.
- Vercel Web Analytics and Speed Insights provide usage and performance measurements. Comments are stored in PostgreSQL; the application does not collect reader email addresses for them.

## Documentation

- [Documentation index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Editorial guide](docs/EDITORIAL_GUIDE.md)
- [Accessibility and privacy](docs/ACCESSIBILITY_AND_PRIVACY.md)

## License

No open-source license is currently granted. Unless stated otherwise, the source code, written content, visual identity and media are copyright © Julien Esterbet. Third-party packages and assets retain their respective licenses.
