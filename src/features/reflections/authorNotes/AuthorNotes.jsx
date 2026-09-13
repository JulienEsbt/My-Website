import React, {createContext, useContext} from 'react'
import {formatDate} from '../../../i18n/formatters.js'
import authorNotes from '../../../data/reflections/authorNotes.js'
import './AuthorNotes.css'

const Context = createContext({slug: '', language: 'fr', notes: []})
const labels = {
    fr: {
        title: 'Évolution de ma pensée',
        author: 'Note de l’auteur',
        clarification: 'Précision',
        source: 'Source complémentaire',
        extension: 'Prolongement',
        nuance: 'Nuance',
        revision: 'Révision',
        historical: 'Cette note cite une version antérieure du passage.',
    },
    en: {
        title: 'How my thinking evolves',
        author: 'Author’s note',
        clarification: 'Clarification',
        source: 'Additional source',
        extension: 'Further reflection',
        nuance: 'Nuance',
        revision: 'Revision',
        historical: 'This note quotes an earlier version of the passage.',
    },
}
const plainText = (value) => {
    if (typeof value === 'string' || typeof value === 'number') return String(value)
    if (Array.isArray(value)) return value.map(plainText).join('')
    return value?.props ? plainText(value.props.children) : ''
}
const normalize = (text) => text.replace(/\s+/g, ' ').trim()

export function AuthorNotesProvider({slug, language, notes = authorNotes, children}) {
    return <Context.Provider value={{slug, language, notes}}>{children}</Context.Provider>
}

function Notes({targetId, passageText}) {
    const {slug, language, notes} = useContext(Context)
    const copy = labels[language]
    const selected = notes.filter(
        (note) => note.slug === slug && note.targetId === targetId && note.content[language]
    )
    if (!selected.length) return null
    return (
        <aside className="author-notes" aria-label={copy.title}>
            {selected.map((note) => {
                const content = note.content[language]
                const historical =
                    targetId &&
                    content.quote &&
                    !normalize(passageText).includes(normalize(content.quote))
                return (
                    <details key={note.id} id={`author-note-${note.id}`}>
                        <summary>
                            {copy.author} · {copy[note.kind]} ·{' '}
                            <time dateTime={note.date}>{formatDate(note.date, language)}</time>
                        </summary>
                        {historical && (
                            <p className="author-notes__historical">{copy.historical}</p>
                        )}
                        {content.quote && <blockquote>{content.quote}</blockquote>}
                        <p className="author-notes__body">{content.body}</p>
                    </details>
                )
            })}
        </aside>
    )
}

// Stable identifiers are explicitly authored in MDX; they never depend on paragraph order.
export function Passage({id, children}) {
    return (
        <div id={`passage-${id}`} className="author-passage">
            {children}
            <Notes targetId={id} passageText={plainText(children)} />
        </div>
    )
}

export function ArticleNotes() {
    return <Notes />
}
