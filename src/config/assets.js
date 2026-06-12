// MAIN
import ME from '../assets/images/home/Me.png'
import ME2 from '../assets/images/home/Me2.jpg'

import MEGALIS from '../assets/images/home/Megalis.png'
import FFNN from '../assets/images/home/FFNN.png'
import WAVE from '../assets/images/home/Wave.png'

import FLY from '../assets/images/home/Fly.jpg'
import HELICO from '../assets/images/home/Helico.jpg'
import SHUTTLE from '../assets/images/home/Shuttle.jpg'
import SPACEX from '../assets/images/home/SpaceX.jpg'
import CRYPTO from '../assets/images/home/Crypto.jpg'

import CV from '../assets/documents/cv.pdf'

// CRYPTO
import ETH from '../assets/images/web3/ETH.jpeg'
import NFT1 from '../assets/images/web3/NFT1.png'
import NFT2 from '../assets/images/web3/NFT2.png'

export const ASSETS = {
    home: {
        header: {me: ME},
        about: {photo: ME2},
        portfolio: {megalis: MEGALIS, ffnn: FFNN, wave: WAVE},
        goals: {fly: FLY, helico: HELICO, shuttle: SHUTTLE, spacex: SPACEX, crypto: CRYPTO},
        cv: CV
    },
    web3: {
        header: {nft1: NFT1},
        about: {nft2: NFT2},
        donation: {eth: ETH}
    }
}