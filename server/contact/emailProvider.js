const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

function classifyProviderError(status, details = '') {
    const message = String(details).toLowerCase()

    if (status === 429) return 'rate_limit'
    if (message.includes('service_id') || message.includes('service id')) return 'service'
    if (message.includes('template_id') || message.includes('template id')) return 'template'
    if (message.includes('user_id') || message.includes('public key')) return 'public_key'
    if (
        message.includes('access token') ||
        message.includes('private key') ||
        message.includes('unauthorized') ||
        message.includes('forbidden')
    ) {
        return 'authorization'
    }
    return 'provider'
}

export async function sendContactEmail(contact, {env = process.env, fetchImpl = fetch} = {}) {
    const serviceId = env.EMAILJS_SERVICE_ID
    const templateId = env.EMAILJS_TEMPLATE_ID
    const publicKey = env.EMAILJS_PUBLIC_KEY
    const privateKey = env.EMAILJS_PRIVATE_KEY

    if (!serviceId || !templateId || !publicKey) {
        const error = new Error('Contact provider is not configured')
        error.providerReason = !serviceId ? 'service' : !templateId ? 'template' : 'public_key'
        throw error
    }

    const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
            name: contact.name,
            email: contact.email,
            reply_to: contact.email,
            message: contact.message,
        },
    }

    if (privateKey) payload.accessToken = privateKey

    const response = await fetchImpl(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
        const error = new Error('Contact provider rejected the request')
        error.providerStatus = response.status
        error.providerReason = classifyProviderError(response.status, await response.text())
        throw error
    }
}
