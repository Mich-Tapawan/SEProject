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

  // Load subscription list
  loadSubscriptions(user._id);

  // Edit Monthly limit
  const editContainer = document.querySelector(".edit-container");
  const editInput = document.getElementById("edit-input");
  const editCancelBtn = document.getElementById("edit-cancel");
  const editConfirmBtn = document.getElementById("edit-confirm");

  document.querySelector("#edit").addEventListener("click", () => {
    editContainer.style.display = "flex";
  });

  editCancelBtn.addEventListener("click", () => {
    editContainer.style.display = "none";
  });

  editConfirmBtn.addEventListener("click", () => {
    if (editInput.value === "") {
      return;
    }
    editBudgetLimit(user._id, editInput.value);
  });

  // Add Subscription
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
      if (input.value == "") {
        isCardInputComplete = false;
        return;
      }
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
    } else {
      alert("Please fill out all of the input fields.");
      return;
    }
  });

  mobileNext.addEventListener("click", () => {
    let isMobileInputComplete = true;
    mobileInputs.forEach((input) => {
      if (input.value === "") {
        isMobileInputComplete = false;
      } else if (
        isNaN(input.value) ||
        Number(input.value) <= 0 ||
        input.value.length !== 11
      ) {
        isMobileInputComplete = false;
      }
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
    } else {
      alert(
        "Please only enter appropriate mobile number format ( Ex. 09123456789)"
      );
      return;
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
      alert("Please enter a valid amount to deposit.");
      return;
    } else if (isNaN(depositAmount.value) || Number(depositAmount.value) <= 0) {
      alert("Invalid input. Please only enter a positive numerical value.");
      return;
    }

    modifyBalance(walletInfo, user._id, depositAmount.value, "deposit");
  });

  transferSubmit.addEventListener("click", () => {
    const data = localStorage.getItem("userBalance");
    const userBalance = JSON.parse(data);
    if (transferAmount.value == "") {
      alert("Please enter a valid amount to transfer.");
      return;
    } else if (
      isNaN(transferAmount.value) ||
      Number(transferAmount.value) <= 0
    ) {
      alert("Invalid input. Please only enter a positive numerical value.");
      return;
    } else if (userBalance < transferAmount.value) {
      alert("Insufficient balance to transfer this amount.");
      return;
    }
    modifyBalance(walletInfo, user._id, transferAmount.value, "transfer");
  });

  //Remove or Cancel selected subscription
  const confirmationContainer = document.querySelector(
    ".confirm-cancel-container"
  );
  const cancelSubBtn = document.getElementById("remove");
  const removeConfirm = document.getElementById("remove-confirm-btn");
  const removeCancel = document.getElementById("remove-return-btn");

  removeConfirm.addEventListener("click", () => {
    // Convert the children to an array and iterate over them
    Array.from(subList.children).forEach((item) => {
      if (item.classList.contains("selected-subscription")) {
        subList.removeChild(item);
        removeSubscription(item.dataset.value);
      }
    });
  });

  cancelSubBtn.addEventListener("click", () => {
    // Checks each item in the list to locate the selected subscription
    let isSelected = false;
    Array.from(subList.children).forEach((item) => {
      if (item.classList.contains("selected-subscription")) {
        isSelected = true;
        return;
      }
    });

    if (isSelected) {
      confirmationContainer.style.display = "flex";
    } else {
      alert("No selected item. Please click on a subscription first.");
    }
  });

  removeCancel.addEventListener("click", () => {
    confirmationContainer.style.display = "none";
  });

  async function removeSubscription(subscriptionID) {
    try {
      const res = await fetch(
        `http://localhost:5000/removeSubscription/${subscriptionID}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      confirmationContainer.style.display = "none";
    } catch (error) {
      console.error("Error removing subscription ", error);
    }
  }

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
      localStorage.setItem("userBalance", userData.balance);

      budgetLimit.innerHTML = `₱${userData.monthlyLimit}`;
      const budgetUsed =
        (Number(userData.monthlyExpenses) / Number(userData.monthlyLimit)) *
        100;
      budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }

  async function loadSubscriptions(id) {
    try {
      const response = await fetch(
        `http://localhost:5000/getSubscriptions/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const subData = await response.json();
      console.log(subData);

      //Clear sub list
      const items = Array.from(subList.children);
      items.forEach((item, index) => {
        subList.removeChild(item);
      });

      if (Array.isArray(subData)) {
        subData.forEach((sub) => {
          const li = document.createElement("li");
          const upper = document.createElement("div");
          const h5 = document.createElement("h5");
          const h6 = document.createElement("h6");
          const lower = document.createElement("div");
          const p = document.createElement("p");
          const span = document.createElement("span");

          // Insert subscription information
          h5.textContent = `${sub.type} Plan`;
          h6.textContent = sub.service;
          upper.append(h5, h6);
          p.textContent = `P ${sub.price} / per month`;
          span.textContent = `Expiration: ${sub.end}`;
          lower.append(p, span);

          li.setAttribute("data-value", sub._id);

          li.appendChild(upper);
          li.appendChild(lower);

          li.addEventListener("click", () => {
            const children = document.querySelectorAll("#registered-subs li");
            children.forEach((card) => {
              card.style.border = "none";
              card.removeAttribute("class");
            });
            li.style.border = "4px solid #ff2575";
            li.setAttribute("class", "selected-subscription");
          });

          subList.appendChild(li);
        });
      } else {
        console.error("No subscription found or invalid data format");
      }
    } catch (error) {
      console.error("Error fetching account subscriptions: ", error);
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

      currentBalance.innerHTML = `₱${data.balance}`;
      localStorage.setItem("userBalance", data.balance);

      depositContainer.style.display = "none";
      transferContainer.style.display = "none";
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  async function editBudgetLimit(userID, limit) {
    console.log(userID, limit);
    try {
      const res = await fetch("http://localhost:5000/editBudgetLimit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, limit }),
      });

      const data = await res.json();
      console.log(data);

      budgetLimit.innerHTML = `₱${data.monthlyLimit}`;
      const budgetUsed =
        (Number(data.monthlyExpenses) / Number(data.monthlyLimit)) * 100;
      budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;

      editContainer.style.display = "none";
    } catch (error) {
      console.error("Error editing budget limit: ", error);
    }
  }
});
