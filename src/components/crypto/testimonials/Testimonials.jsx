import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Button from '@mui/material/Button';
import ETH from '../../../assets/ETH.jpeg'
import './testimonials.css'

const SendETH = async ({ether, receiver }) => {
  try {
    const {ethereum} = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther(ether)
      });
      console.log("Mining...", tx.hash);
      await tx.wait();
      console.log("Mined -- ", tx.hash);
      console.log("tx", tx, { ether, receiver });
      return tx.hash;
    } else {
      console.log("Ethereum object doesn't exist or not detected. Please install MetaMask or a cryto wallet !");
    }
  } catch (err) {
    console.log(err);
  }
};

const Testimonials = () => {
  const [currentAccount, setCurrentAccount] = useState();
  const [network, setNetwork] = useState('Unknow network');
  const [etherscan, setEtherscan] = useState('No Scan link');
  const [tx, setTx] = useState('No Tx');

  const updateNetwork = async () => {
    const networkBis = await window.ethereum.request({method: 'net_version'});
    if (networkBis === '1') {
        setNetwork('Ethereum (Mainnet)');
        setEtherscan('https://etherscan.io/')
    } else if (networkBis === '3') {
        setNetwork('Ropsten (Ethereum Testnet)');
        setEtherscan('https://ropsten.etherscan.io/');
    } else if (networkBis === '5') {
        setNetwork('Goerli (Ethereum Testnet)');
        setEtherscan('https://goerli.etherscan.io/');
    } else if (networkBis === '4') {
        setNetwork('Rinkeby (Ethereum Testnet)');
        setEtherscan('https://rinkeby.etherscan.io/');
    } else if (networkBis === '42') {
        setNetwork('Kovan (Ethereum Testnet)');
        setEtherscan('https://kovan.etherscan.io/');
    } else if (networkBis === '100') {
        setNetwork('Gnosis (Mainnet - XDai Chain)');
        setEtherscan('https://blockscout.com/xdai/mainnet/');
    } else if (networkBis === '137') {
        setNetwork('Polygon (Mainnet - Matic)');
        setEtherscan('https://polygonscan.com/')
    } else if (networkBis === '80001') {
        setNetwork('Mumbai (Polygon Testnet)');
        setEtherscan('https://mumbai.polygonscan.com/');
    } else if (networkBis === '56') {
      setNetwork('Binance Smart Chain (Mainnet - BSC)');
      setEtherscan('https://www.bscscan.com/');
    }
  }

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        await updateNetwork();
        console.log({network})
        const accounts = await window.ethereum.request({method: "eth_accounts"});
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("The account", account, "is connected on", network, "network.");
          setCurrentAccount(account);
        } else {
          console.log("Metamask or Ethereum Object detected, but connection failed or not yet established.")
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Ethereum object doesn't exist or not detected, get Metamask !");
    }
  }

  const connectWallet = async () => {
    console.log("Requesting account...");
    if (window.ethereum) {
      console.log("Metamask or Ethereum Object detected.")
      try {
        await checkIfWalletIsConnected();
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        console.log("Connected to %s", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Ethereum object doesn't exist or not detected, get Metamask !");
    }
  }

  const makeTransaction = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setTx(await SendETH({
      ether: data.get("ether"),
      receiver: "0x718a544638Fd113A58C1062E4b2E8a404b13D2eC"
    }));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  },);

  return (
    <section id='testimonials'>
      <h5>If you want to make a</h5>
      <h2>Donation</h2>

      <article className='testimonials container'>
        <div className="client__avatar">
          <img src={ETH} alt="Avatar One" />
        </div>
        <h5 className='client__name'>
          Réseau :
          {currentAccount && (network)}
          {!currentAccount && (
          <Button onClick={connectWallet}>Connect Wallet</Button>)}
        </h5>
        <small className='client__review'>
          {currentAccount && (<h5 className='client__review'> Connected Address : {currentAccount} </h5>)}
        </small>
        <form className="container testimonials__container eth" onSubmit={makeTransaction}>
          <h5>Send ETH payment</h5>
          <input className="but" name="ether" type="text" placeholder="Amount in ETH" />
          <button type="submit" className="but but-primary">Donate now</button>
          <a href={etherscan + 'tx/' + tx} target="_blank" rel="noreferrer"><Button>Voir la transaction</Button></a>
        </form>
      </article>
    </section>
  )
}

export default Testimonials