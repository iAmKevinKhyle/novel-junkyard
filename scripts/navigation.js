const menu = document.getElementById("menu_button");
const container = document.querySelector(".right-side-container");
const genre_nav_button = document.querySelector(".navigation_to_genre");

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
