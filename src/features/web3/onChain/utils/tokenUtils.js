import {BrowserProvider, Contract, isAddress, parseUnits} from 'ethers'

const ERC20_ABI = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function decimals() view returns (uint8)',
]

export const switchNetwork = async (token) => {
    if (!window.ethereum) throw new Error('NO_PROVIDER')

    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: token.chainHex}],
    })
}

export const sendDonationTransaction = async ({token, amount, receiver}) => {
    if (!window.ethereum) throw new Error('NO_PROVIDER')

    await switchNetwork(token)

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    if (token.type === 'native') {
        const tx = await signer.sendTransaction({
            to: receiver,
            value: parseUnits(String(amount), token.decimals),
        })

        return tx.hash
    }

    const contract = new Contract(token.contract, ERC20_ABI, signer)

    const tx = await contract.transfer(
        receiver,
        parseUnits(String(amount), token.decimals)
    )

    return tx.hash
}

export const importCustomErc20Token = async ({chainHex, contractAddress, chainName, explorer}) => {
    if (!window.ethereum) throw new Error('NO_PROVIDER')

    if (!isAddress(contractAddress)) {
        throw new Error('INVALID_TOKEN_ADDRESS')
    }

    const tokenForSwitch = {chainHex}
    await switchNetwork(tokenForSwitch)

    const provider = new BrowserProvider(window.ethereum)
    const contract = new Contract(contractAddress, ERC20_ABI, provider)

    const [symbol, name, decimals] = await Promise.all([
        contract.symbol(),
        contract.name(),
        contract.decimals(),
    ])

    const network = await provider.getNetwork()

    return {
        id: `custom-${network.chainId.toString()}-${contractAddress.toLowerCase()}`,
        chainId: network.chainId,
        chainHex,
        networkName: chainName || `Chain ${network.chainId.toString()}`,
        symbol,
        name,
        type: 'erc20',
        decimals: Number(decimals),
        contract: contractAddress,
        explorer: explorer || '',
        custom: true,
    }
}