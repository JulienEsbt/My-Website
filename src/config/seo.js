import reflections from '../data/reflections/reflections.js'

export const SITE_URL = 'https://www.julien-esterbet.com'
export const DEFAULT_SOCIAL_IMAGE = '/og/julien-esterbet-portfolio.png'

const content = {
    fr: {
        home: {
            title: 'Julien Esterbet — Développeur full-stack orienté produit',
            description:
                'Portfolio de Julien Esterbet, développeur full-stack orienté produit : applications métiers, FinTech, React, Angular, Java et expérimentations Web3.',
        },
        brunoPizza: {
            title: 'Bruno Pizza — Étude de cas produit | Julien Esterbet',
            description:
                'Étude de cas de Bruno Pizza Production, une application desktop locale qui transforme un plan Excel en parcours de production guidé.',
        },
        myWebsite: {
            title: 'My-Website — Étude de cas portfolio | Julien Esterbet',
            description:
                'Étude de cas de la refonte progressive du portfolio React et Vite de Julien Esterbet : architecture, accessibilité, médias et qualité.',
        },
        resume: {
            title: 'CV de Julien Esterbet — Développeur full-stack, FinTech et Web3',
            description:
                'Parcours, expériences, compétences et projets de Julien Esterbet, développeur full-stack orienté produit basé à Paris.',
        },
        web3: {
            title: 'Labs Web3 — Julien Esterbet',
            description:
                'Expérimentations techniques personnelles autour de Solidity, des wallets, de l’EVM et des données on-chain, présentées sans promesse financière.',
        },
        travel: {
            title: 'Carnets de voyage — Julien Esterbet',
            description:
                'Un espace personnel consacré aux lieux de vie, voyages, photographies et souvenirs de Julien Esterbet.',
        },
        reflections: {
            title: 'Écrits et réflexions — Julien Esterbet',
            description:
                'Textes personnels de Julien Esterbet autour de la philosophie, de la société, du doute et de la construction de soi.',
        },
        notFound: {
            title: 'Page introuvable — Julien Esterbet',
            description: 'Cette page n’existe pas ou a été déplacée.',
        },
    },
    en: {
        home: {
            title: 'Julien Esterbet — Product-minded full-stack developer',
            description:
                'Julien Esterbet’s portfolio: product-minded full-stack development across business applications, FinTech, React, Angular, Java and Web3 experiments.',
        },
        brunoPizza: {
            title: 'Bruno Pizza — Product case study | Julien Esterbet',
            description:
                'Case study of Bruno Pizza Production, a local desktop application turning an Excel plan into a guided production workflow.',
        },
        myWebsite: {
            title: 'My-Website — Portfolio case study | Julien Esterbet',
            description:
                'Case study of Julien Esterbet’s incremental React and Vite portfolio refactor: architecture, accessibility, media and quality.',
        },
        resume: {
            title: 'Julien Esterbet’s résumé — Full-stack, FinTech and Web3',
            description:
                'Experience, skills and selected projects of Julien Esterbet, a product-minded full-stack developer based in Paris.',
        },
        web3: {
            title: 'Web3 labs — Julien Esterbet',
            description:
                'Personal technical experiments around Solidity, wallets, the EVM and on-chain data, presented without financial claims.',
        },
        travel: {
            title: 'Travel journals — Julien Esterbet',
            description:
                'A personal space for Julien Esterbet’s places, travels, photographs and memories.',
        },
        reflections: {
            title: 'Writing and reflections — Julien Esterbet',
            description:
                'Personal writing by Julien Esterbet about philosophy, society, doubt and self-construction.',
        },
        notFound: {
            title: 'Page not found — Julien Esterbet',
            description: 'This page does not exist or has been moved.',
        },
    },
}

const staticRoutes = {
    '/': 'home',
    '/projects/bruno-pizza': 'brunoPizza',
    '/projects/my-website': 'myWebsite',
    '/resume': 'resume',
    '/web3': 'web3',
    '/travel': 'travel',
    '/reflections': 'reflections',
}

const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#julien-esterbet`,
    name: 'Julien Esterbet',
    url: SITE_URL,
    jobTitle: 'Full-stack developer',
    homeLocation: { '@type': 'Place', name: 'Paris, France' },
    sameAs: [
        'https://github.com/JulienEsbt',
        'https://www.linkedin.com/in/julien-esterbet/',
    ],
}

const structuredDataFor = (key, path, language, metadata) => {
    if (key === 'home') {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': `${SITE_URL}/#website`,
                    url: SITE_URL,
                    name: 'Julien Esterbet — Portfolio',
                    inLanguage: language,
                    author: {'@id': person['@id']},
                },
                {
                    '@type': 'ProfilePage',
                    '@id': `${SITE_URL}/#profile`,
                    url: SITE_URL,
                    name: metadata.title,
                    description: metadata.description,
                    inLanguage: language,
                    mainEntity: person,
                },
            ],
        }
    }

    if (key === 'brunoPizza' || key === 'myWebsite') {
        return {
            '@context': 'https://schema.org',
            '@type': key === 'brunoPizza' ? 'SoftwareApplication' : 'WebSite',
            name: key === 'brunoPizza' ? 'Bruno Pizza — Production' : 'My-Website',
            url: `${SITE_URL}${path}`,
            description: metadata.description,
            inLanguage: language,
            author: {'@id': person['@id']},
            ...(key === 'brunoPizza' ? {applicationCategory: 'BusinessApplication'} : {}),
        }
    }

    if (key === 'reflection') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metadata.title.replace(/ — Julien Esterbet$/, ''),
            description: metadata.description,
            url: `${SITE_URL}${path}`,
            inLanguage: language,
            author: person,
            datePublished: metadata.date,
        }
    }

    return null
}

export const getSeoMetadata = (pathname, requestedLanguage = 'fr') => {
    const language = requestedLanguage?.startsWith('en') ? 'en' : 'fr'
    const reflectionMatch = pathname.match(/^\/reflections\/([^/]+)\/?$/)
    const reflection = reflectionMatch
        ? reflections.find(({slug}) => slug === reflectionMatch[1])
        : null
    const normalizedPath = pathname !== '/' ? pathname.replace(/\/$/, '') : '/'
    const key = reflection ? 'reflection' : staticRoutes[normalizedPath]
    const isNotFound = !key

    const metadata = reflection
        ? {
              title: `${reflection.title[language] ?? reflection.title.fr} — Julien Esterbet`,
              description: reflection.excerpt[language] ?? reflection.excerpt.fr,
              date: reflection.date,
          }
        : content[language][key ?? 'notFound']

    const path = isNotFound ? normalizedPath : reflection ? `/reflections/${reflection.slug}` : normalizedPath

    return {
        ...metadata,
        path,
        canonicalUrl: `${SITE_URL}${path}`,
        imageUrl: `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`,
        imageAlt:
            language === 'fr'
                ? 'Julien Esterbet — développeur full-stack orienté produit'
                : 'Julien Esterbet — product-minded full-stack developer',
        language,
        type: reflection ? 'article' : 'website',
        robots: isNotFound ? 'noindex, nofollow' : 'index, follow',
        isNotFound,
        structuredData: isNotFound
            ? null
            : structuredDataFor(key, path, language, metadata),
    }
}

export const INDEXABLE_PATHS = [
    ...Object.keys(staticRoutes),
    ...reflections.map(({slug}) => `/reflections/${slug}`),
]
