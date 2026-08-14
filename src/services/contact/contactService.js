export async function sendContactForm(form) {
    const payload = Object.fromEntries(new FormData(form).entries())
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12_000)

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
            signal: controller.signal,
        })

        const result = await response.json().catch(() => ({ok: false, code: 'unknown_error'}))

        if (!response.ok) {
            const error = new Error('Contact request failed')
            error.code = result.code ?? 'unknown_error'
            throw error
        }

        return result
    } finally {
        window.clearTimeout(timeout)
    }
}
