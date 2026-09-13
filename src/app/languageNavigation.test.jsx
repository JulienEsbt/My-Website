import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, useNavigate, useLocation} from 'react-router-dom'
import {beforeEach, expect, it, vi} from 'vitest'
import i18n from '../i18n/i18n.js'
import Router from './router.jsx'
import LanguageSwitcher from '../components/common/navigation/languageSwitcher/LanguageSwitcher.jsx'
import {Link} from '../components/common/navigation/LocalizedLink.jsx'

vi.mock('../pages/HomePage.jsx', () => ({
    default: () => (
        <>
            <input aria-label="Draft" />
            <LanguageSwitcher />
            <Link to="/resume">CV</Link>
        </>
    ),
}))
function HistoryControls() {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    return (
        <>
            <output>{pathname}</output>
            <button onClick={() => navigate(-1)}>Back</button>
        </>
    )
}
beforeEach(async () => {
    await i18n.changeLanguage('fr')
})
it('changes language without remounting the page and handles browser history', async () => {
    const user = userEvent.setup()
    render(
        <MemoryRouter>
            <Router />
            <HistoryControls />
        </MemoryRouter>
    )
    const draft = await screen.findByRole('textbox', {name: 'Draft'})
    await user.type(draft, 'Preserve this draft')
    await user.click(screen.getByRole('link', {name: 'Switch to English'}))
    await waitFor(() => expect(i18n.resolvedLanguage).toBe('en'))
    expect(screen.getByRole('textbox', {name: 'Draft'})).toBe(draft)
    expect(draft).toHaveValue('Preserve this draft')
    expect(screen.getByRole('link', {name: 'CV'})).toHaveAttribute('href', '/en/resume')
    await user.click(screen.getByRole('button', {name: 'Back'}))
    await waitFor(() => expect(i18n.resolvedLanguage).toBe('fr'))
    expect(screen.getByRole('textbox', {name: 'Draft'})).toBe(draft)
    expect(screen.getByRole('link', {name: 'CV'})).toHaveAttribute('href', '/resume')
})
