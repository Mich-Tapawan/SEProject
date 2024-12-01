document.addEventListener("DOMContentLoaded", () => {
  const signUpSection = document.getElementById("signup-form");
  const paymentMethodSection = document.getElementById("payment-method");

  const userInfo = document.querySelectorAll(".user-info");
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const address = document.getElementById("address");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const contact = document.getElementById("contact");

  // From the sign up page, it returns the client back to the log in page
  document.querySelector("#cancel").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/index.html";
  });

  // From the sign up page user info section, it sends the client to the wallet registration section
  document.querySelector("#next").addEventListener("click", () => {
    let isUserInfoComplete = true;

    userInfo.forEach((inputField) => {
      if (inputField.value == "") {
        isUserInfoComplete = false;
        return;
      }
    });

    if (isUserInfoComplete == true) {
      signUpSection.style.display = "none";
      paymentMethodSection.style.display = "block";
      document.getElementById("nav-cancel").style.display = "block";
    }
  });

  // From the sign up page registration section, it returns the client back to the user info section
  document.getElementById("nav-cancel").addEventListener("click", () => {
    signUpSection.style.display = "grid";
    paymentMethodSection.style.display = "none";
    document.getElementById("nav-cancel").style.display = "none";
  });

  // wallet registration info
  const bankInfo = document.querySelectorAll(".bank-info");
  const cardNumber = document.getElementById("card-number");
  const expiryDate = document.getElementById("expiry-date");
  const securityCode = document.getElementById("cvv");
  const cardName = document.getElementById("card-name");
  const bankRegisterBtn = document.getElementById("bank-register");

  const mobileNumber = document.getElementById("mobile-number");
  const simCarrier = document.getElementById("carrier");
  const mobileRegisterBtn = document.getElementById("mobile-register");

  bankRegisterBtn.addEventListener("click", () => {
    let isBankInfoComplete = true;
    bankInfo.forEach((inputField) => {
      if (inputField.value == "") {
        isBankInfoComplete = false;
        return;
      }
    });
    if (isBankInfoComplete == true) {
      window.location.href = "home.html";
    }
  });

  mobileRegisterBtn.addEventListener("click", () => {
    if (mobileNumber.value == "" || simCarrier.value == "") {
      return;
    } else {
      window.location.href = "home.html";
    }
  });
});
