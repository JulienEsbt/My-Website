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

const useFocusTrap = ({active, containerRef, initialFocusRef, onDismiss}) => {
    const onDismissRef = useRef(onDismiss)

    useEffect(() => {
        onDismissRef.current = onDismiss
    }, [onDismiss])

    useEffect(() => {
        if (!active) return undefined

        const returnFocusTarget = document.activeElement
        const container = containerRef.current
        if (!container) return undefined

        const focusFrame = window.requestAnimationFrame(() => {
            const initialTarget = initialFocusRef?.current ?? getFocusableElements(container)[0]
            ;(initialTarget ?? container).focus()
        })

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

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            window.cancelAnimationFrame(focusFrame)
            document.removeEventListener('keydown', handleKeyDown)

            if (returnFocusTarget instanceof HTMLElement && returnFocusTarget.isConnected) {
                returnFocusTarget.focus()
            }
        }
    }, [active, containerRef, initialFocusRef])
}

export default useFocusTrap
