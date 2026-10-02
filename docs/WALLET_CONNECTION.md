# Connexion des wallets — configuration et recette

## Extensions installées

L’inspecteur propose les fournisseurs Ethereum/EVM annoncés via EIP-6963 (par exemple MetaMask, Rabby ou Brave Wallet). Il interroge uniquement le fournisseur choisi. Un fournisseur ancien est présenté comme « Wallet du navigateur » : son identité n’est pas devinée. Les wallets exclusivement Cosmos, Solana ou MultiversX ne sont pas rendus compatibles par ce sélecteur.

La saisie d’une adresse publique reste disponible sans extension. Aucun compte n’est demandé lors de l’ouverture du sélecteur ; la demande part au clic sur un wallet. Aucun message n’est signé et aucune transaction n’est envoyée. Le choix concerne l’inspecteur ; les dons conservent leur parcours existant.

## Activer WalletConnect (facultatif)

1. Ouvrir https://dashboard.reown.com/ et créer son compte, puis un projet pour le site personnel.
2. Copier le **Project ID** du projet (identifiant public de 32 caractères hexadécimaux, pas une clé de wallet).
3. Dans les réglages du projet, limiter les origines autorisées aux domaines utilisés : `https://www.julienesterbet.com`, `https://julienesterbet.com`, `https://recette.julienesterbet.com`. Ajouter le domaine de prévisualisation exact si nécessaire. Reown autorise localhost pour les essais ; une modification de cette liste peut prendre 15 minutes.
4. Renseigner `VITE_WALLETCONNECT_PROJECT_ID=<identifiant>` dans `.env.local`, puis redémarrer le serveur local. Ne pas versionner ce fichier.
5. Après recette et seulement lors d’une publication décidée par Julien, ajouter cette même variable à l’environnement Vercel concerné et reconstruire le site.

Sans valeur, le bouton WalletConnect est absent et le SDK n’est pas chargé. Avec une valeur, il se charge au clic. Le QR code est généré localement ; les échanges de connexion passent par le relais WalletConnect. La télémétrie optionnelle du SDK est désactivée. Le SDK peut conserver des données techniques de connexion dans le stockage local après une utilisation explicite.

Le parcours demande uniquement le partage d’une adresse Ethereum, sans autorisation de signature ou de transaction. Une fois l’adresse obtenue, la session est déconnectée ; l’inspection utilise ensuite les services de lecture existants. La connexion expire après deux minutes. Les en-têtes CSP autorisent précisément le relais et le service de vérification WalletConnect.

## Recette réelle à faire après configuration

- Sur PC : ouvrir Labs Web3 → Connecter mon wallet → WalletConnect ; scanner le QR depuis un wallet compatible Ethereum, approuver le partage, vérifier l’adresse affichée.
- Vérifier le refus, l’annulation, le délai expiré et la fermeture du sélecteur pendant l’attente ; aucune réponse tardive ne doit lancer d’analyse.
- Sur téléphone : essayer le copier/coller du lien de connexion dans un wallet qui le prend en charge, ou ouvrir le site dans le navigateur intégré du wallet pour utiliser son fournisseur EVM.
- Vérifier sur la version déployée que la CSP et la liste des origines Reown autorisent la connexion.

Les tests automatisés simulent le protocole et les extensions. Ils ne remplacent pas une connexion réelle avec un Project ID valide et un wallet : cette recette reste à faire.

Références : https://eips.ethereum.org/EIPS/eip-6963 et https://docs.reown.com/cloud/relay.

## Adresses des extensions

Les icônes sont celles annoncées par les extensions EIP-6963, affichées comme images locales `data:` avec un pictogramme de repli. Aucun logo distant n’est téléchargé et le contenu SVG n’est pas injecté dans le document. Le nom annoncé n’est pas une certification d’identité.

Après autorisation, l’encart permet de choisir une des adresses partagées, de relire la liste via `eth_accounts`, de changer d’extension ou de détacher le suivi local. `accountsChanged` suit le compte fourni par le wallet ; un verrouillage ou une déconnexion efface l’adresse et les anciens résultats. Chaque changement lance une nouvelle analyse sur le réseau choisi dans l’inspecteur, sans changer le réseau de l’extension. Une modification manuelle du champ d’adresse détache le suivi pour ne pas écraser la saisie.

Les réponses tardives sont ignorées et les abonnements sont retirés lors du changement de wallet ou du départ de la page. Détacher n’efface pas les autorisations de l’extension : leur révocation se fait dans le wallet. WalletConnect reste un partage ponctuel d’adresse, comme décrit plus haut.

Recette complémentaire : autoriser deux adresses dans MetaMask, sélectionner la seconde sur le site, changer de compte dans l’extension, verrouiller puis déverrouiller et actualiser. Répéter avec deux extensions installées pour vérifier que seul le wallet choisi pilote l’inspecteur.
