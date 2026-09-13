import React, {useState} from 'react'
import './Tools.css'
import {FiCompass, FiSearch} from 'react-icons/fi'
import {FiChevronDown, FiExternalLink} from 'react-icons/fi'
import {motion} from 'framer-motion'
import {useTranslation} from 'react-i18next'
import {LINKS} from '../../../config/links.js'

const buildTools = (items = []) =>
    items.map((item) => ({
        label: item.name,
        href: item.url,
    }))

const Tools = () => {
    const {t} = useTranslation('web3')
    const [openGroups, setOpenGroups] = useState(['others', 'explorers'])

    const toggleGroup = (groupId) => {
        setOpenGroups((current) =>
            current.includes(groupId)
                ? current.filter((id) => id !== groupId)
                : [...current, groupId]
        )
    }

    const groups = [
        {
            id: 'others',
            title: t('tools.groups.others'),
            aria: t('tools.aria.listOthers'),
            items: buildTools(LINKS.tools?.others),
        },
        {
            id: 'explorers',
            title: t('tools.groups.explorers'),
            aria: t('tools.aria.listExplorers'),
            items: buildTools(LINKS.tools?.explorers),
        },
    ]

    return (
        <section id="tools">
            <p className="section-kicker">{t('tools.kicker')}</p>
            <h2>{t('tools.title')}</h2>
            <p className="tools-v2__intro">{t('tools.description')}</p>

            <div className="container tools-v2">
                {groups.map((group, groupIndex) => {
                    const isOpen = openGroups.includes(group.id)

                    return (
                        <motion.article
                            key={group.id}
                            className={`tools-v2__card ${isOpen ? 'is-open' : ''}`}
                            initial={{opacity: 0, y: 28}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{duration: 0.45, delay: groupIndex * 0.08}}
                        >
                            <button
                                type="button"
                                className="tools-v2__head"
                                onClick={() => toggleGroup(group.id)}
                                aria-expanded={isOpen}
                                aria-controls={`tools-${group.id}`}
                            >
                                <span aria-hidden="true">
                                    {group.id === 'others' ? <FiSearch /> : <FiCompass />}
                                </span>
                                <h3>{group.title}</h3>
                                <FiChevronDown className="tools-v2__chevron" />
                            </button>

                            <ul
                                id={`tools-${group.id}`}
                                className="tools-v2__list"
                                aria-label={group.aria}
                                hidden={!isOpen}
                            >
                                {group.items.map((tool) => (
                                    <li key={tool.label}>
                                        <a
                                            href={tool.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={t('tools.aria.open', {site: tool.label})}
                                        >
                                            <span className="tools-v2__icon">
                                                <span aria-hidden="true">{tool.label[0]}</span>
                                            </span>

                                            <span className="tools-v2__label">
                                                <strong>{tool.label}</strong>
                                                <small>
                                                    {new URL(tool.href).hostname.replace(
                                                        /^www\./,
                                                        ''
                                                    )}
                                                </small>
                                            </span>

                                            <FiExternalLink
                                                className="tools-v2__external"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.article>
                    )
                })}
            </div>
        </section>
    )
}

export default Tools
