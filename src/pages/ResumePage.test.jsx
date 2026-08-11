import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {beforeAll, beforeEach, describe, expect, it} from 'vitest'
import i18n, {loadNamespace} from '../i18n/i18n.js'
import ResumePage from './ResumePage.jsx'

beforeAll(async () => {
    await loadNamespace('resume')
})

describe('ResumePage', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('provides a structured accessible alternative and the French PDF', () => {
        render(
            <MemoryRouter>
                <ResumePage />
            </MemoryRouter>
        )

        expect(screen.getByRole('heading', {level: 1, name: 'Julien Esterbet'})).toBeVisible()
        expect(
            screen.getByRole('heading', {level: 2, name: 'Expérience professionnelle'})
        ).toBeVisible()
        expect(
            screen.getByRole('link', {name: 'Télécharger le CV au format PDF'}).getAttribute('href')
        ).toContain('Julien-Esterbet-CV-FR-2026.pdf')
    })

    it('switches the download to the English PDF with the language', async () => {
        await i18n.changeLanguage('en')

        render(
            <MemoryRouter>
                <ResumePage />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('link', {name: 'Download the resume as a PDF'}).getAttribute('href')
        ).toContain('Julien-Esterbet-Resume-EN-2026.pdf')
    })
}
