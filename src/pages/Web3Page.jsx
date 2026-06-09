import React from 'react'
import PageNav from '../components/common/pagenav/PageNav'
import Header from '../components/web3/layout/header/Header'
import Nav from '../components/web3/layout/nav/Nav'
import About from '../components/web3/content/about/About'
import Knowledge from '../components/web3/content/knowledge/Knowledge'
import BlockchainExplorer from '../components/web3/web3/blockchainExplorer/BlockchainExplorer'
import WalletInspector from '../components/web3/web3/walletInspector/WalletInspector'
import DonationPanel from '../components/web3/web3/donationPanel/DonationPanel'
import Tools from '../components/web3/content/tools/Tools'
import Contact from '../components/web3/content/contact/Contact'
import Footer from '../components/web3/layout/footer/Footer'

const Web3Page = () => {
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

export default Web3Page