document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");

  document.querySelector("#login").addEventListener("click", () => {
    event.preventDefault();
    if (loginEmail.value == "" && loginPassword.value == "") {
      //Dito kayo mag edit ng alert code
    } else {
      window.location.href = "/client/pages/home.html";
    }
  });

  document.querySelector("#signup").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/pages/signup.html";
  });
});
