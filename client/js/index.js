document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const errorText = document.getElementById("error-text");

  document.querySelector("#signup").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/pages/signup.html";
  });

  document.querySelector("#login").addEventListener("click", () => {
    event.preventDefault();

    // Shows error message for 4 seconds if empty input field
    if (loginEmail.value == "" || loginPassword.value == "") {
      errorText.innerHTML = "Please fill out all required fields to login.";
      setTimeout(() => (errorText.innerHTML = ""), 4000);
      return;
    } else {
      logIn(loginEmail.value, loginPassword.value);
    }
  });

  async function logIn(email, password) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      const user = data.user;
      localStorage.setItem("userID", JSON.stringify(user));

      if (response.ok) {
        window.location.href = "/client/pages/home.html";
      } else {
        errorText.innerHTML =
          "No account found. Please enter valid email and password";
        setTimeout(() => {
          errorText.innerHTML = "";
        }, 4000);
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  }
});
