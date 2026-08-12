import {afterEach, describe, expect, it, vi} from 'vitest'
import {sendContactForm} from './contactService.js'

function createForm() {
    const form = document.createElement('form')
    for (const [name, value] of [
        ['name', 'Julien'],
        ['email', 'julien@example.com'],
        ['message', 'A sufficiently detailed message.'],
        ['website', ''],
        ['startedAt', '1234'],
    ]) {
        const input = document.createElement('input')
        input.name = name
        input.value = value
        form.append(input)
    }
    return form
}

describe('sendContactForm', () => {
    afterEach(() => vi.restoreAllMocks())

    it('posts normalized form fields to the server endpoint', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ok: true}),
        })

        await expect(sendContactForm(createForm())).resolves.toEqual({ok: true})
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/contact',
            expect.objectContaining({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            })
        )
        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
            name: 'Julien',
            email: 'julien@example.com',
            website: '',
        })
    })

    it('rejects a failed server response without exposing its body', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({ok: false})

        await expect(sendContactForm(createForm())).rejects.toThrow('Contact request failed')
    })
})
