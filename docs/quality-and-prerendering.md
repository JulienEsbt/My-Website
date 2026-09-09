# Vérification locale et rendu initial

Les adresses françaises restent inchangées ; leurs équivalents anglais utilisent `/en`.
Le changement de langue passe par le routeur et conserve la page montée, les champs
saisis et l'historique du navigateur. Le catalogue `src/config/routeCatalog.js`
centralise les pages, leurs chemins et leurs espaces de traduction.

## Rendu initial

`npm run build` génère le contenu HTML des pages indexables et des deux pages 404,
avec les métadonnées, les alternatives linguistiques et les feuilles de style.
Le contenu reste lisible sans JavaScript. Les formulaires du rendu statique sont
désactivés et expliquent comment contacter Julien autrement. Quand la page React
est prête, elle remplace ce contenu statique : il ne s'agit pas d'une hydratation.
Les articles sont chargés à la demande, dans la langue demandée.

## Contrôles

Utiliser Node 24 à jour et installer les dépendances avec `npm ci`.

- `npm run check` : format, analyse du code, types, tests unitaires, fichiers
  sensibles, catalogues de médias, build, SEO, budgets et audit de production.
- `npx playwright install chromium` : installation initiale du navigateur de test.
- `npm run test:e2e` : après le build, six parcours dans Chromium. Deux serveurs
  locaux sont démarrés automatiquement. Le formulaire local simule la livraison
  et indique explicitement qu'aucun email n'a été envoyé.
- `npm run media:remote` : avec `VITE_MEDIA_BASE_URL`, contrôle un échantillon de
  trois variantes par catalogue. Ce contrôle ne garantit pas chaque fichier du CDN.

Les budgets incluent les dépendances statiques transitives et les traductions par
route. Les modules interactifs chargés à la demande, notamment cartes et globe,
sont exclus des totaux par route et conservent leurs plafonds propres. Ces totaux
ne représentent donc pas le coût réseau complet d'une visite avec interactions.

Avant tout téléversement R2, le script d'envoi refuse les images contenant des
métadonnées EXIF, IPTC ou XMP. Aucun téléversement n'est nécessaire pour vérifier les
catalogues. Les contrôles navigateur locaux ne valident pas les restrictions de
jeton Mapbox propres aux domaines Vercel Preview ou production.
