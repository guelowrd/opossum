import { ethers } from 'ethers'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'

// Constants
const MINT_PRICE = 0.0123;

// Call smart contract to mint NFT(s) from current address
export async function mintNft(setMintLoading, setMintMessage, setMintError, dataToMint) {
  try {
    // Get wallet details
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    try {
      const address = await signer.getAddress()
      setMintLoading(true);
      // Interact with contract
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, signer)
      const totalPrice = MINT_PRICE
      const transaction = await contract.mint(dataToMint, { value: ethers.utils.parseEther(totalPrice.toString()) })
      await transaction.wait()
      setMintMessage(`Congrats, you minted an Opossum! Check it out in the gallery below.`)
      setMintError(false)
    } catch (thrown) {
      console.log(thrown)
      setMintMessage('Connect your wallet first.');
      setMintError(true)
    }
  } catch (error) {
    setMintMessage(error.message)
    setMintError(true)
  }
  setMintLoading(false)
}