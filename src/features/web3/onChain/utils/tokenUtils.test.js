import {beforeEach, describe, expect, it, vi} from 'vitest'

const {getNetwork, getSigner, sendTransaction, wait, transfer} = vi.hoisted(() => ({
    getNetwork: vi.fn(),
    getSigner: vi.fn(),
    sendTransaction: vi.fn(),
    wait: vi.fn(),
    transfer: vi.fn(),
}))

vi.mock('../../../../services/web3/rpcProviderService.js', () => ({
    getInjectedBrowserProvider: () => ({getNetwork, getSigner}),
}))

vi.mock('ethers', async (importOriginal) => {
    const original = await importOriginal()
    return {
        ...original,
        Contract: vi.fn(() => ({transfer})),
    }
})

import {getExplorerTransactionUrl, sendDonationTransaction, validateDonation} from './tokenUtils.js'

const receiver = '0x718a544638Fd113A58C1062E4b2E8a404b13D2eC'
const token = {
    chainId: 1n,
    chainHex: '0x1',
    symbol: 'ETH',
    type: 'native',
    decimals: 18,
}

describe('tokenUtils', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        window.ethereum = {request: vi.fn().mockResolvedValue(null)}
        getNetwork.mockResolvedValue({chainId: 1n})
        getSigner.mockResolvedValue({sendTransaction})
        wait.mockResolvedValue({status: 1})
        sendTransaction.mockResolvedValue({hash: `0x${'a'.repeat(64)}`, wait})
    })

    it('rejects unsupported networks, invalid receivers and invalid amounts before wallet access', () => {
        expect(() =>
            validateDonation({token: {...token, chainId: 999n}, amount: '1', receiver})
        ).toThrow('UNSUPPORTED_NETWORK')
        expect(() => validateDonation({token, amount: '1', receiver: 'invalid'})).toThrow(
            'INVALID_RECEIVER'
        )
        expect(() => validateDonation({token, amount: '-1', receiver})).toThrow('INVALID_AMOUNT')
        expect(window.ethereum.request).not.toHaveBeenCalled()
    })

    it('switches network, verifies it and waits for a successful receipt', async () => {
        const statuses = []
        const result = await sendDonationTransaction({
            token,
            amount: '0.01',
            receiver,
            onStatus: (status) => statuses.push(status),
        })

        expect(window.ethereum.request).toHaveBeenCalledWith({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x1'}],
        })
        expect(sendTransaction).toHaveBeenCalled()
        expect(wait).toHaveBeenCalledWith(1)
        expect(statuses).toEqual(['switching', 'signing', 'confirming'])
        expect(result.explorerUrl).toBe(`https://etherscan.io/tx/0x${'a'.repeat(64)}`)
    })

    it('rejects explorer links for unknown chains or malformed transaction hashes', () => {
        expect(getExplorerTransactionUrl(999n, `0x${'a'.repeat(64)}`)).toBeNull()
        expect(getExplorerTransactionUrl(1n, 'not-a-hash')).toBeNull()
    })

    it('does not report success when the receipt failed', async () => {
        wait.mockResolvedValue({status: 0})

        await expect(sendDonationTransaction({token, amount: '0.01', receiver})).rejects.toThrow(
            'TRANSACTION_FAILED'
        )
    })
})
