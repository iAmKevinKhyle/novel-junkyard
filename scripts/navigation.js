const menu = document.getElementById("menu_button");
const container = document.querySelector(".right-side-container");
const genre_nav_button = document.querySelector(".navigation_to_genre");
const darkmodeBTN = document.querySelector(".navigation_to_darkmode");
const profileBTN = document.querySelector(".navigation_to_profile");

genre_nav_button.addEventListener("click", () => {
  sessionStorage.setItem("sort-genre", JSON.stringify({ genre: "all" }));
});

menu.addEventListener("click", () => {
  const height = document.querySelector(".fixed-height-container").offsetHeight;

  if (container.offsetHeight === 0) {
    container.style.height = height + 16 + "px";
  } else {
    container.style.height = 0;
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 635) {
    const height = document.querySelector(
      ".fixed-height-container"
    ).offsetHeight;
    container.style.height = height + "px";
  }
  if (window.innerWidth <= 635 && navigator.userAgent.includes("Windows")) {
    container.style.height = 0;
  }
});

function resetPage() {
  localStorage.setItem("current_page", 1);
}

// ? DarkMode???
window.addEventListener("DOMContentLoaded", () => {
  setScreenTheme();
});

darkmodeBTN.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("sun")) {
    localStorage.setItem("darkmode", false);
  } else {
    localStorage.setItem("darkmode", true);
  }

  setScreenTheme();
});

function setScreenTheme() {
  const darkmode = JSON.parse(localStorage.getItem("darkmode")) || false;
  const sun = darkmodeBTN.querySelector(".sun");
  const moon = darkmodeBTN.querySelector(".moon");

  const path = location.pathname;
  const link = document.createElement("link");
  link.rel = "stylesheet";

  if (
    path.includes("/index.html") ||
    path.includes("/error.html") ||
    path[path.length - 1] === "/"
  ) {
    link.href = "styles/darkmode.css";
  } else {
    link.href = "../styles/darkmode.css";
  }

  if (!darkmode) {
    sun.classList.add("none");
    moon.classList.remove("none");
    document.head.querySelectorAll("link").forEach((el) => {
      if (el.href.includes("darkmode")) {
        document.head.removeChild(el);
      }
    });
  } else {
    sun.classList.remove("none");
    moon.classList.add("none");
    document.head.appendChild(link);
  }
}

// ? navigate to profile
profileBTN.addEventListener("click", () => {
  if (
    location.pathname.includes("index.html") ||
    location.pathname.includes("error.html") ||
    location.pathname[location.pathname.length - 1] === "/"
  ) {
    location.href = "pages/profile.html";
  } else {
    location.href = "profile.html";
  }
});
