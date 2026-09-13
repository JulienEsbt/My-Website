# Commentaires publics des réflexions

Interface FR/EN : sélectionner un passage (jusqu’à 1 000 caractères), ouvrir le formulaire, choisir un pseudonyme et publier. Les réactions générales sont également possibles. Publication immédiate, sans compte ; les pseudonymes ne certifient aucune identité.

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
