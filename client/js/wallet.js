document.addEventListener("DOMContentLoaded", async () => {
  // Load all account wallets
  const walletList = document.getElementById("registered-wallets");
  const addWalletBtn = document.getElementById("addWallet");
  const item = localStorage.getItem("userData");
  const res = JSON.parse(item);
  const userInfo = res.user;
  console.log(userInfo);

  // Await the resolved wallets data
  loadWallets(userInfo._id);

  // Add Wallet
  const addWalletContainer = document.querySelector(".add-wallet-container");
  const returnBtn = document.getElementById("return-btn");

  const chooseType = document.querySelector(".choose-type");
  const cardBtn = document.getElementById("card-btn");
  const mobileBtn = document.getElementById("mobile-btn");

  const cardForm = document.querySelector(".card-form");
  const cardInputs = document.querySelectorAll(".card-form input");
  const cardNumber = document.getElementById("card-number");
  const securityCode = document.getElementById("security-code");
  const cardName = document.getElementById("card-name");
  const expiryDate = document.getElementById("expiry-date");
  const cardRegister = document.getElementById("card-register-btn");

  const mobileForm = document.querySelector(".mobile-form");
  const mobileInputs = document.querySelectorAll(".mobile-form input");
  const mobileNumber = document.getElementById("mobile-number");
  const carrier = document.getElementById("carrier");
  const mobileRegister = document.getElementById("mobile-register-btn");

  let walletInfo;

  addWalletBtn.addEventListener("click", () => {
    addWalletContainer.style.display = "flex";
    chooseType.style.display = "flex";
    cardForm.style.display = "none";
    mobileForm.style.display = "none";
  });

  returnBtn.addEventListener("click", () => {
    addWalletContainer.style.display = "none";
  });

  cardBtn.addEventListener("click", () => {
    chooseType.style.display = "none";
    cardForm.style.display = "flex";
    mobileForm.style.display = "none";
  });

  cardRegister.addEventListener("click", () => {
    let isCardInputComplete = true;
    cardInputs.forEach((input) => {
      if (input.value == "") isCardInputComplete = false;
      return;
    });

    if (isCardInputComplete) {
      walletInfo = {
        type: "card",
        cardNumber: cardNumber.value,
        securityCode: securityCode.value,
        cardName: cardName.value,
        expiryDate: expiryDate.value,
        userID: userInfo._id,
      };
      addWallet(walletInfo);
    }
  });

  mobileBtn.addEventListener("click", () => {
    chooseType.style.display = "none";
    cardForm.style.display = "none";
    mobileForm.style.display = "flex";
  });

  mobileRegister.addEventListener("click", () => {
    let isMobileInputComplete = true;
    mobileInputs.forEach((input) => {
      if (input.value == "") isMobileInputComplete = false;
      return;
    });
    if (isMobileInputComplete == true) {
      walletInfo = {
        type: "mobile",
        number: mobileNumber.value,
        carrier: carrier.value,
        userID: userInfo._id,
      };
      addWallet(walletInfo);
    }
  });

  //Remove Wallet
  const removeBtn = document.getElementById("remove");
  removeBtn.addEventListener("click", () => {
    // Convert the children to an array and iterate over them
    Array.from(walletList.children).forEach((item) => {
      if (item.classList.contains("selected-wallet")) {
        walletList.removeChild(item);
        removeWallet(item.dataset.value);
      }
    });
  });

  //Deposit Money
  const depositBtn = document.getElementById("deposit");
  const depositContainer = document.querySelector(".deposit-container");
  const depositAmount = document.getElementById("deposit-amount");
  const depositSubmit = document.getElementById("deposit-submit");
  const depositExit = document.getElementById("exit-deposit");

  depositBtn.addEventListener("click", () => {
    depositContainer.style.display = "flex";
  });

  depositExit.addEventListener("click", () => {
    depositContainer.style.display = "none";
    transferContainer.style.display = "none";
  });

  depositSubmit.addEventListener("click", () => {
    if (depositAmount.value == "") {
      return;
    }
    modifyBalance(userInfo._id, depositAmount.value, "deposit");
  });

  //Transfer Money
  const transferBtn = document.getElementById("transfer");
  const transferContainer = document.querySelector(".transfer-container");
  const transferAmount = document.getElementById("transfer-amount");
  const transferSubmit = document.getElementById("transfer-submit");
  const transferExit = document.getElementById("exit-transfer");

  transferBtn.addEventListener("click", () => {
    transferContainer.style.display = "flex";
  });

  transferExit.addEventListener("click", () => {
    transferContainer.style.display = "none";
    depositContainer.style.display = "none";
  });

  transferSubmit.addEventListener("click", () => {
    if (transferAmount.value == "") {
      return;
    }
    modifyBalance(userInfo._id, transferAmount.value, "transfer");
  });

  async function loadWallets(id) {
    try {
      const response = await fetch(`http://localhost:5000/getWallets/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const walletsData = await response.json();
      console.log(walletsData);

      //Clear wallet list
      const items = Array.from(walletList.children);
      items.forEach((item, index) => {
        if (index !== 0) {
          walletList.removeChild(item);
        }
      });

      if (Array.isArray(walletsData?.wallets)) {
        walletsData.wallets.forEach((wallet) => {
          const li = document.createElement("li");
          const h5 = document.createElement("h5");
          const h6 = document.createElement("h6");

          // Insert wallet information
          if (wallet.type == "mobile") {
            h5.textContent = wallet.number;
            h6.textContent = wallet.carrier;
            li.setAttribute("data-value", wallet.number);
          } else {
            h5.textContent = wallet.cardNumber;
            li.setAttribute("data-value", wallet.cardNumber);
            h6.textContent = "CARD";
          }

          li.appendChild(h5);
          li.appendChild(h6);

          li.addEventListener("click", () => {
            const children = document.querySelectorAll(
              "#registered-wallets li"
            );
            children.forEach((card) => {
              card.style.border = "none";
              card.removeAttribute("class");
            });
            li.style.border = "4px solid #ff2575";
            li.setAttribute("class", "selected-wallet");
          });

          walletList.appendChild(li);
        });
      } else {
        console.error("No wallets found or invalid data format");
      }
    } catch (error) {
      console.error("Error fetching account wallet: ", error);
    }
  }

  async function addWallet(walletInfo) {
    console.log("wallet info: ", walletInfo);
    try {
      const response = await fetch("http://localhost:5000/addWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletInfo: walletInfo,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.error("Error signing up", error);
        return;
      }
      loadWallets(walletInfo.userID);
      addWalletContainer.style.display = "none";
    } catch (error) {
      console.error("Error creating wallet", error);
    }
  }

  async function removeWallet(number) {
    console.log(number);
    try {
      const res = await fetch("http://localhost:5000/removeWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      });
    } catch (error) {
      console.error("Error connecting to server", error);
    }
  }

  async function modifyBalance(userID, amount, inquiry) {
    console.log(userID, amount, inquiry);
    try {
      const res = await fetch("http://localhost:5000/modifyBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, amount, inquiry }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
});
