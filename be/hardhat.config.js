require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    },
    // Add other network configurations if needed
  },
  namedAccounts: {
		deployer: {
      default: 0,
    },
		simpleERC20Beneficiary: 1,
	},
};
