import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import CaseStudyActions from '../features/projects/caseStudy/CaseStudyActions.jsx'
import {LINKS} from '../config/links.js'
import './CaseStudyPage.css'

import './OpenDenteCaseStudyPage.css'
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
            <PageHero
                kicker={t('macpanel.kicker')}
                title="MacPanel"
                subtitle={t('macpanel.subtitle')}
                visual={
                    <ResponsiveImage
                        media={system_dark}
                        alt={t('macpanel.heroAlt')}
                        sizes="(max-width: 700px) 88vw, 350px"
                        style={{width: 'min(100%, 350px)', height: 'auto', marginInline: 'auto'}}
                    />
                }
            >
                <CaseStudyActions
                    projectId="5"
                    repository={LINKS.projects.macPanel}
                    codeLabel={t('macpanel.source')}
                />
            </PageHero>
            <ProjectGallery screens={screens} project="macpanel" />
            {t('macpanel.sections', {returnObjects: true}).map(({title, body}) => (
                <section className="container case-study__section" key={title}>
                    <h2>{title}</h2>
                    <p className="case-study__lead">{body}</p>
                </section>
            ))}
        </PageFrame>
    )
}
