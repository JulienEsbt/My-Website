import {readdir, writeFile, mkdir} from 'node:fs/promises'
import sharp from 'sharp'
import {format} from 'prettier'

const source = 'docs/assets/bruno-pizza-v12'
const output = 'src/assets/images/projects/bruno-pizza-v12'
await mkdir(output, {recursive: true})
const files = (await readdir(source)).filter((file) => file.endsWith('.png')).sort()
let imports = ''
const entries = []
for (const [index, file] of files.entries()) {
    const id = file.replace('.png', '')
    const metadata = await sharp(`${source}/${file}`).metadata()
    const widths = [
        ...new Set([640, 1280, 2048, metadata.width].filter((width) => width <= metadata.width)),
    ]
    const variants = []
    for (const width of widths) {
        const name = `${id}-${width}.webp`
        await sharp(`${source}/${file}`)
            .resize({width, withoutEnlargement: true})
            .webp({quality: 96, effort: 5})
            .toFile(`${output}/${name}`)
        const variable = `image${index}w${width}`
        imports += `import ${variable} from '../assets/images/projects/bruno-pizza-v12/${name}'\n`
        variants.push(
            `{format:'fallback',width:${width},height:${Math.round((metadata.height * width) / metadata.width)},url:${variable}}`
        )
    }
    entries.push(`{id:'${id}',variants:[${variants.join(',')}]}`)
}
await writeFile(
    'src/config/brunoGallery.js',
    await format(imports + `\nexport const BRUNO_GALLERY = [${entries.join(',\n')}]\n`, {
        parser: 'babel',
        singleQuote: true,
        semi: false,
        tabWidth: 4,
        bracketSpacing: false,
        printWidth: 100,
    })
)
