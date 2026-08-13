export async function fetchBlockchainStatuses({signal} = {}) {
    const response = await fetch('/api/blockchain-status', {
        method: 'GET',
        headers: {Accept: 'application/json'},
        signal,
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok || !payload?.ok || !Array.isArray(payload.networks)) {
        throw new Error('BLOCKCHAIN_STATUS_UNAVAILABLE')
    }

    return payload.networks
}
