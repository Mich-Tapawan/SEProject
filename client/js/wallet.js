document.addEventListener("DOMContentLoaded", async () => {
  // Load all account wallets
  const walletList = document.getElementById("registered-wallets");
  const addWalletBtn = document.getElementById("addWallet");
  const item = localStorage.getItem("userData");
  const res = JSON.parse(item);
  const userInfo = res.user;
  console.log(userInfo);

  // Await the resolved wallets data
  const walletsData = await loadWallets(userInfo._id);

  if (Array.isArray(walletsData?.wallets)) {
    walletsData.wallets.forEach((wallet) => {
      const li = document.createElement("li");
      const h5 = document.createElement("h5");
      const h6 = document.createElement("h6");

      // Insert wallet information
      if (wallet.type == "mobile") {
        h5.textContent = wallet.number;
        h6.textContent = wallet.carrier;
      } else {
        h5.textContent = wallet.cardNumber;
        h6.textContent = "CARD";
      }

      li.appendChild(h5);
      li.appendChild(h6);

      li.addEventListener("click", (event) => {
        const children = document.querySelectorAll("#registered-wallets li");
        children.forEach((card) => {
          card.style.border = "none";
        });
        li.style.border = "4px solid #ff2575";
      });

      walletList.appendChild(li);
    });
  } else {
    console.error("No wallets found or invalid data format");
  }

  // Add Wallet
  const addWalletContainer = document.querySelector(".add-wallet-container");
  const returnBtn = document.getElementById("return-btn");

  const chooseType = document.querySelector(".choose-type");
  const cardBtn = document.getElementById("card-btn");
  const mobileBtn = document.getElementById("mobile-btn");

  const cardForm = document.querySelector(".card-form");
  const cardNumber = document.getElementById("card-number");
  const securityCode = document.getElementById("security-code");
  const cardName = document.getElementById("card-name");
  const cardRegister = document.getElementById("card-register-btn");

  const mobileForm = document.querySelector(".mobile-form");
  const mobileNumber = document.getElementById("mobile-number");
  const carrier = document.getElementById("carrier");
  const mobileRegister = document.getElementById("mobile-register-btn");

  addWalletBtn.addEventListener("click", () => {
    addWalletContainer.style.display = "flex";
    chooseType.style.display = "flex";
    cardForm.style.display = "none";
    mobileForm.style.display = "none";
    addWallet();
  });

  returnBtn.addEventListener("click", () => {
    addWalletContainer.style.display = "none";
  });

  cardBtn.addEventListener("click", () => {
    console.log("click");
    chooseType.style.display = "none";
    cardForm.style.display = "flex";
    mobileForm.style.display = "none";
  });

  mobileBtn.addEventListener("click", () => {
    chooseType.style.display = "none";
    cardForm.style.display = "none";
    mobileForm.style.display = "flex";
  });

  async function loadWallets(id) {
    try {
      const response = await fetch(`http://localhost:5000/getWallets/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching account wallet: ", error);
    }
  }

  async function addWallet() {
    try {
      const response = await fetch("http://localhost:5000/addWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Error creating wallet", error);
    }
  }
});
