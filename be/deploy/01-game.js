const { ethers, upgrades } = require("hardhat");

async function main(hre) {
  const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;

	const {deployer, simpleERC20Beneficiary } = await getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);

  await deploy('GAME2048', {
		from: deployer,
		args: [],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});
}

module.exports = main;
