import React, {useEffect, useMemo, useState} from 'react'
import {Link, Navigate, useParams} from 'react-router-dom'
import {FiArrowLeft, FiArrowUp, FiArrowDown} from 'react-icons/fi'
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

    const orderedReflections = useMemo(
        () => [...reflections].sort((a, b) => new Date(a.date) - new Date(b.date)),
        []
    )

    const currentIndex = orderedReflections.findIndex((item) => item.slug === slug)
    const previousReflection = currentIndex > 0 ? orderedReflections[currentIndex - 1] : null
    const nextReflection = currentIndex < orderedReflections.length - 1
        ? orderedReflections[currentIndex + 1]
        : null

    const [scrollProgress, setScrollProgress] = useState(0)
    const [showTop, setShowTop] = useState(false)
    const [showBottom, setShowBottom] = useState(true)

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight

            const progress =
                documentHeight > 0
                    ? (scrollTop / documentHeight) * 100
                    : 0

            const clampedProgress = Math.min(100, Math.max(0, progress))

            setScrollProgress(clampedProgress)

            setShowTop(clampedProgress > 8)
            setShowBottom(clampedProgress < 92)
        }

        updateProgress()
        window.addEventListener('scroll', updateProgress, {passive: true})
        window.addEventListener('resize', updateProgress)

        return () => {
            window.removeEventListener('scroll', updateProgress)
            window.removeEventListener('resize', updateProgress)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        })
    }

    return (
        <>
            <div id="top"/>
            <main id="main" tabIndex="-1">
                <PageNav/>

                <div className="reflexion-article__progress">
                    <span style={{width: `${scrollProgress}%`}}/>
                </div>

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
                        <div className="reflexion-article__next">
                            <span>{t('article.finished')}</span>

                            <div className="reflexion-article__next-grid">
                                {previousReflection && (
                                    <Link to={`/reflections/${previousReflection.slug}`}
                                          className="reflexion-article__next-card">
                                        <small>← {t('article.previous')}</small>
                                        <strong>{previousReflection.title[language]}</strong>
                                    </Link>
                                )}

                                {nextReflection && (
                                    <Link to={`/reflections/${nextReflection.slug}`}
                                          className="reflexion-article__next-card next">
                                        <small>{t('article.next')} →</small>
                                        <strong>{nextReflection.title[language]}</strong>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.article>

                <div className="reflexion-article__floating-actions">
                    {showBottom && (
                        <button
                            type="button"
                            onClick={scrollToBottom}
                            aria-label="Aller en bas"
                        >
                            <FiArrowDown/>
                        </button>
                    )}

                    <Link to="/reflections" aria-label={t('article.back')}>
                        <FiArrowLeft/>
                        <span>{t('article.back')}</span>
                    </Link>

                    {showTop && (
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Remonter en haut"
                        >
                            <FiArrowUp/>
                        </button>
                    )}
                </div>
            </main>
        </>
    )
}

export default ReflectionArticlePage