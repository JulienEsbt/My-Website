# Julien Esterbet — Portfolio

[English](README.md) · **Français**

Un portfolio bilingue et un site personnel : projets logiciels, réflexions sur la société et les idées, récits de voyage et laboratoire Web3 expérimental. Construit avec React et Vite, il réunit expérience professionnelle et centres d’intérêt personnels, en distinguant les réalisations, les prototypes et les projets en cours.

[Visiter le site](https://www.julienesterbet.com) · [Profil GitHub](https://github.com/JulienEsbt) · [Recette](https://recette.julienesterbet.com)

## À découvrir

- **Projets et expérience** — sélection de projets, compétences, démarche, CV HTML et études de cas de Bruno Pizza — Production et de ce site. Agora est présenté comme un projet en construction.
- **Réflexions** — articles MDX avec recherche, notes d’auteur et commentaires publics sur une réflexion entière ou un passage sélectionné. Les discussions sur un passage apparaissent à côté du texte sur ordinateur et dans un panneau sur les petits écrans.
- **Voyages** — récits avec leurs propres URL, galeries photo, chronologie, carte interactive Mapbox et globe 3D.
- **Labs Web3** — instantanés des réseaux, inspection de portefeuille en lecture seule par adresse Ethereum ou nom ENS, vues tokens/NFT, ressources externes et parcours de don on-chain facultatif.
- **Français et anglais** — routes, interface et contenus localisés, avec changement de langue conservant le contexte de lecture. Les flux RSS et Atom restent disponibles ; l’ancienne page Journal a été retirée.

## Technologies et organisation

React 18 · Vite 8 · React Router · i18next · MDX · PostgreSQL (`pg`) · ethers · Mapbox GL · React Globe GL

Vercel héberge l’application et les fonctions API. Cloudflare R2 distribue les médias publics optimisés. EmailJS assure les envois d’emails côté serveur. Vitest, Testing Library, Playwright, axe-core, ESLint et les contrôles TypeScript accompagnent la validation.

```text
api/                         Points d’entrée des fonctions Vercel
server/contact/              Validation du contact et envoi d’emails
server/comments/             Commentaires PostgreSQL, modération et notifications
server/web3/                 État des blockchains côté serveur
src/app/                     Routeur et structure de l’application
src/features/                Interfaces et interactions par fonctionnalité
src/pages/                   Composition des pages
src/components/common/       Navigation, médias et accessibilité partagés
src/config/                  Routes, liens, réseaux et configuration des médias
src/content/reflections/     Articles MDX localisés
src/data/                    Données du portfolio, voyages et contenus éditoriaux
src/generated/               Manifestes versionnés des médias publics
src/i18n/                    Traductions françaises et anglaises
src/services/                Adaptateurs des services côté navigateur
scripts/                     Construction, qualité, SEO et outils médias
```

Les pages et leurs traductions sont chargées à la demande. Les composants interactifs lourds restent hors du chargement initial de la route. La compilation produit du HTML statique pour les pages indexables, les aperçus de partage et les flux RSS/Atom.

## Comment le site fonctionne

### Pages, langues et contenus

Le site est une application React côté navigateur, accompagnée de HTML statique produit à la compilation pour les routes indexables. Chaque article, récit et page principale dispose ainsi d’un document initial lisible et de ses propres métadonnées. React prend ensuite en charge la navigation et les interactions. Les routes sont centralisées pour que les liens, les URL traduites et la génération SEO s’appuient sur le même catalogue.

Le français et l’anglais ont des URL distinctes : les routes par défaut sont françaises, et `/en` identifie les pages anglaises. La détection de langue intervient à l’entrée par l’accueil neutre ; une URL explicite d’article ou de langue reste prioritaire. Le choix manuel est mémorisé, et changer de langue conserve la page correspondante au lieu de ramener le lecteur à l’accueil.

Les réflexions sont rédigées dans des fichiers MDX localisés ; leurs métadonnées et les notes d’auteur sont gérées séparément. Les récits de voyage associent des données éditoriales versionnées aux manifestes des photos. Les contenus restent ainsi consultables dans Git sans y publier les photographies sources privées. Les contributions des lecteurs suivent un autre circuit : elles sont enregistrées dans PostgreSQL pour apparaître immédiatement, sans reconstruire le site.

### Du passage sélectionné à la discussion

La sélection de texte conserve la citation et son contexte environnant. L’interface utilise ces informations pour retrouver le passage et afficher la discussion à proximité. Si une modification de l’article empêche de retrouver le texte avec suffisamment de certitude, la citation reste accessible plutôt que d’être rattachée silencieusement au mauvais paragraphe.

Le navigateur transmet les commentaires à `/api/comments`. Le serveur vérifie la configuration, les origines autorisées et les champs reçus, puis lit ou écrit dans la base partagée avec des requêtes SQL paramétrées. Les listes sont paginées. La publication remet au navigateur du lecteur une clé privée de suppression ; seule son empreinte est conservée en base. La modération utilise un secret serveur distinct.

Les limites de publication sont elles aussi stockées dans PostgreSQL, plutôt que dans la mémoire d’une seule instance de fonction. Une transaction et un verrou consultatif sérialisent les contrôles portant sur la même empreinte réseau : les requêtes simultanées traitées par plusieurs instances partagent donc la même limite. Les deux fenêtres glissantes s’appliquent ensemble pour limiter les rafales tout en permettant plusieurs remarques pendant une lecture.

### Web3 : consultation et actions du wallet

L’inspection accepte une adresse publique ou un nom ENS et consulte les données blockchain via les fournisseurs RPC configurés. L’état des réseaux passe séparément par `/api/blockchain-status`. Cette séparation permet de distinguer une configuration fournisseur manquante ou une requête échouée d’un résultat réellement vide.

Consulter un portefeuille ne demande ni signature ni transaction. Le don est une interaction distincte et facultative avec le wallet du visiteur : l’interface présente le réseau, l’actif et le montant avant la confirmation dans le wallet. Les Labs servent à explorer et expliquer les données on-chain ; ils ne constituent pas un service de garde de fonds.

### Médias et chargement progressif

Le pipeline transforme les images sources privées en dérivés publics adaptés aux différentes tailles d’écran, puis enregistre leurs dimensions et leurs URL dans des manifestes versionnés. Les composants résolvent ces références à partir de `VITE_MEDIA_BASE_URL` : la même logique peut utiliser les médias locaux ou Cloudflare R2. Le site public n’a pas besoin d’accéder à la photothèque originale.

La carte, le globe et les autres vues lourdes se chargent progressivement selon les besoins. L’expérience reste interactive sans imposer le téléchargement de tous les composants de visualisation à l’ouverture de l’accueil. Les animations tiennent compte de la préférence de réduction des mouvements.

## Démarrer en local

Utiliser **Node.js 24.x** et npm avec le fichier de verrouillage versionné.

```bash
git clone https://github.com/JulienEsbt/My-Website.git
cd My-Website
npm ci
cp .env.example .env.local
npm run dev
```

Ouvrir l’URL indiquée par Vite, normalement `http://localhost:3000`.

Un nouveau clone ne contient ni les photographies sources privées ni l’arborescence des médias générés. Pour afficher les médias publics, renseigner cette origine publique dans `.env.local` :

```dotenv
VITE_MEDIA_BASE_URL=https://media.julienesterbet.com
```

Configurer uniquement les intégrations nécessaires à partir de [`.env.example`](.env.example). Mapbox, les services RPC et les commentaires ont besoin de leur configuration respective. Le serveur de développement expose les API locales : l’envoi du formulaire de contact est simulé, tandis que les API blockchain et commentaires configurées utilisent leurs vrais services. `npm run preview` sert la compilation sans démarrer ces API.

### Activer les commentaires en local

Utiliser une base PostgreSQL de test ou une branche Neon dédiée, distincte de la production. Renseigner `COMMENTS_DATABASE_URL` dans `.env.local` et remplir `COMMENTS_RATE_SECRET` et `COMMENTS_ADMIN_TOKEN` avec deux secrets aléatoires robustes et distincts. Préparer ensuite le schéma :

```bash
node --env-file=.env.local scripts/setup-comments.mjs
npm run dev
```

L’application se connecte à PostgreSQL ; elle ne démarre pas de serveur de base de données. Avec Neon, la base est hébergée à distance. Sans la configuration requise, l’API des commentaires signale son indisponibilité au lieu de simuler une publication.

## Configuration

Les valeurs préfixées par `VITE_` sont publiques dans le navigateur. Conserver les secrets serveur dans les fichiers locaux ignorés par Git ou dans les variables de l’environnement serveur.

| Variables                                                                                | Rôle                                                                                          |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_MEDIA_BASE_URL`                                                                    | Origine publique des médias optimisés.                                                        |
| `VITE_MAPBOX_TOKEN`                                                                      | Jeton public Mapbox restreint aux URL autorisées.                                             |
| `VITE_*_RPC_URL`                                                                         | Points d’accès RPC publics pour l’inspection des wallets ; à restreindre chez le fournisseur. |
| `VITE_DONATION_EVM_RECEIVER`                                                             | Adresse EVM publique destinataire des dons.                                                   |
| `*_RPC_URL`                                                                              | Points d’accès RPC serveur pour l’état des blockchains.                                       |
| `CONTACT_ALLOWED_ORIGINS`                                                                | Origines autorisées à envoyer le formulaire de contact.                                       |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` | Configuration EmailJS côté serveur.                                                           |
| `COMMENTS_DATABASE_URL`                                                                  | URL de connexion PostgreSQL de l’environnement concerné.                                      |
| `COMMENTS_RATE_SECRET`, `COMMENTS_ADMIN_TOKEN`                                           | Clés privées de protection contre les abus et de modération.                                  |
| `COMMENTS_ALLOWED_ORIGINS`                                                               | Origines autorisées à publier ou supprimer des commentaires.                                  |
| `COMMENTS_NOTIFY_EMAIL`                                                                  | Valeur `true` pour activer les notifications lorsque `VERCEL_ENV=production`.                 |

Les commentaires sont publics immédiatement et utilisent un pseudonyme sans compte ; ce pseudonyme ne prouve aucune identité. Les lecteurs peuvent retirer leurs contributions depuis le navigateur utilisé pour les publier, et une clé privée permet la modération. Les limites partagées en base sont de **10 publications par 15 minutes et 30 par 2 heures par adresse réseau**, représentée par une empreinte HMAC.

Les notifications de commentaires en production utilisent le modèle EmailJS du contact et son destinataire configuré. Le local et la Preview n’envoient pas ces notifications. Un échec d’envoi n’annule pas la publication et ne déclenche pas de nouvelle tentative automatique.

## Vérifications de développement

| Commande               | Rôle                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`          | Démarrer le serveur de développement et les API locales.                                                                                         |
| `npm run build`        | Compiler le site, le HTML statique, les aperçus de partage et les flux.                                                                          |
| `npm run preview`      | Servir localement la compilation statique de production.                                                                                         |
| `npm run check`        | Vérifier formatage, lint, types, tests unitaires, fichiers sensibles, manifestes médias, compilation, SEO, budgets et dépendances de production. |
| `npm run test:e2e`     | Exécuter les parcours navigateur Playwright.                                                                                                     |
| `npm run audit`        | Auditer toutes les dépendances, outils de développement compris.                                                                                 |
| `npm run media:remote` | Vérifier un échantillon de médias publics.                                                                                                       |

Pour les tests navigateur, installer Chromium avec `npx playwright install chromium` et exécuter `npm run build` avant `npm run test:e2e`. Les contrôles individuels et commandes de maintenance des médias sont dans [`package.json`](package.json). La génération des dérivés nécessite la bibliothèque privée de sources.

GitHub Actions exécute les contrôles de qualité, les parcours navigateur et les vérifications des médias publics sur les pull requests et les pushes vers `develop` et `main`. Ils complètent la revue manuelle, sans certifier tous les appareils ni tous les services externes.

## Déploiement, accessibilité et confidentialité

- `develop` produit les déploiements Vercel Preview ; `main` est la branche de production.
- Configurer séparément les variables serveur Preview et Production, avec des bases ou branches PostgreSQL distinctes. Appliquer le schéma des commentaires à chaque base avant utilisation.
- La navigation prend en charge le clavier, le focus visible et la réduction des animations. La documentation précise la démarche d’accessibilité et ses limites ; aucune certification officielle RGAA n’est revendiquée.
- Les photographies sources privées sont exclues de Git. Les dérivés publics sont redimensionnés, compressés et débarrassés des métadonnées sources.
- Vercel Web Analytics et Speed Insights fournissent les mesures de fréquentation et de performance. Les commentaires sont stockés dans PostgreSQL ; l’application ne collecte pas l’adresse email de leurs lecteurs.

## Documentation

- [Index de la documentation](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Guide éditorial](docs/EDITORIAL_GUIDE.md)
- [Accessibilité et confidentialité](docs/ACCESSIBILITY_AND_PRIVACY.md)

## Licence

Aucune licence open source n’est actuellement accordée. Sauf mention contraire, le code source, les textes, l’identité visuelle et les médias sont protégés par le droit d’auteur © Julien Esterbet. Les bibliothèques et ressources tierces conservent leurs licences respectives.
