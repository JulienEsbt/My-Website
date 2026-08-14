import {renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import useBodyScrollLock from './useBodyScrollLock.js'

describe('useBodyScrollLock', () => {
    it('locks the page while an overlay is active and restores prior styles', () => {
        document.body.style.position = 'relative'
        const {rerender, unmount} = renderHook(({active}) => useBodyScrollLock(active), {
            initialProps: {active: false},
        })

        rerender({active: true})
        expect(document.body.style.position).toBe('fixed')
        expect(document.body.style.width).toBe('100%')

        rerender({active: false})
        expect(document.body.style.position).toBe('relative')
        expect(document.body.style.width).toBe('')

        unmount()
        document.body.style.position = ''
    })

    it('keeps the page locked until nested overlays are all closed', () => {
        const first = renderHook(() => useBodyScrollLock(true))
        const second = renderHook(() => useBodyScrollLock(true))

        first.unmount()
        expect(document.body.style.position).toBe('fixed')

        second.unmount()
        expect(document.body.style.position).toBe('')
    })
})
