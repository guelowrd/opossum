require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts'
  },
  defaultNetwork: process.env.NEXT_PUBLIC_DEFAULT_NETWORK,
  networks: {
    hardhat: {
      chainId: 1337
    },
    maticmum: {
      url: process.env.NEXT_PUBLIC_API_URL_MATICMUM || "",
      accounts: [`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY || ""}`]
    },
    matic: {
      url: process.env.NEXT_PUBLIC_API_URL_MATIC || "",
      accounts: [`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY || ""}`]
    },
    scrollAlpha: {
      url: process.env.NEXT_PUBLIC_API_URL_SCROLL || "",
      accounts: [`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY || ""}`]
    }    
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      polygonMumbai: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.ETHERSCAN_API_KEY || "",
      scrollAlpha: "dummy_key_is_fine" 
    },
    customChains: [
      {
        network: 'scrollAlpha',
        chainId: 534353,
        urls: {
          apiURL: 'https://blockscout.scroll.io/api',
          browserURL: 'https://blockscout.scroll.io/',
        },
      },
    ],
  }
};