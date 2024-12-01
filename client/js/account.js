document.addEventListener("DOMContentLoaded", () => {
  const detailsBtn = document.getElementById("details");
  const subscriptionsBtn = document.getElementById("subscriptions");
  const settingsBtn = document.getElementById("settings");

  const detailsSection = document.getElementById("details-sec");
  const subscriptionsSection = document.getElementById("subscriptions-sec");
  const settingsSection = document.getElementById("settings-sec");

  // Initial Account Page state
  detailsBtn.style.color = "#ff2575";
  detailsSection.style.display = "block";
  subscriptionsSection.style.display = "none";
  settingsSection.style.display = "none";

  // sidebar section toggling
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.onclick = () => {
      const sec = item.dataset.sec;
      if (sec === "details") {
        detailsBtn.style.color = "#ff2575";
        subscriptionsBtn.style.color = "white";
        settingsBtn.style.color = "white";

        detailsSection.style.display = "block";
        subscriptionsSection.style.display = "none";
        settingsSection.style.display = "none";
      } else if (sec === "subscriptions") {
        detailsBtn.style.color = "white";
        subscriptionsBtn.style.color = "#ff2575";
        settingsBtn.style.color = "white";

        detailsSection.style.display = "none";
        subscriptionsSection.style.display = "block";
        settingsSection.style.display = "none";
      } else if (sec === "settings") {
        detailsBtn.style.color = "white";
        subscriptionsBtn.style.color = "white";
        settingsBtn.style.color = "#ff2575";

        detailsSection.style.display = "none";
        subscriptionsSection.style.display = "none";
        settingsSection.style.display = "block";
      } else if (sec === "logout") {
        localStorage.setItem("userData", "");
        window.location.href = "/client/index.html";
      }
    };
  });

  // Integrating user data
  const userName = document.getElementById("name");
  const userCountry = document.getElementById("country");
  const userState = document.getElementById("state");
  const userCity = document.getElementById("city");
  const userAddress = document.getElementById("address");
  const userEmail = document.getElementById("email");
  const userPhone = document.getElementById("phone");
  const item = localStorage.getItem("userData");
  const user = JSON.parse(item);
  const userData = user.user;

  userName.innerHTML = `${userData.firstName} ${userData.lastName}`;
  userCountry.innerHTML = userData.country;
  userState.innerHTML = userData.state;
  userCity.innerHTML = userData.city;
  userAddress.innerHTML = userData.address;
  userEmail.innerHTML = userData.email;
  userPhone.innerHTML = userData.contact;
});
