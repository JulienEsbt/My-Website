import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import SectionNav from './SectionNav.jsx'

vi.mock('gsap', () => ({
    gsap: {
        fromTo: vi.fn(() => ({kill: vi.fn()})),
        set: vi.fn(),
    },
}))

describe('SectionNav', () => {
    it('annonce la section active et masque les icônes décoratives', async () => {
        const user = userEvent.setup()

        render(
            <>
                <SectionNav
                    ariaLabel="Navigation de test"
                    items={[
                        {id: 'intro', label: 'Introduction', icon: <svg data-testid="intro-icon" />},
                        {id: 'details', label: 'Détails', icon: <svg data-testid="details-icon" />},
                    ]}
                />
                <section id="intro" />
                <section id="details" />
            </>
        )

        await user.click(screen.getByRole('link', {name: 'Introduction'}))

        expect(screen.getByRole('link', {name: 'Introduction'})).toHaveAttribute(
            'aria-current',
            'location'
        )
        expect(screen.getByTestId('intro-icon').parentElement).toHaveAttribute('aria-hidden', 'true')
        expect(window.scrollTo).toHaveBeenCalled()
    })
})
