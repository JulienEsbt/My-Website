import {existsSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import {getSeoMetadata, INDEXABLE_PATHS, SITE_URL} from '../src/config/seo.js'

const dist = join(process.cwd(), 'dist')
const errors = []
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

for (const path of INDEXABLE_PATHS) {
    const output = path === '/' ? 'index.html' : `${path.slice(1)}.html`
    const file = join(dist, output)
    if (!existsSync(file)) {
        errors.push(`${output}: page absente`)
        continue
    }

    const html = readFileSync(file, 'utf8')
    const metadata = getSeoMetadata(path, 'fr')
    const expectedCanonical = `${SITE_URL}${path}`
    const canonicalPattern = new RegExp(
        `<link(?=[^>]*rel="canonical")(?=[^>]*href="${escapeRegExp(expectedCanonical)}")[^>]*>`,
        'i'
    )
    if (!canonicalPattern.test(html)) errors.push(`${output}: URL canonique incorrecte`)
    if (!/<meta(?=[^>]*name="description")(?=[^>]*content="[^"\s][^"]+")[^>]*>/isu.test(html))
        errors.push(`${output}: description absente`)
    if (!/<meta(?=[^>]*name="robots")(?=[^>]*content="index, follow")[^>]*>/i.test(html))
        errors.push(`${output}: directive robots incorrecte`)
    if (metadata.structuredData && !html.includes('<script type="application/ld+json">'))
        errors.push(`${output}: données structurées absentes`)
}

const notFoundFile = join(dist, '404.html')
if (!existsSync(notFoundFile)) errors.push('404.html: page absente')
else if (
    !/<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/i.test(
        readFileSync(notFoundFile, 'utf8')
    )
)
    errors.push('404.html: directive noindex absente')

const sitemapFile = join(dist, 'sitemap.xml')
if (!existsSync(sitemapFile)) errors.push('sitemap.xml: fichier absent')
else {
    const sitemap = readFileSync(sitemapFile, 'utf8')
    for (const path of INDEXABLE_PATHS) {
        if (!sitemap.includes(`<loc>${SITE_URL}${path}</loc>`))
            errors.push(`sitemap.xml: route ${path} absente`)
    }
}

const robotsFile = join(dist, 'robots.txt')
if (!existsSync(robotsFile)) errors.push('robots.txt: fichier absent')
else if (!readFileSync(robotsFile, 'utf8').includes(`${SITE_URL}/sitemap.xml`))
    errors.push('robots.txt: sitemap absent ou incorrect')

if (errors.length > 0) {
    console.error('Contrôle SEO du build refusé :')
    errors.forEach((error) => console.error(`- ${error}`))
    process.exit(1)
}

console.log(
    `SEO du build : ${INDEXABLE_PATHS.length} routes indexables, 404, sitemap et robots contrôlés.`
)
