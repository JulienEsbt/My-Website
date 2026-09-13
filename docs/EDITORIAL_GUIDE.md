# Editorial guide

The site keeps two editorial sections:

- **Reflections:** long-form personal essays with a dedicated article route.
- **Travel:** structured destinations, stories, maps, and photo albums.

## RSS and Atom publication records

The Journal page has been retired. Its old French and English URLs redirect to the corresponding homepage. RSS and Atom remain available without a separate Journal section. The Atom identifier is kept stable for existing subscribers.

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

## Subscriptions

RSS and Atom remain available without an account or email collection. Publish only
when there is real content to share; no artificial cadence or empty category is required.
New sections or subscription services require a separate editorial decision.
