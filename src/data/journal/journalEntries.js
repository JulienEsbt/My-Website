import reflections from '../reflections/reflections.js'
import trips from '../travel/trips.js'

const projectEntries = [
    {
        id: 'portfolio-v2-2026-08-16',
        category: 'project',
        date: '2026-08-16',
        title: {
            fr: 'Portfolio V2 : une expérience plus stable et plus éditoriale',
            en: 'Portfolio V2: a more stable and editorial experience',
        },
        excerpt: {
            fr: 'Une mise à jour consacrée à la lisibilité, l’accessibilité, aux études de cas, aux labs Web3 et aux carnets de voyage.',
            en: 'An update focused on readability, accessibility, case studies, Web3 labs and travel journals.',
        },
        href: '/projects/my-website',
    },
]

// Explicit publication records preserve history when later trips are added.
// The source gives June 2026, not an exact day; keep month precision.
const travelPublications = [
    {
        tripId: 'croatia-2026',
        date: '2026-06-01',
        datePrecision: 'month',
        feedId: '/travel#timeline',
    },
]
const travelEntries = travelPublications.map(({tripId, date, datePrecision, feedId}) => {
    const trip = trips.find(({id}) => id === tripId)
    if (!trip) throw new Error(`Unknown journal trip: ${tripId}`)
    return {
        id: `travel-${trip.id}`,
        category: 'travel',
        date,
        datePrecision,
        feedId,
        title: {fr: trip.city, en: trip.cityEn ?? trip.city},
        excerpt: {fr: trip.description, en: trip.descriptionEn ?? trip.description},
        href: `/travel?trip=${encodeURIComponent(trip.id)}#stories`,
    }
})

const reflectionEntries = reflections.map((reflection) => ({
    id: `reflection-${reflection.id}`,
    category: 'reflection',
    date: reflection.date,
    title: reflection.title,
    excerpt: reflection.excerpt,
    href: `/reflections/${reflection.slug}`,
}))

const journalEntries = [...projectEntries, ...travelEntries, ...reflectionEntries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
)

export default journalEntries
