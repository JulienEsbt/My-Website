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

        if (!response.ok) {
            throw new Error('Contact request failed')
        }

        return await response.json()
    } finally {
        window.clearTimeout(timeout)
    }
}
