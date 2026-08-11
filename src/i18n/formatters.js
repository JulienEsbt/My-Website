export const normalizeLanguage = (language) => (language?.startsWith('fr') ? 'fr' : 'en')

export const getLocale = (language) => (normalizeLanguage(language) === 'fr' ? 'fr-FR' : 'en-GB')

export const formatDate = (value, language, options = {}) =>
    new Intl.DateTimeFormat(getLocale(language), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
        ...options,
    }).format(new Date(value))

export const formatNumber = (value, language, options = {}) =>
    new Intl.NumberFormat(getLocale(language), options).format(Number(value || 0))

export const formatCurrency = (value, language, currency = 'USD', options = {}) =>
    new Intl.NumberFormat(getLocale(language), {
        style: 'currency',
        currency,
        maximumFractionDigits: Number(value) >= 100 ? 0 : 2,
        ...options,
    }).format(Number(value || 0))

export const formatPercent = (value, language, options = {}) =>
    new Intl.NumberFormat(getLocale(language), {
        style: 'percent',
        maximumFractionDigits: 1,
        ...options,
    }).format(Number(value || 0) / 100)
