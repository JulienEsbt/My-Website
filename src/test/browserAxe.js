import axe from 'axe-core'

export const runBrowserAxe = (context = document, options = {}) => axe.run(context, options)
