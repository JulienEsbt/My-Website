import albumManifest from '../../../../generated/media/travels/saint-barth-2023.json'
import {createMediaResolver} from '../../../../config/media.js'

const getTravelMedia = createMediaResolver(albumManifest, 'travels')

const img8563 = getTravelMedia('saint-barth-2023/IMG_8563.jpeg')
const img8573 = getTravelMedia('saint-barth-2023/IMG_8573.jpeg')
const img8579 = getTravelMedia('saint-barth-2023/IMG_8579.jpeg')
const img8595 = getTravelMedia('saint-barth-2023/IMG_8595.jpeg')
const img8650 = getTravelMedia('saint-barth-2023/IMG_8650.jpeg')
const img8653 = getTravelMedia('saint-barth-2023/IMG_8653.jpeg')
const img1101 = getTravelMedia('saint-barth-2023/IMG_1101.jpeg')
const img1125 = getTravelMedia('saint-barth-2023/IMG_1125.jpeg')
const img1145 = getTravelMedia('saint-barth-2023/IMG_1145.jpeg')
const saintBarth2023Photos = [
    {src: img8563},
    {src: img8573},
    {src: img8579},
    {src: img8595},
    {src: img8650},
    {src: img8653},
    {src: img1101},
    {src: img1125},
    {src: img1145},
]

export default saintBarth2023Photos