const chapter_list_wrapper = document.getElementById("chapter_list_wrapper");
const ch_first_page = document.querySelector("#ch_first_page");
const ch_prev_page = document.querySelector("#ch_prev_page");
const ch_next_page = document.querySelector("#ch_next_page");
const ch_last_page = document.querySelector("#ch_last_page");
const ch_pages = document.querySelector(".ch_number_of_all_pages");
const ch_page_input = document.querySelector("#ch_page_input");
const ch_buttons = document.querySelectorAll(".ch_buttons");

let page = getChapterListPageOnBookmark();
let number_pages = 1;

window.addEventListener("load", () => {
  if (location.pathname.includes("/pages/novel.html")) {
    showCHLoader();
    setTimeout(() => {
      loadChapters(page);
    }, 2000);
  }
});
ch_buttons.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e.currentTarget.id === "ch_first_page") {
      page = 1;
    }
    if (e.currentTarget.id === "ch_prev_page") {
      page--;
      if (page < 1) {
        page = 1;
      }
    }
    if (e.currentTarget.id === "ch_next_page") {
      page++;
      if (page > number_pages) {
        page = number_pages;
      }
    }
    if (e.currentTarget.id === "ch_last_page") {
      page = number_pages;
    }

    // ? get new chapter content
    removeCHContent();
    loadChapters(page);
    scrollToTopContainer();
    ch_page_input.value = page;

    checkCHButtonsClickability();
  })
);
ch_page_input.addEventListener("change", () => {
  page = ch_page_input.value;

  if (page >= number_pages) {
    page = number_pages;
  }

  // ? get new chapter content
  removeCHContent();
  loadChapters(page);
  scrollToTopContainer();
  ch_page_input.value = page;

  checkCHButtonsClickability();
});

function loadChapters(num) {
  // ? save chapter list page number
  saveChapterListPageOnBookmark(num);
  ch_page_input.value = num;

  const url = `https://novel-scraper-290c.onrender.com/api/novel/chapters/${num}`;
  const title = JSON.parse(localStorage.getItem("novel_info")).title;
  const link = JSON.parse(localStorage.getItem("novel_info")).link;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      link,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      result.forEach((el, i) => {
        if (i === 0) {
          if (el.pagination === null) {
            disableALLCHButtons();
          } else {
            ch_pages.innerHTML = el.pagination;
            ch_page_input.max = el.pagination;
            number_pages = el.pagination;
          }
          return;
        }
        createChapterListContent(title, el.chapter, el.link);
      });
      removeCHLoader();
      checkCHButtonsClickability();
    })
    .catch((err) => console.log(err));
}

function createChapterListContent(title, chapter, link) {
  const span = document.createElement("span");
  const a = document.createElement("a");

  a.href = "javascript:void(0)";
  a.dataset.title = title;
  a.dataset.chapter = chapter;
  a.dataset.link = link;
  a.addEventListener("click", (e) => getChapterContent(e.currentTarget, true));
  a.innerText = chapter;

  span.appendChild(a);
  chapter_list_wrapper.appendChild(span);
}

function removeCHContent() {
  chapter_list_wrapper.innerHTML = `<div class="loader"></div>`;
}

function showCHLoader() {
  const ch_loader = document.querySelector(".loader");
  ch_loader.style.display = "block";
}

function removeCHLoader() {
  const ch_loader = document.querySelector(".loader");
  ch_loader.style.display = "none";
}

function disableALLCHButtons() {
  ch_first_page.setAttribute("disabled", true);
  ch_prev_page.setAttribute("disabled", true);
  ch_next_page.setAttribute("disabled", true);
  ch_last_page.setAttribute("disabled", true);
}

function checkCHButtonsClickability() {
  if (page <= 1) {
    ch_first_page.setAttribute("disabled", true);
    ch_prev_page.setAttribute("disabled", true);
  } else {
    ch_first_page.removeAttribute("disabled");
    ch_prev_page.removeAttribute("disabled");
  }

  if (page >= number_pages) {
    ch_last_page.setAttribute("disabled", true);
    ch_next_page.setAttribute("disabled", true);
  } else {
    ch_last_page.removeAttribute("disabled");
    ch_next_page.removeAttribute("disabled");
  }
}

function scrollToTopContainer() {
  const container = document.getElementById("chapter_list_wrapper");
  const top = container.getBoundingClientRect().top + window.scrollY;

  window.scrollTo(0, top - 20);
}

function saveChapterListPageOnBookmark(num) {
  const title = JSON.parse(localStorage.getItem("novel_info")).title;
  let bookmark = JSON.parse(localStorage.getItem("bookmark"));

  bookmark?.map((el) => {
    if (title === el.title) {
      el.page = num;
    }
  });

  localStorage.setItem("bookmark", JSON.stringify(bookmark));
}

function getChapterListPageOnBookmark() {
  const title = JSON.parse(localStorage.getItem("novel_info")).title;
  let bookmark = JSON.parse(localStorage.getItem("bookmark"));
  let num = 1;

  bookmark?.map((el) => {
    if (title === el.title) {
      if (el.page === undefined) {
        num = 1;
      } else {
        num = el.page;
      }
    }
  });

  return num;
}
