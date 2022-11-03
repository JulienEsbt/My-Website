import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Popover from '@mui/material/Popover';
import ETH from '../../../assets/crypto/ETH.jpeg'
import './donation.css'

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

const Donation = () => {
  const [currentAccount, setCurrentAccount] = useState();
  const [network, setNetwork] = useState('Unknow network');
  const [etherscan, setEtherscan] = useState('No Scan link');
  const [tx, setTx] = useState('No Tx');
  const [isShown, setIsShown] = useState(false);

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
      console.log("Ethereum object doesn't exist or not detected, get Metamask !");
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
    <section id='donation'>
      <h5>If you want to make a</h5>
      <h2>Donation</h2>

      <article className='donation container'>
        <div className="network__avatar">
          <img src={ETH} alt="network__avatar" />
        </div>
        <PopupState>
          {(popupState) => (
              <div>
                {currentAccount && (<Button {...bindTrigger(popupState)}>Network : </Button> )}
                <Popover {...bindPopover(popupState)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} transformOrigin={{vertical: 'top', horizontal: 'center'}}>
                  <Typography sx={{ p: 2 }}>{network}</Typography>
                </Popover>
              </div>
          )}
        </PopupState>
        <h5 className='network__name'>
          {!currentAccount && (
          <Button onClick={connectWallet} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>Connect Wallet</Button>)}
          {isShown && (
              <div className="network__name">
                You can connect your wallet with Metamask or a any other crypto wallet (as XDefi or whatever) and send a transaction OnChain on Ethereum blockchain.
                You can also change the network on Metamask to make the donation on an other blockchain (EVM Compatible, as BSC, Polygon, Gnosis, Testnets, etc).
              </div>
          )}
        </h5>
        <small className='network'>
          {currentAccount && (<h5 className='network'> Connected Address : {currentAccount} </h5>)}
        </small>
        <form className="container donation__container eth" onSubmit={makeTransaction}>
          <h5>Send ETH Donation</h5>
          <input className="but" name="ether" type="text" placeholder="Amount in ETH" />
          <button type="submit" className="but but-primary">Donate now</button>
          <br></br>
          <a href={etherscan + 'tx/' + tx} target="_blank" rel="noreferrer" className="but but-primary">Voir la transaction</a>
        </form>
      </article>
    </section>
  )
}

export default Donation