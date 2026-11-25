import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from 'i18next'
import {expect, it} from 'vitest'
import ProjectGallery from './ProjectGallery.jsx'
import {OPENDENTE_SCREENS} from '../../../config/opendenteMedia.js'
import {activity_dark, awake_light} from '../../../config/macpanelGalleryMedia.js'
import fr from '../../../i18n/fr/projects_fr.json'
import en from '../../../i18n/en/projects_en.json'

it.each(['fr', 'en'])('exposes localized captions and the full-size image in %s', async (lang) => {
    const user = userEvent.setup()
    const content = lang === 'fr' ? fr : en
    i18n.addResourceBundle(lang, 'projects', content, true, true)
    await i18n.changeLanguage(lang)
    for (const [project, screens] of [
        ['opendente', OPENDENTE_SCREENS],
        [
            'macpanel',
            [
                {id: 'activity', media: activity_dark},
                {id: 'awake', media: awake_light},
            ],
        ],
    ]) {
        const {unmount} = render(<ProjectGallery project={project} screens={screens} />)
        const gallery = content[project].gallery
        const choices = within(screen.getByRole('group', {name: gallery.choose}))
        for (const entry of screens) {
            const item = gallery.items[entry.id]
            await user.click(choices.getByRole('button', {name: item.label}))
            expect(screen.getByRole('img', {name: item.alt})).toBeVisible()
            expect(screen.getByRole('link', {name: gallery.enlarge})).toHaveAttribute(
                'href',
                (entry.media ?? entry[lang]).variants.at(-1).url
            )
        }
        unmount()
    }
})
