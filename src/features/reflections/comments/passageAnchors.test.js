import {describe, it, expect} from 'vitest'
import {findPassage} from './passageAnchors.js'

describe('passage anchors', () => {
    it('matches a passage across inline markup without editing the DOM', () => {
        const root = document.createElement('div')
        root.innerHTML = '<p>Lire <strong>et comprendre</strong> ensemble.</p>'
        expect(
            findPassage(root, {quote: 'Lire et comprendre', suffix: ' ensemble.'}).toString()
        ).toBe('Lire et comprendre')
        expect(root.querySelector('strong').textContent).toBe('et comprendre')
    })
    it('uses context to distinguish repeated quotes and refuses ambiguous matches', () => {
        const root = document.createElement('div')
        root.textContent = 'Avant : liberté. Ensuite : liberté.'
        expect(findPassage(root, {quote: 'liberté'})).toBeNull()
        const range = findPassage(root, {quote: 'liberté', prefix: 'Ensuite : '})
        expect(range.startOffset).toBe(27)
    })
    it('keeps edited passages unattached rather than moving their comments', () => {
        const root = document.createElement('div')
        root.textContent = 'Un texte révisé.'
        expect(findPassage(root, {quote: 'ancien texte', prefix: 'Un '})).toBeNull()
    })
})
