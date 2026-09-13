import React, {useEffect, useRef, useState} from 'react'
import {createPortal, flushSync} from 'react-dom'
import {FiMessageCircle} from 'react-icons/fi'
import './ReaderComments.css'
import PassageLayer from './PassageLayer.jsx'
import {findPassage, passageKey} from './passageAnchors.js'

export default function ReaderComments({slug, language, contentRef}) {
    const fr = language === 'fr'
    const [selection, setSelection] = useState(null)
    const [selectionPosition, setSelectionPosition] = useState(null)
    const [anchor, setAnchor] = useState(null)
    const [activePassage, setActivePassage] = useState(null)
    const [drafting, setDrafting] = useState(false)
    const [comments, setComments] = useState([])
    const [status, setStatus] = useState('loading')
    const [hasMore, setHasMore] = useState(false)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [published, setPublished] = useState(false)
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
            if (dialog.current?.open) return
            setSelectionPosition(null)
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
            const rects = [...range.getClientRects()].filter(
                (rect) => rect.bottom > 70 && rect.top < innerHeight - 70
            )
            const rect = rects.at(-1)
            if (rect)
                setSelectionPosition({
                    left: Math.max(12, Math.min(innerWidth - 252, rect.left)),
                    top:
                        rect.bottom + 56 < innerHeight - 65
                            ? rect.bottom + 8
                            : Math.max(70, rect.top - 52),
                })
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
        const dismiss = (event) => {
            if (event.key === 'Escape') setSelectionPosition(null)
        }
        document.addEventListener('selectionchange', capture)
        window.addEventListener('scroll', capture, {passive: true})
        window.addEventListener('resize', capture)
        document.addEventListener('keydown', dismiss)
        return () => {
            document.removeEventListener('selectionchange', capture)
            window.removeEventListener('scroll', capture)
            window.removeEventListener('resize', capture)
            document.removeEventListener('keydown', dismiss)
        }
    }, [contentRef])
    useEffect(() => {
        if (!published) return undefined
        const timer = setTimeout(() => setPublished(false), 6000)
        return () => clearTimeout(timer)
    }, [published])
    const open = (value) => {
        // Apply the fixed non-modal layout before native dialog focus can scroll the document.
        flushSync(() => {
            setAnchor(value)
            setSelectionPosition(null)
            setMessage('')
            setActivePassage(value)
            setDrafting(!!value)
        })
        const panel = dialog.current
        if (passageKey(value || {}) !== passageKey(anchor || {}))
            panel.querySelector('form').reset()
        if (value) {
            panel.show()
            const root = contentRef.current
            const rect = findPassage(root, value)?.getBoundingClientRect()
            panel.style.setProperty(
                '--passage-left',
                `${Math.min(innerWidth - 324, root.getBoundingClientRect().right + 64)}px`
            )
            panel.style.setProperty(
                '--passage-top',
                `${Math.max(80, Math.min(rect?.top ?? 100, innerHeight - panel.offsetHeight - 24))}px`
            )
        } else panel.showModal()
        window.getSelection()?.removeAllRanges()
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
            setDrafting(false)
            event.target.reset()
            setPublished(true)
        } catch (error) {
            setMessage(
                error.message === 'rate'
                    ? fr
                        ? 'Limite atteinte : 10 commentaires sur 15 minutes ou 30 sur 2 heures. Réessaie plus tard ; ton texte est conservé.'
                        : 'Limit reached: 10 comments in 15 minutes or 30 in 2 hours. Try again later; your text is preserved.'
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
            if (
                activePassage &&
                !comments.some(
                    (item) => item.id !== id && passageKey(item) === passageKey(activePassage)
                )
            )
                setActivePassage(null)
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
    useEffect(() => {
        if (!drafting || !anchor) return undefined
        const position = () => {
            const root = contentRef.current
            const range = findPassage(root, anchor)
            const rect = range?.getBoundingClientRect()
            const panel = dialog.current
            if (!root || !panel) return
            panel.style.setProperty(
                '--passage-left',
                `${Math.min(innerWidth - 324, root.getBoundingClientRect().right + 64)}px`
            )
            panel.style.setProperty(
                '--passage-top',
                `${Math.max(80, Math.min(rect?.top ?? 100, innerHeight - panel.offsetHeight - 24))}px`
            )
        }
        position()
        window.addEventListener('resize', position)
        window.addEventListener('scroll', position, {passive: true})
        return () => {
            window.removeEventListener('resize', position)
            window.removeEventListener('scroll', position)
        }
    }, [drafting, anchor, contentRef])
    useEffect(() => {
        const escape = (event) => {
            if (event.key !== 'Escape') return
            if (dialog.current?.open) dialog.current.close()
            else setActivePassage(null)
        }
        document.addEventListener('keydown', escape)
        return () => document.removeEventListener('keydown', escape)
    }, [])
    const renderComment = (comment) => (
        <article className="reader-comments__item" key={comment.id}>
            <header>
                <strong>{comment.pseudonym}</strong>
                <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleDateString(language)}
                </time>
            </header>
            <p>{comment.body}</p>
            {(tokens[comment.id] || adminToken) && (
                <button className="btn" disabled={busy} onClick={() => remove(comment.id)}>
                    {fr ? 'Retirer ce commentaire' : 'Remove this comment'}
                </button>
            )}
        </article>
    )
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
            {selection &&
                selectionPosition &&
                createPortal(
                    <button
                        className="btn btn-primary reader-comments__selection"
                        style={selectionPosition}
                        onPointerDown={(event) => event.preventDefault()}
                        onClick={() => open(selection)}
                        aria-haspopup="dialog"
                    >
                        <FiMessageCircle aria-hidden="true" />
                        {fr ? 'Commenter ce passage' : 'Comment on this passage'}
                    </button>,
                    document.body
                )}
            {published &&
                !activePassage &&
                createPortal(
                    <p className="reader-comments__confirmation" role="status">
                        <FiMessageCircle aria-hidden="true" />{' '}
                        {fr ? 'Ton commentaire est publié.' : 'Your comment is published.'}
                    </p>,
                    document.body
                )}
            <p role="status">{message}</p>
            {comments.filter((comment) => !comment.quote).map(renderComment)}
            <PassageLayer
                contentRef={contentRef}
                comments={comments}
                active={activePassage}
                onActive={setActivePassage}
                onReply={open}
                renderComment={renderComment}
                language={language}
                drafting={drafting}
                feedback={
                    message ||
                    (published
                        ? fr
                            ? 'Ton commentaire est publié.'
                            : 'Your comment is published.'
                        : '')
                }
            />
            {hasMore && (
                <button className="btn" disabled={busy} onClick={more}>
                    {fr
                        ? 'Charger d’autres commentaires et annotations'
                        : 'Load more comments and annotations'}
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
            {typeof document !== 'undefined' &&
                createPortal(
                    <dialog
                        ref={dialog}
                        onClose={() => {
                            setDrafting(false)
                            if (
                                activePassage &&
                                !comments.some(
                                    (item) => passageKey(item) === passageKey(activePassage)
                                )
                            )
                                setActivePassage(null)
                        }}
                        className={`reader-comments__dialog ${anchor ? 'reader-comments__dialog--passage' : ''}`}
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
                                <textarea
                                    name="body"
                                    required
                                    minLength={3}
                                    maxLength={2000}
                                    rows={5}
                                />
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
                                <button
                                    className="btn btn-primary"
                                    disabled={busy || status !== 'ready'}
                                >
                                    {busy ? '…' : fr ? 'Publier' : 'Publish'}
                                </button>
                            </div>
                        </form>
                    </dialog>,
                    document.body
                )}
        </section>
    )
}
