import travelManifest from '../generated/media/travels.json'
import {createMediaResolver} from './media.js'

export const getTravelMedia = createMediaResolver(travelManifest, 'travels')
