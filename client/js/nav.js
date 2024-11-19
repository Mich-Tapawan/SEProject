document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navList = document.getElementById("nav-list");

  burger.addEventListener("click", () => {
    navList.style.display = navList.style.display == "none" ? "flex" : "none";
  });

  window.addEventListener("resize", () => {
    const screenWidth = window.innerWidth;

    if (innerWidth >= 1024) {
      navList.style.display = "flex";
    }
  });
});
