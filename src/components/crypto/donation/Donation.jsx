import React, {useCallback, useEffect, useState} from "react";
import {BrowserProvider, parseEther} from "ethers";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PopupState, {bindPopover, bindTrigger} from "material-ui-popup-state";
import Popover from "@mui/material/Popover";
import ETH from "../../../assets/crypto/ETH.jpeg";
import "./donation.css";

// Mapping chainId -> name + explorer
const CHAINS = {
    1n: {name: "Ethereum (Mainnet)", scan: "https://etherscan.io/"},
    5n: {name: "Goerli (Testnet)", scan: "https://goerli.etherscan.io/"}, // legacy testnet
    137n: {name: "Polygon (Mainnet)", scan: "https://polygonscan.com/"},
    80001n: {name: "Mumbai (Polygon Testnet)", scan: "https://mumbai.polygonscan.com/"}, // legacy testnet
    56n: {name: "Binance Smart Chain (BSC)", scan: "https://bscscan.com/"},
    100n: {name: "Gnosis (xDai)", scan: "https://blockscout.com/xdai/mainnet/"}
};

const SendETH = async ({ether, receiver}) => {
    try {
        const {ethereum} = window;
        if (!ethereum) {
            console.log("No Ethereum provider. Please install MetaMask.");
            return null;
        }
        const provider = new BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const tx = await signer.sendTransaction({
            to: receiver,
            value: parseEther(String(ether || "0"))
        });

        console.log("Mining...", tx.hash);
        const receipt = await tx.wait();
        console.log("Mined -- ", receipt?.hash || tx.hash);
        return receipt?.hash || tx.hash;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const Donation = () => {
    const [currentAccount, setCurrentAccount] = useState();
    const [networkName, setNetworkName] = useState("Unknown network");
    const [etherscanBase, setEtherscanBase] = useState("");
    const [txHash, setTxHash] = useState("");
    const [isShown, setIsShown] = useState(false);

    const refreshNetwork = useCallback(async () => {
        try {
            if (!window.ethereum) return;
            const provider = new BrowserProvider(window.ethereum);
            const {chainId} = await provider.getNetwork(); // bigint
            const info = CHAINS[chainId];
            if (info) {
                setNetworkName(info.name);
                setEtherscanBase(info.scan);
            } else {
                setNetworkName(`Chain ID: ${chainId.toString()}`);
                setEtherscanBase("");
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    const checkIfWalletIsConnected = useCallback(async () => {
        if (!window.ethereum) {
            console.log("No Ethereum provider. Please install MetaMask.");
            return;
        }
        try {
            await refreshNetwork();
            const accounts = await window.ethereum.request({method: "eth_accounts"});
            if (accounts?.length) {
                setCurrentAccount(accounts[0]);
                console.log("Connected:", accounts[0]);
            } else {
                console.log("Ethereum detected, but no active connection.");
            }
        } catch (error) {
            console.log(error);
        }
    }, [refreshNetwork]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("No Ethereum provider. Please install MetaMask.");
            return;
        }
        try {
            await checkIfWalletIsConnected();
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            if (accounts?.length) setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const makeTransaction = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const amount = data.get("ether");
        const hash = await SendETH({
            ether: amount,
            receiver: "0x718a544638Fd113A58C1062E4b2E8a404b13D2eC"
        });
        if (hash) setTxHash(hash);
    };

    useEffect(() => {
        checkIfWalletIsConnected();

        // listen to chain/account changes
        if (window.ethereum) {
            const onChainChanged = () => {
                refreshNetwork();
            };
            const onAccountsChanged = (accounts) => {
                setCurrentAccount(accounts?.[0]);
            };
            window.ethereum.on?.("chainChanged", onChainChanged);
            window.ethereum.on?.("accountsChanged", onAccountsChanged);
            return () => {
                window.ethereum.removeListener?.("chainChanged", onChainChanged);
                window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
            };
        }
    }, [checkIfWalletIsConnected, refreshNetwork]);

    return (
        <section id="donation">
            <h5>If you want to make a</h5>
            <h2>Donation</h2>

            <article className="donation container">
                <div className="network__avatar">
                    <img src={ETH} alt="network__avatar"/>
                </div>

                {/* PopupState est OK puisque tu l'as installé */}
                <PopupState>
                    {(popupState) => (
                        <div>
                            {currentAccount && (
                                <Button {...bindTrigger(popupState)}>Network :</Button>
                            )}
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                transformOrigin={{vertical: "top", horizontal: "center"}}
                            >
                                <Typography sx={{p: 2}}>{networkName}</Typography>
                            </Popover>
                        </div>
                    )}
                </PopupState>

                <h5 className="network__name">
                    {!currentAccount && (
                        <Button
                            onClick={connectWallet}
                            onMouseEnter={() => setIsShown(true)}
                            onMouseLeave={() => setIsShown(false)}
                        >
                            Connect Wallet
                        </Button>
                    )}
                    {isShown && (
                        <div className="network__name">
                            You can connect your wallet with MetaMask or any EVM wallet and send an on-chain
                            transaction.
                            You can also change network in MetaMask (BSC, Polygon, Gnosis, etc.).
                        </div>
                    )}
                </h5>

                <small className="network">
                    {currentAccount && (
                        <h5 className="network"> Connected Address : {currentAccount} </h5>
                    )}
                </small>

                <form className="container donation__container eth" onSubmit={makeTransaction}>
                    <h5>Send ETH Donation</h5>
                    <input className="but" name="ether" type="text" placeholder="Amount in ETH"/>
                    <button type="submit" className="but but-primary">Donate now</button>
                    <br/>
                    {etherscanBase && txHash ? (
                        <a
                            href={`${etherscanBase}tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="but but-primary"
                        >
                            Voir la transaction
                        </a>
                    ) : (
                        <Button disabled className="but but-primary">No Tx yet</Button>
                    )}
                </form>
            </article>
        </section>
    );
};

export default Donation;