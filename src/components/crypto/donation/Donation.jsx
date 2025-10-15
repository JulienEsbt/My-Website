import React, { useEffect, useState, useCallback } from "react";
import { BrowserProvider, parseEther } from "ethers";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Popover from "@mui/material/Popover";
import ETH from "../../../assets/crypto/ETH.jpeg";
import "./donation.css";

// Map chainId -> { name, explorerBase }
const CHAIN_META = {
    1:   { name: "Ethereum (Mainnet)",           explorer: "https://etherscan.io/" },
    5:   { name: "Goerli (Testnet)",             explorer: "https://goerli.etherscan.io/" },
    56:  { name: "BNB Smart Chain (Mainnet)",    explorer: "https://bscscan.com/" },
    100: { name: "Gnosis (Mainnet - xDai)",      explorer: "https://blockscout.com/xdai/mainnet/" },
    137: { name: "Polygon (Mainnet)",            explorer: "https://polygonscan.com/" },
    80001:{ name: "Polygon Mumbai (Testnet)",    explorer: "https://mumbai.polygonscan.com/" },
    // anciens testnets (Ropsten/Rinkeby/Kovan) sont dépréciés
};

async function sendETH({ ether, receiver }) {
    const { ethereum } = window;
    if (!ethereum) throw new Error("No Ethereum provider. Install MetaMask.");
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
        to: receiver,
        value: parseEther(String(ether || "0")),
    });
    await tx.wait();
    return tx.hash;
}

const Donation = () => {
    const [currentAccount, setCurrentAccount] = useState();
    const [networkName, setNetworkName] = useState("Unknown network");
    const [explorerBase, setExplorerBase] = useState("");
    const [txHash, setTxHash] = useState("");
    const [isShown, setIsShown] = useState(false);

    const refreshNetwork = useCallback(async () => {
        const { ethereum } = window;
        if (!ethereum) return;
        const hexChainId = await ethereum.request({ method: "eth_chainId" });
        const chainId = parseInt(hexChainId, 16);
        const meta = CHAIN_META[chainId];
        if (meta) {
            setNetworkName(meta.name);
            setExplorerBase(meta.explorer);
        } else {
            setNetworkName(`Chain ID ${chainId}`);
            setExplorerBase("");
        }
    }, []);

    const checkIfWalletIsConnected = useCallback(async () => {
        const { ethereum } = window;
        if (!ethereum) return;
        await refreshNetwork();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        setCurrentAccount(accounts && accounts.length ? accounts[0] : undefined);
    }, [refreshNetwork]);

    useEffect(() => {
        checkIfWalletIsConnected();

        const { ethereum } = window;
        if (!ethereum) return;

        const handleChainChanged = () => {
            setTxHash("");
            refreshNetwork();
        };
        const handleAccountsChanged = (accounts) => {
            setCurrentAccount(accounts?.[0]);
        };

        ethereum.on?.("chainChanged", handleChainChanged);
        ethereum.on?.("accountsChanged", handleAccountsChanged);
        return () => {
            ethereum.removeListener?.("chainChanged", handleChainChanged);
            ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        };
    }, [checkIfWalletIsConnected, refreshNetwork]); // ✅ OK pour eslint

    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            alert("No wallet detected. Please install MetaMask.");
            return;
        }
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
            await refreshNetwork();
        } catch (e) {
            console.error(e);
        }
    };

    const makeTransaction = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData(e.target);
            const amount = data.get("ether");
            const hash = await sendETH({
                ether: amount,
                receiver: "0x718a544638Fd113A58C1062E4b2E8a404b13D2eC",
            });
            setTxHash(hash);
        } catch (err) {
            console.error(err);
            alert(err?.message || "Transaction failed");
        }
    };

    /*useEffect(() => {
        checkIfWalletIsConnected();

        const { ethereum } = window;
        if (!ethereum) return;

        const handleChainChanged = () => {
            setTxHash("");
            refreshNetwork();
        };
        const handleAccountsChanged = (accounts) => {
            setCurrentAccount(accounts?.[0]);
        };

        ethereum.on?.("chainChanged", handleChainChanged);
        ethereum.on?.("accountsChanged", handleAccountsChanged);

        return () => {
            ethereum.removeListener?.("chainChanged", handleChainChanged);
            ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        };
    }, []);*/

    const txUrl = txHash && explorerBase ? `${explorerBase}tx/${txHash}` : "";

    return (
        <section id="donation">
            <h5>If you want to make a</h5>
            <h2>Donation</h2>

            <article className="donation container">
                <div className="network__avatar">
                    <img src={ETH} alt="Ethereum logo" />
                </div>

                <PopupState>
                    {(popupState) => (
                        <div>
                            {currentAccount && (
                                <Button {...bindTrigger(popupState)}>Network :</Button>
                            )}
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                            >
                                <Typography sx={{ p: 2 }}>{networkName}</Typography>
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
                            You can connect your wallet with MetaMask (or any EVM wallet like
                            XDEFI) and send an on-chain transaction. You can also switch
                            network (BSC, Polygon, Gnosis, etc.).
                        </div>
                    )}
                </h5>

                {currentAccount && (
                    <small className="network">
                        <h5 className="network">Connected Address : {currentAccount}</h5>
                    </small>
                )}

                <form className="container donation__container eth" onSubmit={makeTransaction}>
                    <h5>Send ETH Donation</h5>
                    <input className="but" name="ether" type="text" placeholder="Amount in ETH" />
                    <button type="submit" className="but but-primary">Donate now</button>
                    <br />
                    {txUrl && (
                        <a href={txUrl} target="_blank" rel="noreferrer" className="but but-primary">
                            Voir la transaction
                        </a>
                    )}
                </form>
            </article>
        </section>
    );
};

export default Donation;