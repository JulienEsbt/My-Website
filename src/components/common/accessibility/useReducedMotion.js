import useMediaQuery from './useMediaQuery.js'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY)

export default useReducedMotion
