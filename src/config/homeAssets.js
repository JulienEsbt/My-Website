import CV from '../assets/documents/cv.pdf'
import {getHomeMedia} from './homeMedia.js'

export const HOME_ASSETS = {
    header: {
        me: getHomeMedia('header/Me.jpeg'),
    },
    about: {
        photo: getHomeMedia('about/D14F4D37-8AEF-4E9D-8CAE-DEDE412C2D64_1_105_c.jpeg'),
    },
    portfolio: {
        megalis: getHomeMedia('portfolio/Megalis.png'),
        ffnn: getHomeMedia('portfolio/FFNN.png'),
        wave: getHomeMedia('portfolio/Wave.png'),
    },
    cv: CV,
}
