import {readdir, readFile, writeFile} from 'node:fs/promises'
import {basename, dirname, resolve} from 'node:path'

const travelRoot = resolve(process.cwd(), 'src/assets/images/travels')

async function walk(directory) {
    const entries = await readdir(directory, {withFileTypes: true})
    const children = await Promise.all(
        entries.map((entry) => {
            const path = resolve(directory, entry.name)
            return entry.isDirectory() ? walk(path) : [path]
        }),
    )
    return children.flat()
}

let migratedFiles = 0
let migratedImports = 0

for (const file of await walk(travelRoot)) {
    if (!file.endsWith('.js')) continue

    const album = basename(dirname(file))
    const original = await readFile(file, 'utf8')
    let replacements = 0
    const migrated = original.replace(
        /^import\s+(\w+)\s+from\s+['"]\.\/([^'"]+\.(?:jpe?g|png))['"]\s*$/gim,
        (_, variable, image) => {
            replacements += 1
            return `const ${variable} = getMedia('travels/${album}/${image}')`
        },
    )

    if (replacements === 0) continue

    await writeFile(
        file,
        `import {getMedia} from '../../../../config/media.js'\n\n${migrated}`,
    )
    migratedFiles += 1
    migratedImports += replacements
}

console.log(`${migratedImports} imports migrés dans ${migratedFiles} albums.`)
