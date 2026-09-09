import {readFileSync, readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {expect, it} from 'vitest'
import reflections from './reflections.js'
import journalEntries from '../journal/journalEntries.js'

it('keeps a unique, bilingual article catalog with valid publication metadata and matching MDX files', () => {
    const directory = resolve('src/content/reflections')
    expect(new Set(reflections.map((x) => x.slug)).size).toBe(reflections.length)
    expect(new Set(reflections.map((x) => x.id)).size).toBe(reflections.length)
    const expected = []
    for (const article of reflections) {
        expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        expect(new Date(article.date).toISOString().slice(0, 10)).toBe(article.date)
        expect(article.readingTime).toBeGreaterThan(0)
        expect(['philosophy', 'politics', 'society', 'technology']).toContain(article.category)
        for (const language of ['fr', 'en']) {
            expect(article.title[language].trim()).not.toBe('')
            expect(article.excerpt[language].trim()).not.toBe('')
            const filename = `${article.slug}.${language}.mdx`
            expected.push(filename)
            expect(readFileSync(resolve(directory, filename), 'utf8').length).toBeGreaterThan(200)
        }
    }
    expect(
        readdirSync(directory)
            .filter((x) => x.endsWith('.mdx'))
            .sort()
    ).toEqual(expected.sort())
    expect(new Set(journalEntries.map((x) => x.id)).size).toBe(journalEntries.length)
})
