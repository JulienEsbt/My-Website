import React from 'react'
import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import './PrivacyPage.css'

const SECTIONS = ['analytics', 'contact', 'external', 'control']

export default function PrivacyPage() {
    const {t} = useTranslation('common')
    useDocumentTitle(t('privacy.metaTitle'))

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('privacy.kicker')}
                title={t('privacy.title')}
                subtitle={t('privacy.intro')}
            />

            <article className="container privacy-page" aria-labelledby="privacy-details-title">
                <h2 id="privacy-details-title" className="sr-only">
                    {t('privacy.title')}
                </h2>
                <div className="privacy-page__grid">
                    {SECTIONS.map((section) => (
                        <section key={section}>
                            <h3>{t(`privacy.${section}Title`)}</h3>
                            <p>{t(`privacy.${section}Body`)}</p>
                        </section>
                    ))}
                </div>
                <p className="privacy-page__contact">{t('privacy.contact')}</p>
                <p className="privacy-page__updated">{t('privacy.updated')}</p>
            </article>
        </PageFrame>
    )
}
