import {readFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {extname} from 'node:path'

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'})
    .split('\0')
    .filter(Boolean)

const forbiddenNames = [
    /(^|\/)\.env(?:\.|$)(?!example$)/u,
    /(^|\/)(?:id_rsa|id_ed25519)(?:\.pub)?$/u,
    /(^|\/).+\.(?:key|p12|pfx|pem)$/iu,
]
const textExtensions = new Set([
    '.cjs',
    '.css',
    '.html',
    '.js',
    '.json',
    '.jsx',
    '.md',
    '.mjs',
    '.ts',
    '.tsx',
    '.txt',
    '.xml',
    '.yaml',
    '.yml',
])
const secretPatterns = [
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
    ['GitHub token', /\bgh[opsu]_[A-Za-z0-9]{30,}\b/u],
    ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/u],
    ['OpenAI API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/u],
]

const violations = []

for (const file of trackedFiles) {
    if (forbiddenNames.some((pattern) => pattern.test(file))) {
        violations.push(`${file}: nom de fichier sensible`)
        continue
    }
    if (!textExtensions.has(extname(file).toLowerCase())) continue

    const content = readFileSync(file, 'utf8')
    for (const [label, pattern] of secretPatterns) {
        if (pattern.test(content)) violations.push(`${file}: motif ${label}`)
    }
}

if (violations.length > 0) {
    console.error('Contrôle des fichiers sensibles refusé :')
    violations.forEach((violation) => console.error(`- ${violation}`))
    process.exit(1)
}

console.log(
    `Fichiers sensibles : ${trackedFiles.length} fichiers suivis contrôlés, aucun motif interdit.`
)
