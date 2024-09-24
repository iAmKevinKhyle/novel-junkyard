const menu = document.getElementById("menu_button");
const container = document.querySelector(".right-side-container");
const genre_nav_button = document.querySelector(".navigation_to_genre");
const darkmodeBTN = document.querySelector(".navigation_to_darkmode");

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
  if (window.innerWidth > 624) {
    const height = document.querySelector(
      ".fixed-height-container"
    ).offsetHeight;
    container.style.height = height + "px";
  }
  if (window.innerWidth <= 624 && navigator.userAgent.includes("Windows")) {
    container.style.height = 0;
  }
});

function resetPage() {
  sessionStorage.setItem("page", 1);
}

// ? DarkMode???
window.addEventListener("DOMContentLoaded", () => {
  const darkmode = JSON.parse(localStorage.getItem("darkmode")) || false;
  const sun = darkmodeBTN.querySelector(".sun");
  const moon = darkmodeBTN.querySelector(".moon");

  if (!darkmode) {
    sun.classList.add("none");
    return;
  } else {
    moon.classList.add("none");
  }

  const path = location.pathname;
  const link = document.createElement("link");
  link.rel = "stylesheet";

  if (path.includes("/index.html") || path.includes("/error.html")) {
    link.href = "styles/darkmode.css";
  } else {
    link.href = "../styles/darkmode.css";
  }

  document.head.appendChild(link);
});

darkmodeBTN.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("sun")) {
    localStorage.setItem("darkmode", false);
  } else {
    localStorage.setItem("darkmode", true);
  }
  location.reload();
});
