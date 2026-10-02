import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import WalletPicker from './WalletPicker.jsx'
import {connectWalletConnect} from '../../../../services/web3/walletConnect.ts'
vi.mock('../../../../services/web3/walletConnect.ts', () => ({connectWalletConnect: vi.fn()}))

beforeEach(async () => {
    await i18n.changeLanguage('fr')
})
afterEach(() => {
    delete window.ethereum
})
const announce = (provider, name = 'MetaMask') =>
    act(() =>
        window.dispatchEvent(
            new CustomEvent('eip6963:announceProvider', {
                detail: {provider, info: {uuid: name, name}},
            })
        )
    )
it('shows late extensions, handles rejection and permits choosing another wallet', async () => {
    const user = userEvent.setup()
    const connected = vi.fn()
    const address = '0x1234567890123456789012345678901234567890'
    render(<WalletPicker onClose={vi.fn()} onConnected={connected} />)
    announce({request: vi.fn().mockRejectedValue({code: 4001})})
    announce({request: vi.fn().mockResolvedValue([address])}, 'Rabby')
    await user.click(screen.getByRole('button', {name: /MetaMask/}))
    expect(await screen.findByRole('alert')).toHaveTextContent('refusée')
    await user.click(screen.getByRole('button', {name: /Rabby/}))
    await waitFor(() =>
        expect(connected).toHaveBeenCalledWith(
            address,
            expect.objectContaining({name: 'Rabby', accounts: [address]})
        )
    )
})
it('ignores an extension response after closing the picker', async () => {
    const user = userEvent.setup()
    let resolve
    const connected = vi.fn()
    const {unmount} = render(<WalletPicker onClose={vi.fn()} onConnected={connected} />)
    announce({
        request: () =>
            new Promise((done) => {
                resolve = done
            }),
    })
    await user.click(screen.getByRole('button', {name: /MetaMask/}))
    unmount()
    await act(async () => resolve(['0x1234567890123456789012345678901234567890']))
    expect(connected).not.toHaveBeenCalled()
    expect(document.body.style.overflow).not.toBe('hidden')
})

it('keeps WalletConnect absent without configuration', () => {
    vi.stubEnv('VITE_WALLETCONNECT_PROJECT_ID', '')
    render(<WalletPicker onClose={vi.fn()} onConnected={vi.fn()} />)
    expect(screen.queryByRole('button', {name: /WalletConnect/})).not.toBeInTheDocument()
    vi.unstubAllEnvs()
})

it('offers configured WalletConnect, displays its QR and aborts when closed', async () => {
    vi.stubEnv('VITE_WALLETCONNECT_PROJECT_ID', 'a'.repeat(32))
    const user = userEvent.setup()
    connectWalletConnect.mockImplementation(
        ({onQr, signal}) =>
            new Promise((resolve, reject) => {
                onQr({uri: 'wc:test', image: 'data:image/png;base64,test'})
                signal.addEventListener('abort', () =>
                    reject(new DOMException('Cancelled', 'AbortError'))
                )
            })
    )
    const {unmount} = render(<WalletPicker onClose={vi.fn()} onConnected={vi.fn()} />)
    await user.click(screen.getByRole('button', {name: /WalletConnect · Wallet mobile/}))
    expect(
        await screen.findByRole('img', {name: 'QR code de connexion WalletConnect'})
    ).toBeVisible()
    const signal = connectWalletConnect.mock.lastCall[0].signal
    unmount()
    expect(signal.aborted).toBe(true)
    vi.unstubAllEnvs()
})
