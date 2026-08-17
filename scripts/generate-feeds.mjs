import {mkdir, writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import journalEntries from '../src/data/journal/journalEntries.js'

const SITE_URL = 'https://www.julien-esterbet.com'
const OUTPUT_DIR = resolve(process.cwd(), 'dist')

const escapeXml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')

const absoluteUrl = (path) => new URL(path, SITE_URL).href
const publishedAt = (entry) => new Date(`${entry.date}T12:00:00Z`).toUTCString()
const updatedAt = new Date(`${journalEntries[0]?.date ?? '2026-08-16'}T12:00:00Z`).toISOString()

const rssItems = journalEntries
    .map(
        (entry) => `        <item>
            <title>${escapeXml(entry.title.fr)}</title>
            <link>${escapeXml(absoluteUrl(entry.href))}</link>
            <guid isPermaLink="true">${escapeXml(absoluteUrl(entry.href))}</guid>
            <pubDate>${publishedAt(entry)}</pubDate>
            <category>${escapeXml(entry.category)}</category>
            <description>${escapeXml(entry.excerpt.fr)}</description>
        </item>`
    )
    .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>Journal de Julien Esterbet</title>
        <link>${SITE_URL}/journal</link>
        <description>Projets, voyages et réflexions de Julien Esterbet.</description>
        <language>fr</language>
        <lastBuildDate>${publishedAt(journalEntries[0])}</lastBuildDate>
${rssItems}
    </channel>
</rss>
`

const atomEntries = journalEntries
    .map(
        (entry) => `    <entry>
        <title>${escapeXml(entry.title.fr)}</title>
        <id>${escapeXml(absoluteUrl(entry.href))}</id>
        <link href="${escapeXml(absoluteUrl(entry.href))}" />
        <updated>${new Date(`${entry.date}T12:00:00Z`).toISOString()}</updated>
        <category term="${escapeXml(entry.category)}" />
        <summary>${escapeXml(entry.excerpt.fr)}</summary>
    </entry>`
    )
    .join('\n')

const atom = `<?xml version="1.0" encoding="UTF-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
    <title>Journal de Julien Esterbet</title>
    <id>${SITE_URL}/journal</id>
    <link href="${SITE_URL}/journal" />
    <link href="${SITE_URL}/atom.xml" rel="self" />
    <updated>${updatedAt}</updated>
    <subtitle>Projets, voyages et réflexions de Julien Esterbet.</subtitle>
${atomEntries}
</feed>
`

await mkdir(OUTPUT_DIR, {recursive: true})
await Promise.all([
    writeFile(resolve(OUTPUT_DIR, 'rss.xml'), rss),
    writeFile(resolve(OUTPUT_DIR, 'atom.xml'), atom),
])

console.log(`Generated RSS and Atom feeds with ${journalEntries.length} entries.`)
