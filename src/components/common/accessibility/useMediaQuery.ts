import {useEffect, useState} from 'react'

const getMatch = (query: string): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query).matches
        : false

const useMediaQuery = (query: string): boolean => {
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
