// MAIN
import ME from '../assets/main/Me.png'
import ME2 from '../assets/main/Me2.jpg'
import T1 from '../assets/main/T1.jpg'

import MEGALIS from '../assets/main/Megalis.png'
import FFNN from '../assets/main/FFNN.png'
import WAVE from '../assets/main/Wave.png'

import FLY from '../assets/main/Fly.jpg'
import HELICO from '../assets/main/Helico.jpg'
import SHUTTLE from '../assets/main/Shuttle.jpg'
import SPACEX from '../assets/main/SpaceX.jpg'
import CRYPTO from '../assets/main/Crypto.jpeg'

import CV from '../assets/main/cv.pdf'

// CRYPTO
import ETH from '../assets/crypto/ETH.jpeg'
import NFT1 from '../assets/crypto/NFT1.png'
import NFT2 from '../assets/crypto/NFT2.png'

export const ASSETS = {
    main: {
        header: {me: ME},
        about: {photo: ME2},
        portfolio: {megalis: MEGALIS, ffnn: FFNN, wave: WAVE},
        goals: {fly: FLY, helico: HELICO, shuttle: SHUTTLE, spacex: SPACEX, crypto: CRYPTO},
        cv: CV
    },
    crypto: {
        header: {nft1: NFT1},
        about: {nft2: NFT2},
        donation: {eth: ETH}
    }
}