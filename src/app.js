// import Web3 from "web3";
let web3;

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

    web3 = new Web3(window.ethereum);

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
    web3 = new Web3(window.ethereum);
    document.getElementById("imageContainer").style.display = "none";

    if (!window.ethereum.selectedAddress) {
      alert("Please connect to the wallet before paying the entrance fee.");
      return;
    }

    const accounts = await web3.eth.getAccounts();

    // Check if entrance fee is already paid
    const entranceFeePaid =
      sessionStorage.getItem("entranceFeePaid") === "true";

    if (entranceFeePaid) {
      // Display images directly
      await displayImages();
      return;
    }

    const contract = new web3.eth.Contract(
      window.Museum.abi,
      window.Museum.address
    );

    const entranceFeeInWei = web3.utils.toWei("0.0001", "ether");
    const gasPrice = await web3.eth.getGasPrice();

    // Create the transaction object
    const transactionObject = {
      from: accounts[0],
      value: entranceFeeInWei,
      gas: 700000,
      gasPrice: gasPrice,
    };

    // Send the transaction using the contract instance
    const tx = await contract.methods.payEntrance().send(transactionObject);
    await web3.eth.getTransactionReceipt(tx.transactionHash);

    console.log("Entrance fee paid successfully", tx);
    alert("Entrance fee paid successfully");

    // Save entrance fee payment status to local storage
    sessionStorage.setItem("entranceFeePaid", "true");

    // Display fetched images after payment
    await displayImages();
  } catch (error) {
    console.error("Error paying entrance fee", error);

    if (error.message.includes("reverted")) {
      alert("Entrance fee not paid");
    } else if (
      error.data &&
      error.data.originalError &&
      error.data.originalError.message.includes("Entrance fee already paid")
    ) {
      // Handle the case where entrance fee is already paid
      alert("Entrance fee already paid.");
      await displayImages();
    }
  }
}

async function displayImages() {
  web3 = new Web3(window.ethereum);

  const imageContainer = document.getElementById("imageContainer");
  imageContainer.innerHTML = "";

  const contract = new web3.eth.Contract(
    window.Museum.abi,
    window.Museum.address
  );

  const images = await contract.methods.viewImages().call();

  // Preload images
  const preloadImages = images.map((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    return img;
  });

  // Wait for all images to be loaded
  await Promise.all(preloadImages.map((img) => img.decode()));

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
}

window.onload = async function () {
  try {
    web3 = new Web3(window.ethereum);

    const entranceFeePaid =
      sessionStorage.getItem("entranceFeePaid") === "true";

    if (entranceFeePaid) {
      // Display images directly
      await displayImages();
    }
  } catch (error) {
    console.error("Error checking entrance fee status on page load", error);
  }
};

updateUI();

// Initially hide the image container, content, and payment section
document.getElementById("imageContainer").style.display = "none";
document.querySelector(".content").style.display = "block";
document.querySelector(".payment-section").style.display = "block";
