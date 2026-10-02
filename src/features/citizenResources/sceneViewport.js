// Use CSS pixels: browser zoom and display scaling are already reflected in the viewport.
export function desktopScenePlacement(height) {
    const dock = document.querySelector('.civic-section-nav')
    const bottom = dock
        ? dock.offsetHeight + (parseFloat(getComputedStyle(dock).bottom) || 16) + 20
        : 100
    const header = 96
    const available = innerHeight - header - bottom
    return {top: header + Math.max(0, (available - height) / 2), fits: height <= available}
}
