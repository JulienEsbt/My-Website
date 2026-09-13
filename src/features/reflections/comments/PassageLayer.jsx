import React, {useEffect, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {FiMessageCircle, FiX, FiArrowUpRight} from 'react-icons/fi'
import {findPassage, passageKey} from './passageAnchors.js'

export default function PassageLayer({
    contentRef,
    comments,
    active,
    onActive,
    onReply,
    renderComment,
    language,
    drafting,
    feedback,
}) {
    const fr = language === 'fr'
    const threadRef = useRef(null)
    const groups = useMemo(() => {
        const grouped = new Map()
        for (const comment of comments.filter((c) => c.quote)) {
            const key = passageKey(comment)
            if (!grouped.has(key)) grouped.set(key, {key, anchor: comment, comments: []})
            grouped.get(key).comments.push(comment)
        }
        return [...grouped.values()]
    }, [comments])
    const [layout, setLayout] = useState([])
    const [panelStyle, setPanelStyle] = useState({})
    useEffect(() => {
        const root = contentRef.current
        if (!root) return undefined
        const article = root.closest('.reflexion-article')
        article?.classList.add('reflexion-article--annotated')
        let frame
        let disposed = false
        const measure = () => {
            const edge = root.getBoundingClientRect().right
            let previous = -Infinity
            const visibleGroups = [...groups]
            if (active && !groups.some((g) => g.key === passageKey(active)))
                visibleGroups.push({key: passageKey(active), anchor: active, comments: []})
            const measured = visibleGroups
                .map((group) => {
                    const range = findPassage(root, group.anchor)
                    const rects = range
                        ? [...range.getClientRects()].filter((r) => r.width && r.height)
                        : []
                    return {
                        ...group,
                        rects: rects.map((r) => ({
                            left: r.left,
                            top: r.top + scrollY,
                            width: r.width,
                            height: r.height,
                        })),
                    }
                })
                .sort((a, b) => (a.rects[0]?.top ?? Infinity) - (b.rects[0]?.top ?? Infinity))
            for (const group of measured) {
                if (!group.rects.length) continue
                group.markerTop = Math.max(group.rects[0].top, previous + 54)
                group.markerLeft = Math.min(innerWidth - (innerWidth >= 1280 ? 50 : 44), edge + 8)
                previous = group.markerTop
            }
            setLayout(measured)
            const range = findPassage(root, active)
            const rect = range?.getBoundingClientRect()
            const panelHeight = Math.min(threadRef.current?.scrollHeight || 440, innerHeight - 112)
            const top = Math.max(88, Math.min(rect?.top ?? 120, innerHeight - panelHeight - 24))
            setPanelStyle({
                left: Math.min(innerWidth - 324, edge + 64),
                top,
                '--thread-top': `${top}px`,
            })
        }
        const schedule = () => {
            if (disposed) return
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(measure)
        }
        const observer = new ResizeObserver(schedule)
        observer.observe(root)
        if (threadRef.current) observer.observe(threadRef.current)
        const mutations = new MutationObserver(schedule)
        mutations.observe(root, {childList: true, subtree: true, characterData: true})
        window.addEventListener('resize', schedule)
        window.addEventListener('scroll', schedule, {passive: true})
        document.fonts?.ready.then(schedule)
        schedule()
        return () => {
            disposed = true
            cancelAnimationFrame(frame)
            observer.disconnect()
            mutations.disconnect()
            window.removeEventListener('resize', schedule)
            window.removeEventListener('scroll', schedule)
            article?.classList.remove('reflexion-article--annotated')
        }
    }, [groups, active, contentRef])
    const selected = active ? groups.find((g) => g.key === passageKey(active)) : null
    useEffect(() => {
        if (active && !drafting) threadRef.current?.focus({preventScroll: true})
    }, [active, drafting])
    useEffect(() => {
        const root = contentRef.current
        const click = (event) => {
            if (!window.getSelection()?.isCollapsed || event.target.closest('a, button, input'))
                return
            const hit = layout.find(
                (g) =>
                    g.comments.length &&
                    g.rects.some(
                        (r) =>
                            event.clientX >= r.left &&
                            event.clientX <= r.left + r.width &&
                            event.clientY + scrollY >= r.top &&
                            event.clientY + scrollY <= r.top + r.height
                    )
            )
            if (hit && !drafting) onActive(hit.anchor)
        }
        root?.addEventListener('click', click)
        return () => root?.removeEventListener('click', click)
    }, [layout, contentRef, onActive, drafting])
    const orphaned = layout.filter((group) => group.comments.length && !group.rects.length)
    const jump = (anchor) => {
        const range = findPassage(contentRef.current, anchor)
        const parent = range?.startContainer.parentElement
        parent?.scrollIntoView({block: 'center', behavior: 'instant'})
    }
    return (
        <>
            {orphaned.length > 0 && (
                <details className="passage-orphans">
                    <summary>
                        {fr ? 'Passages modifiés ou introuvables' : 'Changed or missing passages'} (
                        {orphaned.length})
                    </summary>
                    {orphaned.map((group) => (
                        <button
                            key={group.key}
                            className="reader-comments__quote"
                            onClick={() => onActive(group.anchor)}
                        >
                            <q>{group.anchor.quote}</q>
                            <span>
                                {group.comments.length} {fr ? 'commentaire(s)' : 'comment(s)'}
                            </span>
                        </button>
                    ))}
                </details>
            )}
            {typeof document !== 'undefined' &&
                createPortal(
                    <>
                        <div className="passage-highlights" aria-hidden="true">
                            {layout.flatMap((group) =>
                                group.rects.map((rect, i) => (
                                    <span
                                        key={`${group.key}-${i}`}
                                        className={
                                            active && passageKey(active) === group.key
                                                ? 'is-active'
                                                : ''
                                        }
                                        style={rect}
                                    />
                                ))
                            )}
                        </div>
                        {layout
                            .filter((group) => group.comments.length && group.rects.length)
                            .map((group) => (
                                <button
                                    key={group.key}
                                    className={`passage-marker ${active && passageKey(active) === group.key ? 'is-active' : ''}`}
                                    style={{left: group.markerLeft, top: group.markerTop}}
                                    aria-label={`${fr ? 'Commentaires sur le passage' : 'Comments on passage'} : ${group.anchor.quote.slice(0, 75)} (${group.comments.length})`}
                                    disabled={drafting}
                                    aria-controls="passage-thread"
                                    aria-expanded={!!selected && selected.key === group.key}
                                    onClick={() =>
                                        onActive(
                                            active && passageKey(active) === group.key
                                                ? null
                                                : group.anchor
                                        )
                                    }
                                >
                                    <FiMessageCircle aria-hidden="true" />
                                    <span>{group.comments.length}</span>
                                </button>
                            ))}
                        {selected && !drafting && (
                            <aside
                                id="passage-thread"
                                ref={threadRef}
                                tabIndex={-1}
                                className="passage-thread"
                                style={panelStyle}
                                aria-label={fr ? 'Commentaires du passage' : 'Passage comments'}
                            >
                                <header className="passage-thread__head">
                                    <strong>
                                        {fr ? 'Autour de ce passage' : 'About this passage'}
                                    </strong>
                                    <button
                                        aria-label={
                                            fr ? 'Fermer les commentaires' : 'Close comments'
                                        }
                                        onClick={() => onActive(null)}
                                    >
                                        <FiX />
                                    </button>
                                </header>
                                {feedback && (
                                    <p className="passage-thread__feedback" role="status">
                                        {feedback}
                                    </p>
                                )}
                                <blockquote>{selected.anchor.quote}</blockquote>
                                {!layout.find((g) => g.key === selected.key)?.rects.length && (
                                    <p role="status">
                                        {fr
                                            ? 'Ce passage a changé. La citation originale est conservée.'
                                            : 'This passage has changed. The original quotation is preserved.'}
                                    </p>
                                )}
                                <button
                                    className="passage-thread__jump"
                                    onClick={() => jump(selected.anchor)}
                                >
                                    <FiArrowUpRight />
                                    {fr ? 'Revenir au passage' : 'Back to passage'}
                                </button>
                                <div className="passage-thread__comments">
                                    {selected.comments.map(renderComment)}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onReply(selected.anchor)}
                                >
                                    {fr ? 'Ajouter un commentaire' : 'Add a comment'}
                                </button>
                            </aside>
                        )}
                    </>,
                    document.body
                )}
        </>
    )
}
