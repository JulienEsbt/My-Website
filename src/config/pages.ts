import {ROUTE_PATHS} from './routes.js'
import type {NavigationGroup, NavigationPage} from '../types/domain'

export const SITE_PAGE_GROUPS = [
    {
        id: 'primary',
        i18nKey: 'pageNav.groups.primary',
        pages: [
            {id: 'home', path: ROUTE_PATHS.home, i18nKey: 'pageNav.home'},
            {id: 'web3', path: ROUTE_PATHS.web3, i18nKey: 'pageNav.web3'},
        ],
    },
    {
        id: 'editorial',
        i18nKey: 'pageNav.groups.editorial',
        pages: [
            {id: 'travel', path: ROUTE_PATHS.travel, i18nKey: 'pageNav.travel'},
            {id: 'reflections', path: ROUTE_PATHS.reflections, i18nKey: 'pageNav.reflections'},
            {id: 'journal', path: ROUTE_PATHS.journal, i18nKey: 'pageNav.journal'},
        ],
    },
] as const satisfies readonly NavigationGroup[]

export const SITE_PAGES: readonly NavigationPage[] = SITE_PAGE_GROUPS.reduce<NavigationPage[]>(
    (pages, group) => [...pages, ...group.pages],
    []
)
