import {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {FiArrowUpRight, FiChevronDown, FiX} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import useBodyScrollLock from '../../../components/common/accessibility/useBodyScrollLock.js'

function IntentContent({t, heading = 'h4'}) {
    const Heading = heading
    return (
        <div className="portfolio__intent-content">
            <div className="portfolio__intent-grid">
                {['why', 'objective', 'design'].map((item) => (
                    <section key={item}>
                        <Heading>{t(`portfolio.agora.${item}Title`)}</Heading>
                        <p>{t(`portfolio.agora.${item}`)}</p>
                    </section>
                ))}
            </div>
            <section className="portfolio__intent-status">
                <Heading>{t('portfolio.agora.statusTitle')}</Heading>
                <p>{t('portfolio.agora.status')}</p>
            </section>
            <section className="portfolio__intent-open-questions">
                <Heading>{t('portfolio.agora.questionsTitle')}</Heading>
                <p>{t('portfolio.agora.questions')}</p>
            </section>
        </div>
    )
}

function IntentDialog({t, onClose}) {
    const dialog = useRef(null)
    useBodyScrollLock(true)
    useEffect(() => {
        const element = dialog.current
        if (!element.open) element.showModal()
    }, [])

    return createPortal(
        <dialog
            ref={dialog}
            className="portfolio__intent-dialog"
            aria-labelledby="agora-intent-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return
                const bounds = event.currentTarget.getBoundingClientRect()
                if (
                    event.clientX < bounds.left ||
                    event.clientX > bounds.right ||
                    event.clientY < bounds.top ||
                    event.clientY > bounds.bottom
                )
                    event.currentTarget.close()
            }}
        >
            <header className="portfolio__intent-header">
                <div>
                    <span className="portfolio__type">{t('portfolio.agora.type')}</span>
                    <h2 id="agora-intent-title">{t('portfolio.agora.title')}</h2>
                </div>
                <button
                    type="button"
                    className="portfolio__intent-close"
                    onClick={() => dialog.current.close()}
                >
                    <FiX aria-hidden="true" />
                    {t('portfolio.agora.close')}
                </button>
            </header>
            <p className="portfolio__intent-lead">{t('portfolio.agora.description')}</p>
            <IntentContent t={t} heading="h3" />
        </dialog>,
        document.body
    )
}

export default function AgoraProjectCard({enhanced = false}) {
    const {t} = useTranslation('home')
    const [reading, setReading] = useState(false)
    const trigger = useRef(null)
    const principles = t('portfolio.agora.principles', {returnObjects: true})
    return (
        <article
            className="portfolio__item portfolio__intent"
            aria-labelledby="agora-project-title"
        >
            <div className="portfolio__image portfolio__agora-visual" aria-hidden="true">
                <svg viewBox="0 0 800 360" focusable="false">
                    <path
                        className="portfolio__agora-lines"
                        d="M300 153 C260 153 270 94 220 94 M500 153 C540 153 530 94 580 94 M300 197 C260 197 270 270 220 270 M500 197 C540 197 530 270 580 270"
                    />
                    <rect
                        className="portfolio__agora-core"
                        x="290"
                        y="118"
                        width="220"
                        height="112"
                        rx="24"
                    />
                    <path
                        className="portfolio__agora-bubble"
                        d="M383 144 Q383 138 389 138 H411 Q417 138 417 144 V160 Q417 166 411 166 H396 L385 174 V164 Q383 163 383 160 Z"
                    />
                    <text className="portfolio__agora-question" x="400" y="204" textAnchor="middle">
                        {t('portfolio.agora.graph.question')}
                    </text>
                    {[
                        ['arguments', 60, 70],
                        ['objections', 580, 70],
                        ['facts', 60, 246],
                        ['sources', 580, 246],
                    ].map(([label, x, y]) => (
                        <g key={label}>
                            <rect
                                className="portfolio__agora-branch"
                                x={x}
                                y={y}
                                width="160"
                                height="48"
                                rx="14"
                            />
                            <circle
                                className="portfolio__agora-node"
                                cx={x + 20}
                                cy={y + 24}
                                r="4"
                            />
                            <text x={x + 91} y={y + 30} textAnchor="middle">
                                {t(`portfolio.agora.graph.${label}`)}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
            <div className="portfolio__body">
                <span className="portfolio__type">{t('portfolio.agora.type')}</span>
                <h3 id="agora-project-title">{t('portfolio.agora.title')}</h3>
                <p>{t('portfolio.agora.description')}</p>
                <ul className="portfolio__tags" aria-label={t('portfolio.agora.principlesLabel')}>
                    {principles.map((principle) => (
                        <li key={principle}>
                            <span>{principle}</span>
                        </li>
                    ))}
                </ul>
                <div className="portfolio__actions">
                    {enhanced ? (
                        <button
                            ref={trigger}
                            className="portfolio__intent-trigger"
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => setReading(true)}
                        >
                            <FiArrowUpRight aria-hidden="true" />
                            {t('portfolio.agora.toggle')}
                        </button>
                    ) : (
                        <details className="portfolio__intent-details">
                            <summary>
                                <FiChevronDown aria-hidden="true" />
                                {t('portfolio.agora.toggle')}
                            </summary>
                            <IntentContent t={t} />
                        </details>
                    )}
                </div>
            </div>
            {reading && (
                <IntentDialog
                    t={t}
                    onClose={() => {
                        setReading(false)
                        trigger.current?.focus({preventScroll: true})
                    }}
                />
            )}
        </article>
    )
}
