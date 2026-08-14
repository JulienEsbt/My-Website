import {useEffect} from 'react'

let lockCount = 0
let lockedScrollY = 0
let previousBodyStyles = null

const lockBody = () => {
    if (lockCount === 0) {
        lockedScrollY = window.scrollY
        previousBodyStyles = {
            position: document.body.style.position,
            top: document.body.style.top,
            left: document.body.style.left,
            right: document.body.style.right,
            width: document.body.style.width,
        }

        document.body.style.position = 'fixed'
        document.body.style.top = `-${lockedScrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.width = '100%'
    }

    lockCount += 1
}

const unlockBody = () => {
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount > 0 || !previousBodyStyles) return

    Object.assign(document.body.style, previousBodyStyles)
    previousBodyStyles = null
    window.scrollTo({top: lockedScrollY, left: 0, behavior: 'instant'})
}

const useBodyScrollLock = (active) => {
    useEffect(() => {
        if (!active) return undefined

        lockBody()
        return unlockBody
    }, [active])
}

export default useBodyScrollLock
