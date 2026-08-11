import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import PageFrame from './PageFrame.jsx'

vi.mock('../../navigation/pageNav/PageNav.jsx', () => ({
    default: () => <nav aria-label="Navigation principale de test" />,
}))

vi.mock('../footerSection/Footer.jsx', () => ({
    default: () => <footer>Pied de page de test</footer>,
}))

describe('PageFrame', () => {
    it('sépare la navigation, le contenu principal et le pied de page', () => {
        render(
            <PageFrame>
                <h1>Contenu de test</h1>
            </PageFrame>
        )

        const main = screen.getByRole('main')
        const navigation = screen.getByRole('navigation')
        const footer = screen.getByRole('contentinfo')

        expect(main).toHaveAttribute('id', 'main')
        expect(main).toHaveAttribute('tabindex', '-1')
        expect(main).toContainElement(screen.getByRole('heading', {level: 1}))
        expect(main).not.toContainElement(navigation)
        expect(main).not.toContainElement(footer)
    })
})
