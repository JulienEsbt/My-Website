import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'
import {getSeoMetadata} from '../../../config/seo.js'

const setMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector)
    if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
    }
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

const setLink = (selector, attributes) => {
    let element = document.head.querySelector(selector)
    if (!element) {
        element = document.createElement('link')
        document.head.appendChild(element)
    }
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

const SeoManager = () => {
    const {pathname} = useLocation()
    const {i18n} = useTranslation()

    useEffect(() => {
        const seo = getSeoMetadata(pathname, i18n.resolvedLanguage ?? i18n.language)
        document.title = seo.title

        setMeta('meta[name="description"]', {name: 'description', content: seo.description})
        setMeta('meta[name="robots"]', {name: 'robots', content: seo.robots})
        setMeta('meta[property="og:type"]', {property: 'og:type', content: seo.type})
        setMeta('meta[property="og:site_name"]', {
            property: 'og:site_name',
            content: 'Julien Esterbet — Portfolio',
        })
        setMeta('meta[property="og:locale"]', {
            property: 'og:locale',
            content: seo.language === 'fr' ? 'fr_FR' : 'en_GB',
        })
        setMeta('meta[property="og:title"]', {property: 'og:title', content: seo.title})
        setMeta('meta[property="og:description"]', {
            property: 'og:description',
            content: seo.description,
        })
        setMeta('meta[property="og:url"]', {property: 'og:url', content: seo.canonicalUrl})
        setMeta('meta[property="og:image"]', {property: 'og:image', content: seo.imageUrl})
        setMeta('meta[property="og:image:width"]', {property: 'og:image:width', content: '1200'})
        setMeta('meta[property="og:image:height"]', {property: 'og:image:height', content: '630'})
        setMeta('meta[property="og:image:alt"]', {
            property: 'og:image:alt',
            content: seo.imageAlt,
        })
        setMeta('meta[name="twitter:card"]', {name: 'twitter:card', content: 'summary_large_image'})
        setMeta('meta[name="twitter:title"]', {name: 'twitter:title', content: seo.title})
        setMeta('meta[name="twitter:description"]', {
            name: 'twitter:description',
            content: seo.description,
        })
        setMeta('meta[name="twitter:image"]', {name: 'twitter:image', content: seo.imageUrl})
        setMeta('meta[name="twitter:image:alt"]', {
            name: 'twitter:image:alt',
            content: seo.imageAlt,
        })
        setLink('link[rel="canonical"]', {rel: 'canonical', href: seo.canonicalUrl})

        const previousJsonLd = document.head.querySelector('script[data-seo-json-ld]')
        previousJsonLd?.remove()
        if (seo.structuredData) {
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.dataset.seoJsonLd = 'true'
            script.textContent = JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')
            document.head.appendChild(script)
        }
    }, [i18n.language, i18n.resolvedLanguage, pathname])

    return null
}

export default SeoManager
