import React from 'react'
import './tools.css'
import { BiCheck } from 'react-icons/bi'
import { TbAffiliate } from 'react-icons/tb'

const Tools = () => {
  return (
    <section id='tools'>
      <h5>What I Use</h5>
      <h2>Tools</h2>

      <div className='.container services__container'>
        <article className='service'>
          <div className='service__head'>
            <h3>Exchanges</h3>
          </div>
          <ul className='service__list'>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://www.binance.com/fr/register?ref=39988902" target='_blank' rel="noreferrer">Binance</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://join.swissborg.com/r/julienEXY6" target='_blank' rel="noreferrer">Swissborg</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://www.bitpanda.com/?ref=834175650551002831" target='_blank' rel="noreferrer">Bitpanda</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://crypto.com/exch/3bbx57fyz4" target='_blank' rel="noreferrer">Crypto.com</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://www.coinbase.com/join/esterb_z" target='_blank' rel="noreferrer">Coinbase</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://www.probit.com/r/66068663" target='_blank' rel="noreferrer">Probit</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://get.maiar.com/referral/109iztngwn" target='_blank' rel="noreferrer">Maiar</a>
            </li>
          </ul>
        </article>

        <article className='service'>
          <div className='service__head'>
            <h3>Others</h3>
          </div>
          <ul className='service__list'>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://coinmarketcap.com/invite?ref=FVM95Y3R" target='_blank' rel="noreferrer">CoinMarketCap</a>
            </li>
            <li>
              <TbAffiliate className='service__list-icon'/>
              <a href="https://fr.tradingview.com/gopro/?share_your_love=julienesbt" target='_blank' rel="noreferrer">TradingView</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://coin360.com/" target='_blank' rel="noreferrer">Coin360</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://defillama.com/" target='_blank' rel="noreferrer">DefiLlama</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://www.blockchaincenter.net/altcoin-season-index/" target='_blank' rel="noreferrer">Altcoin Season Index</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://scalpexindex.com/app/" target='_blank' rel="noreferrer">Scalpex Index</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://studio.glassnode.com/" target='_blank' rel="noreferrer">Glassnode</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://chainlist.org/" target='_blank' rel="noreferrer">ChainList</a>
            </li>
          </ul>
        </article>

        <article className='service'>
          <div className='service__head'>
            <h3>Some Explorers</h3>
          </div>
          <ul className='service__list'>
          <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://bitcoinexplorer.org/" target='_blank' rel="noreferrer">Bitcoin</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://etherscan.io/" target='_blank' rel="noreferrer">Ethereum</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://www.bscscan.com/" target='_blank' rel="noreferrer">Binance Smart Chain</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://explorer.elrond.com/" target='_blank' rel="noreferrer">Elrond</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://explorer.solana.com/" target='_blank' rel="noreferrer">Solana</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://polkadot.subscan.io/" target='_blank' rel="noreferrer">Polkadot</a>
            </li>
            <li>
              <BiCheck className='service__list-icon'/>
              <a href="https://www.mintscan.io/cosmos" target='_blank' rel="noreferrer">Cosmos</a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Tools