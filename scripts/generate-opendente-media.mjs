import sharp from 'sharp'
import {readdir, mkdir} from 'node:fs/promises'
import {resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const source = process.argv[2]
if (!source) throw new Error('Usage: node scripts/generate-opendente-media.mjs <source folder>')
const output = fileURLToPath(new URL('../src/assets/images/projects/opendente/', import.meta.url))
await mkdir(output, {recursive: true})
const files = await readdir(source)
const originals = {
    'panel-fr-light': '13.57.46',
    'panel-fr-dark': '13.58.09',
    'panel-en-light': '13.58.59',
    'panel-en-dark': '13.59.13',
    'charge-fr': '14.00.28',
    'charge-en': '13.59.31',
    'menu-fr': '14.00.32',
    'menu-en': '13.59.51',
    'magsafe-en': '13.59.45',
    'guide-fr': '14.00.40',
    'guide-en': '14.00.09',
}
const paths = {}
for (const [name, time] of Object.entries(originals)) {
    const filename = files.find((file) => file.endsWith(`${time}.png`))
    if (!filename) throw new Error(`Missing source image: ${time}`)
    const path = resolve(source, filename)
    paths[name] = path
    const {width} = await sharp(path).metadata()
    for (const size of [360, 720, width]) {
        await sharp(path)
            .resize({width: size, withoutEnlargement: true})
            .webp({lossless: true, effort: 6})
            .toFile(resolve(output, `${name}-${size}.webp`))
    }
}
const background = Buffer.from(
    `<svg width="2400" height="1500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g"><stop stop-color="#12384a"/><stop offset="1" stop-color="#080e22"/></radialGradient><pattern id="p" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M96 0H0V96" fill="none" stroke="#6bd4dd" stroke-opacity=".04"/></pattern></defs><rect width="2400" height="1500" fill="url(#g)"/><rect width="2400" height="1500" fill="url(#p)"/></svg>`
)
const dark = await sharp(paths['panel-fr-dark']).resize({width: 720}).png().toBuffer()
const light = await sharp(paths['panel-fr-light']).resize({width: 620}).png().toBuffer()
const cover = await sharp(background)
    .composite([
        {input: dark, left: 480, top: 120},
        {input: light, left: 1340, top: 190},
    ])
    .png()
    .toBuffer()
for (const width of [640, 1280, 1600, 2400]) {
    await sharp(cover)
        .resize({width})
        .webp({lossless: true, effort: 6})
        .toFile(resolve(output, `cover-${width}.webp`))
}
