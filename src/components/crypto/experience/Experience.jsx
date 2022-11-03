import React from 'react'
import './experience.css'
import {BsPatchCheckFill} from 'react-icons/bs'

const Experience = () => {
  return (
    <section id='experience'>
      <h5>What Interests I Have</h5>
      <h2>My knowledge</h2>

      <div className="container experience__container">
        <div className="experience__frontend">
          <h3>Blockchain</h3>
          <div className="experience__content">
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Bitcoin</h4>
                <small className='text-light'>Functioning, Mining, Lightning Network, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Ethereum</h4>
                <small className='text-light'>Stacking, Layers, DeFi, Bridges, ERCs, EVM...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Polkadot</h4>
                <small className='text-light'>Crowdloans, Stacking, ParaChains, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Solana</h4>
                <small className='text-light'>Consensus, DeFi, NFTs, Explorer, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Elrond</h4>
                <small className='text-light'>Consensus, DeFi, Launchpad, Explorer, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Cosmos</h4>
                <small className='text-light'>Consensus, Osmosis, Terra, Kepler, ...</small>
              </div>
            </article>
          </div>
        </div>
        <div className="experience__backend">
        <h3>Other</h3>
          <div className="experience__content">
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Exchanges</h4>
                <small className='text-light'>Binance, Swissborg, FTX, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Wallets</h4>
                <small className='text-light'>Metamask, XDefi, Kepler, Phantom, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Blockchains</h4>
                <small className='text-light'>EVM, Avalanche, Cardano, Near, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>NFTs</h4>
                <small className='text-light'>OpenSea, Sandbox, Pokmi, SoulWare, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Technologies</h4>
                <small className='text-light'>Rollup, ZK-Proof, Cryptography, ...</small>
              </div>
            </article>
            <article className='experience__details'>
              <BsPatchCheckFill className='experience__details-icon' />
              <div>
                <h4>Tools</h4>
                <small className='text-light'>Ledger, Explorers, CMC, Sclapex...</small>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience