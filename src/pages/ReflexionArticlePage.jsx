import React from 'react'
import {Link, Navigate, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import PageNav from '../components/common/pagenav/PageNav'
import reflexions from '../data/reflexions/reflexions'
import './ReflexionArticlePage.css'

const mdxModules = import.meta.glob('../content/reflexions/*.mdx', {
    eager: true,
})

const getMdxArticle = (slug, language) => {
    const key = `../content/reflexions/${slug}.${language}.mdx`
    return mdxModules[key]?.default
}

const ReflexionArticlePage = () => {
    const {slug} = useParams()
    const {t, i18n} = useTranslation('reflexions')

    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'
    const reflexion = reflexions.find((item) => item.slug === slug)

    if (!reflexion) {
        return <Navigate to="/reflexions" replace/>
    }

    const MdxContent = getMdxArticle(slug, language) || getMdxArticle(slug, 'fr')
    const isFallbackFrench = language !== 'fr' && !getMdxArticle(slug, language)

    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>

                <motion.article
                    className="container reflexion-article"
                    initial={{opacity: 0, y: 35}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.65, ease: 'easeOut'}}
                >
                    <Link to="/reflexions" className="reflexion-article__back">
                        ← {t('article.back')}
                    </Link>

                    <div className="reflexion-article__shell">
                        <div className="reflexion-article__meta">
                            <span>{t(`categories.${reflexion.category}`)}</span>
                            <span>{reflexion.readingTime} min</span>
                            <span>{reflexion.date}</span>
                        </div>

                        <h1>{reflexion.title[language]}</h1>

                        <p className="reflexion-article__excerpt">
                            {reflexion.excerpt[language]}
                        </p>

                        {isFallbackFrench && (
                            <p className="reflexion-article__notice">
                                {t('article.frenchOnly')}
                            </p>
                        )}

                        <div className="reflexion-article__content">
                            {MdxContent ? (
                                <MdxContent/>
                            ) : (
                                (reflexion.content?.[language] ?? []).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))
                            )}
                        </div>
                    </div>
                </motion.article>
            </main>
        </>
    )
}

export default ReflexionArticlePage