import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const source = process.argv[2]
if (!source) throw new Error('Provide the Bruno Pizza desktop/demo-images folder')
const output = 'src/assets/images/projects/bruno-pizza-hero'
await mkdir(output, {recursive: true})
const imports = []
const entries = []
for (const [id, filename] of [
    ['base', 'DEMO-V2-01-base-tomate.png'],
    ['assembly', 'DEMO-V2-04-pizza-terminee.png'],
]) {
    const input = path.join(source, filename)
    const {width, height} = await sharp(input).metadata()
    const variants = []
    for (const size of [360, 720, width]) {
        for (const format of ['avif', 'webp']) {
            const name = `${id}-${size}.${format}`
            const key = `${id}${size}${format}`
            await sharp(input)
                .resize({width: size, withoutEnlargement: true})
                .toFormat(format, {quality: format === 'avif' ? 65 : 90})
                .toFile(path.join(output, name))
            imports.push(`import ${key} from '../assets/images/projects/bruno-pizza-hero/${name}'`)
            variants.push(
                `{format: '${format === 'webp' ? 'fallback' : 'avif'}', width: ${size}, height: ${Math.round((height * size) / width)}, url: ${key}}`
            )
        }
    }
    entries.push(`${id}: {variants: [${variants.join(',\n')}]}`)
}
await writeFile(
    'src/config/brunoHero.js',
    `${imports.join('\n')}\n\nexport const BRUNO_HERO = {${entries.join(',\n')}}\n`
)
