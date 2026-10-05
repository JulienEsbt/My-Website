// CSS pixels already reflect browser zoom and operating-system display scaling.
export function sceneViewport() {
    const dock = document.querySelector('.civic-section-nav, .section-nav')
    const bottom = dock
        ? dock.offsetHeight + (parseFloat(getComputedStyle(dock).bottom) || 16) + 20
        : 100
    return {header: 96, bottom, available: Math.max(0, innerHeight - 96 - bottom)}
}

export function desktopScenePlacement(height) {
    const {header, available} = sceneViewport()
    return {top: header + Math.max(0, (available - height) / 2), fits: height <= available}
}

export function observeSceneViewport(element) {
    const update = () => {
        const {header, bottom} = sceneViewport()
        element.style.setProperty('--scene-header', `${header}px`)
        element.style.setProperty('--scene-bottom', `${bottom}px`)
    }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    document.querySelectorAll('.civic-section-nav, .section-nav').forEach((dock) => {
        observer?.observe(dock)
    })
    window.addEventListener('resize', update)
    return () => {
        observer?.disconnect()
        window.removeEventListener('resize', update)
    }
}
