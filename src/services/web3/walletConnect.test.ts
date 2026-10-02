import {beforeEach, describe, expect, it, vi} from 'vitest'
const sdk = vi.hoisted(() => ({
    connect: vi.fn(),
    disconnect: vi.fn().mockResolvedValue(undefined),
    core: {
        pairing: {disconnect: vi.fn().mockResolvedValue(undefined)},
        relayer: {
            transportOpen: vi.fn().mockResolvedValue(undefined),
            transportClose: vi.fn().mockResolvedValue(undefined),
        },
    },
}))
vi.mock('@walletconnect/sign-client', () => ({default: {init: vi.fn().mockResolvedValue(sdk)}}))
vi.mock('qrcode', () => ({
    default: {toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,qr')},
}))
import {connectWalletConnect} from './walletConnect'
const projectId = 'a'.repeat(32)
const address = '0x1234567890123456789012345678901234567890'
const session = {topic: 'session', namespaces: {eip155: {accounts: [`eip155:1:${address}`]}}}
beforeEach(() => {
    vi.clearAllMocks()
})

describe('WalletConnect read-only address handoff', () => {
    it('requires configuration before starting a connection', async () => {
        await expect(
            connectWalletConnect({
                projectId: '',
                signal: new AbortController().signal,
                onQr: vi.fn(),
            })
        ).rejects.toThrow('WALLETCONNECT_CONFIG')
        expect(sdk.connect).not.toHaveBeenCalled()
    })
    it('requests accounts only, renders a QR locally, then closes the session and pairing', async () => {
        sdk.connect.mockResolvedValue({uri: 'wc:pairing@2?key=test', approval: async () => session})
        const onQr = vi.fn()
        expect(
            await connectWalletConnect({projectId, signal: new AbortController().signal, onQr})
        ).toBe(address)
        expect(sdk.connect).toHaveBeenCalledWith({
            requiredNamespaces: {
                eip155: {
                    chains: ['eip155:1'],
                    methods: ['eth_accounts'],
                    events: ['accountsChanged', 'chainChanged'],
                },
            },
        })
        expect(onQr).toHaveBeenCalledWith({
            uri: 'wc:pairing@2?key=test',
            image: 'data:image/png;base64,qr',
        })
        expect(sdk.disconnect).toHaveBeenCalledWith(expect.objectContaining({topic: 'session'}))
        expect(sdk.core.pairing.disconnect).toHaveBeenCalledWith({topic: 'pairing'})
        expect(sdk.core.relayer.transportClose).toHaveBeenCalled()
    })
    it('cancels without returning an account and closes a late approved session', async () => {
        let approve!: (value: typeof session) => void
        sdk.connect.mockResolvedValue({
            uri: 'wc:pairing@2?key=test',
            approval: () =>
                new Promise((resolve) => {
                    approve = resolve
                }),
        })
        const controller = new AbortController()
        const result = connectWalletConnect({
            projectId,
            signal: controller.signal,
            onQr: () => controller.abort(),
        })
        await expect(result).rejects.toMatchObject({name: 'AbortError'})
        approve(session)
        await vi.waitFor(() => expect(sdk.disconnect).toHaveBeenCalled())
    })
    it('rejects a session without a valid Ethereum account', async () => {
        sdk.connect.mockResolvedValue({approval: async () => ({topic: 'invalid', namespaces: {}})})
        await expect(
            connectWalletConnect({projectId, signal: new AbortController().signal, onQr: vi.fn()})
        ).rejects.toThrow('NO_ACCOUNTS')
        expect(sdk.disconnect).toHaveBeenCalled()
    })
})
