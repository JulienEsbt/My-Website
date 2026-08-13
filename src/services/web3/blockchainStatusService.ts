import type {BlockchainStatus} from '../../types/web3'

interface BlockchainStatusPayload {
    ok: true
    networks: BlockchainStatus[]
}

const isBlockchainStatus = (value: unknown): value is BlockchainStatus => {
    if (!value || typeof value !== 'object') return false
    const status = value as Partial<BlockchainStatus>
    return (
        typeof status.id === 'string' &&
        ['online', 'error', 'missing-rpc'].includes(status.status ?? '')
    )
}

const isStatusPayload = (value: unknown): value is BlockchainStatusPayload => {
    if (!value || typeof value !== 'object') return false
    const payload = value as Partial<BlockchainStatusPayload>
    return (
        payload.ok === true &&
        Array.isArray(payload.networks) &&
        payload.networks.every(isBlockchainStatus)
    )
}

export async function fetchBlockchainStatuses({signal}: {signal?: AbortSignal} = {}): Promise<
    BlockchainStatus[]
> {
    const response = await fetch('/api/blockchain-status', {
        method: 'GET',
        headers: {Accept: 'application/json'},
        ...(signal ? {signal} : {}),
    })

    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok || !isStatusPayload(payload)) {
        throw new Error('BLOCKCHAIN_STATUS_UNAVAILABLE')
    }

    return payload.networks
}
