import {randomUUID} from 'node:crypto'
import pg from 'pg'
let pool
export function getCommentPool(env = process.env) {
    if (!pool)
        pool = new pg.Pool({
            connectionString: env.COMMENTS_DATABASE_URL,
            max: 3,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 10000,
            statement_timeout: 8000,
        })
    return pool
}
const publicColumns =
    'id, slug, language, pseudonym, body, quote, prefix, suffix, created_at AS "createdAt"'
export function createCommentStore(env) {
    const db = () => getCommentPool(env)
    return {
        async list(slug, language, offset) {
            const {rows} = await db().query(
                `SELECT ${publicColumns} FROM reflection_comments WHERE slug=$1 AND language=$2 ORDER BY created_at DESC, id LIMIT 21 OFFSET $3`,
                [slug, language, offset]
            )
            return {comments: rows.slice(0, 20), hasMore: rows.length > 20}
        },
        async allow(key) {
            const client = await db().connect()
            try {
                await client.query('BEGIN')
                await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [key])
                await client.query(
                    'DELETE FROM reflection_comment_limits WHERE expires_at <= now()'
                )
                const {rows} = await client.query(
                    `SELECT expires_at FROM reflection_comment_limits WHERE key LIKE $1 ORDER BY expires_at`,
                    [`${key}:event:%`]
                )
                const now = Date.now()
                const times = rows.map((row) => new Date(row.expires_at).getTime() - 7200000)
                const recent = times.filter((time) => time > now - 900000)
                const retryAfter = Math.max(
                    recent.length >= 10
                        ? Math.ceil((recent[recent.length - 10] + 900000 - now) / 1000)
                        : 0,
                    times.length >= 30
                        ? Math.ceil((times[times.length - 30] + 7200000 - now) / 1000)
                        : 0
                )
                if (retryAfter > 0) {
                    await client.query('COMMIT')
                    return {allowed: false, retryAfter}
                }
                await client.query(
                    `INSERT INTO reflection_comment_limits(key,count,expires_at) VALUES($1,1,now()+interval '2 hours')`,
                    [`${key}:event:${randomUUID()}`]
                )
                await client.query('COMMIT')
                return {allowed: true, retryAfter: 0}
            } catch (error) {
                await client.query('ROLLBACK')
                throw error
            } finally {
                client.release()
            }
        },
        async add(data) {
            const {rows} = await db().query(
                `INSERT INTO reflection_comments(id,slug,language,pseudonym,body,quote,prefix,suffix,delete_hash) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${publicColumns}`,
                [
                    data.id,
                    data.slug,
                    data.language,
                    data.pseudonym,
                    data.body,
                    data.quote,
                    data.prefix,
                    data.suffix,
                    data.deleteHash,
                ]
            )
            return rows[0]
        },
        async remove(id, hash, admin) {
            const result = await db().query(
                'DELETE FROM reflection_comments WHERE id=$1 AND (delete_hash=$2 OR $3::boolean) RETURNING id',
                [id, hash, admin]
            )
            return result.rowCount > 0
        },
    }
}
