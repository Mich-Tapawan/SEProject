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

  // Fetching Philippine data for list of provinces and their cities
  const config = {
    cUrl: "https://api.countrystatecity.in/v1/countries",
    ckey: "",
  };

  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  async function loadCountries() {
    const apiEndPoint = config.cUrl;

    try {
      const result = await fetch(apiEndPoint, {
        headers: { "X-CSCAPI-KEY": config.ckey },
      });
      const data = await result.json();
      console.log(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }

    stateSelect.disabled = true;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = "none";
    citySelect.style.pointerEvents = "none";
  }

  async function loadStates() {
    stateSelect.disabled = false;
    citySelect.disabled = true;
    stateSelect.style.pointerEvents = "auto";
    citySelect.style.pointerEvents = "none";

    const selectedCountryCode = countrySelect.value;
    console.log(selectedCountryCode);

    stateSelect.innerHTML = '<option value="">Select State</option>'; // for clearing the existing states
    citySelect.innerHTML = '<option value="">Select City</option>'; // Clear existing city options

    try {
      const result = await fetch(
        `${config.cUrl}/${selectedCountryCode}/states`,
        {
          headers: { "X-CSCAPI-KEY": config.ckey },
        }
      );
      const data = await result.json();
      console.log(data);

      data.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading states:", error);
    }
  }

  async function loadCities() {
    citySelect.disabled = false;
    citySelect.style.pointerEvents = "auto";

    const selectedCountryCode = countrySelect.value;
    const selectedStateCode = stateSelect.value;
    console.log(selectedCountryCode, selectedStateCode);

    citySelect.innerHTML = '<option value="">Select City</option>'; // Clear existing city options

    try {
      const result = await fetch(
        `${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`,
        { headers: { "X-CSCAPI-KEY": config.ckey } }
      );
      const data = await result.json();
      console.log(data);

      data.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.iso2;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  }

  window.onload = loadCountries;
});
