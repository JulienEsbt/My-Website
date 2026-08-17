import {useEffect} from 'react'

let immersiveViewCount = 0

const showImmersiveView = () => {
    immersiveViewCount += 1
    document.body.classList.add('immersive-navigation-open')
}

const hideImmersiveView = () => {
    immersiveViewCount = Math.max(0, immersiveViewCount - 1)

    if (immersiveViewCount === 0) {
        document.body.classList.remove('immersive-navigation-open')
    }
}

const useImmersiveNavigation = (active) => {
    useEffect(() => {
        if (!active) return undefined

        showImmersiveView()
        return hideImmersiveView
    }, [active])
}

export default useImmersiveNavigation
