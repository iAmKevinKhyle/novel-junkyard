const error_title = document.querySelector(".error_title");
const try_again_btn = document.querySelector(".try_again_btn");
const error_action_btn = document.querySelectorAll(".error_action_btn");

let fetchStatus;

window.addEventListener("load", () => {
  if (!location.pathname.includes("/error.html")) {
    removeSavedErrorStats();
  } else {
    const errorStats = JSON.parse(localStorage.getItem("error"));
    const msg = errorStats.msg;
    const name = errorStats.name;
    const title = `${name}: ${msg}`;
    const path = localStorage.getItem("path").replace("/novel-junkyard", "");

    error_title.innerText = title;
    try_again_btn.dataset.path = path;
  }
});

error_action_btn.forEach((el) =>
  el.addEventListener("click", (e) => {
    const target = e.currentTarget;
    const path = target.dataset.path;

    location.href = path;
  })
);

function removeSavedErrorStats() {
  localStorage.removeItem("error");
  localStorage.removeItem("path");
}

function saveErrorStats(msg, name, path) {
  localStorage.setItem(
    "error",
    JSON.stringify({
      msg,
      name,
    })
  );
  localStorage.setItem("path", path);
}

function redirectIfHasError(fetchStatus, data) {
  if (fetchStatus !== 200) {
    const msg = data.error.message;
    const name = data.error.name;
    const path = location.pathname;

    saveErrorStats(msg, name, path);
    location.href = "../error.html";
  }
}
