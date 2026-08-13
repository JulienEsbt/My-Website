import type {RoutePath} from '../types/domain'

export const ROUTE_PATHS = Object.freeze({
    home: '/',
    brunoPizzaCaseStudy: '/projects/bruno-pizza',
    myWebsiteCaseStudy: '/projects/my-website',
    resume: '/resume',
    web3: '/web3',
    travel: '/travel',
    reflections: '/reflections',
    reflectionArticle: '/reflections/:slug',
} satisfies Record<string, RoutePath>)
