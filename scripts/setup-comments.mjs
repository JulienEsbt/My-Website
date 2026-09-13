import {readFile} from 'node:fs/promises'
import {getCommentPool} from '../server/comments/store.js'
if (!process.env.COMMENTS_DATABASE_URL)
    throw new Error('Set COMMENTS_DATABASE_URL before running this migration.')
const pool = getCommentPool()
try {
    await pool.query(
        await readFile(new URL('../server/comments/schema.sql', import.meta.url), 'utf8')
    )
    console.log('Comments schema ready.')
} finally {
    await pool.end()
}
