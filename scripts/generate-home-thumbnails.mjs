import {mkdir, writeFile} from 'node:fs/promises'
import sharp from 'sharp'
import {format} from 'prettier'

const output = 'src/assets/images/home/thumbnails'
await mkdir(output, {recursive: true})
const sources = [
    ['portrait', 'public/media/hero/me-53b31f13aac9/1024.avif', [160, 256, 320]],
    ['bruno', 'src/assets/images/projects/bruno-pizza-v12/01-dashboard-3420.webp', [160, 320]],
    ['opendente', 'src/assets/images/projects/opendente/cover-2400.webp', [160, 320]],
    ['website', 'src/assets/images/projects/my-website/hero-1440.webp', [160, 320]],
]
const imports = [],
    entries = []
for (const [id, source, widths] of sources) {
    const variants = []
    for (const width of widths) {
        for (const encoding of ['avif', 'webp']) {
            const name = `home-thumb-${id}-${width}.${encoding}`
            const variable = `${id}${width}${encoding}`
            const {height} = await sharp(source)
                .resize({width, withoutEnlargement: true})
                .toFormat(encoding, {quality: encoding === 'avif' ? 65 : 88, effort: 6})
                .toFile(`${output}/${name}`)
            imports.push(
                `import ${variable} from '../assets/images/home/thumbnails/${name}?no-inline'`
            )
            variants.push(
                `{format: '${encoding === 'avif' ? 'avif' : 'fallback'}', width: ${width}, height: ${height}, url: ${variable}}`
            )
        }
    }
    entries.push(`${id}: {variants: [${variants.join(',')}]}`)
}
await writeFile(
    'src/config/homeThumbnails.js',
    await format(
        `${imports.join('\n')}\n\nexport const HOME_THUMBNAILS = {${entries.join(',\n')}}\n`,
        {
            parser: 'babel',
            singleQuote: true,
            semi: false,
            tabWidth: 4,
            bracketSpacing: false,
            printWidth: 100,
        }
    )
)
