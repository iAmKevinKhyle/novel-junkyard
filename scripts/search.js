const search_novel = document.getElementById("search_novel");
const search_keyword_span = document.querySelector(".search_keyword");

search_novel.addEventListener("focus", () => {
  search_novel.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;

      sessionStorage.setItem("search-keyword", value);
      sessionStorage.setItem("page", 1);

      if (location.pathname === "/index.html") {
        location.href = "pages/search.html";
      } else {
        location.href = "search.html";
      }
    }
  });
});

window.addEventListener("load", () => {
  if (location.pathname === "/pages/search.html") {
    search_keyword_span.innerText = sessionStorage.getItem("search-keyword");
  }
});
