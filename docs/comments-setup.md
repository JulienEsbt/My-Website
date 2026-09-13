# Commentaires publics des réflexions

Interface FR/EN : sélectionner un passage (jusqu’à 1 000 caractères), ouvrir le formulaire, choisir un pseudonyme et publier. Les réactions générales sont également possibles. Publication immédiate, sans compte ; les pseudonymes ne certifient aucune identité.

## Réglages de l’écran « Install Integration »

- **Region** : choisir Frankfurt, Germany si proposée pour garder la base en UE. Vérifier ensuite la région des fonctions Vercel : rapprocher fonctions et base réduit la latence. La région de Londres affichée sur la capture n’est pas une erreur technique, mais ce n’est pas le choix recommandé ici.
- **Auth** : désactiver. Les commentaires utilisent un pseudonyme sans compte et n’emploient pas Neon Auth.
- **Installation Plans** : garder Free pour commencer ; vérifier le récapitulatif avant validation.
- **Nom** si demandé : `portfolio-comments`. Connecter au projet Vercel `my-website`.
- Pour les essais locaux, créer une branche Neon `development` et récupérer son URL depuis Connect. Garder la branche de production distincte.
- Si l’intégration crée une variable `DATABASE_URL`, notre code attend explicitement `COMMENTS_DATABASE_URL` : ajouter cette dernière avec l’URL de la bonne branche. Ne pas supposer que l’installation suffit à brancher l’API.
- Les noms de branches Neon et les environnements Vercel sont deux réglages distincts : contrôler l’URL affectée à Development/Preview/Production avant publication.

