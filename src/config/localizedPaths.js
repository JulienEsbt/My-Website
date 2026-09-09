export const languageFromPath = (pathname) => (/^\/en(?:\/|$)/.test(pathname) ? 'en' : 'fr')

export const unlocalizedPath = (pathname) => pathname.replace(/^\/en(?=\/|$)/, '') || '/'

export const localizedPath = (path, language) => {
    const base = unlocalizedPath(path)
    return language?.startsWith('en') ? `/en${base === '/' ? '' : base}` : base
}

export const languageSwitchUrl = (href, language) => {
    const url = new URL(href, 'https://www.julienesterbet.com')
    url.pathname = localizedPath(url.pathname, language)
    url.searchParams.delete('lang')
    return `${url.pathname}${url.search}${url.hash}`
}
