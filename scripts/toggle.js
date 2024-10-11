const bookmark_button = document.querySelector(".bookmark_content_button");
const reading_button = document.querySelector(".reading_content_button");
const reading_content = document.querySelector(".reading_content");
const bookmark_content = document.querySelector(".bookmark_content");
const bookmark_title = document.querySelector(".bookmark_title");
const reading_title = document.querySelector(".reading_title");

window.addEventListener("load", () => {
  const active = localStorage.getItem("active_tab") || "bookmark";

  toggleTabContent(active);
});

bookmark_button.addEventListener("click", (e) => {
  localStorage.setItem("active_tab", "bookmark");
  toggleTabContent("bookmark");
});
reading_button.addEventListener("click", (e) => {
  localStorage.setItem("active_tab", "reading");
  toggleTabContent("reading");
});

function toggleTabContent(active) {
  if (active === "bookmark") {
    showBookmarkContent();
    hideReadingContent();
  } else {
    showReadingContent();
    hideBookmarkContent();
  }
}
function hideBookmarkContent() {
  bookmark_content.classList.add("hidden");
  bookmark_title.classList.add("hidden");
}
function showBookmarkContent() {
  bookmark_content.classList.remove("hidden");
  bookmark_title.classList.remove("hidden");
}
function hideReadingContent() {
  reading_title.classList.add("hidden");
  reading_content.classList.add("hidden");
}
function showReadingContent() {
  reading_content.classList.remove("hidden");
  reading_title.classList.remove("hidden");
}
