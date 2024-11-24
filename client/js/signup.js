document.addEventListener("DOMContentLoaded", () => {
  const signUpSection = document.getElementById("signup-form");
  const paymentMethodSection = document.getElementById("payment-method");

  document.querySelector("#cancel").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/index.html";
  });

  document.querySelector("#next").addEventListener("click", () => {
    signUpSection.style.display = "none";
    paymentMethodSection.style.display = "block";
  });
});
