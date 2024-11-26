document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");

  document.querySelector("#signup").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/pages/signup.html";
  });

  document.querySelector("#login").addEventListener("click", () => {
    event.preventDefault();
    if (loginEmail.value == "" && loginPassword.value == "") {
      //Dito kayo mag edit ng alert code
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
      localStorage.setItem("userData", JSON.stringify(data));

      if (response.ok) {
        window.location.href = "/client/pages/home.html";
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  }
});
