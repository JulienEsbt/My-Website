import {useRef} from 'react'
import {FiX} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'
import useFocusTrap from '../../../../components/common/accessibility/useFocusTrap.js'
import WalletTokenRow from './WalletTokenRow.jsx'

const WalletInspectorDialogs = ({
    result,
    selectedNft,
    showAllNfts,
    showAllTokens,
    onSelectNft,
    onShowAllNfts,
    onShowAllTokens,
}) => {
    const {t} = useTranslation('web3')
    const tokensModalRef = useRef(null)
    const tokensCloseRef = useRef(null)
    const nftsModalRef = useRef(null)
    const nftsCloseRef = useRef(null)
    const nftModalRef = useRef(null)
    const nftCloseRef = useRef(null)

    useFocusTrap({
        active: showAllTokens && Boolean(result),
        containerRef: tokensModalRef,
        initialFocusRef: tokensCloseRef,
        onDismiss: () => onShowAllTokens(false),
    })
    useFocusTrap({
        active: showAllNfts && Boolean(result),
        containerRef: nftsModalRef,
        initialFocusRef: nftsCloseRef,
        onDismiss: () => onShowAllNfts(false),
    })
    useFocusTrap({
        active: Boolean(selectedNft),
        containerRef: nftModalRef,
        initialFocusRef: nftCloseRef,
        onDismiss: () => onSelectNft(null),
    })

    return (
        <>
            {showAllTokens && result && (
                <div className="wallet-inspector__modal" onClick={() => onShowAllTokens(false)}>
                    <div
                        ref={tokensModalRef}
                        className="wallet-inspector__modal-content wallet-inspector__modal-content--wide"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wallet-tokens-title"
                        tabIndex="-1"
                    >
                        <button
                            ref={tokensCloseRef}
                            type="button"
                            className="wallet-inspector__modal-close"
                            onClick={() => onShowAllTokens(false)}
                            aria-label={t('walletInspector.closeDialog')}
                        >
                            <FiX />
                        </button>
                        <h3 id="wallet-tokens-title">{t('walletInspector.tokens')}</h3>
                        <div className="wallet-token-list wallet-token-list--modal">
                            {result.allTokens.map((token) => (
                                <WalletTokenRow key={token.contract} token={token} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showAllNfts && result && (
                <div className="wallet-inspector__modal" onClick={() => onShowAllNfts(false)}>
                    <div
                        ref={nftsModalRef}
                        className="wallet-inspector__modal-content wallet-inspector__modal-content--wide"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wallet-nfts-title"
                        tabIndex="-1"
                    >
                        <button
                            ref={nftsCloseRef}
                            type="button"
                            className="wallet-inspector__modal-close"
                            onClick={() => onShowAllNfts(false)}
                            aria-label={t('walletInspector.closeDialog')}
                        >
                            <FiX />
                        </button>
                        <h3 id="wallet-nfts-title">{t('walletInspector.nfts')}</h3>
                        <div className="wallet-nft-gallery">
                            {result.nfts.map((nft) => (
                                <button
                                    key={nft.id}
                                    type="button"
                                    className="wallet-nft-card"
                                    onClick={() => {
                                        onShowAllNfts(false)
                                        onSelectNft(nft)
                                    }}
                                >
                                    <img src={nft.image} alt={nft.name} />
                                    <strong>{nft.name}</strong>
                                    <span>{nft.collection}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedNft && (
                <div className="wallet-inspector__modal" onClick={() => onSelectNft(null)}>
                    <div
                        ref={nftModalRef}
                        className="wallet-inspector__modal-content wallet-inspector__modal-content--single"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wallet-nft-title"
                        tabIndex="-1"
                    >
                        <button
                            ref={nftCloseRef}
                            type="button"
                            className="wallet-inspector__modal-close"
                            onClick={() => onSelectNft(null)}
                            aria-label={t('walletInspector.closeDialog')}
                        >
                            <FiX />
                        </button>
                        <img src={selectedNft.image} alt={selectedNft.name} />
                        <h3 id="wallet-nft-title">{selectedNft.name}</h3>
                        <p>{selectedNft.collection}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default WalletInspectorDialogs
