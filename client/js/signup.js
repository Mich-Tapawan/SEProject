document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#cancel").addEventListener("click", () => {
    event.preventDefault();
    window.location.href = "/client/index.html";
  });

  document.querySelector("#next").addEventListener("click", () => {});
});
