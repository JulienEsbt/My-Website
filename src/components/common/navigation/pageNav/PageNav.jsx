import React, {useCallback, useEffect, useRef, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher.jsx'
import {SITE_PAGE_GROUPS} from '../../../../config/pages.js'
import './PageNav.css'

const PageNav = () => {
    const [isOpen, setOpen] = useState(false)
    const {t} = useTranslation('common')
    const navigationRef = useRef(null)
    const menuButtonRef = useRef(null)
    const firstLinkRef = useRef(null)

    const closeMenu = useCallback(() => setOpen(false), [])

    useEffect(() => {
        if (!isOpen) return undefined

        const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus())

        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return

            event.preventDefault()
            closeMenu()
            window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        }

        const handlePointerDown = (event) => {
            if (!navigationRef.current?.contains(event.target)) closeMenu()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            window.cancelAnimationFrame(focusFrame)
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [closeMenu, isOpen])

    return (
        <>
            <div className="lang-wrapper">
                <LanguageSwitcher />
            </div>

            <nav className="pagenav" aria-label={t('pageNav.aria')}>
                <div ref={navigationRef} className="pagenavbar">
                    <button
                        ref={menuButtonRef}
                        type="button"
                        className={`navbutton ${isOpen ? 'is-open' : ''}`}
                        onClick={() => setOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-controls="primary-navigation"
                        aria-label={isOpen ? t('pageNav.close') : t('pageNav.open')}
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>

                    {isOpen && (
                        <div className="pagebar" id="primary-navigation">
                            {SITE_PAGE_GROUPS.map((group, groupIndex) => (
                                <div className="pagebar__group" key={group.id}>
                                    <span>{t(group.i18nKey)}</span>
                                    {group.pages.map((page, pageIndex) => (
                                        <NavLink
                                            key={page.path}
                                            ref={
                                                groupIndex === 0 && pageIndex === 0
                                                    ? firstLinkRef
                                                    : undefined
                                            }
                                            to={page.path}
                                            className="pagetext"
                                            onClick={closeMenu}
                                        >
                                            {t(page.i18nKey)}
                                        </NavLink>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}

export default PageNav
