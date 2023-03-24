# Web3Form: Fill the Form & Get an Opossum
dApp to fill a form, generate an SVG from its answers and mint a non-transferrable NFTs to store it on the blockchain.
The NFT (ERC-1155 standard) is nicknamed *`Opossum`* which stands for *`Original Proof Of Splendid SubMission`*.
Built on Ethereum (Solidity) with Next.js (React) and TailwindCSS.

## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [MetaMask wallet browser extension](https://metamask.io/download.html).

## Getting Started
### Environment Setup
Duplicate `.env.example` to `.env` and fill out the environment variables.
Run `npm install`.

### Running The Smart Contract Locally
Compile the ABI for the smart contract using `npx hardhat compile`.
If you're successful, you'll receive a confirmation message:
```
Compilation finished successfully
```
And, a `src/artifacts` folder will be created in your project.
Run a local blockchain for testing with `npx hardhat node`.
If you're successful, you'll be presented with a number of account details in the CLI. Here's an example:
```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

(etc.)
```
Then in a new terminal window, `npx hardhat run scripts/deploy.js --network localhost` to deploy the smart contract locally.
If you're successful, you'll get something like the following CLI output:
```
Minter deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Adding A Local Account To MetaMask
Open your MetaMask browser extension and change the network to `Localhost 8545`.
Next, import one of the accounts by adding its Private Key (for example, `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`) to MetaMask.
If you're successful, you should see the a balance resembling something like `10000 ETH` in the wallet.

### Connecting The Front-End
In `.env` set the `NEXT_PUBLIC_MINTER_ADDRESS` environment variable to the address your smart contract was deployed to. For example, `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`.
In a new terminal window, load the front-end with `npm run dev`.

## Demo'ing The Functionality
Once set up, go to `localhost:3000` (or whatever post number you used), to view your dApp in the browser.
First, connect your wallet by clicking `Connect wallet`. Ensure you're connected to the `Localhost 8454` network in your MetaMask extension. Select the wallet that you imported earlier.
You can now test minting tokens by filling out the form clicking the `Submit Form & Mint Opossum` button.
If you successfully mint a number of NFTs, you should see the `Tokens minted` amount increment, and a preview of the minted Opossum in `Opossum Gallery` below.
Switching accounts in MetaMask will update the wallet address in the top right hand corner, and the gallery at the bottom.
Disconnecting all accounts will prompt you to connect your wallet.

## Testing
To test the smart contract, run `npx hardhat test`.
Basic tests can be found in `test/Minter.test.js`.