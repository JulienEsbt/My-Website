import {readFileSync} from 'node:fs'
import {describe, it, expect} from 'vitest'
import authorNotes from './authorNotes.js'
import reflections from './reflections.js'

describe('published author notes integrity', () => {
    it('requires valid metadata, translations and existing stable passage anchors', () => {
        expect(new Set(authorNotes.map((note) => note.id)).size).toBe(authorNotes.length)
        for (const note of authorNotes) {
            expect(note.id).toMatch(/^[a-z0-9-]+$/)
            expect(reflections.some((entry) => entry.slug === note.slug)).toBe(true)
            expect(note.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            expect(new Date(note.date).toISOString().slice(0, 10)).toBe(note.date)
            expect(['clarification', 'nuance', 'revision', 'source', 'extension']).toContain(
                note.kind
            )
            expect(Object.keys(note.content).length).toBeGreaterThan(0)
            for (const [language, content] of Object.entries(note.content)) {
                expect(['fr', 'en']).toContain(language)
                expect(content.body.trim().length).toBeGreaterThan(0)
                if (note.targetId) {
                    expect(note.targetId).toMatch(/^[a-z0-9-]+$/)
                    expect(content.quote.trim().length).toBeGreaterThan(0)
                    const mdx = readFileSync(
                        new URL(
                            `../../content/reflections/${note.slug}.${language}.mdx`,
                            import.meta.url
                        ),
                        'utf8'
                    )
                    expect(mdx).toContain(`<Passage id="${note.targetId}">`)
                    expect(mdx.split(`<Passage id="${note.targetId}">`).length).toBe(2)
                }
            }
        }
    })
})
