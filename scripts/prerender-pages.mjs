import {ROUTE_CATALOG} from '../src/config/routeCatalog.js'
import {build} from 'vite'
import {readFile, writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
import {JSDOM} from 'jsdom'
import {INDEXABLE_PATHS} from '../src/config/seo.js'

await build({
    build: {ssr: 'src/prerender.jsx', outDir: 'dist-ssr', copyPublicDir: false, manifest: false},
})
process.env.NODE_ENV = 'production'
const {renderPage} = await import(pathToFileURL(resolve('dist-ssr/prerender.js')))
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
// Pages share styles; only link styles for their own entry and static dependencies.
const stylesFor = (entry, seen = new Set()) => {
    if (!entry || seen.has(entry)) return []
    seen.add(entry)
    const chunk = manifest[entry]
    if (!chunk) return []
    return [...(chunk.css ?? []), ...(chunk.imports ?? []).flatMap((key) => stylesFor(key, seen))]
}

for (const path of [...INDEXABLE_PATHS, '/404', '/en/404']) {
    const htmlPath = path === '/' ? 'dist/index.html' : `dist${path}.html`
    const template = await readFile(htmlPath, 'utf8')
    const body = await renderPage(path)
    const dom = new JSDOM(`<body>${body}</body>`)
    const document = dom.window.document
    // Static content must not retain animation start states without JavaScript.
    for (const element of document.querySelectorAll('[style]')) {
        if (element.style.opacity === '0') {
            element.style.opacity = '1'
            element.style.removeProperty('transform')
            element.style.removeProperty('filter')
        }
    }
    document
        .querySelectorAll(
            '.section-nav, .reflexion-article__floating-actions, .reflexion-article__progress'
        )
        .forEach((element) => element.remove())
    document.querySelectorAll('form').forEach((form) => {
        const notice = document.createElement('p')
        notice.textContent = path.startsWith('/en')
            ? 'Interactive forms require JavaScript. You can also use the email link on this page.'
            : 'Les formulaires interactifs nécessitent JavaScript. Vous pouvez aussi utiliser le lien email de cette page.'
        form.prepend(notice)
    })
    // Nonfunctional controls are disabled in the readable static fallback.
    document.querySelectorAll('button, input, textarea, select').forEach((element) => {
        element.disabled = true
    })
    const content = `<div id="prerendered-content">${document.body.innerHTML}</div>`
    dom.window.close()
    const basePath = path.replace(/^\/en(?=\/|$)/, '') || '/'
    const page =
        Object.values(ROUTE_CATALOG).find(({path}) => path === basePath)?.page ??
        (basePath.startsWith('/reflections/')
            ? ROUTE_CATALOG.reflectionArticle.page
            : 'NotFoundPage')
    const existingStyles = new Set(
        [...template.matchAll(/<link[^>]+href="\/([^"]+\.css)"/g)].map((match) => match[1])
    )
    const styles = [...new Set(stylesFor(`src/pages/${page}.jsx`))]
        .filter((file) => !existingStyles.has(file))
        .map((file) => `<link rel="stylesheet" href="/${file}">`)
        .join('\n')
    const html = template
        .replace('</head>', `${styles}\n</head>`)
        .replace('<div id="root"></div>', `${content}<div id="root"></div>`)
    if (!html.includes('<h1') || !html.includes('id="prerendered-content"'))
        throw new Error(`Missing page content: ${path}`)
    await writeFile(htmlPath, html)
}
console.log(`Prerendered ${INDEXABLE_PATHS.length} localized pages and two 404 pages.`)
