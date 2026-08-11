import {renderHook} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import useReducedMotion, {REDUCED_MOTION_QUERY} from './useReducedMotion.js'

const originalMatchMedia = window.matchMedia

afterEach(() => {
    window.matchMedia = originalMatchMedia
})

describe('useReducedMotion', () => {
    it('reflects the system motion preference', () => {
        window.matchMedia = vi.fn((query) => ({
            matches: query === REDUCED_MOTION_QUERY,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }))

        const {result} = renderHook(() => useReducedMotion())

        expect(result.current).toBe(true)
        expect(window.matchMedia).toHaveBeenCalledWith(REDUCED_MOTION_QUERY)
    })
})
