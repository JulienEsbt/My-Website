# Notes d’auteur : évolution de la pensée

Cette fonctionnalité est réservée aux notes écrites et approuvées par Julien. Elle ne constitue pas un système de commentaires visiteurs. Le catalogue `src/data/reflections/authorNotes.js` est volontairement vide : aucun changement d’opinion personnel n’est inventé.

## Ajouter une note

Ajouter un objet au catalogue avec un `id` unique et stable, le `slug` d’un article existant, une date ISO réelle `YYYY-MM-DD`, un `kind` parmi `clarification`, `nuance`, `revision`, `source`, `extension` et `content.fr.body` et/ou `content.en.body`. Les textes sont du texte brut (pas de HTML). Les retours à la ligne sont conservés. Une traduction absente n’est pas remplacée automatiquement par l’autre langue.

Sans `targetId`, la note apparaît à la fin de l’article. Pour commenter un passage, choisir un identifiant stable et envelopper le paragraphe original dans le MDX :

```mdx
<Passage id="liberte-responsabilite">

Le paragraphe original, conservé intégralement.

</Passage>
```

Ajouter `targetId: 'liberte-responsabilite'` et `content.fr.quote` / `content.en.quote` reprenant exactement la phrase originale dans chaque langue renseignée. Le même identifiant désigne le passage correspondant dans les deux versions MDX. Une citation conservée permet de comprendre la note même si le texte change ensuite : l’interface signale alors une version antérieure. Ne pas déplacer un identifiant vers un autre argument. Les adresses `#passage-liberté` ne sont que des exemples : utiliser des identifiants ASCII en minuscules avec tirets.

Les liens réels sont `/reflections/SLUG#passage-ID` et `/reflections/SLUG#author-note-ID`, préfixés par `/en` pour l’anglais. Les notes s’ouvrent au clavier et à la souris avec un élément HTML details. Elles sont présentes dans le HTML pré-rendu.

## Vérifier avant publication

- Confirmer le texte et la date avec Julien ; distinguer précision, nuance et révision.
- Conserver le texte original ou sa citation, sans réécrire silencieusement l’argument commenté.
- Vérifier le passage dans chaque langue publiée. Ne jamais réutiliser les exemples de tests comme opinion de Julien.
- Vérifier les identifiants, les liens directs, les citations, les traductions, la lecture mobile et le rendu après génération.
- Lancer les tests et la construction avant toute publication.

Les commentaires visiteurs disposent de leur propre système, documenté dans [comments-setup.md](comments-setup.md). La bibliothèque commentée reste reportée.
