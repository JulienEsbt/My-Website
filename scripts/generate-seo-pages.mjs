import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getSeoMetadata, INDEXABLE_PATHS, SITE_URL} from '../src/config/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')

const replaceAttribute = (html, selector, attribute, value) => {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const tagPattern = new RegExp(`<meta(?=[^>]*${escapedSelector})[^>]*>`, 'i')

    return html.replace(tagPattern, (tag) => {
        const attributePattern = new RegExp(`(${attribute}=")[^"]*(")`, 'i')
        return tag.replace(attributePattern, `$1${escapeHtml(value)}$2`)
    })
}

const replaceCanonical = (html, value) =>
    html.replace(/<link(?=[^>]*rel="canonical")[^>]*>/i, (tag) =>
        tag.replace(/(href=")[^"]*(")/i, `$1${escapeHtml(value)}$2`)
    )

const renderMetadata = (template, seo) => {
    let html = replaceCanonical(
        template
            .replace(/<html lang="[^"]+">/, `<html lang="${seo.language}">`)
            .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`),
        seo.canonicalUrl
    )

    const values = [
        ['name="description"', 'content', seo.description],
        ['name="robots"', 'content', seo.robots],
        ['property="og:type"', 'content', seo.type],
        ['property="og:locale"', 'content', seo.language === 'fr' ? 'fr_FR' : 'en_GB'],
        ['property="og:title"', 'content', seo.title],
        ['property="og:description"', 'content', seo.description],
        ['property="og:url"', 'content', seo.canonicalUrl],
        ['property="og:image"', 'content', seo.imageUrl],
        ['property="og:image:alt"', 'content', seo.imageAlt],
        ['name="twitter:title"', 'content', seo.title],
        ['name="twitter:description"', 'content', seo.description],
        ['name="twitter:image"', 'content', seo.imageUrl],
        ['name="twitter:image:alt"', 'content', seo.imageAlt],
    ]
    values.forEach(([selector, attribute, value]) => {
        html = replaceAttribute(html, selector, attribute, value)
    })

    html = html.replace(
        '</head>',
        `${seo.alternates.map(({language, url}) => `<link rel="alternate" hreflang="${language}" href="${escapeHtml(url)}">`).join('\n')}\n</head>`
    )
    if (seo.structuredData) {
        const json = JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')
        html = html.replace(
            '</head>',
            `        <script type="application/ld+json" data-seo-json-ld="true">${json}</script>\n    </head>`
        )
    }

    return html
}

const template = await readFile(join(dist, 'index.html'), 'utf8')
await writeFile(join(dist, 'index.html'), renderMetadata(template, getSeoMetadata('/', 'fr')))

for (const path of INDEXABLE_PATHS) {
    if (path === '/') continue
    const output = join(dist, `${path.slice(1)}.html`)
    await mkdir(dirname(output), {recursive: true})
    await writeFile(output, renderMetadata(template, getSeoMetadata(path)))
}

const notFound = getSeoMetadata('/404', 'fr')
await writeFile(join(dist, '404.html'), renderMetadata(template, notFound))
await mkdir(join(dist, 'en'), {recursive: true})
await writeFile(join(dist, 'en/404.html'), renderMetadata(template, getSeoMetadata('/en/404')))

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${INDEXABLE_PATHS.map(
    (path) =>
        `    <url><loc>${SITE_URL}${path}</loc>${getSeoMetadata(path)
            .alternates.map(
                ({language, url}) =>
                    `<xhtml:link rel="alternate" hreflang="${language}" href="${url}" />`
            )
            .join('')}</url>`
).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

console.log(`SEO pages generated: ${INDEXABLE_PATHS.length} indexable routes + 404`)
