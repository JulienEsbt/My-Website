import {HOME_ASSETS} from './homeAssets.js'
import {LINKS} from './links.js'
import {ROUTE_PATHS} from './routes.js'
import type {PortfolioProject} from '../types/domain'

export const PORTFOLIO_PROJECTS = [
    {
        id: '1',
        status: 'active',
        image: HOME_ASSETS.portfolio.brunoPizza,
        repository: LINKS.projects.brunoPizza,
        caseStudy: ROUTE_PATHS.brunoPizzaCaseStudy,
        tags: ['react', 'typescript', 'electron', 'express', 'sqlite'],
    },
    {
        id: '4',
        status: 'active',
        image: HOME_ASSETS.portfolio.openDente,
        repository: LINKS.projects.openDente,
        caseStudy: ROUTE_PATHS.openDenteCaseStudy,
        tags: ['swift', 'swiftui', 'macos', 'i18n'],
    },
    {
        id: '2',
        status: 'portfolio',
        image: HOME_ASSETS.portfolio.myWebsite,
        repository: LINKS.projects.myWebsite,
        demo: LINKS.demos.myWebsite,
        caseStudy: ROUTE_PATHS.myWebsiteCaseStudy,
        tags: ['react', 'vite', 'i18n', 'accessibility', 'vercel'],
    },
    {
        id: '3',
        status: 'academic',
        image: HOME_ASSETS.portfolio.megalis,
        repository: LINKS.projects.megalis,
        tags: ['solidity', 'evm', 'storage'],
    },
] as const satisfies readonly PortfolioProject[]
