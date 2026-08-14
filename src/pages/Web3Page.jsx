import React, {lazy, Suspense} from 'react'
import {useTranslation} from 'react-i18next'
import Header from '../features/web3/header/Header'
import Web3Nav from '../features/web3/web3Nav/Web3Nav.jsx'
import About from '../features/web3/about/About'
import Knowledge from '../features/web3/knowledge/Knowledge'
import Tools from '../features/web3/tools/Tools'
import ContactSection from '../components/common/layout/contactSection/ContactSection.jsx'
import FeatureLoading from '../components/common/feedback/featureLoading/FeatureLoading.jsx'
import PageFrame from '../components/common/layout/pageFrame/PageFrame.jsx'
import useDocumentTitle from '../components/common/accessibility/useDocumentTitle.js'
import LabNotice from '../features/web3/labNotice/LabNotice.jsx'

const BlockchainExplorer = lazy(
    () => import('../features/web3/onChain/blockchainExplorer/BlockchainExplorer.jsx')
)
const WalletInspector = lazy(
    () => import('../features/web3/onChain/walletInspector/WalletInspector.jsx')
)
const DonationPanel = lazy(() => import('../features/web3/onChain/donationPanel/DonationPanel.jsx'))

const Web3Page = () => {
    const {t} = useTranslation('web3')
    useDocumentTitle(t('meta.title'))

    return (
        <PageFrame>
            <Header />

            <Web3Nav />

            <About />
            <LabNotice />
            <Knowledge />
            <Suspense fallback={<FeatureLoading />}>
                <BlockchainExplorer />
            </Suspense>
            <Suspense fallback={<FeatureLoading />}>
                <WalletInspector />
            </Suspense>
            <Suspense fallback={<FeatureLoading />}>
                <DonationPanel />
            </Suspense>
            <Tools />
            <ContactSection />
        </PageFrame>
    )
}

export default Web3Page
