import {useEffect, useState} from 'react'

const getMatch = (query) =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query).matches
        : false

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => getMatch(query))

    useEffect(() => {
        const mediaQuery = window.matchMedia?.(query)
        if (!mediaQuery) return undefined

        const updateMatch = () => setMatches(mediaQuery.matches)
        updateMatch()
        mediaQuery.addEventListener('change', updateMatch)

        return () => mediaQuery.removeEventListener('change', updateMatch)
    }, [query])

    return matches
}

export default useMediaQuery
