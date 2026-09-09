import {INDEXABLE_PATHS} from '../../config/seo.js'
import {languageFromPath} from '../../config/localizedPaths.js'

const publicPaths = new Set(INDEXABLE_PATHS)

export const sanitizeMeasurement = (event) => {
    try {
        const url = new URL(event.url)
        url.search = ''
        url.hash = ''
        url.username = ''
        url.password = ''
        const pathname = url.pathname.replace(/\/$/, '') || '/'
        url.pathname = publicPaths.has(pathname)
            ? pathname
            : languageFromPath(pathname) === 'en'
              ? '/en/404'
              : '/404'
        return {...event, url: url.toString(), ...('route' in event ? {route: url.pathname} : {})}
    } catch {
        return null
    }
}