Références : [Neon dans Vercel Marketplace](https://vercel.com/marketplace/neon/neon), [latence selon les régions](https://neon.com/demos/regional-latency).

## Écran « Connect a Project »

Pour la phase actuelle de validation :

1. Projet : `my-website`.
2. Environments : Preview et Development cochés ; Production décoché pour le moment.
3. Create database branch for deployment : Preview coché, Production décoché.
4. Custom Prefix : saisir `COMMENTS_DATABASE` dans le champ de la capture, dont le suffixe affiché est `_URL`. Vérifier après connexion que la variable créée se nomme exactement `COMMENTS_DATABASE_URL`.
5. Sensitive : garder activé pour les environnements qui l’acceptent, puis Connect.
6. Récupérer l’URL de la branche destinée au développement dans le fichier local `.env.local`. Le raccordement Vercel ne remplit pas ce fichier automatiquement. Ne pas utiliser l’URL d’une branche Preview temporaire pour une future production.
7. Exécuter la préparation des tables puis la recette à deux navigateurs. Connecter la production séparément quand la publication sera décidée.

## Connexion guidée pour Julien

1. Dans le projet **my-website** sur Vercel, ouvrir **Storage**, choisir Neon via le Marketplace et connecter la ressource au projet. Vérifier l’offre et la région affichées avant de valider ; aucune formule payante n’est souscrite par le code.
2. Depuis Neon, bouton **Connect**, récupérer l’URL PostgreSQL de la branche de développement/prévisualisation, avec TLS. La coller uniquement dans `COMMENTS_DATABASE_URL` du fichier local `.env.local`, jamais dans la conversation ni Notion.
3. Les réglages privés locaux peuvent être préparés avec `node scripts/prepare-comments-env.mjs`. Ce script conserve les valeurs existantes, génère les deux clés manquantes, vérifie que le fichier est ignoré par Git et n’affiche aucun secret.
4. Exécuter `node --env-file=.env.local scripts/setup-comments.mjs`. Puis redémarrer le serveur local. Tester publication, lecture depuis un second navigateur et suppression. Utiliser une base de test, pas des contributions réelles pour cette vérification.
5. Pour Vercel, renseigner les quatre variables décrites ci-dessous côté serveur dans l’environnement concerné. Séparer les bases Preview et Production ; ne pas brancher automatiquement les essais sur la base publique.
6. La mise en ligne du code reste une opération distincte. Après publication autorisée, vérifier aussi les origines du site et le retrait par modération.

Sources : [stockage Vercel](https://vercel.com/docs/marketplace-storage), [intégration Neon](https://vercel.com/marketplace/neon/neon).

## Après la connexion locale : variables Vercel

Dans **my-website → Settings → Environment Variables**, vérifier les noms exacts pour l'environnement Preview :

- `COMMENTS_DATABASE_URL` : URL de sa branche Neon. Si cette variable a déjà été créée par l'intégration, la conserver ; ne pas créer de doublon.
- `COMMENTS_RATE_SECRET` et `COMMENTS_ADMIN_TOKEN` : copier leurs valeurs privées depuis le fichier local pour la recette Preview. Copier la valeur seule, sans nom de variable ni guillemets.
- `COMMENTS_ALLOWED_ORIGINS` : `https://julienesterbet.com,https://www.julienesterbet.com`. Les URL Preview déclarées par Vercel sont aussi admises par le serveur.

Enregistrer. Aucun préfixe `VITE_` : ces valeurs appartiennent au serveur. Un déploiement déjà existant ne reçoit pas ces changements ; la prochaine Preview doit contenir le code des commentaires et ces variables. Sa base doit également recevoir `server/comments/schema.sql` si elle est distincte de la base locale. Le push et le déploiement sont une étape séparée après revue. Pour Production, configurer une branche permanente et des clés dédiées avant la mise en ligne.

## Connexion avant publication

1. Créer ou choisir une base PostgreSQL, par exemple Neon via Vercel Marketplace. Aucun service n’a été créé par ce chantier.
2. Configurer côté serveur, jamais avec un préfixe `VITE_` :
   - `COMMENTS_DATABASE_URL` : URL PostgreSQL fournie par le service, avec sa configuration TLS.
   - `COMMENTS_RATE_SECRET` : valeur aléatoire privée pour les empreintes anti-spam.
   - `COMMENTS_ADMIN_TOKEN` : autre valeur aléatoire privée, réservée à Julien.
   - `COMMENTS_ALLOWED_ORIGINS` : origines exactes autorisées, séparées par des virgules (par exemple https://julienesterbet.com,https://www.julienesterbet.com). Les origines Vercel fournies par la plateforme sont également acceptées.
3. Avec ces variables chargées, exécuter `node --env-file=.env.local scripts/setup-comments.mjs` en local pour créer les deux tables. Le script est réexécutable ; il ne supprime aucune table.
4. Vérifier sur un environnement de prévisualisation connecté : publier depuis un navigateur, lire depuis un autre, retrouver le passage, retirer son commentaire puis tester la modération. Le build Vite seul ne démarre pas les API ; utiliser le serveur de développement ou Vercel.
5. Vérifier la notice de confidentialité et les paramètres du fournisseur retenu avant publication. Ce travail n’inclut ni push ni déploiement.

## Modération et suppression

La section « Modération du site » sous les commentaires accepte la clé privée de Julien. Elle est gardée uniquement en mémoire de la page et envoyée dans l’en-tête Authorization, jamais dans une URL ou le stockage du navigateur. Les boutons permettent de retirer les commentaires. Aucune authentification de Julien n’est déduite du pseudonyme.

Chaque publication reçoit aussi une clé de suppression individuelle aléatoire. Seule son empreinte est stockée en base ; le navigateur conserve la clé pour permettre au lecteur de retirer son commentaire. Effacer les données du navigateur retire cette capacité : Julien peut alors intervenir. Ne pas copier ces clés dans des documents publics.

## Données et limites

Stockage partagé : article, langue, pseudonyme, texte, citation, contexte de la citation, date et empreinte de suppression. L’adresse réseau est transformée en empreinte HMAC avant stockage dans une table anti-spam séparée ; les entrées expirées sont nettoyées lors des publications suivantes. Limite de cinq publications par adresse réseau sur quinze minutes, partagée entre les instances. Aucun email ni compte lecteur.

Les citations sont fournies par les lecteurs, donc ne prouvent pas l’état historique du texte. Le lien recherche la citation et son contexte ; en cas de modification, il conserve la citation et signale qu’il ne retrouve plus le passage. Le contenu utilisateur est rendu en texte, sans HTML. Les requêtes SQL utilisent des paramètres.

Sans configuration complète, l’API renvoie 503 et l’interface désactive Publier. Le formulaire reste accessible pour visualiser le fonctionnement ; ce n’est pas une publication locale simulée. La saisie non publiée n’est pas enregistrée après fermeture/rechargement de la page.

La limite anti-spam ne remplace pas un système complet de lutte contre les abus distribués. Ajouter un challenge seulement si l’usage réel le justifie. Le raccordement PostgreSQL et la vérification avec deux navigateurs restent nécessaires avant mise en ligne.
