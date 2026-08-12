const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u

function removeControlCharacters(value) {
    return Array.from(value, (character) => {
        const codePoint = character.codePointAt(0)
        const isForbidden =
            codePoint <= 8 || codePoint === 11 || codePoint === 12 || codePoint === 127
        return isForbidden || (codePoint >= 14 && codePoint <= 31) ? '' : character
    }).join('')
}

function normalizeSingleLine(value) {
    return removeControlCharacters(String(value ?? '').normalize('NFKC'))
        .replace(/\s+/gu, ' ')
        .trim()
}

function normalizeMessage(value) {
    return removeControlCharacters(String(value ?? '').normalize('NFKC'))
        .replace(/\r\n?/gu, '\n')
        .trim()
}

export function validateContactPayload(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {ok: false}
    }

    const data = {
        name: normalizeSingleLine(input.name),
        email: normalizeSingleLine(input.email).toLowerCase(),
        message: normalizeMessage(input.message),
        website: normalizeSingleLine(input.website),
        startedAt: Number(input.startedAt),
    }

    const isValid =
        data.name.length >= 2 &&
        data.name.length <= 80 &&
        data.email.length <= 254 &&
        EMAIL_PATTERN.test(data.email) &&
        data.message.length >= 10 &&
        data.message.length <= 4000 &&
        Number.isFinite(data.startedAt) &&
        data.startedAt > 0

    return isValid ? {ok: true, data} : {ok: false}
}
