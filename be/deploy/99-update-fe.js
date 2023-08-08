const fs = require('fs-extra');
const path = require('path');

const rootPath = path.resolve(__dirname).split('/be/deploy')[0]
const contractName = 'GAME2048';

async function updateAbi() {
  const contract = await hre.artifacts.readArtifact(contractName)
  fs.writeFileSync(`${rootPath}/fe/src/libs/${contractName}ContractAbi.json`, JSON.stringify(contract.abi, null, 2))
}

async function updateContractAddresses() {
  const deploymentInfo = await hre.deployments.getOrNull(contractName);

  fs.writeFileSync(`${rootPath}/fe/src/libs/${contractName}ContractAddress.json`, JSON.stringify(deploymentInfo.address, null, 2))
}

async function moveTypes() {
  fs.copySync(`${rootPath}/be/types`, `${rootPath}/fe/src/types/contracts`, { overwrite: true })
}

module.exports = async () => {
  if (!process.env.UPDATE_FRONTEND_CONTRACT) {
    return
  }
  console.log("Writing to front end...")
  await updateAbi()
  await updateContractAddresses()
  await moveTypes()
  console.log("Front end written!")
}


module.exports.tags = ["all", "frontend"]
