document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.querySelectorAll(".user-info");
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const address = document.getElementById("address");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const contact = document.getElementById("contact");
  const country = document.getElementById("country");
  const state = document.getElementById("state");
  const city = document.getElementById("city");

  let userInfoContent;

  // From the sign up page, it returns the client back to the log in page
  document.querySelector("#cancel").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/index.html";
  });

  // From the sign up page user info section, it sends the client to the wallet registration section
  document.querySelector("#register").addEventListener("click", () => {
    let isUserInfoComplete = true;

    userInfo.forEach((inputField) => {
      if (inputField.value == "") {
        isUserInfoComplete = false;
        return;
      }
    });

    if (isUserInfoComplete == true) {
      userInfoContent = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        email: email.value,
        password: password.value,
        contact: contact.value,
        country: country.value,
        state: state.value,
        city: city.value,
      };
      sendUserData(userInfoContent);
    } else {
      alert("Please fill out all required fields before registering.");
    }
  });

  async function sendUserData(userInfo) {
    console.log(userInfo);
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo: userInfo,
        }),
      });
      const data = await response.json();
      localStorage.setItem("userID", JSON.stringify(data));

      if (!response.ok) {
        console.error("Error signing up", error);
        return;
      }
      window.location.href = "/client/pages/home.html";
    } catch (error) {
      console.error("Error sending user data:", error);
    }
  }
});
