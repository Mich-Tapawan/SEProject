document.addEventListener("DOMContentLoaded", async () => {
  // Load all account wallets
  const subList = document.getElementById("registered-subs");
  const currentBalance = document.getElementById("current-balance");
  const budgetLimit = document.getElementById("monthly-limit");
  const budgetPercentage = document.getElementById("budget-percentage");

  const item = localStorage.getItem("userID");
  let user = JSON.parse(item);
  console.log("userID", user._id);
  loadData(user._id);

  // Await the resolved subscription data
  //loadSubscriptions(user._id);

  // Edit Monthly limit
  document.querySelector("#edit").addEventListener("click", () => {});

  // Add Wallet
  const addSubContainer = document.querySelector(".add-sub-container");
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
  const cardNext = document.getElementById("card-next");

  const mobileForm = document.querySelector(".mobile-form");
  const mobileInputs = document.querySelectorAll(".mobile-form input");
  const mobileNumber = document.getElementById("mobile-number");
  const carrier = document.getElementById("carrier");
  const mobileNext = document.getElementById("mobile-next");

  let walletInfo;
  let inquiry;
  const depositBtn = document.getElementById("deposit");
  const depositContainer = document.querySelector(".deposit-container");
  const depositAmount = document.getElementById("deposit-amount");
  const depositSubmit = document.getElementById("deposit-submit");
  const depositExit = document.getElementById("exit-deposit");

  const transferBtn = document.getElementById("transfer");
  const transferContainer = document.querySelector(".transfer-container");
  const transferAmount = document.getElementById("transfer-amount");
  const transferSubmit = document.getElementById("transfer-submit");
  const transferExit = document.getElementById("exit-transfer");

  cardBtn.addEventListener("click", () => {
    chooseType.style.display = "none";
    cardForm.style.display = "flex";
    mobileForm.style.display = "none";
  });

  mobileBtn.addEventListener("click", () => {
    chooseType.style.display = "none";
    cardForm.style.display = "none";
    mobileForm.style.display = "flex";
  });

  returnBtn.addEventListener("click", () => {
    addSubContainer.style.display = "none";
  });

  depositBtn.addEventListener("click", () => {
    addSubContainer.style.display = "flex";
    chooseType.style.display = "flex";
    cardForm.style.display = "none";
    mobileForm.style.display = "none";
    inquiry = "deposit";
  });

  transferBtn.addEventListener("click", () => {
    addSubContainer.style.display = "flex";
    chooseType.style.display = "flex";
    cardForm.style.display = "none";
    mobileForm.style.display = "none";
    inquiry = "transfer";
  });

  cardNext.addEventListener("click", () => {
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
        userID: user._id,
      };

      addSubContainer.style.display = "none";
      inquiry == "deposit"
        ? (depositContainer.style.display = "flex")
        : (transferContainer.style.display = "flex");
    }
  });

  mobileNext.addEventListener("click", () => {
    let isMobileInputComplete = true;
    mobileInputs.forEach((input) => {
      if (input.value == "") isMobileInputComplete = false;
      return;
    });

    if (isMobileInputComplete) {
      walletInfo = {
        type: "mobile",
        number: mobileNumber.value,
        carrier: carrier.value,
        userID: user._id,
      };

      addSubContainer.style.display = "none";
      inquiry == "deposit"
        ? (depositContainer.style.display = "flex")
        : (transferContainer.style.display = "flex");
    }
  });

  depositExit.addEventListener("click", () => {
    depositContainer.style.display = "none";
  });

  transferExit.addEventListener("click", () => {
    transferContainer.style.display = "none";
  });

  depositSubmit.addEventListener("click", () => {
    if (depositAmount.value == "") {
      return;
    }

    modifyBalance(walletInfo, user._id, depositAmount.value, "deposit");
  });

  transferSubmit.addEventListener("click", () => {
    if (transferAmount.value == "") {
      return;
    }
    modifyBalance(walletInfo, user._id, transferAmount.value, "transfer");
  });

  //Remove Wallet
  const removeBtn = document.getElementById("remove");
  removeBtn.addEventListener("click", () => {
    // Convert the children to an array and iterate over them
    Array.from(subList.children).forEach((item) => {
      if (item.classList.contains("selected-wallet")) {
        subList.removeChild(item);
        removeWallet(item.dataset.value);
      }
    });
  });

  async function loadData(userID) {
    console.log(userID);
    try {
      const res = await fetch(`http://localhost:5000/getUserData/${userID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const userData = await res.json();

      console.log(userData);
      currentBalance.innerHTML = `₱${userData.balance}`;
      budgetLimit.innerHTML = `₱${userData.monthlyLimit}`;
      const budgetUsed =
        (Number(userData.monthlyLimit) / Number(userData.balance)) * 100;
      budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }

  async function loadSubscriptions(id) {
    try {
      const response = await fetch(`http://localhost:5000/getWallets/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const walletsData = await response.json();
      console.log(walletsData);

      //Clear wallet list
      const items = Array.from(subList.children);
      items.forEach((item, index) => {
        if (index !== 0) {
          subList.removeChild(item);
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
            const children = document.querySelectorAll("#registered-subs li");
            children.forEach((card) => {
              card.style.border = "none";
              card.removeAttribute("class");
            });
            li.style.border = "4px solid #ff2575";
            li.setAttribute("class", "selected-wallet");
          });

          subList.appendChild(li);
        });
      } else {
        console.error("No wallets found or invalid data format");
      }
    } catch (error) {
      console.error("Error fetching account wallet: ", error);
    }
  }

  // Deposit or Transfer money
  async function modifyBalance(walletInfo, userID, amount, inquiry) {
    console.log(walletInfo, userID, amount, inquiry);
    try {
      const res = await fetch("http://localhost:5000/modifyBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletInfo, userID, amount, inquiry }),
      });
      const data = await res.json();
      console.log(data);
      localStorage.setItem("userData", data);
      const user = data.user;
      currentBalance.innerHTML = `P${user.balance}`;
      depositContainer.style.display = "none";
      transferContainer.style.display = "none";
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
});
