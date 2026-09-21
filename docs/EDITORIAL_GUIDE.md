# Editorial guide

The site keeps three editorial sections:

- **Reflections:** long-form personal essays with a dedicated article route.
- **Travel:** structured destinations, stories, maps, and photo albums.
- **Citizen resources:** a reviewed personal selection, with factual descriptions, credits, source links and important limits.

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

## Citizen resources

The selection lives in `src/data/citizenResources/resources.js`; French and English copy lives in the `resources` translation namespace. Four featured references have local previews; complementary references use text cards. Navigation uses the common namespace; contextual entry copy belongs to the home and reflections namespaces so it loads with those pages.

1. Verify the original resource, its owner, direct URL and supporting sources. Keep the distinction between descriptions, interpretations and Julien's convictions. Being useful does not imply endorsing every position or interface.
2. Add or edit both translations, with a concrete use, visible limitation and source explanation. Never infer a personal review from a site's content.
3. Set `reviewedAt` only after checking the link and description. This date is not a comprehensive audit of the service.
4. When replacing a preview, use a public page without personal data or logged-in UI, export a 960 × 600 WebP and keep `preview.url` and `preview.date` accurate. The initial four previews total about 192 KB. These are credited illustrative captures, not embedded sites, live data or a claim of endorsement. Keep a text fallback if an image cannot load.
5. Verify FR/EN, mobile, keyboard access, links and static HTML with JavaScript disabled. Run `npm run check` and `npx playwright test e2e/citizen-resources.spec.js`.

Agora remains a local unpublished prototype; its link points to the existing project presentation. The Observatory and its proposed media ownership map must not be described as publicly available before that is true. Adding resources does not automatically add feed entries or publish anything.

## Subscriptions

RSS and Atom remain available without an account or email collection. Publish only
when there is real content to share; no artificial cadence or empty category is required.
New sections or subscription services require a separate editorial decision.
