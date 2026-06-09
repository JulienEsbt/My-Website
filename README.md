# 🌐 Julien Esterbet — Personal Website & Portfolio

A modern, responsive **React + Vite portfolio** showcasing my projects, technical skills, and interests across *
*software engineering, Web3, and FinTech**.  
This website also includes a dedicated section about **cryptocurrency & decentralized technologies**, reflecting my
passion for **blockchain, AI, and innovation**.

---

## 🚀 Tech Stack

- ⚛️ **React 18** — component-based front‑end framework
- ⚡ **Vite 5** — dev server + ultra‑fast build
- 🧭 **React Router v6** — routing (`/` & `/crypto`)
- 🎨 **MUI (Material UI)** + **CSS Modules** — modern responsive UI
- 💅 **Styled Components** — scoped styling (selected components)
- 🧩 **React Icons** — iconography
- 🪙 **Ethers.js** — on‑chain interactions (MetaMask donation)
- ☁️ **Vercel** — CI/CD & hosting
- 🌐 **IONOS DNS** — custom domain management (`julien-esterbet.com`)
- 📦 **Node.js / npm** — dependencies & scripts

---

## 🌍 Environments & Deployment

| Environment                 | Branch    | Domain / URL                        | Hosting         |
|-----------------------------|-----------|-------------------------------------|-----------------|
| **Production**              | `main`    | https://www.julien-esterbet.com     | Vercel          |
| **Preproduction / Recette** | `develop` | https://recette.julien-esterbet.com | Vercel          |
| **Alias Recette (r7)**      | `develop` | https://r7.julien-esterbet.com      | Vercel          |
| **Local**                   | —         | http://localhost:3000               | Vite dev server |

**Pipeline**

- Push on **`develop`** → auto‑deploy to **recette** & **r7**.
- Push on **`main`** → auto‑deploy to **production** (custom domain).
- DNS (IONOS) → `A` record for apex (`216.198.79.1`) + `CNAME` to `cname.vercel-dns.com` for subdomains (`www`,
  `recette`, `r7`).
- SSL handled automatically by Vercel (Let’s Encrypt).

---

## 📁 Project Structure

```
src/
├─ assets/                 # images, pdf, media
├─ components/
│  ├─ main/                # portfolio sections
│  ├─ crypto/              # crypto-related pages/features
│  ├─ common/              # shared UI (Header, Nav, Footer, etc.)
│  └─ ...
├─ pages/
│  ├─ HomePage.jsx         # route /
│  └─ Web3Page.jsx       # route /crypto
├─ styles/                 # global CSS / modules
├─ App.jsx                 # app shell & router
└─ main.jsx                # Vite entry point
public/
└─ index.html
```

---

## 🧩 Features

- 🏠 **Portfolio Landing** — About, Experience, Projects, Goals, Contact
- 💰 **Crypto Page** — Ethereum donation via `ethers.js` (MetaMask)
- 🧭 **Smooth Navigation** — `React Router v6` + in‑page anchors
- 📱 **Responsive** — mobile/tablet/desktop
- 🔄 **CI/CD** — automated deploys from GitHub via Vercel
- 🧹 **Clean Git Workflow** — `feature/*` → `develop` → `main`

---

## 🧠 Scripts

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `npm install`     | Install all dependencies                       |
| `npm run dev`     | Start local dev server → http://localhost:3000 |
| `npm run build`   | Build optimized production bundle to `/dist`   |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | (optional) Lint for consistent style           |

---

## 🛠️ Development Workflow

**1) Create a feature branch**

```bash
git checkout develop
git pull
git checkout -b feature/your-feature
```

**2) Commit and push**

```bash
git add -A
git commit -m "feat: add new feature"
git push -u origin feature/your-feature
```

**3) Open a Pull Request**

- base: `develop`
- compare: `feature/your-feature`
- merge after review

**4) Deploy flow**

- `develop` → preproduction (**recette** & **r7**)
- `main` → production (**julien-esterbet.com**)

---

## 💻 Local Development

1. Clone the repo

```bash
git clone https://github.com/<your-repo>.git
cd <your-repo>
```

2. Install deps

```bash
npm install
```

3. Run locally

```bash
npm run dev
```

→ Open **http://localhost:3000**

---

## 🧱 Infrastructure overview

**Registrar / DNS**: IONOS

- `A` (apex `julien-esterbet.com`) → `216.198.79.1` (Vercel)
- `CNAME` (`www`) → `cname.vercel-dns.com`
- `CNAME` (`recette`) → `cname.vercel-dns.com`
- `CNAME` (`r7`) → `cname.vercel-dns.com`
- MX/TXT (mail/verification) unchanged

**Hosting / CI/CD**: Vercel

- Project connected to GitHub repository
- **Production** environment tracks `main` → domain `julien-esterbet.com` (+ `www`)
- **Preview/Preprod** environment tracks `develop` → domains `recette.julien-esterbet.com` & `r7.julien-esterbet.com`
- Automatic builds (`npm ci && npm run build`) and immutable deployments
- Auto HTTPS (Let’s Encrypt), cache & CDN at the edge

**Workflow**

```
feature/*  →  develop  →  main
    │           │          └─ deploys to Production (custom domain)
    │           └─ deploys to Recette (recette & r7)
    └─ PRs reviewed & merged
```

---

## ✨ Author

**Julien Esterbet**  
💼 Analyst Programmer @ Prepar-Vie  
🎓 MSc Computer Science — FinTech specialization  
🌍 Passionate about blockchain, AI & sustainable innovation

- 🌐 Website: https://www.julien-esterbet.com
- 💼 LinkedIn: https://www.linkedin.com/in/julien-esterbet/
- 🐙 GitHub: https://github.com/JulienEsbt
- 📸 Instagram: https://www.instagram.com/julien.esbt/
- 🐦 Twitter: https://twitter.com/JulienEsbtCrypt

---

## 🧾 License

Open-sourced under the **MIT License**.

> “Knowledge and curiosity are the real compasses of innovation.” — *Julien Esterbet*
