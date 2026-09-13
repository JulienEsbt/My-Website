import {Readable} from 'node:stream'
import {describe, expect, it} from 'vitest'
import {createContactDevMiddleware} from './contactDevMiddleware.js'

const origin = 'http://localhost:3000'
const body = {
    name: 'Local Test',
    email: 'test@example.com',
    message: 'A local test message.',
    website: '',
    startedAt: 1000,
}
async function submit(payload, headers = {}) {
    const req = Readable.from([payload])
    req.method = 'POST'
    req.headers = {origin, 'content-type': 'application/json', ...headers}
    const res = {
        statusCode: 200,
        setHeader() {},
        end(value) {
            this.body = JSON.parse(value)
        },
    }
    await createContactDevMiddleware({origin, now: () => 3000})(req, res)
    return res
}
describe('local contact adapter', () => {
    it('validates submissions and explicitly reports simulated delivery', async () => {
        const response = await submit(JSON.stringify(body))
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ok: true, delivery: 'simulated'})
    })
    it('uses the real field validation', async () => {
        expect((await submit(JSON.stringify({...body, email: 'bad'}))).statusCode).toBe(400)
    })
    it('rejects oversized streamed bodies even without a content-length header', async () => {
        expect((await submit('a'.repeat(17000))).statusCode).toBe(413)
    })
    it('rejects malformed JSON and untrusted origins', async () => {
        expect((await submit('{')).statusCode).toBe(400)
        expect(
            (await submit(JSON.stringify(body), {origin: 'https://other.example'})).statusCode
        ).toBe(403)
    })
})
