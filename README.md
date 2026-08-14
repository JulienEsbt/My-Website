# Julien Esterbet — Portfolio

Product-focused full-stack portfolio built with React and Vite. It presents selected professional and personal projects, an experimental Web3 lab, long-form reflections, and travel stories without presenting academic prototypes as current products.

- Production: [julien-esterbet.com](https://julien-esterbet.com)
- Review environment (`develop`): [re7.julien-esterbet.com](https://re7.julien-esterbet.com)
- GitHub profile: [JulienEsbt](https://github.com/JulienEsbt)

## What the site contains

- A bilingual French/English professional portfolio and accessible HTML resume.
- Case studies for Bruno Pizza — Production and this portfolio.
- Web3 experiments: blockchain status, wallet inspection, resources, and optional donations.
- A travel timeline, galleries, Mapbox map, and 3D globe.
- Searchable MDX reflections and individual article pages.
- Privacy information, semantic error pages, technical SEO, and responsive navigation.

## Technology

- React 18, React Router 7, Vite 8, and TypeScript checking.
- i18next for localized interfaces and content.
- Vitest, Testing Library, axe-core, ESLint, and Prettier.
- Framer Motion, GSAP, Embla, and Swiper for progressive interaction.
- MDX and Fuse.js for long-form content and search.
- Mapbox GL and React Globe GL for travel visualizations.
- ethers v6 for the Web3 lab.
- Vercel Functions for contact delivery and server-side blockchain status.
- Cloudflare DNS and R2 for public optimized media derivatives.
- Vercel Web Analytics and Speed Insights for privacy-conscious production monitoring.

## Architecture

```text
api/                         Vercel Function entry points
server/
├── contact/                 Validation, anti-abuse controls and email delivery
└── web3/                    Server-side multi-network blockchain status
src/
├── app/                     Router, route registry and application shell
├── components/common/       Shared layout, navigation and accessibility UI
├── config/                  Routes, links, media, networks and wallet settings
├── content/reflections/     Localized MDX articles
├── data/                    Portfolio, travel, reflection and Web3 content
├── features/                Feature-oriented page sections
├── generated/               Versioned media manifests generated from private sources
├── i18n/                    French and English namespaces
├── pages/                   Lazy-loaded route-level components
├── services/                External-service and domain adapters
└── types/                   Shared TypeScript domain types
scripts/                     Quality, SEO, security and media tooling
public/                      Static metadata, OG images and lightweight textures
```

Routes are declared centrally and lazy-loaded with their translation namespace. Page-specific code remains inside feature folders, while provider access and reusable behavior live in services or server handlers. This keeps external integrations away from presentation components and avoids loading the heaviest travel and Web3 features on the initial route.

## Local development

Requirements:

- Node.js 24.x
- npm with the committed lockfile

```bash
git clone https://github.com/JulienEsbt/My-Website.git
cd My-Website
npm ci
cp .env.example .env.local
npm run dev
```

The local server runs at `http://localhost:3000`.

The repository intentionally does not contain the private source photographs or the generated public media tree. Without a configured `VITE_MEDIA_BASE_URL`, media-backed sections can therefore have missing visuals in a fresh clone. The deployed environments use the optimized derivatives hosted on Cloudflare R2.

## Environment variables

Copy `.env.example` to `.env.local` and add only the services needed for the feature being tested. Never commit `.env.local` or real tokens.

| Variable | Runtime | Purpose |
| --- | --- | --- |
| `VITE_MAPBOX_TOKEN` | Browser | Public, URL-restricted Mapbox token. |
| `VITE_DONATION_EVM_RECEIVER` | Browser | Public EVM receiver address for optional donations. |
| `VITE_MEDIA_BASE_URL` | Browser | Public HTTPS origin containing the generated `/media` tree. |
| `VITE_*_RPC_URL` | Browser | Full public Alchemy RPC URLs used by the wallet inspector; provider-domain restrictions are required. |
| `*_RPC_URL` | Server | Full RPC URLs used by `/api/blockchain-status`; never prefix these variables with `VITE_`. |
| `CONTACT_ALLOWED_ORIGINS` | Server | Comma-separated origins allowed to call the contact endpoint. |
| `EMAILJS_SERVICE_ID` | Server | EmailJS service identifier. |
| `EMAILJS_TEMPLATE_ID` | Server | EmailJS template identifier. |
| `EMAILJS_PUBLIC_KEY` | Server | EmailJS public key used by the server-side provider request. |
| `EMAILJS_PRIVATE_KEY` | Server | EmailJS private key, kept exclusively in server environment variables. |

Values prefixed with `VITE_` are bundled into browser code and must be treated as public configuration. Restrictions are enforced at the external provider whenever supported.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the application and generate static SEO route documents. |
| `npm run preview` | Serve the production build locally. |
| `npm run format` | Format the repository with Prettier. |
| `npm run format:check` | Check formatting without modifying files. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |
| `npm run test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run security:files` | Detect forbidden sensitive or private files. |
| `npm run seo:check` | Validate generated SEO documents. |
| `npm run budget:check` | Validate bundle and media performance budgets. |
| `npm run audit:prod` | Audit production dependencies. |
| `npm run check` | Run the complete CI quality gate. |

Media maintainers can additionally audit private sources, generate sanitized responsive derivatives, and validate those derivatives with `media:audit`, `media:generate`, and `media:check`. These operations require the private local source library and are not part of a fresh public clone.

After generating the derivatives, an authorized maintainer can upload or verify the public R2 tree from an interactive terminal:

```bash
node scripts/upload-r2-media.mjs --all
node scripts/upload-r2-media.mjs --verify-only
```

The upload command asks for short-lived R2 credentials without writing them to disk. Revoke the upload token after use; never store R2 credentials in the repository or a browser-facing environment variable.

## Quality, accessibility, and privacy

Every pull request and push to `develop` or `main` runs the full quality gate: formatting, linting, type checking, tests, sensitive-file detection, production build, SEO checks, performance budgets, and a production dependency audit.

Accessibility work follows a documented RGAA-informed approach: keyboard navigation, visible focus, semantic landmarks, localized labels, reduced-motion support, contrast checks, and automated axe coverage. This is not a claim of official RGAA certification. The HTML resume is the accessible reference; the downloadable PDFs are not claimed to be PDF/UA compliant.

The Git repository contains media manifests and generated references, not the private source photographs. Public derivatives are resized, compressed, stripped of source metadata, and served from Cloudflare R2. Vercel Analytics and Speed Insights are used without adding an advertising tracker or a user account system.

## Deployment

- `develop` is the integration branch and produces Vercel Preview deployments.
- `main` is the production branch for `julien-esterbet.com` and `www.julien-esterbet.com`.
- Cloudflare is the authoritative DNS provider; Vercel remains the application host.
- Cloudflare R2 serves immutable responsive media through `VITE_MEDIA_BASE_URL`.
- Vercel supplies TLS, serverless functions, security headers, analytics, and real-user performance data.

The application sets a restrictive Content Security Policy, denies framing, limits browser permissions, keeps contact and server RPC credentials outside client bundles, validates contact payloads, restricts origins, applies anti-bot checks, and rate-limits submissions.

## Repository workflow

Changes are prepared on a focused branch, reviewed against `develop`, and promoted from `develop` to `main` only after the quality gate and review environment are validated. Stage exact files when committing so private media, environment files, and internal audit documents are never included accidentally.

## License

No open-source license is currently granted for this repository. Unless stated otherwise, the source code, written content, visual identity, and media are copyright © Julien Esterbet. Third-party packages and assets remain subject to their respective licenses.
