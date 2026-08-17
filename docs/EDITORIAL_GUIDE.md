# Editorial guide

The site separates three kinds of publication:

- **Journal:** short chronological updates across projects, travel, reflections, and eventually sport.
- **Reflections:** long-form personal essays with a dedicated article route.
- **Travel:** structured destinations, stories, maps, and photo albums.

## Journal entry template

Add a factual entry to `src/data/journal/journalEntries.js` or derive it from an existing versioned source.

```js
{
    id: 'stable-id-yyyy-mm-dd',
    category: 'project', // project | travel | reflection | sport
    date: 'YYYY-MM-DD',
    title: {fr: 'Titre', en: 'Title'},
    excerpt: {fr: 'Résumé court.', en: 'Short summary.'},
    href: '/existing-route',
}
```

Use only a real publication date and an existing route. Do not create placeholder stories to fill a category. An empty, honest category is preferable to invented content.

## Reflection checklist

1. Add localized metadata to `src/data/reflections/reflections.js`.
2. Add the corresponding MDX article using the existing localized content convention.
3. Confirm the slug, date, excerpt, category, and reading time.
4. Test the article route, language switch, headings, links, and keyboard navigation.
5. Run `npm run check`.

## Cadence and subscriptions

The initial target is one meaningful update per month, without committing to a fixed public promise. RSS and Atom are the default subscription channels because they require no account or personal-data collection.

An email newsletter should be added only after a regular cadence exists. That change requires a provider choice, explicit consent, double opt-in, unsubscribe handling, retention rules, and an updated privacy notice. Until then, no email field or subscriber database should be added.

## Topic pipeline

Suitable future topics include a project release note, a completed trip, a new long-form reflection, or a concrete sport practice worth documenting. Sport remains a Journal category rather than a standalone section until enough original content justifies its own information architecture.
