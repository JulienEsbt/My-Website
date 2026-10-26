import sharp from 'sharp'
import {mkdir, writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

const root = new URL('../', import.meta.url)
const output = new URL('src/assets/images/projects/my-website/', root)
await mkdir(output, {recursive: true})
const source = new URL('docs/assets/my-website/hero-source.png', root)
// Keep the introduction, portrait and interest labels; exclude navigation and empty margins.
const crop = {left: 240, top: 180, width: 1440, height: 600}
const imports = [],
    variants = []
for (const width of [480, 800, 1200, 1440]) {
    for (const format of ['avif', 'webp']) {
        const name = `hero-${width}.${format}`
        const variable = `hero${width}${format}`
        const image = sharp(fileURLToPath(source))
            .extract(crop)
            .resize({width, withoutEnlargement: true})
        const {height} = await image
            .toFormat(
                format,
                format === 'avif' ? {quality: 65, effort: 6} : {quality: 88, effort: 6}
            )
            .toFile(fileURLToPath(new URL(name, output)))
        imports.push(`import ${variable} from '../assets/images/projects/my-website/${name}'`)
        variants.push(
            `        {format: '${format === 'webp' ? 'fallback' : format}', width: ${width}, height: ${height}, url: ${variable}},`
        )
    }
}
await writeFile(
    new URL('src/config/websiteMedia.js', root),
    `${imports.join('\n')}\n\nexport const WEBSITE_COVER = {\n    variants: [\n${variants.join('\n')}\n    ],\n}\n`
)
