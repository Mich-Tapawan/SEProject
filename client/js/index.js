document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  document.querySelector("#login").addEventListener("click", () => {
    event.preventDefault();
    if (loginEmail.value != "" && loginPassword.value != "") {
      window.location.href = "/client/pages/home.html";
    }
  });

  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  document.querySelector("#signup").addEventListener("click", () => {
    event.preventDefault();

    signupForm.style.display = "block";
    loginForm.style.display = "none";
  });

  document.querySelector("#cancel").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
  });

  document.querySelector("#next").addEventListener("click", () => {});

  // function showForm(formId) {
  //   document
  //     .querySelectorAll("section")
  //     .forEach((section) => (section.style.display = "none"));
  //   document.getElementById(formId).style.display = "block";
  // }
});
