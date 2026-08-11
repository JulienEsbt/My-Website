export const shortenAddress = (value) => {
    if (!value) return ''
    return `${value.slice(0, 6)}...${value.slice(-4)}`
}

import {formatCurrency} from '../../../../i18n/formatters.js'

export const formatUsd = (value, language) => formatCurrency(value, language, 'USD')
