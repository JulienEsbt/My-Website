// @ts-check

/** @satisfies {readonly import('../../types/domain').EditorialEntry[]} */
const reflections = [
    {
        id: 'charte-de-pensee-2025-05-11',
        slug: 'charte-de-pensee',
        title: {fr: 'Charte de pensée', en: 'Charter of thought'},
        category: 'philosophy',
        featured: true,
        readingTime: 10,
        date: '2025-05-11',
        excerpt: {
            fr: 'Un texte personnel entre philosophie, poésie, responsabilité, révolte, amour, doute et désir de lucidité.',
            en: 'A personal text between philosophy, poetry, responsibility, revolt, love, doubt and the desire for lucidity.',
        },
    },
    {
        id: 'verite-liberte-construction-de-soi-2025-06-15',
        slug: 'verite-liberte-construction-de-soi',
        category: 'philosophy',
        date: '2025-06-15',
        readingTime: 6,
        featured: false,
        title: {
            fr: 'Vérité, liberté et construction de soi',
            en: 'Truth, freedom and self-construction',
        },
        excerpt: {
            fr: 'Une réflexion personnelle sur le doute, les déterminismes, la vérité, la responsabilité individuelle et la manière dont nous nous construisons.',
            en: 'A personal reflection on doubt, determinisms, truth, individual responsibility and the way we build ourselves.',
        },
    },
    {
        id: 'mefiance-opposition-simple-2026-01-11',
        slug: 'mefiance-opposition-simple',
        category: 'philosophy',
        date: '2026-02-02',
        readingTime: 15,
        featured: false,
        title: {fr: 'Se méfier des oppositions simples', en: 'Being wary of simple oppositions'},
        excerpt: {
            fr: 'Une réflexion personnelle sur notre tendance à simplifier le réel, les oppositions binaires, la responsabilité, le déterminisme et la difficulté de comprendre sans excuser.',
            en: 'A personal reflection on our tendency to simplify reality, binary oppositions, responsibility, determinism and the difficulty of understanding without excusing.',
        },
    },
]

export default reflections
