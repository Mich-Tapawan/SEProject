document.addEventListener("DOMContentLoaded", () => {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  document.querySelector("#login").addEventListener("click", () => {
    event.preventDefault();
    if (loginEmail.value != "" && loginPassword.value != "") {
      window.location.href = "/client/pages/home.html";
    }
  });

  // function showForm(formId) {
  //   document
  //     .querySelectorAll("section")
  //     .forEach((section) => (section.style.display = "none"));
  //   document.getElementById(formId).style.display = "block";
  // }
});
