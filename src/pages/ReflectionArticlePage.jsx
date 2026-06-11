import React from 'react'
import {Link, Navigate, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {motion} from 'framer-motion'
import PageNav from '../components/common/navigation/pageNav/PageNav'
import reflections from '../data/reflections/reflections.js'
import './ReflectionArticlePage.css'

const mdxModules = import.meta.glob('../content/reflections/*.mdx', {
    eager: true,
})

const getMdxArticle = (slug, language) => {
    const key = `../content/reflections/${slug}.${language}.mdx`
    return mdxModules[key]?.default
}

const ReflectionArticlePage = () => {
    const {slug} = useParams()
    const {t, i18n} = useTranslation('reflections')

    const language = i18n.language?.startsWith('fr') ? 'fr' : 'en'
    const reflection = reflections.find((item) => item.slug === slug)

    if (!reflection) {
        return <Navigate to="/reflections" replace/>
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
                    <Link to="/reflections" className="reflexion-article__back">
                        ← {t('article.back')}
                    </Link>

                    <div className="reflexion-article__shell">
                        <div className="reflexion-article__meta">
                            <span>{t(`categories.${reflection.category}`)}</span>
                            <span>{reflection.readingTime} min</span>
                            <span>{reflection.date}</span>
                        </div>

                        <h1>{reflection.title[language]}</h1>

                        <p className="reflexion-article__excerpt">
                            {reflection.excerpt[language]}
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
                                (reflection.content?.[language] ?? []).map((paragraph, index) => (
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

export default ReflectionArticlePage