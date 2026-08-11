import albumManifest from '../../../../generated/media/travels/germany-2022.json'
import {createMediaResolver} from '../../../../config/media.js'

const getTravelMedia = createMediaResolver(albumManifest, 'travels')

const img2083 = getTravelMedia('germany-2022/IMG_2083.jpeg')
const img2086 = getTravelMedia('germany-2022/IMG_2086.jpeg')
const img2093 = getTravelMedia('germany-2022/IMG_2093.jpeg')
const img2096 = getTravelMedia('germany-2022/IMG_2096.jpeg')
const img2097 = getTravelMedia('germany-2022/IMG_2097.jpeg')
const img2103 = getTravelMedia('germany-2022/IMG_2103.jpeg')
const img2105 = getTravelMedia('germany-2022/IMG_2105.jpeg')
const img2205 = getTravelMedia('germany-2022/IMG_2205.jpeg')
const img2107 = getTravelMedia('germany-2022/IMG_2107.jpeg')
const img2108 = getTravelMedia('germany-2022/IMG_2108.jpeg')
const img2114 = getTravelMedia('germany-2022/IMG_2114.jpeg')
const img2119 = getTravelMedia('germany-2022/IMG_2119.jpeg')
const img2131 = getTravelMedia('germany-2022/IMG_2131.jpeg')
const img2147 = getTravelMedia('germany-2022/IMG_2147.jpeg')
const img2166 = getTravelMedia('germany-2022/IMG_2166.jpeg')
const germany2022Photos = [
    {src: img2083},
    {src: img2086},
    {src: img2093},
    {src: img2096},
    {src: img2097},
    {src: img2103},
    {src: img2105},
    {src: img2205},
    {src: img2107},
    {src: img2108},
    {src: img2114},
    {src: img2119},
    {src: img2131},
    {src: img2147},
    {src: img2166},
]

export default germany2022Photos