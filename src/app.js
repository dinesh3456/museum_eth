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

// ...

// ...

// ...

async function payEntrance() {
  try {
    const response = await fetch("./Museum.json");
    const MuseumJSON = await response.json();

    const web3 = new Web3(window.ethereum);

    if (!window.ethereum.selectedAddress) {
      alert("Please connect to the wallet before paying the entrance fee.");
      return;
    }

    const accounts = await web3.eth.getAccounts();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      MuseumJSON.address,
      MuseumJSON.abi,
      signer
    );

    const entranceFeeInWei = web3.utils.toWei("0.0000000000001", "ether");

    // Send the transaction to pay the entrance fee
    await contract.payEntrance({
      value: entranceFeeInWei,
      gasLimit: 300000, // Specify a reasonable gas limit
    });

    console.log("Entrance fee paid successfully");

    // Display fetched images after payment
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = "";

    const images = await contract.viewImages();
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

// ...

// ...

// Initialize the UI
updateUI();

// Initially hide the image container, content, and payment section
document.getElementById("imageContainer").style.display = "none";
document.querySelector(".content").style.display = "block";
document.querySelector(".payment-section").style.display = "block";
