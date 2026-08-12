const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

export async function sendContactEmail(contact, {env = process.env, fetchImpl = fetch} = {}) {
    const serviceId = env.EMAILJS_SERVICE_ID
    const templateId = env.EMAILJS_TEMPLATE_ID
    const publicKey = env.EMAILJS_PUBLIC_KEY
    const privateKey = env.EMAILJS_PRIVATE_KEY

    if (!serviceId || !templateId || !publicKey) {
        throw new Error('Contact provider is not configured')
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
        throw new Error('Contact provider rejected the request')
    }
}
