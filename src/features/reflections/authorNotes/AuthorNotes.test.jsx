import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {AuthorNotesProvider, ArticleNotes, Passage} from './AuthorNotes.jsx'

const base = {
    id: 'example',
    slug: 'example',
    date: '2026-09-12',
    kind: 'nuance',
    content: {fr: {body: 'Texte de test uniquement.'}},
}
const wrap = (children, notes = [base], language = 'fr') =>
    render(
        <AuthorNotesProvider slug="example" language={language} notes={notes}>
            {children}
        </AuthorNotesProvider>
    )

describe('author notes', () => {
    it('renders article notes with a stable link and a dated native disclosure', () => {
        const {container} = wrap(<ArticleNotes />)
        expect(container.querySelector('#author-note-example summary')).toHaveTextContent(
            'Note de l’auteur · Nuance'
        )
        expect(container.querySelector('time')).toHaveAttribute('datetime', '2026-09-12')
        expect(screen.getByText(base.content.fr.body)).toBeInTheDocument()
    })
    it('preserves the passage and distinguishes an earlier quoted version', () => {
        wrap(
            <Passage id="argument">
                <p>Nouvelle formulation.</p>
            </Passage>,
            [
                {
                    ...base,
                    targetId: 'argument',
                    content: {fr: {...base.content.fr, quote: 'Formulation originale.'}},
                },
            ]
        )
        expect(screen.getByText('Nouvelle formulation.')).toBeInTheDocument()
        expect(screen.getByText('Formulation originale.')).toBeInTheDocument()
        expect(
            screen.getByText('Cette note cite une version antérieure du passage.')
        ).toBeInTheDocument()
    })
    it('matches inline formatting and whitespace without flagging a false revision', () => {
        wrap(
            <Passage id="argument">
                <p>
                    Une <b>idée</b>.
                </p>
            </Passage>,
            [
                {
                    ...base,
                    targetId: 'argument',
                    content: {fr: {...base.content.fr, quote: 'Une idée.'}},
                },
            ]
        )
        expect(screen.queryByText(/version antérieure/)).not.toBeInTheDocument()
    })
    it('does not leak another language, article or unapproved notes', () => {
        const {container, rerender} = wrap(<ArticleNotes />, [base], 'en')
        expect(container).toBeEmptyDOMElement()
        rerender(
            <AuthorNotesProvider slug="other" language="fr" notes={[base]}>
                <ArticleNotes />
            </AuthorNotesProvider>
        )
        expect(container).toBeEmptyDOMElement()
        rerender(
            <AuthorNotesProvider slug="example" language="fr">
                <ArticleNotes />
            </AuthorNotesProvider>
        )
        expect(container).toBeEmptyDOMElement()
    })
})
