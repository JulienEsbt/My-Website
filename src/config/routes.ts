import {ROUTE_CATALOG} from './routeCatalog.js'
export const ROUTE_PATHS = Object.freeze(
    Object.fromEntries(Object.entries(ROUTE_CATALOG).map(([id, route]) => [id, route.path]))
) as {[K in keyof typeof ROUTE_CATALOG]: (typeof ROUTE_CATALOG)[K]['path']}
