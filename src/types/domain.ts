export type SupportedLanguage = 'fr' | 'en'

export type LocalizedText = Readonly<Record<SupportedLanguage, string>>

export type RoutePath =
    | '/'
    | '/projects/bruno-pizza'
    | '/projects/my-website'
    | '/resume'
    | '/privacy'
    | '/web3'
    | '/travel'
    | '/reflections'
    | '/journal'
    | '/reflections/:slug'

export interface NavigationPage {
    id: 'home' | 'web3' | 'travel' | 'reflections' | 'journal'
    path: RoutePath
    i18nKey: string
}

export interface NavigationGroup {
    id: 'primary' | 'editorial'
    i18nKey: string
    pages: readonly NavigationPage[]
}

export interface ExternalLink {
    name: string
    url: `https://${string}`
}

export interface BlockchainNetwork {
    id: 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'bnb'
    name: string
    symbol: string
    rpcEnv:
        | 'VITE_ETH_RPC_URL'
        | 'VITE_POLYGON_RPC_URL'
        | 'VITE_ARBITRUM_RPC_URL'
        | 'VITE_OPTIMISM_RPC_URL'
        | 'VITE_BNB_RPC_URL'
    explorer: `https://${string}`
}

export interface EvmChainMetadata {
    name: string
    chainHex: `0x${string}`
    explorer: `https://${string}/`
}

export interface ProjectSummary {
    id: string
    title: LocalizedText
    description: LocalizedText
    status: 'active' | 'portfolio' | 'academic' | 'historical'
    repository?: `https://github.com/${string}`
    demo?: `https://${string}`
    technologies: readonly string[]
}

export interface PortfolioProject {
    id: '1' | '2' | '3'
    status: 'active' | 'portfolio' | 'academic'
    image: unknown
    repository: `https://github.com/${string}`
    demo?: `https://${string}`
    caseStudy?: RoutePath
    tags: readonly string[]
}

export interface EditorialEntry {
    id: string
    slug: string
    title: LocalizedText
    excerpt: LocalizedText
    category: 'philosophy' | 'politics' | 'society' | 'technology'
    date: string
    readingTime: number
    featured?: boolean
}
