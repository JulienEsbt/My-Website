import axe from 'axe-core'

const params = new URLSearchParams(window.location.search)

export const runBrowserAxe = (context = document, options = {}) => axe.run(context, options)

if (params.has('rgaaSpacing')) {
    const spacingStyles = document.createElement('style')
    spacingStyles.dataset.rgaaPreview = 'text-spacing'
    spacingStyles.textContent = `
        * {
            letter-spacing: 0.12em !important;
            line-height: 1.5 !important;
            word-spacing: 0.16em !important;
        }

        p {
            margin-bottom: 2em !important;
        }
    `
    document.head.append(spacingStyles)
    document.documentElement.dataset.rgaaSpacing = 'enabled'
}

if (params.has('rgaaNoCss')) {
    const removePresentationStyles = () => {
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((stylesheet) => {
            stylesheet.remove()
        })
        document.querySelectorAll('[style]').forEach((element) => {
            element.removeAttribute('style')
        })
    }

    const observer = new MutationObserver(removePresentationStyles)
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
        childList: true,
        subtree: true,
    })

    window.requestAnimationFrame(() => {
        removePresentationStyles()
        document.documentElement.dataset.rgaaNoCss = 'enabled'
    })
}

if (params.has('axe')) {
    document.documentElement.dataset.axeStatus = 'waiting'

    window.setTimeout(() => {
        document.documentElement.dataset.axeStatus = 'running'

        runBrowserAxe()
            .then((results) => {
                const violations = results.violations.map(({help, id, impact, nodes}) => ({
                    help,
                    id,
                    impact,
                    targets: nodes.map((node) => node.target),
                }))

                document.documentElement.dataset.axeResults = JSON.stringify(violations)
                document.documentElement.dataset.axeStatus = 'done'
            })
            .catch((error) => {
                document.documentElement.dataset.axeError = error.message
                document.documentElement.dataset.axeStatus = 'error'
            })
    }, 1200)
}
