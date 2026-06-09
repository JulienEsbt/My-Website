import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/crypto/layout/header/Header'
import Nav from '../components/crypto/layout/nav/Nav'
import About from '../components/crypto/content/about/About'
import Knowledge from '../components/crypto/content/knowledge/Knowledge'
import BlockchainExplorer from '../components/crypto/web3/blockchainExplorer/BlockchainExplorer'
import WalletInspector from '../components/crypto/web3/walletInspector/WalletInspector'
import DonationPanel from '../components/crypto/web3/donationPanel/DonationPanel'
import Tools from '../components/crypto/content/tools/Tools'
import Contact from '../components/crypto/content/contact/Contact'
import Footer from '../components/crypto/layout/footer/Footer'

const CryptoPage = () => {
    return (
        <main id="main" tabIndex="-1">
            <PageNav/>

            <section id="top">
                <Header/>
            </section>

            <Nav/>

            <About/>
            <Knowledge/>
            <BlockchainExplorer/>
            <WalletInspector/>
            <DonationPanel/>
            <Tools/>
            <Contact/>
            <Footer/>
        </main>
    )
}

export default CryptoPage