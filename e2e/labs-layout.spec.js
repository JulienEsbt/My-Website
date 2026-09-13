import {test, expect} from '@playwright/test'

test('Labs dashboard keeps long amounts readable and donation controls usable', async ({page}) => {
    const result = {
        address: '0x1234567890123456789012345678901234567890',
        ens: 'example.eth',
        avatar: null,
        network: {name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io'},
        nativeBalance: 0.1,
        nativeValueUsd: 248,
        portfolioValueUsd: 248,
        tokenCount: 2,
        loadedTokenCount: 2,
        pricedTokenCount: 0,
        valuationPartial: true,
        nftCount: 4,
        nftStatus: 'available',
        nfts: Array.from({length: 4}, (_, i) => ({
            id: String(i),
            name: `Collection ${i + 1}`,
            collection: 'Test collection',
            image:
                'data:image/svg+xml,' +
                encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="%230f2035"/><circle cx="90" cy="90" r="50" fill="cornflowerblue"/></svg>`
                ),
        })),
        topHolding: {symbol: 'ETH', valueUsd: 248, allocation: 100},
        allocationItems: [{symbol: 'ETH', valueUsd: 248, allocation: 100}],
        topTokens: [
            {
                contract: '0xtoken',
                symbol: 'stkAAVE',
                name: 'Staked Aave',
                balance: '.0068',
                valueUsd: 0,
                allocation: 0,
            },
        ],
        allTokens: [],
        recentTransfers: [
            {
                id: 'one',
                hash: '0xexample',
                direction: 'in',
                counterparty: '0x1234567890123456789012345678901234567890',
                value: 0.006808272830960593,
                asset: 'stkAAVE',
            },
        ],
    }
    await page.route('**/src/services/web3/walletInspectorService.*', (route) =>
        route.fulfill({
            contentType: 'application/javascript',
            body: `export const inspectWalletPortfolio = async () => (${JSON.stringify(result)}); export const compareWalletNetworks = async () => []; export const connectInjectedWallet = async () => null;`,
        })
    )
    await page.setViewportSize({width: 1440, height: 1000})
    await page.goto('http://localhost:3101/web3')
    await page.locator('.crypto-about').scrollIntoViewIfNeeded()
    await expect(page.locator('.crypto-about__content')).toHaveCSS('opacity', '1')
    await expect(page.locator('.crypto-about__visual')).toHaveCSS('opacity', '1')
    await page.locator('.crypto-about').screenshot({path: '/tmp/compact-ecosystem-verified.png'})
    await page.getByLabel('Adresse de wallet ou nom ENS').fill('example.eth')
    await page.getByRole('button', {name: 'Analyser', exact: true}).click()
    await expect(page.locator('.wallet-inspector__identity-card')).toContainText('example.eth')
    await page.locator('.wallet-inspector').scrollIntoViewIfNeeded()
    await expect(page.locator('.wallet-inspector')).toHaveCSS('opacity', '1')
    await page.locator('.wallet-inspector').screenshot({path: '/tmp/labs-dashboard-desktop.png'})
    const allocation = await page.locator('.wallet-inspector__allocation').boundingBox()
    const tokens = await page.locator('.wallet-inspector__tokens-panel').boundingBox()
    const nfts = await page.locator('.wallet-inspector__nfts-panel').boundingBox()
    expect(Math.abs(allocation.height - tokens.height)).toBeLessThan(2)
    expect(Math.abs(allocation.y - tokens.y)).toBeLessThan(2)
    expect(nfts.width).toBeGreaterThan(tokens.width + allocation.width)
    for (const width of [1440, 768, 390]) {
        await page.setViewportSize({width, height: 1000})
        const row = page.locator('.wallet-activity-row')
        const label = await row.locator('span').boundingBox()
        const amount = await row.locator('em').boundingBox()
        expect(amount.x).toBeGreaterThanOrEqual(label.x + label.width)
        await expect
            .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
            .toBe(true)
    }
    await page.locator('.wallet-metrics-guide summary').click()
    await expect(page.locator('.wallet-metrics-guide')).toHaveAttribute('open', '')
    await page.locator('.wallet-inspector').screenshot({path: '/tmp/labs-dashboard-mobile.png'})
    await page.setViewportSize({width: 1440, height: 1000})
    await page.locator('#donation').scrollIntoViewIfNeeded()
    await expect(page.locator('.donation-panel')).toHaveCSS('opacity', '1')
    await page.locator('.donation-panel').screenshot({path: '/tmp/labs-donation-desktop.png'})
    await page.locator('.donation-panel__presets button').first().click()
    await expect(page.locator('.donation-panel__form input')).not.toHaveValue('')
    await page.setViewportSize({width: 390, height: 844})
    await page.locator('#donation').scrollIntoViewIfNeeded()
    await page.locator('.donation-panel').screenshot({path: '/tmp/labs-donation-mobile.png'})
    await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
})
