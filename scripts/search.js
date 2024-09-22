const search_novel = document.getElementById("search_novel");
const search_keyword_span = document.querySelector(".search_keyword");

search_novel.addEventListener("focus", () => {
  search_novel.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
      let value = e.target.value;

      if (value === "clear/all") {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
        return;
      }
      if (value === "clear/reading") {
        localStorage.removeItem("reading");
        location.reload();
        return;
      }
      if (value === "clear/bookmark") {
        localStorage.removeItem("bookmark");
        location.reload();
        return;
      }

      if (format.test(value)) {
        value = value.replace(format, "");
      }

      sessionStorage.setItem("search-keyword", value);
      sessionStorage.setItem("page", 1);

      if (location.pathname.includes("/index.html")) {
        location.href = "pages/search.html";
      } else {
        location.href = "search.html";
      }
    }
  });
});

window.addEventListener("load", () => {
  if (location.pathname.includes("/pages/search.html")) {
    search_keyword_span.innerText = sessionStorage.getItem("search-keyword");
  }
});
