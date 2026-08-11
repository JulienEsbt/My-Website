import axe from 'axe-core'

export const getAxeViolations = async (context) => {
    const results = await axe.run(context, {
        rules: {
            'color-contrast': {enabled: false},
        },
    })

    return results.violations
}
