import {getWeb3Media} from './web3Media.js'

const SOULWARE_CONTRACT = '0x6d9E65c3E51837171eeBBB4c11808bb9c2Ea9353'

const soulware2173 = {
    id: 'soulware-2173',
    name: 'Soulware #2173',
    collection: 'Soulware Project',
    image: getWeb3Media('NFT1.png'),
    chain: 'Ethereum',
    standard: 'ERC-721',
    contractAddress: SOULWARE_CONTRACT,
    tokenId: '2173',
    rarity: '#1,377',
    etherscanUrl: `https://etherscan.io/nft/${SOULWARE_CONTRACT}/2173`,
    openseaUrl: `https://opensea.io/item/ethereum/${SOULWARE_CONTRACT}/2173`,
}

const soulware723 = {
    id: 'soulware-723',
    name: 'Soulware #723',
    collection: 'Soulware Project',
    image: getWeb3Media('NFT2.png'),
    chain: 'Ethereum',
    standard: 'ERC-721',
    contractAddress: SOULWARE_CONTRACT,
    tokenId: '723',
    rarity: '#628',
    etherscanUrl: `https://etherscan.io/nft/${SOULWARE_CONTRACT}/723`,
    openseaUrl: `https://opensea.io/item/ethereum/${SOULWARE_CONTRACT}/723`,
}

export const WEB3_ASSETS = {
    nfts: {soulware2173, soulware723},
    header: {nft1: soulware2173.image},
    about: {nft2: soulware723.image},
}
