import homeManifest from '../generated/media/home.json'
import {createMediaResolver} from './media.js'

export const getHomeMedia = createMediaResolver(homeManifest, 'home')
