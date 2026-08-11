import {describe, expect, it} from 'vitest'
import {formatCurrency, formatDate, formatNumber, formatPercent} from './formatters.js'

describe('localized formatters', () => {
    it('formats dates in the requested language', () => {
        expect(formatDate('2025-05-11', 'fr')).toBe('11 mai 2025')
        expect(formatDate('2025-05-11', 'en')).toBe('11 May 2025')
    })

    it('formats numbers, currencies and percentages with locale-aware separators', () => {
        expect(formatNumber(1234.5, 'fr')).toContain('1 234,5')
        expect(formatNumber(1234.5, 'en')).toBe('1,234.5')
        expect(formatCurrency(42.5, 'fr')).toContain('42,50')
        expect(formatCurrency(42.5, 'en')).toContain('42.50')
        expect(formatPercent(12.5, 'fr')).toBe('12,5 %')
        expect(formatPercent(12.5, 'en')).toBe('12.5%')
    })
})
