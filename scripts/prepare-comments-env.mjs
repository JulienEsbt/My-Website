import {readFile, writeFile, chmod} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {randomBytes} from 'node:crypto'
const file = '.env.local'
try {
    execFileSync('git', ['check-ignore', '--quiet', file])
} catch {
    throw new Error('.env.local must be ignored by Git before storing private settings.')
}
let content = await readFile(file, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return ''
    throw error
})
const settings = {
    COMMENTS_DATABASE_URL: '',
    COMMENTS_RATE_SECRET: randomBytes(32).toString('hex'),
    COMMENTS_ADMIN_TOKEN: randomBytes(32).toString('hex'),
    COMMENTS_ALLOWED_ORIGINS: 'https://julienesterbet.com,https://www.julienesterbet.com',
}
let added = 0
for (const [key, value] of Object.entries(settings)) {
    if (!new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`, 'm').test(content)) {
        content += `\n${key}=${value}\n`
        added++
    }
}
if (added) await writeFile(file, content, {mode: 0o600})
await chmod(file, 0o600)
console.log(
    `Private comments settings ready (${added} settings added). Existing values preserved. Fill COMMENTS_DATABASE_URL in .env.local, then run the setup script. No secret is printed.`
)
