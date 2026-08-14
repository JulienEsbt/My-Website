import {useEffect, useRef} from 'react'

const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container) =>
    [...(container?.querySelectorAll(FOCUSABLE_ELEMENTS) ?? [])].filter(
        (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true'
    )

const isolateOutsideContent = (container) => {
    const previousAttributes = new Map()
    let branch = container

    while (branch && branch !== document.body) {
        const parent = branch.parentElement
        if (!parent) break

        ;[...parent.children].forEach((sibling) => {
            if (
                sibling === branch ||
                sibling.contains(container) ||
                sibling.matches('script, style, link') ||
                previousAttributes.has(sibling)
            ) {
                return
            }

            previousAttributes.set(sibling, {
                ariaHidden: sibling.getAttribute('aria-hidden'),
                hadInert: sibling.hasAttribute('inert'),
            })
            sibling.setAttribute('aria-hidden', 'true')
            sibling.setAttribute('inert', '')
        })

        branch = parent
    }

    return () => {
        previousAttributes.forEach(({ariaHidden, hadInert}, element) => {
            if (ariaHidden === null) element.removeAttribute('aria-hidden')
            else element.setAttribute('aria-hidden', ariaHidden)

            if (!hadInert) element.removeAttribute('inert')
        })
    }
}

const MAX_REF_WAIT_FRAMES = 60
const getReturnFocusTarget = (returnFocusRef, fallback) => returnFocusRef?.current ?? fallback

const useFocusTrap = ({
    active,
    autoFocus = true,
    containerRef,
    initialFocusRef,
    onDismiss,
    returnFocusRef,
}) => {
    const onDismissRef = useRef(onDismiss)
    const returnFocusFrameRef = useRef(null)

    useEffect(() => {
        onDismissRef.current = onDismiss
    }, [onDismiss])

    useEffect(() => {
        if (!active) return undefined

        const returnFocusTarget = document.activeElement
        let container = null
        let focusFrame = null
        let setupFrame = null
        let setupAttempts = 0
        let restoreOutsideContent = () => {}
        let isInitialized = false

        if (returnFocusFrameRef.current !== null) {
            window.cancelAnimationFrame(returnFocusFrameRef.current)
            returnFocusFrameRef.current = null
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                onDismissRef.current?.()
                return
            }

            if (event.key !== 'Tab') return

            const focusableElements = getFocusableElements(container)
            if (focusableElements.length === 0) {
                event.preventDefault()
                container.focus()
                return
            }

            const firstElement = focusableElements[0]
            const lastElement = focusableElements.at(-1)

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
            }
        }

        const initializeTrap = () => {
            container = containerRef.current

            if (!container) {
                setupAttempts += 1
                if (setupAttempts < MAX_REF_WAIT_FRAMES) {
                    setupFrame = window.requestAnimationFrame(initializeTrap)
                }
                return
            }

            isInitialized = true
            restoreOutsideContent = isolateOutsideContent(container)
            document.addEventListener('keydown', handleKeyDown)

            if (autoFocus) {
                focusFrame = window.requestAnimationFrame(() => {
                    const initialTarget =
                        initialFocusRef?.current ?? getFocusableElements(container)[0]
                    ;(initialTarget ?? container).focus()
                })
            }
        }

        initializeTrap()

        return () => {
            if (setupFrame !== null) window.cancelAnimationFrame(setupFrame)
            if (focusFrame !== null) window.cancelAnimationFrame(focusFrame)
            if (isInitialized) {
                document.removeEventListener('keydown', handleKeyDown)
                restoreOutsideContent()
            }

            let returnFocusAttempts = 0
            const restoreFocus = () => {
                const target = getReturnFocusTarget(returnFocusRef, returnFocusTarget)

                if (target instanceof HTMLElement && target.isConnected) {
                    target.focus()
                    returnFocusFrameRef.current = null
                    return
                }

                returnFocusAttempts += 1
                if (returnFocusRef && returnFocusAttempts < MAX_REF_WAIT_FRAMES) {
                    returnFocusFrameRef.current = window.requestAnimationFrame(restoreFocus)
                } else {
                    returnFocusFrameRef.current = null
                }
            }

            restoreFocus()
        }
    }, [active, autoFocus, containerRef, initialFocusRef, returnFocusRef])
}

export default useFocusTrap
