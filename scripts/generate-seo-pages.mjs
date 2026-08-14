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
    const pattern = new RegExp(`(<meta[^>]+${escapedSelector}[^>]+${attribute}=")[^"]*(")`, 'i')
    return html.replace(pattern, `$1${escapeHtml(value)}$2`)
}

const renderMetadata = (template, seo) => {
    let html = template
        .replace(/<html lang="[^"]+">/, `<html lang="${seo.language}">`)
        .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
        .replace(
            /<link rel="canonical" href="[^"]+" \/>/,
            `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`
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

    if (seo.structuredData) {
        const json = JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')
        html = html.replace(
            '</head>',
            `        <script type="application/ld+json">${json}</script>\n    </head>`
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
    await writeFile(output, renderMetadata(template, getSeoMetadata(path, 'fr')))
}

const notFound = getSeoMetadata('/404', 'fr')
await writeFile(join(dist, '404.html'), renderMetadata(template, notFound))

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE_PATHS.map((path) => `    <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

console.log(`SEO pages generated: ${INDEXABLE_PATHS.length} indexable routes + 404`)
