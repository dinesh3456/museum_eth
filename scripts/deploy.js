const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // get the signer that we will use to deploy
  const [deployer] = await ethers.getSigners();

  //const ownerAddress = "0xde018Addf960aB45CEA9b2D96d7a88a2196Cd59C";

  const Museum = await ethers.getContractFactory("Museum");
  const museum = await Museum.deploy();

  await museum.deployed();

  // Pull the address and ABI out while you deploy, since that will be key in interacting with the smart contract later
  const data = {
    contractName: museum.contractName,
    abi: JSON.parse(museum.interface.format("json")),
    address: museum.address,
  };

  // This writes the ABI and address to the marketplace.json
  // This data is then used by frontend files to connect with the smart contract
  fs.writeFileSync("./src/Museum.json", JSON.stringify(data));

  console.log("Successfully deployed marketplace to:", museum.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
