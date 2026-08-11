import {lazy} from 'react'
import {ROUTE_PATHS} from '../config/routes.js'

const routeLoaders = {
    [ROUTE_PATHS.home]: () => import('../pages/HomePage.jsx'),
    [ROUTE_PATHS.web3]: () => import('../pages/Web3Page.jsx'),
    [ROUTE_PATHS.travel]: () => import('../pages/TravelPage.jsx'),
    [ROUTE_PATHS.reflections]: () => import('../pages/ReflectionsPage.jsx'),
    [ROUTE_PATHS.reflectionArticle]: () => import('../pages/ReflectionArticlePage.jsx'),
}

export const APP_ROUTES = Object.entries(routeLoaders).map(([path, loader]) => ({
    path,
    Component: lazy(loader),
}))

export function preloadRoute(path) {
    const normalizedPath = path.startsWith('/reflections/')
        ? ROUTE_PATHS.reflectionArticle
        : path

    return routeLoaders[normalizedPath]?.()
}
