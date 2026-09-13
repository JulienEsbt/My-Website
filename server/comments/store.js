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
            await db().query('DELETE FROM reflection_comment_limits WHERE expires_at < now()')
            const {rows} = await db().query(
                `INSERT INTO reflection_comment_limits(key,count,expires_at) VALUES($1,1,now()+interval '1 minute') ON CONFLICT(key) DO UPDATE SET count=reflection_comment_limits.count+1 RETURNING count`,
                [`${key}:${Math.floor(Date.now() / 60000)}`]
            )
            return rows[0].count <= 60
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
