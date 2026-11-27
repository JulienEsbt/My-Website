import {createMediaResolver} from './media.js'
import tripSummaries from '../data/travel/tripSummaries.js'
import covers from 'virtual:travel-highlight-media'

const resolveCover = createMediaResolver(
    covers.map(({media}) => media),
    'travels'
)

export const travelHighlights = covers.map(({tripId, relativeSource, photoPosition}) => ({
    ...tripSummaries.find(({id}) => id === tripId),
    photoPosition,
    photo: resolveCover(relativeSource),
}))
