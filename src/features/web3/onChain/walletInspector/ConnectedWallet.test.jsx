import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import ConnectedWallet from './ConnectedWallet.jsx'

const a = '0x1111111111111111111111111111111111111111'
const b = '0x2222222222222222222222222222222222222222'
const c = '0x3333333333333333333333333333333333333333'
function fixture() {
    const listeners = new Map()
    const provider = {
        request: vi.fn().mockResolvedValue([a, b]),
        on: vi.fn((event, callback) => listeners.set(event, callback)),
        removeListener: vi.fn((event) => listeners.delete(event)),
    }
    const wallet = {id: 'test', name: 'MetaMask', provider, accounts: [a, b]}
    return {wallet, provider, listeners}
}
beforeEach(async () => {
    await i18n.changeLanguage('fr')
})
it('selects an authorized address, follows extension events and clears locked accounts', async () => {
    const user = userEvent.setup()
    const {wallet, provider, listeners} = fixture()
    const change = vi.fn()
    const {unmount} = render(<ConnectedWallet wallet={wallet} onAddress={change} />)
    await waitFor(() => expect(provider.request).toHaveBeenCalledWith({method: 'eth_accounts'}))
    await user.selectOptions(screen.getByLabelText('Adresse à analyser'), b)
    expect(change).toHaveBeenLastCalledWith(b)
    act(() => listeners.get('accountsChanged')([c]))
    expect(change).toHaveBeenLastCalledWith(c)
    expect(screen.getByLabelText('Adresse à analyser')).toHaveValue(c)
    act(() => listeners.get('accountsChanged')([]))
    expect(change).toHaveBeenLastCalledWith('')
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Aucune adresse')
    unmount()
    expect(listeners.size).toBe(0)
})
it('ignores stale refreshes after an account change and after detaching', async () => {
    const user = userEvent.setup()
    const {wallet, provider, listeners} = fixture()
    const change = vi.fn()
    const {unmount} = render(<ConnectedWallet wallet={wallet} onAddress={change} />)
    const button = screen.getByRole('button', {name: 'Actualiser les adresses'})
    await waitFor(() => expect(button).toBeEnabled())
    let resolve
    provider.request.mockImplementation(
        () =>
            new Promise((done) => {
                resolve = done
            })
    )
    await user.click(button)
    act(() => listeners.get('accountsChanged')([c]))
    await act(async () => resolve([a, b]))
    expect(screen.getByRole('combobox')).toHaveValue(c)
    await user.click(button)
    const calls = change.mock.calls.length
    unmount()
    await act(async () => resolve([a]))
    expect(change).toHaveBeenCalledTimes(calls)
})
it('clears the selected account when the provider disconnects', async () => {
    const {wallet, listeners} = fixture()
    const change = vi.fn()
    render(<ConnectedWallet wallet={wallet} onAddress={change} />)
    await waitFor(() =>
        expect(screen.getByRole('button', {name: 'Actualiser les adresses'})).toBeEnabled()
    )
    act(() => listeners.get('disconnect')({code: 4900}))
    expect(change).toHaveBeenLastCalledWith('')
})
