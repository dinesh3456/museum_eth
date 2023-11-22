// Replace 'YOUR_CONTRACT_ADDRESS' with the actual address of your deployed Solidity smart contract
const contractAddress = "YOUR_CONTRACT_ADDRESS";

// Replace 'YOUR_PRIVATE_KEY' with the private key of the account that deploys the contract
const privateKey = "YOUR_PRIVATE_KEY";

// Replace 'YOUR_ABI' with the ABI (Application Binary Interface) of your Solidity smart contract
const contractABI = YOUR_ABI;

// Function to update UI based on the wallet connection status
function updateUI() {
  const connectWalletBtn = document.getElementById("connectWalletBtn");

  if (window.ethereum && window.ethereum.selectedAddress) {
    connectWalletBtn.textContent = "Connected";
    connectWalletBtn.disabled = true;
  } else {
    connectWalletBtn.textContent = "Connect Wallet";
    connectWalletBtn.disabled = false;
  }
}

// Connect to the user's MetaMask wallet
async function connectWallet() {
  try {
    // Request account access if needed
    await window.ethereum.enable();
    console.log("Connected to MetaMask");

    // Initialize web3 after connecting
    const web3 = new Web3(window.ethereum);

    // Update UI
    updateUI();

    const connectWalletBtn = document.getElementById("connectWalletBtn");
    connectWalletBtn.textContent = "Connected";
    connectWalletBtn.disabled = true;
  } catch (error) {
    console.error("Error connecting to MetaMask", error);
  }
}

// Function to handle the payment of entrance fee
async function payEntrance() {
  try {
    // Connect to the user's wallet
    const web3 = new Web3(window.ethereum);

    if (!window.ethereum.selectedAddress) {
      alert("Please connect to the wallet before paying the entrance fee.");
      return;
    }

    // Get the user's accounts
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    // Get the contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Replace 'YOUR_AMOUNT_IN_WEI' with the actual entrance fee in Wei
    const entranceFeeInWei = web3.utils.toWei("0.05", "ether");

    // Send the transaction to pay entrance fee
    await contract.methods.payEntrance().send({
      from: userAccount,
      value: entranceFeeInWei,
    });

    console.log("Entrance fee paid successfully");
  } catch (error) {
    console.error("Error paying entrance fee", error);
  }
}

// Initialize the UI
updateUI();
