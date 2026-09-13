import {sendContactEmail} from '../contact/emailProvider.js'

export async function notifyComment(comment, {env = process.env, send = sendContactEmail} = {}) {
    if (env.VERCEL_ENV !== 'production' || env.COMMENTS_NOTIFY_EMAIL !== 'true') return
    const path = `${comment.language === 'en' ? '/en' : ''}/reflections/${encodeURIComponent(comment.slug)}`
    await send(
        {
            name: `Nouveau commentaire — ${comment.pseudonym}`,
            email: '',
            message: [
                'Un nouveau commentaire vient d’être publié sur le portfolio.',
                `Article : https://julienesterbet.com${path}`,
                `Pseudonyme : ${comment.pseudonym}`,
                comment.quote
                    ? `Passage : ${comment.quote}`
                    : 'Commentaire sur la réflexion entière.',
                '',
                comment.body,
                '',
                `Identifiant : ${comment.id}`,
            ].join('\n'),
        },
        {env}
    )
}
