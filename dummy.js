//import Web3 from "web3";

async function updateUI() {
    const connectWalletBtn = document.getElementById("connectWalletBtn");
  
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWalletBtn.textContent = "Connected";
      connectWalletBtn.disabled = true;
    } else {
      connectWalletBtn.textContent = "Connect Wallet";
      connectWalletBtn.disabled = false;
    }
  }
  
  async function connectWallet() {
    try {
      await window.ethereum.enable();
      console.log("Connected to MetaMask");
  
      const web3 = new Web3(window.ethereum);
  
      // Update UI
      await updateUI();
  
      const connectWalletBtn = document.getElementById("connectWalletBtn");
      connectWalletBtn.textContent = "Connected";
      connectWalletBtn.disabled = true;
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  }
  
  async function payEntrance() {
    try {
      const web3 = new Web3(window.ethereum);
  
      if (!window.ethereum.selectedAddress) {
        alert("Please connect to the wallet before paying the entrance fee.");
        return;
      }
  
      const accounts = await web3.eth.getAccounts();
  
      // Fetch Museum.json using fetch
      const response = await fetch("Museum.json");
      const MuseumJSON = await response.json();
  
      const contract = new web3.eth.Contract(MuseumJSON.abi, MuseumJSON.address);
  
      const entranceFeeInWei = web3.utils.toWei("0.0000000000001", "ether");
      const gasPrice = await web3.eth.getGasPrice();
  
      // Create the transaction object
      const transactionObject = {
        from: accounts[0],
        value: entranceFeeInWei,
        gas: 300000,
        gasPrice: gasPrice,
      };
  
      // Send the transaction using the contract instance
      const tx = await contract.methods.payEntrance().send(transactionObject);
  
      // Wait for the transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
  
      if (receipt.status) {
        console.log("Entrance fee paid successfully");
  
        // Display fetched images after payment
        const imageContainer = document.getElementById("imageContainer");
        imageContainer.innerHTML = "";
  
        const images = await contract.methods.viewImages().call();
        images.forEach((imageUrl) => {
          const imgElement = document.createElement("img");
          imgElement.src = imageUrl;
          imgElement.classList.add("image");
          imageContainer.appendChild(imgElement);
        });
  
        // Hide unnecessary elements
        document.querySelector(".content").style.display = "none";
        document.querySelector(".payment-section").style.display = "none";
  
        // Show the image container
        imageContainer.style.display = "block";
      } else {
        console.error("Transaction failed.");
      }
    } catch (error) {
      if (
        error.data &&
        error.data.originalError &&
        error.data.originalError.message.includes("Entrance fee already paid")
      ) {
        // Handle the case where entrance fee is already paid
        alert("Entrance fee already paid.");
      } else {
        console.error("Error paying entrance fee", error);
      }
    }
  }
  
  updateUI();
  
  // Initially hide the image container, content, and payment section
  document.getElementById("imageContainer").style.display = "none";
  document.querySelector(".content").style.display = "block";
  document.querySelector(".payment-section").style.display = "block";
  