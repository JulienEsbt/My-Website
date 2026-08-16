import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import i18n from 'i18next'
import DonationPanel from './DonationPanel.jsx'

const {sendDonationTransaction, validateDonation} = vi.hoisted(() => ({
    sendDonationTransaction: vi.fn(),
    validateDonation: vi.fn(),
}))

vi.mock('../utils/tokenUtils.js', () => ({
    importCustomErc20Token: vi.fn(),
    sendDonationTransaction,
    validateDonation,
}))

describe('DonationPanel', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
        await i18n.changeLanguage('fr')
        sendDonationTransaction.mockImplementation(async ({onStatus}) => {
            onStatus('switching')
            onStatus('signing')
            onStatus('confirming')
            return {
                hash: `0x${'a'.repeat(64)}`,
                explorerUrl: `https://etherscan.io/tx/0x${'a'.repeat(64)}`,
            }
        })
    })

    it('requires a separate explicit confirmation before calling the wallet', async () => {
        const user = userEvent.setup()
        render(<DonationPanel />)

        await user.type(screen.getByLabelText('Montant de la donation en ETH'), '0.01')
        await user.click(screen.getByRole('button', {name: 'Vérifier la transaction'}))

        expect(validateDonation).toHaveBeenCalled()
        expect(sendDonationTransaction).not.toHaveBeenCalled()
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Confirmation requise avant l’ouverture du wallet'
        )

        await user.click(screen.getByRole('button', {name: 'Ouvrir le wallet et confirmer'}))

        expect(sendDonationTransaction).toHaveBeenCalledTimes(1)
        expect(await screen.findByRole('status')).toHaveTextContent(
            'Transaction confirmée on-chain.'
        )
        expect(screen.getByRole('link', {name: /Voir la transaction/})).toHaveAttribute(
            'href',
            `https://etherscan.io/tx/0x${'a'.repeat(64)}`
        )
    })

    it('offers token-aware preset amounts without opening the wallet', async () => {
        const user = userEvent.setup()
        render(<DonationPanel />)

        await user.click(screen.getByRole('button', {name: '0.01 ETH'}))

        expect(screen.getByLabelText('Montant de la donation en ETH')).toHaveValue(0.01)
        expect(sendDonationTransaction).not.toHaveBeenCalled()
    })
})
