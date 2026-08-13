import {Contract, isAddress, parseUnits} from 'ethers'
import {CHAIN_METADATA} from '../../../../config/evmChains.js'
import {getInjectedBrowserProvider} from '../../../../services/web3/rpcProviderService.js'

const ERC20_ABI = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function decimals() view returns (uint8)',
]

const getChainMetadata = (chainId) => CHAIN_METADATA[Number(chainId)]

function parseDonationAmount(amount, decimals) {
    const value = String(amount).trim()
    if (!/^\d+(?:\.\d+)?$/u.test(value)) throw new Error('INVALID_AMOUNT')

    const parsed = parseUnits(value, decimals)
    if (parsed <= 0n) throw new Error('INVALID_AMOUNT')
    return parsed
}

export function validateDonation({token, amount, receiver}) {
    if (!token || !getChainMetadata(token.chainId)) throw new Error('UNSUPPORTED_NETWORK')
    if (!isAddress(receiver)) throw new Error('INVALID_RECEIVER')
    if (!Number.isInteger(token.decimals) || token.decimals < 0 || token.decimals > 255) {
        throw new Error('INVALID_TOKEN')
    }
    if (token.type !== 'native' && (token.type !== 'erc20' || !isAddress(token.contract))) {
        throw new Error('INVALID_TOKEN')
    }

    return {parsedAmount: parseDonationAmount(amount, token.decimals)}
}

export const switchNetwork = async (token) => {
    if (!window.ethereum) throw new Error('NO_PROVIDER')

    const metadata = getChainMetadata(token.chainId)
    if (!metadata || metadata.chainHex.toLowerCase() !== token.chainHex.toLowerCase()) {
        throw new Error('UNSUPPORTED_NETWORK')
    }

    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: metadata.chainHex}],
    })
}

export function getExplorerTransactionUrl(chainId, transactionHash) {
    const explorer = getChainMetadata(chainId)?.explorer
    return explorer && /^0x[\da-f]{64}$/iu.test(transactionHash)
        ? `${explorer}tx/${transactionHash}`
        : null
}

export const sendDonationTransaction = async ({token, amount, receiver, onStatus}) => {
    const {parsedAmount} = validateDonation({token, amount, receiver})
    onStatus?.('switching')
    await switchNetwork(token)

    const provider = getInjectedBrowserProvider()
    const network = await provider.getNetwork()
    if (network.chainId !== BigInt(token.chainId)) throw new Error('WRONG_NETWORK')

    const signer = await provider.getSigner()
    onStatus?.('signing')

    const transaction =
        token.type === 'native'
            ? await signer.sendTransaction({to: receiver, value: parsedAmount})
            : await new Contract(token.contract, ERC20_ABI, signer).transfer(receiver, parsedAmount)

    onStatus?.('confirming')
    const receipt = await transaction.wait(1)
    if (!receipt || receipt.status !== 1) throw new Error('TRANSACTION_FAILED')

    return {
        hash: transaction.hash,
        explorerUrl: getExplorerTransactionUrl(token.chainId, transaction.hash),
    }
}

export const importCustomErc20Token = async ({chainHex, contractAddress}) => {
    if (!window.ethereum) throw new Error('NO_PROVIDER')
    if (!isAddress(contractAddress)) throw new Error('INVALID_TOKEN_ADDRESS')

    const chain = Object.entries(CHAIN_METADATA).find(
        ([, metadata]) => metadata.chainHex.toLowerCase() === chainHex.toLowerCase()
    )
    if (!chain) throw new Error('UNSUPPORTED_NETWORK')

    const [chainId, metadata] = chain
    const tokenForSwitch = {chainId: BigInt(chainId), chainHex: metadata.chainHex}
    await switchNetwork(tokenForSwitch)

    const provider = getInjectedBrowserProvider()
    const network = await provider.getNetwork()
    if (network.chainId !== BigInt(chainId)) throw new Error('WRONG_NETWORK')

    const contract = new Contract(contractAddress, ERC20_ABI, provider)
    const [symbol, name, decimals] = await Promise.all([
        contract.symbol(),
        contract.name(),
        contract.decimals(),
    ])

    return {
        id: `custom-${chainId}-${contractAddress.toLowerCase()}`,
        chainId: BigInt(chainId),
        chainHex: metadata.chainHex,
        networkName: metadata.name,
        symbol,
        name,
        type: 'erc20',
        decimals: Number(decimals),
        contract: contractAddress,
        explorer: metadata.explorer,
        custom: true,
    }
}
