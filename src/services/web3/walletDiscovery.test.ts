import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    discoverWallets,
    requestWalletAddress,
    walletConnectionError,
    safeWalletIcon,
    walletAccounts,
} from './walletDiscovery'

afterEach(() => {
    delete window.ethereum
})

describe('wallet discovery and explicit connection', () => {
    it('discovers late and repeated EIP-6963 announcements without requesting accounts', () => {
        const change = vi.fn()
        const provider = {request: vi.fn()}
        const other = {request: vi.fn()}
        window.ethereum = other
        const stop = discoverWallets(change)
        const announce = () =>
            window.dispatchEvent(
                new CustomEvent('eip6963:announceProvider', {
                    detail: {info: {uuid: 'test', name: 'Test wallet'}, provider},
                })
            )
        announce()
        announce()
        window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {detail: {}}))
        expect(change.mock.lastCall?.[0]).toEqual([{id: 'test', name: 'Test wallet', provider}])
        expect(provider.request).not.toHaveBeenCalled()
        expect(other.request).not.toHaveBeenCalled()
        stop()
        const count = change.mock.calls.length
        announce()
        expect(change).toHaveBeenCalledTimes(count)
    })
    it('connects only the selected provider, with no signature or network switch', async () => {
        const account = '0x1234567890123456789012345678901234567890'
        const selected = {request: vi.fn().mockResolvedValue([account])}
        window.ethereum = {request: vi.fn()}
        expect(await requestWalletAddress(selected)).toBe(account)
        expect(selected.request).toHaveBeenCalledExactlyOnceWith({method: 'eth_requestAccounts'})
        expect(window.ethereum.request).not.toHaveBeenCalled()
    })
    it.each([[], null, ['invalid']])(
        'rejects inaccessible or invalid accounts: %j',
        async (accounts) => {
            await expect(
                requestWalletAddress({request: vi.fn().mockResolvedValue(accounts)})
            ).rejects.toThrow()
        }
    )
    it.each([
        [{code: 4001}, 'rejected'],
        [{code: 4001, message: 'wallet must have at least one account'}, 'noAccounts'],
        [new Error('NO_ACCOUNTS'), 'noAccounts'],
        [{info: {error: {code: -32002}}}, 'pending'],
        [{code: 4100}, 'unauthorized'],
        [null, 'connectionFailed'],
    ])('explains connection failures %j', (error, expected) =>
        expect(walletConnectionError(error)).toBe(expected)
    )
})

it('accepts data image icons but never remote or executable URLs', () => {
    expect(safeWalletIcon('data:image/svg+xml;base64,PHN2Zy8+')).toBeDefined()
    for (const value of [
        'https://example.com/icon.png',
        'javascript:alert(1)',
        'data:text/html;base64,test',
        'data:image/png;base64,' + 'a'.repeat(200_000),
    ])
        expect(safeWalletIcon(value)).toBeUndefined()
})
it('keeps all authorized addresses and deduplicates casing', () => {
    const account = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    expect(walletAccounts([account, account.toUpperCase().replace('0X', '0x')])).toEqual([account])
    expect(walletAccounts([])).toEqual([])
    expect(() => walletAccounts(['wrong'])).toThrow('INVALID_ACCOUNT')
})
