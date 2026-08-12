import {describe, expect, it, vi} from 'vitest'
import {sendContactEmail} from './emailProvider.js'

const contact = {
    name: 'Julien Esterbet',
    email: 'julien@example.com',
    message: 'A sufficiently detailed message.',
}

const env = {
    EMAILJS_SERVICE_ID: 'service-id',
    EMAILJS_TEMPLATE_ID: 'template-id',
    EMAILJS_PUBLIC_KEY: 'public-key',
    EMAILJS_PRIVATE_KEY: 'private-key',
}

describe('sendContactEmail', () => {
    it('keeps provider credentials in the server request', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({ok: true})

        await sendContactEmail(contact, {env, fetchImpl})

        const [url, request] = fetchImpl.mock.calls[0]
        const payload = JSON.parse(request.body)
        expect(url).toBe('https://api.emailjs.com/api/v1.0/email/send')
        expect(payload).toMatchObject({
            service_id: 'service-id',
            template_id: 'template-id',
            user_id: 'public-key',
            accessToken: 'private-key',
            template_params: {
                name: contact.name,
                email: contact.email,
                reply_to: contact.email,
                message: contact.message,
            },
        })
    })

    it('refuses to call the provider without server configuration', async () => {
        const fetchImpl = vi.fn()

        await expect(sendContactEmail(contact, {env: {}, fetchImpl})).rejects.toThrow(
            'Contact provider is not configured'
        )
        expect(fetchImpl).not.toHaveBeenCalled()
    })
})
