# 🌐 Julien Esterbet — Personal Website & Portfolio

A modern, responsive and multilingual **React + Vite portfolio** showcasing my projects, technical skills, travels,
reflections and interests across **software engineering, Web3, blockchain, FinTech, artificial intelligence, travel and
philosophy**.

The website combines a professional portfolio, a personal travel journal, a reflection space, and a dedicated Web3
ecosystem.

---

## 🚀 Tech Stack

### Core

- ⚛️ **React**
- ⚡ **Vite**
- 🧭 **React Router**
- 🌍 **i18next**
- 🎞️ **Framer Motion**
- 🎨 **Material UI**
- 🧩 **React Icons**

### Mapping & Visualization

- 🗺️ **Mapbox GL JS**
- 🌎 **React Globe GL**
- 🎯 Interactive travel visualizations

### Content & Search

- 📝 **MDX**
- 🔍 **Fuse.js**
- 🌐 Multilingual content architecture

### Web3

- 🪙 **Ethers.js**
- 🦊 MetaMask integration
- 💸 Multi-chain donation system

### Infrastructure

- ☁️ **Vercel**
- 🌐 **IONOS DNS**
- 📦 **Node.js / npm**

---

## 🌍 Environments & Deployment

| Environment                 | Branch    | Domain / URL                        | Hosting |
|-----------------------------|-----------|-------------------------------------|---------|
| **Production**              | `main`    | https://www.julien-esterbet.com     | Vercel  |
| **Preproduction / Recette** | `develop` | https://recette.julien-esterbet.com | Vercel  |
| **Alias Recette (re7)**     | `develop` | https://re7.julien-esterbet.com     | Vercel  |
| **Local**                   | —         | http://localhost:3000               | Vite    |

### Pipeline

- Push on **develop** → deploy to **Recette**
- Push on **main** → deploy to **Production**
- SSL handled automatically by Vercel
- DNS managed through IONOS

---

## 📁 Project Structure

## 📁 Project Structure

```text
src/
├─ app/
│  └─ router.jsx                         # Centralized application routes
│
├─ assets/
│  ├─ documents/
│  │  ├─ Julien-Esterbet-CV-FR-2026.pdf
│  │  └─ Julien-Esterbet-Resume-EN-2026.pdf
│  └─ images/
│     ├─ home/                           # Homepage images and portraits
│     └─ web3/                           # Web3 / crypto visual assets
│
├─ components/
│  └─ common/
│     ├─ layout/
│     │  ├─ contactSection/              # Shared contact section
│     │  ├─ footerSection/               # Shared footer
│     │  └─ pageHero/                    # Reusable hero component for pages
│     ├─ navigation/
│     │  ├─ languageSwitcher/            # FR / EN language switcher
│     │  ├─ pageNav/                     # Global page navigation
│     │  └─ sectionNav/                  # Floating section navigation
│     ├─ scrollToTop/
│     └─ social/
│        └─ headerSocials/
│
├─ config/
│  ├─ assets.js                          # Centralized asset references
│  ├─ blockchains.js                     # Supported blockchain networks
│  ├─ links.js                           # External links and socials
│  ├─ pages.js                           # Site pages configuration
│  ├─ tokenCatalog.js                    # Token catalog for Web3 tools
│  └─ wallet.js                          # Wallet / donation configuration
│
├─ content/
│  └─ reflections/                       # MDX long-form articles
│     └─ charte-de-pensee.fr.mdx
│
├─ data/
│  ├─ reflections/
│  │  └─ reflections.js                  # Reflection metadata
│  ├─ travel/
│  │  ├─ dreamDestinations.js            # Dream destinations data
│  │  └─ trips.js                        # Travel timeline and map data
│  └─ web3/
│     └─ knowledge.js                    # Web3 educational content
│
├─ features/
│  ├─ home/
│  │  ├─ about/
│  │  └─ ...
│  │
│  ├─ reflections/
│  │  ├─ reflectionAuthor/
│  │  └─ ...
│  │
│  ├─ travel/
│  │  ├─ dreamDestinations/
│  │  └─ ...
│  │
│  └─ web3/
│     ├─ about/
│     └─ ...
│
├─ i18n/
│  ├─ en/
│  ├─ fr/
│  └─ i18n.js                            # i18next configuration
│
├─ pages/
│  ├─ HomePage.jsx
│  ├─ TravelPage.jsx
│  ├─ ReflectionsPage.jsx
│  ├─ ReflectionArticlePage.jsx
│  └─ Web3Page.jsx
│
├─ App.jsx
├─ index.css
└─ main.jsx

root/
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ vercel.json
├─ README.md
└─ .env.local                           # local environment variables, not committed
```

---

## 🧩 Features

### 🏠 Portfolio

- About
- Experience
- Projects
- Goals
- Contact

### 🌎 Travel

- Interactive Mapbox map
- 3D Globe visualization
- Travel timeline
- Dream destinations
- Travel statistics
- Interactive navigation

### 💭 Reflections

- MDX articles
- Categories & filtering
- Full-text search
- Featured reflections
- Reading time display
- French / English support

### ⛓️ Web3

- Blockchain resources
- Wallet tools
- Donation system
- Multi-chain support

### 🌍 Global

- Responsive design
- Multilingual support
- Framer Motion animations
- Glassmorphism UI
- SEO-friendly routing

---

## 🧠 Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm install`     | Install dependencies           |
| `npm run dev`     | Start local development server |
| `npm run build`   | Build production bundle        |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run linter                     |

---

## 🛠️ Development Workflow

### 1. Create a feature branch

```bash
git checkout develop
git pull
git checkout -b feature/my-feature
```

### 2. Commit and push

```bash
git add .
git commit -m "feat: my feature"
git push
```

### 3. Open a Pull Request

- Base: `develop`
- Compare: `feature/my-feature`

### 4. Deployment

- `develop` → Recette
- `main` → Production

---

## 💻 Local Development

```bash
git clone https://github.com/JulienEsbt/My-Website.git
cd My-Website

npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## ✨ Author

**Julien Esterbet**

💼 Analyst Programmer @ Prepar-Vie  
🎓 MSc Computer Science — FinTech Specialization  
🌍 Passionate about Blockchain, AI, Aerospace, Travel and Philosophy

### Links

- 🌐 Website: https://www.julien-esterbet.com
- 💼 LinkedIn: https://www.linkedin.com/in/julien-esterbet/
- 🐙 GitHub: https://github.com/JulienEsbt
- 📸 Instagram: https://www.instagram.com/julien.esbt/

---

## 🧾 License

Open-sourced under the **MIT License**.

> "Knowledge and curiosity are the real compasses of innovation."
> — Julien Esterbet
