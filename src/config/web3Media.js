import web3Manifest from '../generated/media/web3.json'
import {createMediaResolver} from './media.js'

export const getWeb3Media = createMediaResolver(web3Manifest, 'web3')
