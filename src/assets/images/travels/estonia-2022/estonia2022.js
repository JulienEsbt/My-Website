import albumManifest from '../../../../generated/media/travels/estonia-2022.json'
import {createMediaResolver} from '../../../../config/media.js'

const getTravelMedia = createMediaResolver(albumManifest, 'travels')

const img1980 = getTravelMedia('estonia-2022/IMG_1980.jpeg')
const img1981 = getTravelMedia('estonia-2022/IMG_1981.jpeg')
const img2307 = getTravelMedia('estonia-2022/IMG_2307.JPG')
const rg9436 = getTravelMedia('estonia-2022/_RG_9436.jpg')
const rg9641 = getTravelMedia('estonia-2022/_RG_9641.jpg')
const img1995 = getTravelMedia('estonia-2022/IMG_1995.jpeg')
const img2014 = getTravelMedia('estonia-2022/IMG_2014.jpeg')
const img2199 = getTravelMedia('estonia-2022/IMG_2199.jpeg')
const img2019 = getTravelMedia('estonia-2022/IMG_2019.JPG')
const img2031 = getTravelMedia('estonia-2022/IMG_2031.jpeg')
const img2043 = getTravelMedia('estonia-2022/IMG_2043.jpeg')
const img2045 = getTravelMedia('estonia-2022/IMG_2045.jpeg')
const img2049 = getTravelMedia('estonia-2022/IMG_2049.jpeg')
const estonia2022Photos = [
    {src: img1980},
    {src: img1981},
    {src: img2307},
    {src: rg9436},
    {src: rg9641},
    {src: img1995},
    {src: img2014},
    {src: img2199},
    {src: img2019},
    {src: img2031},
    {src: img2043},
    {src: img2045},
    {src: img2049},
]

export default estonia2022Photos