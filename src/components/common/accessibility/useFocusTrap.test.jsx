import {useRef, useState} from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import useFocusTrap from './useFocusTrap.js'

const DialogFixture = () => {
    const [open, setOpen] = useState(false)
    const dialogRef = useRef(null)
    const closeRef = useRef(null)

    useFocusTrap({
        active: open,
        containerRef: dialogRef,
        initialFocusRef: closeRef,
        onDismiss: () => setOpen(false),
    })

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Ouvrir
            </button>
            <a href="#background">Contenu en arrière-plan</a>

            {open && (
                <div ref={dialogRef} role="dialog" aria-label="Exemple" tabIndex="-1">
                    <button ref={closeRef} type="button" onClick={() => setOpen(false)}>
                        Fermer
                    </button>
                    <a href="#example">Dernier élément</a>
                </div>
            )}
        </>
    )
}

describe('useFocusTrap', () => {
    it('moves, traps and restores focus while supporting Escape', async () => {
        const user = userEvent.setup()
        render(<DialogFixture />)

        const opener = screen.getByRole('button', {name: 'Ouvrir'})
        await user.click(opener)

        await waitFor(() => expect(screen.getByRole('button', {name: 'Fermer'})).toHaveFocus())
        expect(opener).toHaveAttribute('inert')
        expect(opener).toHaveAttribute('aria-hidden', 'true')
        expect(screen.getByRole('link', {name: 'Dernier élément'})).toBeVisible()

        await user.keyboard('{Shift>}{Tab}{/Shift}')
        expect(screen.getByRole('link', {name: 'Dernier élément'})).toHaveFocus()

        await user.keyboard('{Escape}')
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(opener).not.toHaveAttribute('inert')
        expect(opener).not.toHaveAttribute('aria-hidden')
        expect(opener).toHaveFocus()
    })
})
