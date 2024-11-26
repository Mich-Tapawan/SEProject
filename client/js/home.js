document.addEventListener("DOMContentLoaded", () => {
  const currentBalance = document.getElementById("current-balance");
  const activeSubs = document.getElementById("active-subs");
  const budgetPercentage = document.getElementById("budget-percentage");
  const budgetLimit = document.getElementById("budget-limit");
  const item = localStorage.getItem("userData");
  const res = JSON.parse(item);
  const userData = res.user;
  const budgetUsed = (5000 / userData.monthlyLimit) * 100;
  console.log(userData);

  currentBalance.innerHTML = `₱${userData.balance}`;
  activeSubs.innerHTML = 6;
  budgetPercentage.innerHTML = `${Math.ceil(budgetUsed)}%`;
  budgetLimit.innerHTML = `₱${userData.monthlyLimit}`;
});
