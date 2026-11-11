import onChainCover from '../assets/images/projects/onchain/document-timestamp.svg'
import {WEBSITE_COVER} from './websiteMedia.js'
import {OPENDENTE_COVER} from './opendenteMedia.js'
import {BRUNO_GALLERY} from './brunoGallery.js'
import cvFr from '../assets/documents/Julien-Esterbet-CV-FR-2026.pdf'
import resumeEn from '../assets/documents/Julien-Esterbet-Resume-EN-2026.pdf'
import {getHomeMedia} from './homeMedia.js'
import {HOME_THUMBNAILS} from './homeThumbnails.js'

const portrait = getHomeMedia('header/Me.jpeg')

export const HOME_ASSETS = {
    header: {
        me: {
            ...portrait,
            variants: [...HOME_THUMBNAILS.portrait.variants, ...portrait.variants],
        },
    },
    about: {
        photo: getHomeMedia('about/D14F4D37-8AEF-4E9D-8CAE-DEDE412C2D64_1_105_c.jpeg'),
    },
    portfolio: {
        openDente: OPENDENTE_COVER,
        brunoPizza: BRUNO_GALLERY[0],
        myWebsite: WEBSITE_COVER,
        megalis: onChainCover,
    },
    resume: {
        fr: cvFr,
        en: resumeEn,
    },
}
