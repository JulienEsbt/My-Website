import {lazy} from 'react'
import {ROUTE_PATHS} from '../config/routes.js'
import {loadNamespace} from '../i18n/i18n.js'

const routeLoaders = {
    [ROUTE_PATHS.home]: {
        namespace: 'home',
        loadPage: () => import('../pages/HomePage.jsx'),
    },
    [ROUTE_PATHS.brunoPizzaCaseStudy]: {
        namespace: 'projects',
        loadPage: () => import('../pages/BrunoPizzaCaseStudyPage.jsx'),
    },
    [ROUTE_PATHS.myWebsiteCaseStudy]: {
        namespace: 'projects',
        loadPage: () => import('../pages/MyWebsiteCaseStudyPage.jsx'),
    },
    [ROUTE_PATHS.resume]: {
        namespace: 'resume',
        loadPage: () => import('../pages/ResumePage.jsx'),
    },
    [ROUTE_PATHS.web3]: {
        namespace: 'web3',
        loadPage: () => import('../pages/Web3Page.jsx'),
    },
    [ROUTE_PATHS.travel]: {
        namespace: 'travel',
        loadPage: () => import('../pages/TravelPage.jsx'),
    },
    [ROUTE_PATHS.reflections]: {
        namespace: 'reflections',
        loadPage: () => import('../pages/ReflectionsPage.jsx'),
    },
    [ROUTE_PATHS.reflectionArticle]: {
        namespace: 'reflections',
        loadPage: () => import('../pages/ReflectionArticlePage.jsx'),
    },
}

const loadLocalizedPage = ({loadPage, namespace}) =>
    Promise.all([loadPage(), loadNamespace(namespace)]).then(([pageModule]) => pageModule)

export const APP_ROUTES = Object.entries(routeLoaders).map(([path, route]) => ({
    path,
    Component: lazy(() => loadLocalizedPage(route)),
}))
