document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navList = document.getElementById("nav-list");
  const notif = document.getElementById("bell");

  if (!burger || !navList || !notif) {
    return;
  }

  burger.addEventListener("click", () => {
    navList.style.display = navList.style.display == "none" ? "flex" : "none";
  });

  window.addEventListener("resize", () => {
    const screenWidth = window.innerWidth;

    if (innerWidth >= 1024) {
      navList.style.display = "flex";
    }
  });

  notif.addEventListener("click", () => {
    window.location.href = "/client/pages/notification.html";
  });
});
