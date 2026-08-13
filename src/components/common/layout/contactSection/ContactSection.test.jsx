import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import ContactSection from './ContactSection.jsx'

const {sendContactForm} = vi.hoisted(() => ({sendContactForm: vi.fn()}))

vi.mock('../../../../services/contact/contactService.js', () => ({sendContactForm}))

describe('ContactSection', () => {
    beforeEach(async () => {
        sendContactForm.mockReset()
        await i18n.changeLanguage('fr')
    })

    it('announces a successful submission from the simulated service', async () => {
        const user = userEvent.setup()
        sendContactForm.mockResolvedValue({ok: true})
        render(<ContactSection />)

        await user.type(screen.getByLabelText('Nom'), 'Julien Esterbet')
        await user.type(screen.getByLabelText('Email'), 'julien@example.com')
        await user.type(
            screen.getByLabelText('Message'),
            'Bonjour, voici un message suffisamment détaillé.'
        )
        await user.click(screen.getByRole('button', {name: 'Envoyer l’email'}))

        expect(await screen.findByRole('status')).toHaveTextContent('Message envoyé, merci !')
        expect(sendContactForm).toHaveBeenCalledTimes(1)
        expect(document.querySelector('input[name="website"]')).toHaveAttribute('tabindex', '-1')
    })

    it('shows a validation message for a rejected form', async () => {
        const user = userEvent.setup()
        const error = new Error('Contact request failed')
        error.code = 'invalid_form'
        sendContactForm.mockRejectedValue(error)
        render(<ContactSection />)

        await user.type(screen.getByLabelText('Nom'), 'Julien Esterbet')
        await user.type(screen.getByLabelText('Email'), 'julien@example.com')
        await user.type(screen.getByLabelText('Message'), 'Un message suffisamment long.')
        await user.click(screen.getByRole('button', {name: 'Envoyer l’email'}))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'le message au moins 10 caractères'
        )
    })

    it('aligns browser constraints with server validation', () => {
        render(<ContactSection />)

        expect(screen.getByLabelText('Nom')).toHaveAttribute('minlength', '2')
        expect(screen.getByLabelText('Nom')).toHaveAttribute('maxlength', '80')
        expect(screen.getByLabelText('Email')).toHaveAttribute('maxlength', '254')
        expect(screen.getByLabelText('Message')).toHaveAttribute('minlength', '10')
        expect(screen.getByLabelText('Message')).toHaveAttribute('maxlength', '4000')
    })
})
