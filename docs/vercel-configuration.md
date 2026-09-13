# Vérification Vercel — Portfolio

Cette procédure est fondée sur les variables et la configuration du dépôt. Elle ne certifie pas les réglages actuellement enregistrés dans Vercel. Ne jamais copier les valeurs privées dans Git, Notion ou une conversation.

## 1. Projet et construction

Dans my-website, contrôler le dépôt Git lié, la branche de Production (main) et les Preview de develop. Contrôler aussi l’affectation des domaines de recette et de production. Les réglages du dépôt sont : Vite, Node 24.x, installation npm ci, compilation npm run build, sortie dist, racine du dépôt. Conserver les routes et en-têtes de vercel.json ; éviter les règles contradictoires ajoutées dans le tableau de bord.

## 2. Variables attendues

Filtrer successivement Preview puis Production. Comparer les noms complets, types, portées et éventuelles surcharges par branche. Pour les valeurs publiques et les mêmes services, une entrée peut cibler les deux environnements.

| Variable | Type / usage |
| --- | --- |
| COMMENTS_DATABASE_URL | Secret. URL PostgreSQL Neon exacte de la base concernée. |
| COMMENTS_ADMIN_TOKEN | Secret. Clé de modération. |
| COMMENTS_RATE_SECRET | Secret. Empreinte anti-abus. |
| COMMENTS_ALLOWED_ORIGINS | Config. Origines autorisées séparées par des virgules, sans chemin ni slash final. |
| COMMENTS_NOTIFY_EMAIL | Config. true en Production après recette du fournisseur ; false en Preview. Le code interdit de toute façon les envois de commentaires hors Production. |
| EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY | Paramètres côté serveur du service de contact existant. Même service possible dans les deux environnements. |
| EMAILJS_PRIVATE_KEY | Secret, si le service l’exige. |
| CONTACT_ALLOWED_ORIGINS | Config. Origines du formulaire de contact. |
| VITE_MAPBOX_TOKEN | Config publique, token Mapbox avec restrictions adaptées aux domaines. |
| VITE_ETH_RPC_URL, VITE_POLYGON_RPC_URL, VITE_ARBITRUM_RPC_URL, VITE_OPTIMISM_RPC_URL, VITE_BNB_RPC_URL | URLs publiques utilisées par Wallet Inspector ; restrictions et quotas à vérifier chez le fournisseur. |
| ETH_RPC_URL, POLYGON_RPC_URL, ARBITRUM_RPC_URL, OPTIMISM_RPC_URL, BNB_RPC_URL | URLs côté serveur de Blockchain Explorer ; Secret si elles contiennent une clé fournisseur. |
| VITE_DONATION_EVM_RECEIVER | Adresse publique du destinataire des dons. |
| VITE_MEDIA_BASE_URL | Origine publique optionnelle des médias ; vide pour les médias livrés avec le site. |

Les variables VITE_ sont intégrées au navigateur : les classer Secret dans Vercel ne les rend pas privées. Ne pas ajouter de préfixe VITE_ aux paramètres des commentaires ou du serveur.

Les variables COMMENTS_DATABASE_DATABASE_URL, COMMENTS_DATABASE_POSTGRES_URL et autres variantes créées par Neon ne remplacent pas COMMENTS_DATABASE_URL. Récupérer la bonne URL dans Neon et enregistrer cette dernière sous le nom exact attendu. L’intégration peut gérer et recréer ses propres variables ; ne pas les supprimer en masse.

Les listes d’origines peuvent être identiques : https://julienesterbet.com,https://www.julienesterbet.com,https://re7.julien-esterbet.com,https://recette.julien-esterbet.com, en conservant uniquement les domaines effectivement utilisés. Les URL de déploiement déclarées par Vercel sont également reconnues par le serveur.

## 3. Secrets Neon et alerte Needs Attention

Le badge observé indique une valeur qui ressemble à un secret, mais reste consultable par les membres autorisés. Utiliser le parcours Rotate Neon Secrets et lire les ressources affectées avant validation. Une rotation peut invalider les anciennes connexions : mettre à jour les variables gérées par l’intégration, la variable manuelle COMMENTS_DATABASE_URL et le fichier local si celui-ci utilise le même identifiant. Enregistrer les mots de passe et URLs privées comme Secret. Ne pas procéder à la rotation isolément sans prévoir les nouveaux déploiements utilisant les nouvelles valeurs.

Garder la même structure et les mêmes fonctionnalités entre Preview et Production. Recommandation : branches Neon distinctes pour éviter de mêler essais et commentaires publics. Même base possible mais toute publication ou suppression en recette touchera alors les données publiques. Si la politique Vercel impose des valeurs secrètes de production distinctes, la respecter.

## 4. Base, services et domaines

Sur chaque base utilisée, appliquer server/comments/schema.sql via l’éditeur SQL Neon (script idempotent). Vérifier reflection_comments et reflection_comment_limits. Rapprocher la région des fonctions de celle de Neon lorsque possible. Vérifier les domaines Vercel, HTTPS et la redirection vers le domaine canonique.

Vérifier les restrictions Mapbox et Alchemy pour les domaines de recette et de production. Vérifier la clé et le modèle EmailJS, son destinataire, son quota et le rendu du message comme texte. Les notifications de commentaires n’ont pas d’adresse de lecteur : le modèle doit accepter un reply_to vide.

Contrôler Deployment Protection pour permettre les essais aux personnes prévues sans bloquer le site public. Dans Firewall, vérifier qu’aucune ancienne règle trop stricte ne bloque POST /api/comments ou /api/contact. Ne pas désactiver les protections globales pour contourner un problème de configuration.

## 5. Déploiement et recette

Les changements de variables ne modifient pas les déploiements existants. Une fois le code prêt à publier, créer une nouvelle Preview contenant le code et les variables à jour. Tester : pages FR/EN, changement de langue sans rechargement, liens directs, globe/carte, images, Wallet Inspector ENS/adresse, Explorer et formulaire de contact. Pour les commentaires : publier, relire dans un autre navigateur, commenter un passage, supprimer comme auteur et modérateur. Contrôler les logs des fonctions sans exposer de secrets.

Après validation, déployer en Production avec ses variables et refaire un essai contrôlé, dont une notification réelle. Vérifier les erreurs d’envoi et le quota EmailJS : les échecs sont journalisés sans empêcher la publication, mais ne sont pas relancés automatiquement. Nettoyer seulement les contributions de test.

Sources : https://vercel.com/docs/environment-variables/managing-environment-variables et https://vercel.com/docs/environment-variables/sensitive-environment-variables.
