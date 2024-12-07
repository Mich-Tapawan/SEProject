document.addEventListener("DOMContentLoaded", () => {
  const detailsBtn = document.getElementById("details");
  const detailsSection = document.getElementById("details-sec");

  // Initial Account Page state
  detailsBtn.style.color = "#ff2575";
  detailsSection.style.display = "block";

  // sidebar section toggling
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.onclick = () => {
      const sec = item.dataset.sec;
      if (sec === "details") {
        detailsBtn.style.color = "#ff2575";
        subscriptionsBtn.style.color = "white";

        detailsSection.style.display = "block";
        subscriptionsSection.style.display = "none";
      } else if (sec === "logout") {
        localStorage.setItem("userID", "");
        localStorage.setItem("userBalance", "");
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

  // Load User data
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
      userName.innerHTML = `${userData.firstName} ${userData.lastName}`;
      userCountry.innerHTML = userData.country;
      userState.innerHTML = userData.state;
      userCity.innerHTML = userData.city;
      userAddress.innerHTML = userData.address;
      userEmail.innerHTML = userData.email;
      userPhone.innerHTML = userData.contact;
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }
});
