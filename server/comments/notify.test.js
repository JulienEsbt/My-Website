import {describe, it, expect, vi} from 'vitest'
import {notifyComment} from './notify.js'
const comment = {
    id: 'test',
    slug: 'charte-de-pensee',
    language: 'fr',
    pseudonym: 'Camille',
    body: 'Une remarque',
    quote: 'Un passage',
}
describe('comment notification', () => {
    it('never sends from local or preview, or without opt-in', async () => {
        const send = vi.fn()
        for (const env of [
            {},
            {VERCEL_ENV: 'preview', COMMENTS_NOTIFY_EMAIL: 'true'},
            {VERCEL_ENV: 'production'},
        ])
            await notifyComment(comment, {env, send})
        expect(send).not.toHaveBeenCalled()
    })
    it('uses the contact recipient template with the article and passage in production', async () => {
        const send = vi.fn()
        const env = {VERCEL_ENV: 'production', COMMENTS_NOTIFY_EMAIL: 'true'}
        await notifyComment(comment, {env, send})
        expect(send).toHaveBeenCalledWith(
            expect.objectContaining({
                email: '',
                message: expect.stringContaining(
                    'https://julienesterbet.com/reflections/charte-de-pensee'
                ),
            }),
            {env}
        )
        expect(send.mock.calls[0][0].message).toContain('Un passage')
    })
})
