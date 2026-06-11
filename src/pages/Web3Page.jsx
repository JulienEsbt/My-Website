import React from 'react'
import PageNav from '../components/common/navigation/pageNav/PageNav'
import Header from '../features/web3/header/Header'
import Web3Nav from '../features/web3/web3Nav/Web3Nav.jsx'
import About from '../features/web3/about/About'
import Knowledge from '../features/web3/knowledge/Knowledge'
import BlockchainExplorer from '../features/web3/onChain/blockchainExplorer/BlockchainExplorer'
import WalletInspector from '../features/web3/onChain/walletInspector/WalletInspector'
import DonationPanel from '../features/web3/onChain/donationPanel/DonationPanel'
import Tools from '../features/web3/tools/Tools'
import ContactSection from "../components/common/layout/contactSection/ContactSection.jsx";
import Footer from "../components/common/layout/footerSection/Footer.jsx";

const Web3Page = () => {
    return (
        <main id="main" tabIndex="-1">
            <PageNav/>

            <section id="top">
                <Header/>
            </section>

            <Web3Nav/>

            <About/>
            <Knowledge/>
            <BlockchainExplorer/>
            <WalletInspector/>
            <DonationPanel/>
            <Tools/>
            <ContactSection/>
            <Footer/>
        </main>
    )
}

export default Web3Page