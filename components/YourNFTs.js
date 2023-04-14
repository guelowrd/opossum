import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'

export default function YourNFTs() {
    // UI state
    const [nfts, setNfts] = useState([])
    const [connected, setConnected] = useState(false)

    useEffect(function () {
        getNftsOfCurrentWallet()
        if (!connected) {
            getAllNfts()
        }
    });

    // Get all NFTs ever minted
    async function getAllNfts() {
        if (!hasEthereum()) return

        try {
            // Fetch data from contract
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_API_URL)
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, provider)
            const tokensIdAndData = []
            // Get amount of tokens ever minted
            const tokensMinted = await contract.totalSupply()
            // For all token ever minted, get the tokenId & data & check if owned by this address
            for (let i = tokensMinted - 1; i >= 0; i--) {
                const tokenData = await contract.uri(i)
                tokensIdAndData.push({
                    key: i.toString(),
                    data: tokenData.toString(),
                    owned: false
                })
            }
            setNfts(tokensIdAndData)
        } catch (error) {
            console.log(error)
        }
    }

    // Get NFTs owned by current wallet
    async function getNftsOfCurrentWallet() {
        if (!hasEthereum()) return

        try {
            // Fetch data from contract
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, provider)
            const address = await signer.getAddress()
            const tokensIdAndData = [];
            // Get amount of tokens owned by this address
            const tokensOwned = await contract.ownerBalance(address)
            // For each token owned, get the tokenId
            const tokenIdsOwned = []
            for (let i = tokensOwned - 1; i >= 0; i--) {
                const tokenId = await contract.tokenOfOwnerByIndex(address, i)
                tokenIdsOwned.push(parseInt(tokenId))
                const tokenData = await contract.uri(tokenId)
                tokensIdAndData.push({
                    key: tokenId.toString(),
                    data: tokenData.toString(),
                    owned: true
                })
            }
            // Get amount of tokens ever minted
            const tokensMinted = await contract.totalSupply()
            // For all token ever minted, get the tokenId & data & check if owned by this address
            for (let i = tokensMinted - 1; i >= 0; i--) {
                if (tokenIdsOwned.includes(i)) {
                    continue
                }
                const tokenData = await contract.uri(i)
                tokensIdAndData.push({
                    key: i.toString(),
                    data: tokenData.toString(),
                    owned: false
                })
            }
            setNfts(tokensIdAndData)
            setConnected(true);
        } catch (error) {
            setConnected(false);
            console.log(error)
        }
    }
    if (nfts.length < 1) return (null)
    return (
        <>
            <h2 className="font-semibold text-gray-600 text-2xl mt-1">Opossum Gallery</h2>
            <ul className="grid grid-cols-4 gap-6 h-24 lg:h-30">
                {nfts.map((nft) =>
                    <div key={nft.key} className="bg-gray-100 shadow-lg p-4 justify-center items-center text-center text-sm">
                        <img alt="" className={(nft.owned ? "border-blue-900" : "border-white") + " rounded-lg border-2 bg-gray-100 mb-1"} src={nft.data} />
                        #{nft.key + (nft.owned ? " is yours" : "")}
                    </div>)}
            </ul>
        </>
    )
}