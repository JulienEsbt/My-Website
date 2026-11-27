import tripSummaries from './tripSummaries.js'
import tripStories from './tripStories.js'

export default tripSummaries.map((trip) => ({...trip, ...tripStories[trip.id]}))
