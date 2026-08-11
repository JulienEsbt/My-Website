const albumLoaders = Object.freeze({
    'england-2017': () =>
        import('../../assets/images/travels/england-2017/england2017.js'),
    'croatia-2021': () =>
        import('../../assets/images/travels/croatia-2021/croatia2021.js'),
    'germany-2022': () =>
        import('../../assets/images/travels/germany-2022/germany2022.js'),
    'estonia-2022': () =>
        import('../../assets/images/travels/estonia-2022/estonia2022.js'),
    'spain-madrid-2023': () =>
        import('../../assets/images/travels/spain-madrid-2023/spainMadrid2023.js'),
    'saint-martin-2023': () =>
        import('../../assets/images/travels/saint-martin-2023/saintMartin2023.js'),
    'saint-barth-2023': () =>
        import('../../assets/images/travels/saint-barth-2023/saintBarth2023.js'),
    'hungary-2023': () =>
        import('../../assets/images/travels/hungary-2023/hungary2023.js'),
    'italy-2023': () => import('../../assets/images/travels/italy-2023/italy2023.js'),
    'austria-2023': () => import('../../assets/images/travels/austria-2023/austria2023.js'),
    'spain-barcelona-2024': () =>
        import('../../assets/images/travels/spain-barcelona-2024/spainBarcelona2024.js'),
    'portugal-2025': () =>
        import('../../assets/images/travels/portugal-2025/portugal2025.js'),
    'hungary-2025': () =>
        import('../../assets/images/travels/hungary-2025/hungary2025.js'),
    'slovakia-2025': () =>
        import('../../assets/images/travels/slovakia-2025/slovakia2025.js'),
    'czechia-2025': () => import('../../assets/images/travels/czechia-2025/czechia2025.js'),
    'north-macedonia-2025': () =>
        import('../../assets/images/travels/north-macedonia-2025/northMacedonia2025.js'),
    'guadeloupe-2025': () =>
        import('../../assets/images/travels/guadeloupe-2025/guadeloupe2025.js'),
    'belgium-2025': () => import('../../assets/images/travels/belgium-2025/belgium2025.js'),
})

const albumPromises = new Map()

export function loadTripPhotos(albumId) {
    const loader = albumLoaders[albumId]
    if (!loader) return Promise.resolve([])

    if (!albumPromises.has(albumId)) {
        albumPromises.set(
            albumId,
            loader().then((module) => module.default)
        )
    }

    return albumPromises.get(albumId)
}
