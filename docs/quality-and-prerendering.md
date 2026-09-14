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
- `npm run test:e2e` : après le build, les parcours navigateur dans Chromium (navigation, commentaires, responsive et transitions). Deux serveurs
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

## Fichiers de test et fichiers générés

`playwright.config.js` configure les navigateurs et les serveurs de test ; `e2e/`
contient les scénarios exécutés localement et dans GitHub Actions. Ils font partie
du code de maintenance et doivent rester versionnés.

`test-results/` contient les résultats temporaires et les traces conservées en cas
d’échec. `playwright-report/`, lorsqu’il est généré, contient le rapport HTML. Ces
répertoires sont ignorés par Git et peuvent être supprimés après diagnostic.
`dist/` est le site compilé utilisé par la prévisualisation ; `dist-ssr/` est une
sortie intermédiaire du pré-rendu. Le build les recrée. Les supprimer ne modifie
pas le site déployé, mais supprimer `dist/` nécessite un nouveau build avant de
relancer la prévisualisation.
