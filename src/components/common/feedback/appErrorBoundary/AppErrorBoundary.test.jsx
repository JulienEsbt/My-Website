import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import AppErrorBoundary from './AppErrorBoundary.jsx'

const BrokenComponent = () => {
    throw new Error('Test error')
}

describe('AppErrorBoundary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr')
    })

    it('shows a safe recovery screen when a child crashes', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const preventExpectedError = (event) => event.preventDefault()
        window.addEventListener('error', preventExpectedError)

        try {
            render(
                <AppErrorBoundary>
                    <BrokenComponent />
                </AppErrorBoundary>
            )

            expect(screen.getByRole('alert')).toBeVisible()
            expect(
                screen.getByRole('heading', {
                    name: 'Le portfolio n’a pas pu s’afficher correctement.',
                })
            ).toBeVisible()
            expect(screen.getByRole('link', {name: 'Retour à l’accueil'})).toHaveAttribute(
                'href',
                '/'
            )
        } finally {
            window.removeEventListener('error', preventExpectedError)
            consoleSpy.mockRestore()
        }
    })
})
