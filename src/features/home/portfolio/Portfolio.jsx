import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {FiArrowUpRight, FiMessageCircle} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import MobileAccordion from '../../../components/common/mobile/MobileAccordion.jsx'
import ResponsiveImage from '../../../components/common/media/ResponsiveImage.jsx'
import useMediaQuery from '../../../components/common/accessibility/useMediaQuery.js'
import useReducedMotion from '../../../components/common/accessibility/useReducedMotion.js'
import {PORTFOLIO_PROJECTS} from '../../../config/portfolioProjects.js'
import AgoraProjectCard from './AgoraProjectCard.jsx'
import PortfolioProject from './PortfolioProject.jsx'
import './Portfolio.css'
import '../professionalChapters.css'

gsap.registerPlugin(ScrollTrigger)
const PROJECTS = [...PORTFOLIO_PROJECTS, {id: 'agora'}]
const STORAGE_KEY = 'portfolio.selectedProject'

function ProjectPreview({project, t}) {
    const key = project.id === 'agora' ? 'portfolio.agora' : `portfolio.items.${project.id}`
    return (
        <span className="portfolio__preview mobile-project-preview">
            {project.image ? (
                <ResponsiveImage media={project.image} alt="" sizes="72px" loading="lazy" />
            ) : (
                <span className="portfolio__preview-mark" aria-hidden="true">
                    <FiMessageCircle />
                </span>
            )}
            <span>
                <strong>{t(`${key}.title`)}</strong>
                <small>{t(`${key}.type`)}</small>
            </span>
        </span>
    )
}

export default function Portfolio() {
    const {t} = useTranslation('home')
    const {hash} = useLocation()
    const sectionRef = useRef(null)
    const selectors = useRef([])
    const reducedMotion = useReducedMotion()
    const mobile = useMediaQuery('(max-width: 700px)')
    const [selected, setSelected] = useState(PROJECTS[0].id)
    const [enhanced, setEnhanced] = useState(false)

    useEffect(() => {
        let saved
        try {
            saved = sessionStorage.getItem(STORAGE_KEY)
        } catch {
            /* Selection remains usable without storage. */
        }
        setSelected(
            hash === '#agora-project-title'
                ? 'agora'
                : PROJECTS.some(({id}) => id === saved)
                  ? saved
                  : PROJECTS[0].id
        )
        setEnhanced(true)
    }, [hash])

    useLayoutEffect(() => {
        if (reducedMotion) return undefined
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {trigger: sectionRef.current, start: 'top 80%'},
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [reducedMotion])

    const select = (id) => {
        setSelected(id)
        try {
            sessionStorage.setItem(STORAGE_KEY, id)
        } catch {
            /* Storage is optional. */
        }
    }

    const navigate = (event, index) => {
        const next = {
            ArrowDown: (index + 1) % PROJECTS.length,
            ArrowUp: (index - 1 + PROJECTS.length) % PROJECTS.length,
            Home: 0,
            End: PROJECTS.length - 1,
        }[event.key]
        if (next === undefined) return
        event.preventDefault()
        select(PROJECTS[next].id)
        selectors.current[next]?.focus()
    }

    const cards = PROJECTS.map((project) =>
        project.id === 'agora' ? (
            <AgoraProjectCard key="agora" />
        ) : (
            <PortfolioProject
                key={project.id}
                project={project}
                onOpen={() => select(project.id)}
            />
        )
    )

    return (
        <section
            id="portfolio"
            className="professional-chapter professional-chapter--portfolio"
            ref={sectionRef}
        >
            <div className="professional-chapter__heading">
                <span className="professional-chapter__number" aria-hidden="true">
                    01
                </span>
                <p className="section-kicker">{t('portfolio.kicker')}</p>
                <h2>{t('portfolio.title')}</h2>
                <p className="portfolio__intro">{t('portfolio.intro')}</p>
            </div>
            <div className="container portfolio__container">
                {mobile ? (
                    <MobileAccordion
                        labels={PROJECTS.map((project) => (
                            <ProjectPreview key={project.id} project={project} t={t} />
                        ))}
                    >
                        {cards}
                    </MobileAccordion>
                ) : (
                    <>
                        <div className="portfolio__index">
                            <p className="portfolio__index-label" id="portfolio-index-label">
                                {t('portfolio.browseLabel')}
                            </p>
                            <div
                                role={enhanced ? 'tablist' : undefined}
                                aria-labelledby="portfolio-index-label"
                                aria-orientation={enhanced ? 'vertical' : undefined}
                            >
                                {PROJECTS.map((project, index) => (
                                    <button
                                        type="button"
                                        className="portfolio__selector"
                                        key={project.id}
                                        id={`portfolio-tab-${project.id}`}
                                        ref={(el) => (selectors.current[index] = el)}
                                        role={enhanced ? 'tab' : undefined}
                                        aria-selected={
                                            enhanced ? selected === project.id : undefined
                                        }
                                        aria-controls={
                                            enhanced ? `portfolio-panel-${project.id}` : undefined
                                        }
                                        tabIndex={!enhanced || selected === project.id ? 0 : -1}
                                        onClick={() => select(project.id)}
                                        onKeyDown={(event) => navigate(event, index)}
                                    >
                                        <span
                                            className="portfolio__index-number"
                                            aria-hidden="true"
                                        >
                                            0{index + 1}
                                        </span>
                                        <ProjectPreview project={project} t={t} />
                                        <FiArrowUpRight aria-hidden="true" />
                                    </button>
                                ))}
                            </div>
                            <p className="portfolio__index-hint">{t('portfolio.browseHint')}</p>
                        </div>
                        <div className="portfolio__panels">
                            {PROJECTS.map((project, index) => (
                                <div
                                    key={project.id}
                                    id={`portfolio-panel-${project.id}`}
                                    className="portfolio__panel"
                                    role={enhanced ? 'tabpanel' : undefined}
                                    aria-labelledby={
                                        enhanced ? `portfolio-tab-${project.id}` : undefined
                                    }
                                    tabIndex={enhanced ? 0 : undefined}
                                    hidden={enhanced && selected !== project.id}
                                >
                                    {cards[index]}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
