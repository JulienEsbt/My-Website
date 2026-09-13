import {useTranslation} from 'react-i18next'
export default function WalletMetricsGuide() {
    const {i18n} = useTranslation('web3')
    const fr = (i18n.resolvedLanguage ?? i18n.language).startsWith('fr')
    const items = fr
        ? [
              [
                  'Valeur du portefeuille',
                  'Somme de la valeur du solde natif et des tokens pour lesquels un prix a été obtenu, sur le réseau sélectionné. Les NFT ne sont pas valorisés dans ce total. Un actif sans prix ne vaut pas nécessairement zéro.',
              ],
              [
                  'Tokens détectés et valorisés',
                  'Détectés : les tokens trouvés par le service. Valorisés : ceux dont le solde et le prix donnent une valeur positive. Une liste limitée ou un échec de métadonnées peut rendre le résultat partiel.',
              ],
              [
                  'Répartition et principal actif',
                  'Les pourcentages portent sur la valeur calculée des actifs valorisés. Ils ne décrivent pas forcément la totalité de tes avoirs, ni les autres réseaux.',
              ],
              [
                  'NFT et données indisponibles',
                  'Le compteur provient du fournisseur NFT. Un tiret signifie que le nombre n’est pas disponible ; ce n’est pas un zéro. Les alertes de chargement partiel restent à prendre en compte.',
              ],
              [
                  'Sources et vérification',
                  'Les soldes et transferts sont interrogés via Alchemy ; les prix sont récupérés par le service de cotation du site. La cotation est limitée à 20 contrats par analyse. Les prix reçus sont réutilisés pendant une minute au maximum. Les données peuvent évoluer entre deux analyses. Le lien vers l’explorateur permet de vérifier l’adresse sur le réseau choisi.',
              ],
          ]
        : [
              [
                  'Portfolio value',
                  'The native balance value plus tokens with an available price on the selected network. NFTs are not valued in this total. An asset without a price is not necessarily worthless.',
              ],
              [
                  'Detected and priced tokens',
                  'Detected tokens are those found by the service. Priced tokens have a positive calculated value. Truncated lists or metadata failures can make the result partial.',
              ],
              [
                  'Allocation and top holding',
                  'Percentages refer to the calculated value of priced assets. They may not represent all your holdings or other networks.',
              ],
              [
                  'NFTs and unavailable data',
                  'The count comes from the NFT provider. A dash means unavailable, not zero. Partial-loading notices still apply.',
              ],
              [
                  'Sources and verification',
                  'Balances and transfers are queried through Alchemy; prices come through the site’s pricing service. Pricing is limited to 20 contracts per analysis. Received prices are reused for up to one minute. Data can change between analyses. The explorer link lets you verify the address on the selected network.',
              ],
          ]
    return (
        <details className="wallet-metrics-guide">
            <summary>{fr ? 'Comment lire ces résultats ?' : 'How to read these results'}</summary>
            <div>
                {items.map(([title, body]) => (
                    <section key={title}>
                        <h4>{title}</h4>
                        <p>{body}</p>
                    </section>
                ))}
            </div>
        </details>
    )
}
