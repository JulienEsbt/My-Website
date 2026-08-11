import albumManifest from '../../../../generated/media/travels/croatia-2021.json'
import {createMediaResolver} from '../../../../config/media.js'

const getTravelMedia = createMediaResolver(albumManifest, 'travels')

const img7060 = getTravelMedia('croatia-2021/IMG_7060.jpeg')
const img7069 = getTravelMedia('croatia-2021/IMG_7069.jpeg')
const img7088 = getTravelMedia('croatia-2021/IMG_7088.jpeg')
const img7105 = getTravelMedia('croatia-2021/IMG_7105.jpeg')
const img7156 = getTravelMedia('croatia-2021/IMG_7156.jpeg')
const img7157 = getTravelMedia('croatia-2021/IMG_7157.jpeg')
const img7190 = getTravelMedia('croatia-2021/IMG_7190.jpeg')
const img7197 = getTravelMedia('croatia-2021/IMG_7197.jpeg')
const img7345 = getTravelMedia('croatia-2021/IMG_7345.jpeg')
const img7355 = getTravelMedia('croatia-2021/IMG_7355.jpeg')
const img7422 = getTravelMedia('croatia-2021/IMG_7422.jpeg')
const img7424 = getTravelMedia('croatia-2021/IMG_7424.jpeg')
const img7440 = getTravelMedia('croatia-2021/IMG_7440.jpeg')
const img7445 = getTravelMedia('croatia-2021/IMG_7445.jpeg')
const croatia2021Photos = [
    {src: img7060},
    {src: img7069},
    {src: img7088},
    {src: img7105},
    {src: img7156},
    {src: img7157},
    {src: img7190},
    {src: img7197},
    {src: img7345},
    {src: img7355},
    {src: img7422},
    {src: img7424},
    {src: img7440},
    {src: img7445},
]

export default croatia2021Photos