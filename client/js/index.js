document.addEventListener("DOMContentLoaded", () => {
  function showForm(formId) {
    document
      .querySelectorAll("section")
      .forEach((section) => (section.style.display = "none"));
    document.getElementById(formId).style.display = "block";
  }
});
