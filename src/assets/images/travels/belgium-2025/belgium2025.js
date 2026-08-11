import albumManifest from '../../../../generated/media/travels/belgium-2025.json'
import {createMediaResolver} from '../../../../config/media.js'

const getTravelMedia = createMediaResolver(albumManifest, 'travels')

const img1309 = getTravelMedia('belgium-2025/IMG_1309.jpeg')
const img1317 = getTravelMedia('belgium-2025/IMG_1317.jpeg')
const img1333 = getTravelMedia('belgium-2025/IMG_1333.jpeg')
const img1349 = getTravelMedia('belgium-2025/IMG_1349.jpeg')
const img1362 = getTravelMedia('belgium-2025/IMG_1362.jpeg')
const img1371 = getTravelMedia('belgium-2025/IMG_1371.jpeg')
const img1406 = getTravelMedia('belgium-2025/IMG_1406.jpeg')
const img1407 = getTravelMedia('belgium-2025/IMG_1407.jpeg')
const img1430 = getTravelMedia('belgium-2025/IMG_1430.jpeg')
const img1455 = getTravelMedia('belgium-2025/IMG_1455.jpeg')
const img1459 = getTravelMedia('belgium-2025/IMG_1459.jpeg')
const img1462 = getTravelMedia('belgium-2025/IMG_1462.jpeg')
const img122f1a79 = getTravelMedia('belgium-2025/122f1a79-aad5-4d8d-800d-67efe42c81b5.jpg')
const img1f676ff8 = getTravelMedia('belgium-2025/1f676ff8-3097-42e4-95c0-f74204a20c51.jpg')
const img8045b88f = getTravelMedia('belgium-2025/8045b88f-04de-4409-a129-1b8fedbbfa8d.jpg')
const img0dd40fba = getTravelMedia('belgium-2025/0dd40fba-af49-4274-9e0a-6476843f5cbb.jpg')
const belgium2025Photos = [
    {src: img1309},
    {src: img1317},
    {src: img1333},
    {src: img1349},

    {src: img1362},
    {src: img1f676ff8},
    {src: img8045b88f},
    {src: img0dd40fba},
    {src: img1371},

    {src: img1406},
    {src: img1407},

    {src: img1430},

    {src: img1455},
    {src: img1459},
    {src: img1462},

    {src: img122f1a79},
]

export default belgium2025Photos