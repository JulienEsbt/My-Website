// MAIN
import ME from '../assets/images/home/header/Me.jpeg'
import ME2 from '../assets/images/home/about/D14F4D37-8AEF-4E9D-8CAE-DEDE412C2D64_1_105_c.jpeg'

import MEGALIS from '../assets/images/home/portfolio/Megalis.png'
import FFNN from '../assets/images/home/portfolio/FFNN.png'
import WAVE from '../assets/images/home/portfolio/Wave.png'

import CV from '../assets/documents/cv.pdf'

// WEB3
import NFT1 from '../assets/images/web3/NFT1.png'
import NFT2 from '../assets/images/web3/NFT2.png'

const SOULWARE_CONTRACT = '0x6d9E65c3E51837171eeBBB4c11808bb9c2Ea9353'

export const ASSETS = {
    home: {
        header: {me: ME},
        about: {photo: ME2},
        portfolio: {megalis: MEGALIS, ffnn: FFNN, wave: WAVE},
        cv: CV,
    },

    web3: {
        nfts: {
            soulware2173: {
                id: 'soulware-2173',
                name: 'Soulware #2173',
                collection: 'Soulware Project',
                image: NFT1,
                chain: 'Ethereum',
                standard: 'ERC-721',
                contractAddress: SOULWARE_CONTRACT,
                tokenId: '2173',
                rarity: '#1,377',
                etherscanUrl: `https://etherscan.io/nft/${SOULWARE_CONTRACT}/2173`,
                openseaUrl: `https://opensea.io/item/ethereum/${SOULWARE_CONTRACT}/2173`,
            },

            soulware723: {
                id: 'soulware-723',
                name: 'Soulware #723',
                collection: 'Soulware Project',
                image: NFT2,
                chain: 'Ethereum',
                standard: 'ERC-721',
                contractAddress: SOULWARE_CONTRACT,
                tokenId: '723',
                rarity: '#628',
                etherscanUrl: `https://etherscan.io/nft/${SOULWARE_CONTRACT}/723`,
                openseaUrl: `https://opensea.io/item/ethereum/${SOULWARE_CONTRACT}/723`,
            },
        },

        header: {nft1: NFT1},
        about: {nft2: NFT2},
    },
}