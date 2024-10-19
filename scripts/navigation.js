const menu = document.getElementById("menu_button");
const container = document.querySelector(".right-side-container");
const genre_nav_button = document.querySelector(".navigation_to_genre");
const darkmodeBTN = document.querySelector(".navigation_to_darkmode");
const profileBTN = document.querySelector(".navigation_to_profile");

const host = "https://novel-scraper-290c.onrender.com/api/user/";

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

// ? cookie method get/set/delete
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ? toast method/functions set/delete/display
appendToast();

const toast = document.querySelector(".toast");
const slide_loading = toast.querySelector(".slide_loading");
const toast_text = toast.querySelector(".text");
const close_toast = toast.querySelector(".close_toast");
let setTimeoutFunc;

close_toast.addEventListener("click", () => {
  removeToast();
});

function displayToast() {
  const hasToast = localStorage.getItem("toast") || false;

  if (hasToast) {
    toast_text.textContent = hasToast;
    toast.classList.remove("hide");

    if (setTimeoutFunc) {
      clearTimeout(setTimeoutFunc);
    }
    setTimeoutFunc = setTimeout(() => {
      toast.classList.add("hide");
      toast_text.textContent = "";
      localStorage.removeItem("toast");
    }, 5000);
  }
}

function setToast(text) {
  localStorage.setItem("toast", text);
}

function removeToast() {
  toast.classList.add("hide");
}

function appendToast() {
  const div = document.createElement("div");
  div.classList.add("toast", "hide");
  div.innerHTML = `
    <p class="text"></p>
    <button class="close_toast"><i class="fa-solid fa-close"></i></button>
    <span class="slide_loading"></span>
  `;

  document.body.append(div);
}
