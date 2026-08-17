import reflections from '../reflections/reflections.js'
import trips from '../travel/trips.js'

const latestTrip = [...trips]
    .filter((trip) => !trip.isPlanned)
    .sort((a, b) => b.sortOrder - a.sortOrder)[0]

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

const travelEntries = latestTrip
    ? [
          {
              id: `travel-${latestTrip.id}`,
              category: 'travel',
              date: `${latestTrip.year}-06-01`,
              datePrecision: 'month',
              title: {fr: latestTrip.city, en: latestTrip.cityEn ?? latestTrip.city},
              excerpt: {
                  fr: latestTrip.description,
                  en: latestTrip.descriptionEn ?? latestTrip.description,
              },
              href: '/travel#timeline',
          },
      ]
    : []

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
