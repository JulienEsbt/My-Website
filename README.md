# 🌐 Julien Esterbet — Personal Website & Portfolio

A modern, responsive **React-based portfolio** showcasing my projects, technical skills, and interests across **software engineering, Web3, and FinTech**.  
This website also includes a dedicated section about **cryptocurrency & decentralized technologies**, reflecting my passion for blockchain, AI, and innovation.

---

## 🚀 Tech Stack

- ⚛️ **React** — front-end framework
- 🧭 **React Router v6** — page routing (`/` & `/crypto`)
- 🎨 **MUI (Material UI)** & custom CSS — modern UI components
- 💅 **Styled Components / CSS Modules** — modular styling
- 🪙 **Ethers.js** — blockchain interactions (Metamask donation feature)
- 📦 **Node.js / npm** — dependency management and build tools

---

## 📁 Project Structure

    src/
    ├── components/
    │   ├── main/          → Main portfolio sections
    │   ├── crypto/        → Crypto-focused pages and features
    │   └── common/        → Shared components (e.g., PageNav)
    ├── pages/
    │   ├── MainPage.jsx   → Root route (/)
    │   └── CryptoPage.jsx → Secondary route (/crypto)
    ├── assets/            → Images, icons, media
    └── App.jsx            → Global router and structure

---

## 🧩 Features

- 🏠 **Portfolio Landing Page** — About, Experience, Projects, Goals, and Contact
- 💰 **Crypto Page** — Ethereum-based donation feature using `ethers.js`
- 🧭 **Smooth Navigation** — via `React Router v6` and in-page anchors
- 💻 **Responsive Design** — fully mobile and tablet compatible
- 🔒 **Clean Git Workflow** — `main` → `develop` → `feature/*`

---

## 🧠 Scripts

| Command | Description |
|----------|-------------|
| `npm install` | Install all dependencies |
| `npm start` | Start development server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build optimized production files |
| `npm run lint` | (optional) Lint the codebase for consistent style |

---

## 🛠️ Development Workflow

**1️⃣ Create a feature branch**

    git checkout develop
    git pull
    git checkout -b feature/your-feature

**2️⃣ Commit and push changes**

    git add -A
    git commit -m "feat: add new section"
    git push -u origin feature/your-feature

**3️⃣ Open a Pull Request**
- base: `develop`
- compare: `feature/your-feature`
- Merge once reviewed

**4️⃣ Deploy**
- When ready: PR from `develop` → `main`

---

## ✨ Author

**Julien Esterbet**  
💼 Analyst Programmer @ Prepar-Vie  
🎓 MSc Computer Science — FinTech specialization  
🌍 Passionate about blockchain, AI, and sustainable innovation

🔗 [LinkedIn](https://www.linkedin.com/in/julien-esterbet/)  
🐙 [GitHub](https://github.com/JulienEsbt)  
📸 [Instagram](https://www.instagram.com/julien.esbt/)  
🐦 [Twitter](https://twitter.com/JulienEsbtCrypt)

---

## 🧾 License

This project is open-source and available under the **MIT License**.

---

> “Knowledge and curiosity are the real compasses of innovation.” — *Julien Esterbet*