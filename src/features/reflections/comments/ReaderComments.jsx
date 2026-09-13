import React, {useEffect, useRef, useState} from 'react'
import {FiMessageCircle} from 'react-icons/fi'
import './ReaderComments.css'

export default function ReaderComments({slug, language, contentRef}) {
    const fr = language === 'fr'
    const [selection, setSelection] = useState(null)
    const [anchor, setAnchor] = useState(null)
    const [comments, setComments] = useState([])
    const [status, setStatus] = useState('loading')
    const [hasMore, setHasMore] = useState(false)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [tokens, setTokens] = useState({})
    const [adminToken, setAdminToken] = useState('')
    const dialog = useRef(null)
    const endpoint = `/api/comments?slug=${encodeURIComponent(slug)}&language=${language}`
    useEffect(() => {
        const controller = new AbortController()
        fetch(endpoint, {signal: controller.signal})
            .then(async (response) => {
                if (!response.ok) throw new Error('unavailable')
                const data = await response.json()
                setComments(data.comments)
                setHasMore(data.hasMore)
                setStatus('ready')
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setStatus('unavailable')
            })
        try {
            setTokens(JSON.parse(localStorage.getItem('reflection-comment-keys') || '{}'))
        } catch {
            /* Storage may be disabled. */
        }
        return () => controller.abort()
    }, [endpoint])
    useEffect(() => {
        const capture = () => {
            const selected = window.getSelection()
            const root = contentRef.current
            if (!selected?.rangeCount || selected.isCollapsed || !root) {
                setSelection(null)
                return
            }
            const range = selected.getRangeAt(0)
            if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
                setSelection(null)
                return
            }
            const rawQuote = range.toString()
            const quote = rawQuote.trim()
            if (!quote || quote.length > 1000) {
                setSelection(null)
                return
            }
            const before = range.cloneRange()
            before.selectNodeContents(root)
            before.setEnd(range.startContainer, range.startOffset)
            const after = range.cloneRange()
            after.selectNodeContents(root)
            after.setStart(range.endContainer, range.endOffset)
            setSelection({
                quote,
                prefix: (
                    before.toString() +
                    rawQuote.slice(0, rawQuote.length - rawQuote.trimStart().length)
                ).slice(-80),
                suffix: (rawQuote.slice(rawQuote.trimEnd().length) + after.toString()).slice(0, 80),
            })
        }
        document.addEventListener('selectionchange', capture)
        return () => document.removeEventListener('selectionchange', capture)
    }, [contentRef])
    const open = (value) => {
        setAnchor(value)
        setMessage('')
        dialog.current.showModal()
    }
    const save = async (event) => {
        event.preventDefault()
        setBusy(true)
        setMessage('')
        const form = new FormData(event.currentTarget)
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    pseudonym: form.get('pseudonym'),
                    body: form.get('body'),
                    website: form.get('website'),
                    quote: anchor?.quote || '',
                    prefix: anchor?.prefix || '',
                    suffix: anchor?.suffix || '',
                }),
            })
            if (!response.ok) throw new Error(response.status === 429 ? 'rate' : 'failed')
            const result = await response.json()
            const next = {...tokens, [result.comment.id]: result.deleteToken}
            setTokens(next)
            try {
                localStorage.setItem('reflection-comment-keys', JSON.stringify(next))
            } catch {
                /* The comment is published even when storage is unavailable. */
            }
            setComments((items) => [result.comment, ...items])
            dialog.current.close()
        } catch (error) {
            setMessage(
                error.message === 'rate'
                    ? fr
                        ? 'Trop de publications. Réessaie dans 15 minutes.'
                        : 'Too many posts. Try again in 15 minutes.'
                    : fr
                      ? 'Publication impossible pour le moment. Ton texte reste dans ce formulaire.'
                      : 'Unable to publish right now. Your text remains in this form.'
            )
        } finally {
            setBusy(false)
        }
    }
    const remove = async (id) => {
        setBusy(true)
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(adminToken ? {Authorization: `Bearer ${adminToken}`} : {}),
                },
                body: JSON.stringify({id, deleteToken: tokens[id]}),
            })
            if (!response.ok) throw new Error()
            setComments((items) => items.filter((item) => item.id !== id))
        } catch {
            setMessage(
                fr ? 'Impossible de retirer ce commentaire.' : 'Unable to remove this comment.'
            )
        } finally {
            setBusy(false)
        }
    }
    const more = async () => {
        setBusy(true)
        try {
            const response = await fetch(`${endpoint}&offset=${comments.length}`)
            if (!response.ok) throw new Error()
            const data = await response.json()
            setComments((items) => [...items, ...data.comments])
            setHasMore(data.hasMore)
        } catch {
            setMessage(fr ? 'Chargement impossible. Réessaie.' : 'Unable to load. Try again.')
        } finally {
            setBusy(false)
        }
    }
    const locate = (comment) => {
        const root = contentRef.current
        if (!root || !comment.quote) return
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        const nodes = []
        let text = ''
        let node
        while ((node = walker.nextNode())) {
            nodes.push({node, start: text.length})
            text += node.textContent
        }
        let start = text.indexOf(comment.quote)
        while (
            start >= 0 &&
            ((comment.prefix && !text.slice(0, start).endsWith(comment.prefix)) ||
                (comment.suffix &&
                    !text.slice(start + comment.quote.length).startsWith(comment.suffix)))
        )
            start = text.indexOf(comment.quote, start + 1)
        if (start < 0) {
            setMessage(
                fr
                    ? 'Ce passage a été modifié depuis ce commentaire. La citation originale est conservée.'
                    : 'This passage has changed. The original quotation is preserved.'
            )
            return
        }
        const first = nodes.find((item) => item.start + item.node.length > start)
        const end = start + comment.quote.length
        const last = nodes.find((item) => item.start + item.node.length >= end)
        const range = document.createRange()
        range.setStart(first.node, start - first.start)
        range.setEnd(last.node, end - last.start)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        first.node.parentElement.scrollIntoView({block: 'center', behavior: 'instant'})
    }
    return (
        <section className="reader-comments" aria-labelledby="reader-comments-title">
            <div className="reader-comments__heading">
                <FiMessageCircle aria-hidden="true" />
                <h2 id="reader-comments-title">
                    {fr ? 'Prolonger la réflexion' : 'Continue the conversation'}
                </h2>
            </div>
            <p>
                {fr
                    ? 'Sélectionne un passage du texte pour le commenter, ou réagis à l’ensemble de la réflexion.'
                    : 'Select a passage to comment on it, or respond to the whole article.'}
            </p>
            <p className="reader-comments__notice">
                {fr
                    ? 'Les commentaires sont publics dès leur publication. Les pseudonymes sont libres et ne garantissent pas une identité. Tu peux retirer tes commentaires depuis ce navigateur ; Julien peut modérer les échanges.'
                    : 'Comments are public immediately. Pseudonyms are unverified. You can remove your comments from this browser; Julien can moderate the discussion.'}
            </p>
            {status === 'unavailable' && (
                <p role="status">
                    {fr
                        ? 'Les commentaires ne sont pas encore disponibles. Tu peux déjà préparer ton texte dans le formulaire, mais il ne sera pas publié.'
                        : 'Comments are not available yet. You can prepare your text in the form, but it will not be published.'}
                </p>
            )}
            <button className="btn" onClick={() => open(null)}>
                {fr ? 'Commenter la réflexion' : 'Comment on the article'}
            </button>
            {selection && (
                <button
                    className="btn btn-primary reader-comments__selection"
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => open(selection)}
                >
                    {fr ? 'Commenter ce passage' : 'Comment on this passage'}
                </button>
            )}
            <p role="status">{message}</p>
            {comments.map((comment) => (
                <article className="reader-comments__item" key={comment.id}>
                    <header>
                        <strong>{comment.pseudonym}</strong>
                        <time dateTime={comment.createdAt}>
                            {new Date(comment.createdAt).toLocaleDateString(language)}
                        </time>
                    </header>
                    {comment.quote && (
                        <button className="reader-comments__quote" onClick={() => locate(comment)}>
                            <q>{comment.quote}</q>
                            <span>{fr ? 'Retrouver le passage ↑' : 'Find the passage ↑'}</span>
                        </button>
                    )}
                    <p>{comment.body}</p>
                    {(tokens[comment.id] || adminToken) && (
                        <button className="btn" disabled={busy} onClick={() => remove(comment.id)}>
                            {fr ? 'Retirer ce commentaire' : 'Remove this comment'}
                        </button>
                    )}
                </article>
            ))}
            {hasMore && (
                <button className="btn" disabled={busy} onClick={more}>
                    {fr ? 'Voir les commentaires suivants' : 'Load more comments'}
                </button>
            )}
            <details className="reader-comments__moderation">
                <summary>{fr ? 'Modération du site' : 'Site moderation'}</summary>
                <label>
                    {fr ? 'Clé de modération' : 'Moderation key'}
                    <input
                        type="password"
                        autoComplete="off"
                        value={adminToken}
                        onChange={(event) => setAdminToken(event.target.value)}
                    />
                </label>
                <p>
                    {fr
                        ? 'Réservé à Julien. La clé reste en mémoire pendant cette visite et permet de retirer un commentaire.'
                        : 'For Julien only. The key stays in memory during this visit and allows comment removal.'}
                </p>
            </details>
            <dialog
                ref={dialog}
                className="reader-comments__dialog"
                aria-labelledby="comment-form-title"
            >
                <form onSubmit={save}>
                    <h2 id="comment-form-title">
                        {anchor
                            ? fr
                                ? 'Commenter ce passage'
                                : 'Comment on this passage'
                            : fr
                              ? 'Commenter la réflexion'
                              : 'Comment on the article'}
                    </h2>
                    {anchor && <blockquote>{anchor.quote}</blockquote>}
                    <label>
                        {fr ? 'Pseudonyme' : 'Pseudonym'}
                        <input
                            name="pseudonym"
                            required
                            minLength={2}
                            maxLength={40}
                            autoComplete="nickname"
                        />
                    </label>
                    <label>
                        {fr ? 'Ton commentaire' : 'Your comment'}
                        <textarea name="body" required minLength={3} maxLength={2000} rows={5} />
                    </label>
                    <label className="reader-comments__trap" aria-hidden="true">
                        Website
                        <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                    <p>
                        {fr
                            ? 'Publication publique immédiate · 2 000 caractères maximum. Évite toute information personnelle sensible.'
                            : 'Published publicly immediately · 2,000 characters maximum. Avoid sensitive personal information.'}
                    </p>
                    {status !== 'ready' && (
                        <p>
                            {fr
                                ? 'La publication sera disponible une fois le service connecté.'
                                : 'Publishing will be available once the service is connected.'}
                        </p>
                    )}
                    <p role="status">{message}</p>
                    <div className="reader-comments__actions">
                        <button
                            className="btn"
                            type="button"
                            onClick={() => dialog.current.close()}
                        >
                            {fr ? 'Fermer' : 'Close'}
                        </button>
                        <button className="btn btn-primary" disabled={busy || status !== 'ready'}>
                            {busy ? '…' : fr ? 'Publier' : 'Publish'}
                        </button>
                    </div>
                </form>
            </dialog>
        </section>
    )
}
