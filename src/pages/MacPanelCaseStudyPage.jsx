import {useTranslation} from 'react-i18next'
import {FiArrowDown, FiArrowUpRight} from 'react-icons/fi'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import CaseStudyActions from '../features/projects/caseStudy/CaseStudyActions.jsx'
import CaseStudyPager from '../features/projects/caseStudy/CaseStudyPager.jsx'
import {LINKS} from '../config/links.js'
import './CaseStudyPage.css'

import './OpenDenteCaseStudyPage.css'
import './MacPanelCaseStudyPage.css'
import ResponsiveImage from '../components/common/media/ResponsiveImage.jsx'
import ProjectGallery from '../features/projects/caseStudy/ProjectGallery.jsx'
import {
    system_dark,
    activity_dark,
    displays_light,
    disks_light,
    customization_dark,
    awake_light,
} from '../config/macpanelGalleryMedia.js'

const screens = [
    {id: 'system', media: system_dark},
    {id: 'activity', media: activity_dark},
    {id: 'displays', media: displays_light},
    {id: 'disks', media: disks_light},
    {id: 'custom', media: customization_dark},
    {id: 'awake', media: awake_light},
]

export default function MacPanelCaseStudyPage() {
    const {t} = useTranslation('projects')
    return (
        <PageFrame>
            <div className="case-study-page macpanel-page">
                <PageHero
                    kicker={t('macpanel.kicker')}
                    title="MacPanel"
                    subtitle={t('macpanel.subtitle')}
                    visual={
                        <div className="macpanel-hero__screens">
                            <ResponsiveImage
                                media={displays_light}
                                alt={t('macpanel.gallery.items.displays.alt')}
                                className="macpanel-hero__displays"
                                sizes="(min-width: 1200px) 230px, 29vw"
                                loading="eager"
                            />
                            <ResponsiveImage
                                media={disks_light}
                                alt={t('macpanel.gallery.items.disks.alt')}
                                className="macpanel-hero__disks"
                                sizes="(min-width: 1200px) 220px, 28vw"
                                loading="eager"
                            />
                            <ResponsiveImage
                                media={system_dark}
                                alt={t('macpanel.heroAlt')}
                                className="macpanel-hero__system"
                                sizes="(min-width: 1200px) 288px, 42vw"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    }
                >
                    <CaseStudyActions
                        projectId="5"
                        repository={LINKS.projects.macPanel}
                        codeLabel={t('macpanel.source')}
                    >
                        <a
                            className="btn case-study__button macpanel-hero__explore"
                            href="#explore"
                        >
                            <FiArrowDown aria-hidden="true" />
                            {t('macpanel.explore')}
                        </a>
                    </CaseStudyActions>
                </PageHero>
                <article className="case-study">
                    <ProjectGallery screens={screens} project="macpanel" />
                    <div className="container macpanel-details">
                        {t('macpanel.sections', {returnObjects: true}).map(({title, body}) => (
                            <section className="case-study__card" key={title}>
                                <h2>{title}</h2>
                                <p>{body}</p>
                            </section>
                        ))}
                    </div>
                    <aside className="container case-study__next">
                        <div>
                            <h2>{t('macpanel.next.title')}</h2>
                            <p>{t('macpanel.next.body')}</p>
                        </div>
                        <a
                            className="btn btn-primary case-study__button"
                            href={LINKS.projects.macPanel}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('actions.code')}
                            <FiArrowUpRight aria-hidden="true" />
                        </a>
                    </aside>
                    <div className="container case-study__pager-footer">
                        <CaseStudyPager current="5" />
                    </div>
                </article>
            </div>
        </PageFrame>
    )
}
