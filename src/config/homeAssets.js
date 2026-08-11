import cvFr from '../assets/documents/Julien-Esterbet-CV-FR-2026.pdf'
import resumeEn from '../assets/documents/Julien-Esterbet-Resume-EN-2026.pdf'
import {getHomeMedia} from './homeMedia.js'

export const HOME_ASSETS = {
    header: {
        me: getHomeMedia('header/Me.jpeg'),
    },
    about: {
        photo: getHomeMedia('about/D14F4D37-8AEF-4E9D-8CAE-DEDE412C2D64_1_105_c.jpeg'),
    },
    portfolio: {
        brunoPizza: getHomeMedia('portfolio/BrunoPizza.png'),
        myWebsite: getHomeMedia('portfolio/MyWebsite.png'),
        megalis: getHomeMedia('portfolio/Megalis.png'),
    },
    resume: {
        fr: cvFr,
        en: resumeEn,
    },
}
