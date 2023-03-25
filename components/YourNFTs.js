import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'

export default function YourNFTs() {
    // UI state
    const [nfts, setNfts] = useState([])

    useEffect(function () {
        getNftsOfCurrentWallet()
    });

    // Get NFTs owned by current wallet
    async function getNftsOfCurrentWallet() {
        if (!hasEthereum()) return

        try {
            // Fetch data from contract
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, provider)
            const address = await signer.getAddress()
            // Get amount of tokens owned by this address
            const tokensOwned = await contract.ownerBalance(address)
            // For each token owned, get the tokenId
            const tokensIdAndData = []

            for (let i = 0; i < tokensOwned; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(address, i)
                const tokenData = await contract.uri(tokenId)
                tokensIdAndData.push({
                    key: tokenId.toString(),
                    data: tokenData.toString()
                })
            }

            setNfts(tokensIdAndData)
        } catch (error) {
            console.log(error)
        }
    }

    if (nfts.length < 1) return (null)

    return (
        <>
            <h2 className="text-xl font-semibold text-gray-600 text-sm mb-1 mt-1">Opossum Gallery</h2>
            <ul className="grid grid-cols-4 gap-6">
                {nfts.map((nft) =>
                    <div key={nft.key} className="bg-gray-100 shadow-lg p-4 h-24 lg:h-32 justify-center items-center text-center">
                        <img alt="" src={nft.data} />
                        {nft.key}
                    </div>)}
            </ul>
        </>
    )
}