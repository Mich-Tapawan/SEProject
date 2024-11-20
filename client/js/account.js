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
        window.location.href = "/client/index.html";
      }
    };
  });
});
