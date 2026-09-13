import {ROUTE_CATALOG} from './routeCatalog.js'
import {languageFromPath, localizedPath, unlocalizedPath} from './localizedPaths.js'
import reflections from '../data/reflections/reflections.js'
import trips from '../data/travel/trips.js'

export const SITE_URL = 'https://www.julienesterbet.com'
export const DEFAULT_SOCIAL_IMAGE = '/og/julien-esterbet-portfolio.png'

const content = {
    fr: {
        home: {
            title: 'Portfolio — Julien Esterbet',
            description:
                'Julien Esterbet, analyste programmeur : applications métiers, projets logiciels, réflexions personnelles et récits de voyage.',
        },
        brunoPizza: {
            title: 'Bruno Pizza — Étude de cas produit | Julien Esterbet',
            description:
                'Étude de cas de Bruno Pizza Production, une application desktop locale qui transforme un plan Excel en parcours de production guidé.',
        },
        myWebsite: {
            title: 'My-Website — Étude de cas portfolio | Julien Esterbet',
            description:
                'Présentation du portfolio React et Vite de Julien Esterbet : architecture, accessibilité, contenus, médias, qualité et expériences interactives.',
        },
        resume: {
            title: 'CV de Julien Esterbet — Développeur full-stack orienté produit',
            description:
                'Parcours, expériences, compétences et projets de Julien Esterbet, développeur full-stack orienté produit basé à Paris.',
        },
        privacy: {
            title: 'Confidentialité — Julien Esterbet',
            description:
                'Informations sur les mesures de fréquentation, de performance et le formulaire de contact du portfolio de Julien Esterbet.',
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
            title: 'Portfolio — Julien Esterbet',
            description:
                'Julien Esterbet, software developer and IT analyst: business applications, software projects, personal reflections and travel stories.',
        },
        brunoPizza: {
            title: 'Bruno Pizza — Product case study | Julien Esterbet',
            description:
                'Case study of Bruno Pizza Production, a local desktop application turning an Excel plan into a guided production workflow.',
        },
        myWebsite: {
            title: 'My-Website — Portfolio case study | Julien Esterbet',
            description:
                'Presentation of Julien Esterbet’s React and Vite portfolio: architecture, accessibility, content, media, quality and interactive experiences.',
        },
        resume: {
            title: 'Julien Esterbet’s résumé — Product-minded full-stack developer',
            description:
                'Experience, skills and selected projects of Julien Esterbet, a product-minded full-stack developer based in Paris.',
        },
        privacy: {
            title: 'Privacy — Julien Esterbet',
            description:
                'Information about audience measurement, performance monitoring and the contact form on Julien Esterbet’s portfolio.',
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

const staticRoutes = Object.fromEntries(
    Object.values(ROUTE_CATALOG)
        .filter(({path}) => !path.includes(':'))
        .map(({path, seoKey}) => [path, seoKey])
)

const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#julien-esterbet`,
    name: 'Julien Esterbet',
    url: SITE_URL,
    jobTitle: 'Full-stack developer',
    homeLocation: {'@type': 'Place', name: 'Paris, France'},
    sameAs: ['https://github.com/JulienEsbt', 'https://www.linkedin.com/in/julien-esterbet/'],
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
                    '@id': `${SITE_URL}${path}#profile`,
                    url: `${SITE_URL}${path}`,
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
            author: person,
            ...(key === 'brunoPizza' ? {applicationCategory: 'BusinessApplication'} : {}),
        }
    }

    if (key === 'reflection' || key === 'travelStory') {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metadata.title.replace(/ — Julien Esterbet$/, ''),
            description: metadata.description,
            url: `${SITE_URL}${path}`,
            inLanguage: language,
            author: person,
            ...(metadata.date ? {datePublished: metadata.date} : {}),
            ...(metadata.place ? {about: {'@type': 'Place', name: metadata.place}} : {}),
        }
    }

    return null
}

export const getSeoMetadata = (pathname, requestedLanguage = languageFromPath(pathname)) => {
    const language = requestedLanguage?.startsWith('en') ? 'en' : 'fr'
    pathname = unlocalizedPath(pathname)
    const reflectionMatch = pathname.match(/^\/reflections\/([^/]+)\/?$/)
    const reflection = reflectionMatch
        ? reflections.find(({slug}) => slug === reflectionMatch[1])
        : null
    const travelMatch = pathname.match(/^\/travel\/([^/]+)\/?$/)
    const trip = travelMatch ? trips.find(({id}) => id === travelMatch[1]) : null
    const normalizedPath = pathname !== '/' ? pathname.replace(/\/$/, '') : '/'
    const key = reflection ? 'reflection' : trip ? 'travelStory' : staticRoutes[normalizedPath]
    const isNotFound = !key

    const metadata = reflection
        ? {
              title: `${reflection.title[language] ?? reflection.title.fr} — Julien Esterbet`,
              description: reflection.excerpt[language] ?? reflection.excerpt.fr,
              date: reflection.date,
          }
        : trip
          ? {
                title: `${language === 'fr' ? trip.city : (trip.cityEn ?? trip.city)}, ${
                    language === 'fr' ? trip.country : (trip.countryEn ?? trip.country)
                } — ${
                    language === 'fr' ? trip.dateLabel : (trip.dateLabelEn ?? trip.dateLabel)
                } | Julien Esterbet`,
                description:
                    language === 'fr' ? trip.description : (trip.descriptionEn ?? trip.description),
                place: `${language === 'fr' ? trip.city : (trip.cityEn ?? trip.city)}, ${
                    language === 'fr' ? trip.country : (trip.countryEn ?? trip.country)
                }`,
            }
          : content[language][key ?? 'notFound']

    const basePath = isNotFound
        ? normalizedPath
        : reflection
          ? `/reflections/${reflection.slug}`
          : trip
            ? `/travel/${trip.id}`
            : normalizedPath

    const path = localizedPath(basePath, language)
    const alternates = isNotFound
        ? []
        : ['fr', 'en', 'x-default'].map((locale) => ({
              language: locale,
              url: `${SITE_URL}${localizedPath(basePath, locale)}`,
          }))
    return {
        ...metadata,
        alternates,
        path,
        canonicalUrl: `${SITE_URL}${path}`,
        imageUrl: `${SITE_URL}${trip ? `/og/travel/${language}/${trip.id}.png` : DEFAULT_SOCIAL_IMAGE}`,
        imageAlt: trip
            ? language === 'fr'
                ? `Carnet de voyage à ${trip.city}, ${trip.country}`
                : `Travel journal in ${trip.cityEn ?? trip.city}, ${trip.countryEn ?? trip.country}`
            : language === 'fr'
              ? 'Julien Esterbet — développeur full-stack orienté produit'
              : 'Julien Esterbet — product-minded full-stack developer',
        language,
        type: reflection || trip ? 'article' : 'website',
        robots: isNotFound ? 'noindex, nofollow' : 'index, follow',
        isNotFound,
        structuredData: isNotFound ? null : structuredDataFor(key, path, language, metadata),
    }
}

export const BASE_INDEXABLE_PATHS = [
    ...Object.keys(staticRoutes),
    ...reflections.map(({slug}) => `/reflections/${slug}`),
    ...trips.map(({id}) => `/travel/${id}`),
]

export const INDEXABLE_PATHS = BASE_INDEXABLE_PATHS.flatMap((path) => [
    path,
    localizedPath(path, 'en'),
])
