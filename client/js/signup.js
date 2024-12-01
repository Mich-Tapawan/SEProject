document.addEventListener("DOMContentLoaded", () => {
  const signUpSection = document.getElementById("signup-form");
  const paymentMethodSection = document.getElementById("payment-method");

  // From the sign up page, it returns the client back to the log in page
  document.querySelector("#cancel").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/index.html";
  });

  // From the sign up page user info section, it sends the client to the wallet registration section
  document.querySelector("#next").addEventListener("click", () => {
    signUpSection.style.display = "none";
    paymentMethodSection.style.display = "block";
    document.getElementById("nav-cancel").style.display = "block";
  });

  // From the sign up page registration section, it returns the client back to the user info section
  document.getElementById("nav-cancel").addEventListener("click", () => {
    signUpSection.style.display = "grid";
    paymentMethodSection.style.display = "none";
    document.getElementById("nav-cancel").style.display = "none";
  });
});
