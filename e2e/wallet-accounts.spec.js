import {test, expect} from '@playwright/test'

for (const viewport of [
    {width: 1440, height: 1000},
    {width: 393, height: 852},
]) {
    test(`wallet icons and account changes at ${viewport.width}px`, async ({page}) => {
        await page.setViewportSize(viewport)
        await page.addInitScript(() => {
            const listeners = {}
            window.testAccounts = [
                '0x1111111111111111111111111111111111111111',
                '0x2222222222222222222222222222222222222222',
            ]
            window.emitAccounts = (accounts) => {
                window.testAccounts = accounts
                listeners.accountsChanged?.(accounts)
            }
            const provider = {
                request: async () => window.testAccounts,
                on: (event, listener) => {
                    listeners[event] = listener
                },
                removeListener: (event) => {
                    delete listeners[event]
                },
            }
            window.addEventListener('eip6963:requestProvider', () => {
                for (const name of ['MetaMask', 'Rabby']) {
                    window.dispatchEvent(
                        new CustomEvent('eip6963:announceProvider', {
                            detail: {
                                info: {
                                    uuid: name,
                                    name,
                                    icon:
                                        'data:image/svg+xml;base64,' +
                                        btoa(
                                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#f6851b"/><path d="M10 12L30 12L20 30Z" fill="white"/></svg>'
                                        ),
                                },
                                provider: name === 'MetaMask' ? provider : {...provider},
                            },
                        })
                    )
                }
            })
        })
        await page.goto('/web3')
        await page.locator('#prerendered-content').waitFor({state: 'detached'})
        await page.getByRole('button', {name: 'Connecter mon wallet', exact: true}).click()
        const dialog = page.getByRole('dialog', {name: 'Choisir mon wallet'})
        await expect(dialog.locator('.wallet-icon img')).toHaveCount(2)
        await page.screenshot({path: `/tmp/wallet-picker-new-${viewport.width}.png`})
        await dialog.getByRole('button', {name: /MetaMask/}).click()
        const select = page.getByLabel('Adresse à analyser', {exact: true})
        await expect(select).toHaveValue('0x1111111111111111111111111111111111111111')
        await select.selectOption('0x2222222222222222222222222222222222222222')
        await expect(page.locator('#wallet-address')).toHaveValue(
            '0x2222222222222222222222222222222222222222'
        )
        await page.evaluate(() =>
            window.emitAccounts(['0x3333333333333333333333333333333333333333'])
        )
        await expect(select).toHaveValue('0x3333333333333333333333333333333333333333')
        await expect(page.locator('#wallet-address')).toHaveValue(
            '0x3333333333333333333333333333333333333333'
        )
        await page.locator('.wallet-session').scrollIntoViewIfNeeded()
        await page.screenshot({path: `/tmp/wallet-session-${viewport.width}.png`})
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
            true
        )
        await page.evaluate(() => window.emitAccounts([]))
        await expect(select).not.toBeVisible()
        await expect(page.locator('#wallet-address')).toHaveValue('')
        await page.getByRole('button', {name: 'Détacher du site'}).click()
        await expect(page.locator('.wallet-session')).not.toBeVisible()
    })
}

test('wallet selection opens accessibly and never requests accounts before explicit choice', async ({
    page,
}) => {
    await page.addInitScript(() => {
        window.walletRequests = []
        const provider = {
            request: async ({method}) => {
                window.walletRequests.push(method)
                throw {code: 4001, message: 'wallet must have at least one account'}
            },
        }
        window.addEventListener('eip6963:requestProvider', () => {
            for (const name of ['Brave Wallet', 'MetaMask'])
                window.dispatchEvent(
                    new CustomEvent('eip6963:announceProvider', {
                        detail: {
                            info: {uuid: name, name},
                            provider: name === 'MetaMask' ? {request: provider.request} : provider,
                        },
                    })
                )
        })
    })
    await page.goto('/web3')
    await page.locator('#prerendered-content').waitFor({state: 'detached'})
    const connect = page.getByRole('button', {name: 'Connecter mon wallet', exact: true})
    await connect.click()
    const modal = page.getByRole('dialog', {name: 'Choisir mon wallet'})
    await expect(modal).toBeVisible()
    expect(await page.evaluate(() => window.walletRequests)).toEqual([])
    await modal.getByRole('button', {name: /Brave Wallet/}).click()
    await expect(modal.getByRole('alert')).toContainText('Aucun compte accessible')
    expect(await page.evaluate(() => window.walletRequests)).toEqual(['eth_requestAccounts'])
    await page.screenshot({path: '/tmp/wallet-picker.png'})
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
    await expect(connect).toBeFocused()
})
