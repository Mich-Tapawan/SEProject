document.addEventListener("DOMContentLoaded", () => {
  const currentBalance = document.getElementById("current-balance");
  const activeSubs = document.getElementById("active-subs");
  const expenses = document.getElementById("monthly-expenses");
  const budgetPercentage = document.getElementById("budget-percentage");
  const budgetLimit = document.getElementById("budget-limit");

  // Load user data
  const item = localStorage.getItem("userID");
  let user = JSON.parse(item);

  console.log("userID", user._id);
  loadData(user._id);

  // Generate Subscription Grid
  let clickedSub;
  const subscribeContainer = document.querySelector(".subscribe-form");
  const serviceImg = document.getElementById("service-img");
  const serviceName = document.getElementById("service-name");
  const cancelBtn = document.getElementById("cancel-btn");
  const subscribeBtn = document.getElementById("subscribe-btn");
  const selectPlan = document.getElementById("select-plan");
  const subscriptionList = document.getElementById("subscription-grid");
  const subscriptions = [
    {
      name: "Netflix",
      src: "/client/assets/netflix.png",
      plan: ["Mobile - 149", "Basic - 149", "Standard - 459", "Premium - 549"],
    },
    {
      name: "Spotify",
      src: "/client/assets/spotify.png",
      plan: ["Individual - 149", "Duo - 185", "Family - 214", "Student - 75"],
    },
    {
      name: "Youtube",
      src: "/client/assets/youtube.png",
      plan: ["Individual - 159", "Family - 239", "Student - 95"],
    },
    {
      name: "Prime Video",
      src: "/client/assets/amazon.png",
      plan: ["Standard - 149"],
    },
    {
      name: "Disney+",
      src: "/client/assets/disney+.png",
      plan: ["Mobile - 159", "Premium - 369"],
    },
    {
      name: "HBO GO",
      src: "/client/assets/hbo.png",
      plan: ["Standard - 199"],
    },
  ];

  subscriptions.forEach((subscription) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");

    img.src = subscription.src;
    img.alt = subscription.name;
    h3.innerHTML = subscription.name;

    li.appendChild(img);
    li.appendChild(h3);

    li.addEventListener("click", () => {
      clickedSub = subscription.name;
      serviceImg.src = subscription.src;
      serviceName.innerHTML = subscription.name;
      subscribeContainer.style.display = "flex";

      //Clear dropdown list
      const items = Array.from(selectPlan.children);
      items.forEach((item, index) => {
        if (index !== 0) {
          selectPlan.removeChild(item);
        }
      });

      // Create dropdown options for service plans
      let plans = subscription.plan;
      plans.forEach((plan) => {
        const option = document.createElement("option");
        option.innerHTML = `${plan} php / per month`;
        option.setAttribute("value", plan);
        selectPlan.appendChild(option);
      });
    });

    subscriptionList.appendChild(li);
  });

  cancelBtn.addEventListener("click", () => {
    subscribeContainer.style.display = "none";
  });

  subscribeBtn.addEventListener("click", () => {
    // Checks if the user have not selected a plan or has insufficient balance to subscribe
    const data = localStorage.getItem("userBalance");
    const userBalance = JSON.parse(data);
    const selectedValue = selectPlan.value.split(" - ");
    if (selectPlan.value === "") {
      alert("Please select a subscription plan.");
      return;
    } else if (Number(selectedValue[1]) > userBalance) {
      alert("Insufficient balance to subscribe to this plan.");
      return;
    }
    addSubscription(user._id, clickedSub, selectPlan.value);
  });

  // Pop up after successfully subscribing
  const confirmationBox = document.querySelector(".confirmation-box");
  const confirmationButton = document.getElementById("okay");

  confirmationButton.addEventListener("click", () => {
    confirmationBox.style.display = "none";
  });

  async function loadData(userID) {
    try {
      const res = await fetch(`http://localhost:5000/getUserData/${userID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const userData = await res.json();

      console.log(userData);
      currentBalance.innerHTML = `₱${userData.balance}`;
      budgetLimit.innerHTML = `₱${userData.monthlyLimit}`;
      expenses.innerHTML = `₱${userData.monthlyExpenses}`;
      activeSubs.innerHTML = userData.activeSubs;
      const budgetUsed =
        (Number(userData.monthlyExpenses) / Number(userData.monthlyLimit)) *
        100;
      budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }

  async function addSubscription(userID, service, plan) {
    try {
      const res = await fetch("http://localhost:5000/addSubscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, service, plan }),
      });
      const data = await res.json();

      currentBalance.innerHTML = `₱${data.balance}`;
      activeSubs.innerHTML = data.activeSubs;
      expenses.innerHTML = `₱${data.monthlyExpenses}`;
      const budgetUsed =
        (Number(data.monthlyExpenses) / Number(data.monthlyLimit)) * 100;
      budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;

      subscribeContainer.style.display = "none";
      confirmationBox.style.display = "flex";
    } catch (error) {
      console.error("Error adding subscription: ", error);
    }
  }
});
