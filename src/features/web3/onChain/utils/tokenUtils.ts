import {Contract, isAddress, parseUnits} from 'ethers'
import {CHAIN_METADATA} from '../../../../config/evmChains.js'
import {getInjectedBrowserProvider} from '../../../../services/web3/rpcProviderService.js'
import type {DonationToken} from '../../../../types/web3'

const ERC20_ABI = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function decimals() view returns (uint8)',
]
type TransactionStatus = 'switching' | 'signing' | 'confirming'
const getChainMetadata = (chainId: bigint) =>
    CHAIN_METADATA[Number(chainId) as keyof typeof CHAIN_METADATA]

function parseDonationAmount(amount: string | number, decimals: number): bigint {
    const value = String(amount).trim()
    if (!/^\d+(?:\.\d+)?$/u.test(value)) throw new Error('INVALID_AMOUNT')
    const parsed = parseUnits(value, decimals)
    if (parsed <= 0n) throw new Error('INVALID_AMOUNT')
    return parsed
}

export function validateDonation({
    token,
    amount,
    receiver,
}: {
    token: DonationToken
    amount: string | number
    receiver: string
}) {
    if (!getChainMetadata(token.chainId)) throw new Error('UNSUPPORTED_NETWORK')
    if (!isAddress(receiver)) throw new Error('INVALID_RECEIVER')
    if (!Number.isInteger(token.decimals) || token.decimals < 0 || token.decimals > 255)
        throw new Error('INVALID_TOKEN')
    if (token.type === 'erc20' && !isAddress(token.contract ?? '')) throw new Error('INVALID_TOKEN')
    return {parsedAmount: parseDonationAmount(amount, token.decimals)}
}

export async function switchNetwork(
    token: Pick<DonationToken, 'chainId' | 'chainHex'>
): Promise<void> {
    if (!window.ethereum) throw new Error('NO_PROVIDER')
    const metadata = getChainMetadata(token.chainId)
    if (!metadata || metadata.chainHex.toLowerCase() !== token.chainHex.toLowerCase())
        throw new Error('UNSUPPORTED_NETWORK')
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: metadata.chainHex}],
    })
}

export function getExplorerTransactionUrl(chainId: bigint, transactionHash: string): string | null {
    const explorer = getChainMetadata(chainId)?.explorer
    return explorer && /^0x[\da-f]{64}$/iu.test(transactionHash)
        ? `${explorer}tx/${transactionHash}`
        : null
}

export async function sendDonationTransaction({
    token,
    amount,
    receiver,
    onStatus,
}: {
    token: DonationToken
    amount: string | number
    receiver: string
    onStatus?: (status: TransactionStatus) => void
}) {
    const {parsedAmount} = validateDonation({token, amount, receiver})
    onStatus?.('switching')
    await switchNetwork(token)
    const provider = getInjectedBrowserProvider()
    const network = await provider.getNetwork()
    if (network.chainId !== token.chainId) throw new Error('WRONG_NETWORK')
    const signer = await provider.getSigner()
    onStatus?.('signing')
    const transaction =
        token.type === 'native'
            ? await signer.sendTransaction({to: receiver, value: parsedAmount})
            : await new Contract(token.contract!, ERC20_ABI, signer).getFunction('transfer')(
                  receiver,
                  parsedAmount
              )
    onStatus?.('confirming')
    const receipt = await transaction.wait(1)
    if (!receipt || receipt.status !== 1) throw new Error('TRANSACTION_FAILED')
    return {
        hash: transaction.hash,
        explorerUrl: getExplorerTransactionUrl(token.chainId, transaction.hash),
    }
}

export async function importCustomErc20Token({
    chainHex,
    contractAddress,
}: {
    chainHex: string
    contractAddress: string
}): Promise<DonationToken> {
    if (!window.ethereum) throw new Error('NO_PROVIDER')
    if (!isAddress(contractAddress)) throw new Error('INVALID_TOKEN_ADDRESS')
    const chain = Object.entries(CHAIN_METADATA).find(
        ([, metadata]) => metadata.chainHex.toLowerCase() === chainHex.toLowerCase()
    )
    if (!chain) throw new Error('UNSUPPORTED_NETWORK')
    const [chainId, metadata] = chain
    await switchNetwork({chainId: BigInt(chainId), chainHex: metadata.chainHex})
    const provider = getInjectedBrowserProvider()
    const network = await provider.getNetwork()
    if (network.chainId !== BigInt(chainId)) throw new Error('WRONG_NETWORK')
    const contract = new Contract(contractAddress, ERC20_ABI, provider)
    const [symbol, name, decimals] = await Promise.all([
        contract.getFunction('symbol')(),
        contract.getFunction('name')(),
        contract.getFunction('decimals')(),
    ])
    return {
        id: `custom-${chainId}-${contractAddress.toLowerCase()}`,
        chainId: BigInt(chainId),
        chainHex: metadata.chainHex,
        networkName: metadata.name,
        symbol: String(symbol),
        name: String(name),
        type: 'erc20',
        decimals: Number(decimals),
        contract: contractAddress,
        explorer: metadata.explorer,
        custom: true,
    }
}
