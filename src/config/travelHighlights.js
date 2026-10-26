import {createMediaResolver} from './media.js'
import trips from '../data/travel/trips.js'
import portugal from '../generated/media/travels/portugal-2025.json'
import guadeloupe from '../generated/media/travels/guadeloupe-2025.json'
import italy from '../generated/media/travels/italy-2023.json'
import austria from '../generated/media/travels/austria-2023.json'
import saintMartin from '../generated/media/travels/saint-martin-2023.json'
import estonia from '../generated/media/travels/estonia-2022.json'

export const travelHighlights = [
    ['portugal-2025', portugal, 'IMG_1949.jpeg', '50% 55%'],
    ['guadeloupe-2025', guadeloupe, 'IMG_1682.jpeg', '50% 66%'],
    ['italy-2023', italy, 'IMG_8723.jpeg', '50% 48%'],
    ['austria-2023', austria, 'IMG_2908.jpeg', '50% 52%'],
    ['saint-martin-2023', saintMartin, 'IMG_1808.jpeg', '50% 55%'],
    ['estonia-2022', estonia, 'IMG_2043.jpeg', '50% 55%'],
].map(([id, manifest, filename, photoPosition]) => ({
    ...trips.find((trip) => trip.id === id),
    photoPosition,
    photo: createMediaResolver(manifest, 'travels')(`${id}/${filename}`),
}))
