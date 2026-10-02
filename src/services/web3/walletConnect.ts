import SignClient from '@walletconnect/sign-client'

const reason = {code: 6000, message: 'Public address inspection finished'}
let clientPromise: Promise<SignClient> | undefined
let currentAttempt = 0

function getClient(projectId: string) {
    clientPromise ??= SignClient.init({
        projectId,
        relayUrl: 'wss://relay.walletconnect.org',
        telemetryEnabled: false,
        customStoragePrefix: 'portfolio-inspector',
        metadata: {
            name: 'Julien Esterbet · Wallet Inspector',
            description: 'Read-only public EVM address inspection',
            url: window.location.origin,
            icons: [],
        },
    }).catch((error) => {
        clientPromise = undefined
        throw error
    })
    return clientPromise
}

/** One-shot address sharing. No signature, transaction or automatic session restoration. */
export async function connectWalletConnect({
    projectId,
    signal,
    onQr,
}: {
    projectId: string
    signal: AbortSignal
    onQr: (qr: {uri: string; image: string}) => void
}): Promise<string> {
    if (!/^[a-f\d]{32}$/i.test(projectId)) throw new Error('WALLETCONNECT_CONFIG')
    signal.throwIfAborted()
    const attempt = ++currentAttempt
    let client: SignClient | undefined
    let pairingTopic: string | undefined
    let timedOut = false
    let cancel: () => void = () => {}
    let timeout: ReturnType<typeof setTimeout> | undefined
    const cancelled = new Promise<never>((_, reject) => {
        cancel = () => reject(new DOMException('Connection cancelled', 'AbortError'))
        signal.addEventListener('abort', cancel, {once: true})
        timeout = setTimeout(() => {
            timedOut = true
            reject(new Error('WALLETCONNECT_TIMEOUT'))
        }, 120_000)
    })
    const connect = async () => {
        client = await getClient(projectId)
        if (signal.aborted || timedOut) {
            if (currentAttempt === attempt)
                await client.core.relayer.transportClose().catch(() => {})
            signal.throwIfAborted()
        }
        if (timedOut) throw new Error('WALLETCONNECT_TIMEOUT')
        await client.core.relayer.transportOpen()
        const {uri, approval} = await client.connect({
            requiredNamespaces: {
                eip155: {
                    chains: ['eip155:1'],
                    methods: ['eth_accounts'],
                    events: ['accountsChanged', 'chainChanged'],
                },
            },
        })
        pairingTopic = uri?.split('@')[0]?.slice(3)
        // Attach immediately: declining, cancelling or a late approval never leaves an unhandled promise.
        const approved = approval().then(async (session) => {
            const account = session.namespaces.eip155?.accounts?.find((value) =>
                /^eip155:1:0x[\da-f]{40}$/i.test(value)
            )
            await client!.disconnect({topic: session.topic, reason}).catch(() => {})
            if (!account) throw new Error('NO_ACCOUNTS')
            return account.slice('eip155:1:'.length)
        })
        // Consume rejection even if QR generation fails or cancellation happens first.
        void approved.catch(() => {})
        if (uri && !signal.aborted && !timedOut) {
            const {default: QRCode} = await import('qrcode')
            const image = await QRCode.toDataURL(uri, {
                width: 320,
                margin: 2,
                errorCorrectionLevel: 'M',
            })
            if (!signal.aborted && !timedOut) onQr({uri, image})
        }
        if (signal.aborted || timedOut) {
            if (pairingTopic)
                await client.core.pairing.disconnect({topic: pairingTopic}).catch(() => {})
            signal.throwIfAborted()
            throw new Error('WALLETCONNECT_TIMEOUT')
        }
        return approved
    }
    try {
        return await Promise.race([connect(), cancelled])
    } finally {
        clearTimeout(timeout)
        signal.removeEventListener('abort', cancel)
        if (client && pairingTopic)
            await client.core.pairing.disconnect({topic: pairingTopic}).catch(() => {})
        if (client && currentAttempt === attempt)
            await client.core.relayer.transportClose().catch(() => {})
    }
}
