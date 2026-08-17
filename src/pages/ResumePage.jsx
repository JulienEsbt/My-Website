import React from 'react'
import {FiArrowLeft, FiDownload} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import PageHero from '../components/common/layout/pageHero/PageHero.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import {HOME_ASSETS} from '../config/homeAssets.js'
import './ResumePage.css'

const asArray = (value) => (Array.isArray(value) ? value : [])

export default function ResumePage() {
    const {t, i18n} = useTranslation('resume')
    const language = i18n.resolvedLanguage?.startsWith('fr') ? 'fr' : 'en'
    const experiences = asArray(t('experience', {returnObjects: true}))
    const education = asArray(t('education', {returnObjects: true}))
    const projects = asArray(t('projects', {returnObjects: true}))
    const skills = asArray(t('skills', {returnObjects: true}))
    const certifications = asArray(t('certifications', {returnObjects: true}))
    const languages = asArray(t('languages', {returnObjects: true}))

    useDocumentTitle(t('meta.title'))

    return (
        <PageFrame>
            <PageHero
                id="top"
                kicker={t('hero.kicker')}
                title={t('hero.title')}
                subtitle={`${t('hero.role')} · ${t('hero.focus')}`}
            >
                <Link className="btn resume__button" to="/">
                    <FiArrowLeft aria-hidden="true" />
                    {t('hero.back')}
                </Link>
                <a
                    className="btn btn-primary resume__button"
                    href={HOME_ASSETS.resume[language]}
                    download
                    aria-describedby="resume-download-note"
                >
                    <FiDownload aria-hidden="true" />
                    {t('hero.download')}
                </a>
            </PageHero>

            <article className="container resume" aria-label={t('hero.kicker')}>
                <p className="resume__summary">{t('hero.summary')}</p>
                <p id="resume-download-note" className="resume__download-note">
                    {t('hero.downloadNote')}
                </p>

                <div className="resume__layout">
                    <aside className="resume__sidebar" aria-label={t('sections.contact')}>
                        <section aria-labelledby="resume-contact-title">
                            <h2 id="resume-contact-title">{t('sections.contact')}</h2>
                            <address className="resume__contact">
                                <p>{t('contact.location')}</p>
                                <a href={`tel:${t('contact.phone').replaceAll(' ', '')}`}>
                                    {t('contact.phoneLabel')}
                                </a>
                                <a href={`mailto:${t('contact.email')}`}>
                                    {t('contact.emailLabel')}
                                </a>
                                <a
                                    href={`https://${t('contact.linkedin')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t('contact.linkedinLabel')}
                                </a>
                                <a
                                    href={`https://${t('contact.website')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t('contact.websiteLabel')}
                                </a>
                                <a
                                    href={`https://${t('contact.github')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t('contact.githubLabel')}
                                </a>
                            </address>
                        </section>

                        <section aria-labelledby="resume-skills-title">
                            <h2 id="resume-skills-title">{t('sections.skills')}</h2>
                            <dl className="resume__definition-list">
                                {skills.map((skill, index) => (
                                    <div key={skill.id ?? index}>
                                        <dt>{skill.name}</dt>
                                        <dd>{skill.detail}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        <section aria-labelledby="resume-certifications-title">
                            <h2 id="resume-certifications-title">{t('sections.certifications')}</h2>
                            <ul className="resume__compact-list">
                                {certifications.map((certification, index) => (
                                    <li key={index}>{certification}</li>
                                ))}
                            </ul>
                        </section>

                        <section aria-labelledby="resume-languages-title">
                            <h2 id="resume-languages-title">{t('sections.languages')}</h2>
                            <ul className="resume__compact-list">
                                {languages.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </aside>

                    <div className="resume__main">
                        <section aria-labelledby="resume-experience-title">
                            <h2 id="resume-experience-title">{t('sections.experience')}</h2>
                            <div className="resume__entries">
                                {experiences.map((experience, index) => (
                                    <article className="resume__entry" key={experience.id ?? index}>
                                        <h3>{experience.role}</h3>
                                        <p className="resume__meta">
                                            {experience.organization} · {experience.period}
                                        </p>
                                        <ul>
                                            {experience.bullets.map((bullet, bulletIndex) => (
                                                <li key={bulletIndex}>{bullet}</li>
                                            ))}
                                        </ul>
                                        {experience.skills && (
                                            <p className="resume__skills-used">
                                                <strong>{t('labels.skills')} :</strong>{' '}
                                                {experience.skills}
                                            </p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section aria-labelledby="resume-education-title">
                            <h2 id="resume-education-title">{t('sections.education')}</h2>
                            <div className="resume__entries">
                                {education.map((item, index) => (
                                    <article className="resume__entry" key={item.id ?? index}>
                                        <h3>{item.title}</h3>
                                        <p className="resume__meta">
                                            {item.school} · {item.period}
                                        </p>
                                        <p>{item.detail}</p>
                                        {item.thesis && (
                                            <p className="resume__thesis">{item.thesis}</p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section aria-labelledby="resume-projects-title">
                            <h2 id="resume-projects-title">{t('sections.projects')}</h2>
                            <div className="resume__entries resume__entries--projects">
                                {projects.map((project, index) => (
                                    <article className="resume__entry" key={project.id ?? index}>
                                        <p className="resume__status">{project.status}</p>
                                        <h3>{project.name}</h3>
                                        <p>{project.detail}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </article>
        </PageFrame>
    )
}
