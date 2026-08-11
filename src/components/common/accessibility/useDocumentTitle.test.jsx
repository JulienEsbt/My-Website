import {renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import useDocumentTitle from './useDocumentTitle.js'

describe('useDocumentTitle', () => {
    it('updates the document title when the localized title changes', () => {
        const {rerender} = renderHook(({title}) => useDocumentTitle(title), {
            initialProps: {title: 'Voyages — Julien Esterbet'},
        })

        expect(document.title).toBe('Voyages — Julien Esterbet')

        rerender({title: 'Travel — Julien Esterbet'})
        expect(document.title).toBe('Travel — Julien Esterbet')
    })
})
