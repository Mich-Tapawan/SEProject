document.addEventListener("DOMContentLoaded", () => {
  const currentBalance = document.getElementById("current-balance");
  const activeSubs = document.getElementById("active-subs");
  const budgetPercentage = document.getElementById("budget-percentage");
  const budgetLimit = document.getElementById("budget-limit");
  const item = localStorage.getItem("userID");
  let user = JSON.parse(item);

  console.log("userID", user._id);
  loadData(user._id);

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
});
