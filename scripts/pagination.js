const genre_content_container = document.querySelector(
  "#genre_content_container"
);
const latest_content_container = document.querySelector(
  "#latest_content_container"
);
const hottest_content_container = document.querySelector(
  "#hot_content_container"
);
const completed_content_container = document.querySelector(
  "#completed_content_container"
);
const search_content_container = document.querySelector(
  "#search_content_container"
);
const first_page = document.querySelectorAll("#first_page");
const last_page = document.querySelectorAll("#last_page");
const prev_page = document.querySelectorAll("#prev_page");
const next_page = document.querySelectorAll("#next_page");
const page_number = document.querySelectorAll("#page_number");
const number_of_all_pages = document.querySelectorAll(".number_of_all_pages");
const error_message = document.querySelector(".error_message");

let current_page = page_number[0].value;
let number_of_pages;
let content_fetched;
let current_genre;
let marked_page = sessionStorage.getItem("page") || current_page;
let search_keyword;

window.addEventListener("load", () => {
  current_page = marked_page;

  if (location.pathname.includes("/pages/genre.html")) {
    const genre = sessionStorage.getItem("sort-genre")
      ? JSON.parse(sessionStorage.getItem("sort-genre")).genre
      : "all";
    const newTitle =
      genre
        .toLowerCase()
        .split("_")
        .map((letter) => {
          return letter[0].toUpperCase() + letter.slice(1);
        }) + " Novels";
    current_genre = genre;
    document.title = newTitle.replaceAll(",", " ");

    getNovelByGenre(genre, marked_page);
  }
  if (location.pathname.includes("/pages/latest.html")) {
    getAllNovelsByClass("latest", marked_page);
  }
  if (location.pathname.includes("/pages/hot.html")) {
    getAllNovelsByClass("hot", marked_page);
  }
  if (location.pathname.includes("/pages/completed.html")) {
    getAllNovelsByClass("completed", marked_page);
  }
  if (location.pathname.includes("/pages/search.html")) {
    search_keyword = sessionStorage.getItem("search-keyword");
    getSearchResults(search_keyword, marked_page);
  }

  checkButtonClickability();
});

first_page.forEach((el) =>
  el.addEventListener("click", () => handlePaginationCount("first"))
);
last_page.forEach((el) =>
  el.addEventListener("click", () => handlePaginationCount("last"))
);
next_page.forEach((el) =>
  el.addEventListener("click", () => handlePaginationCount("next"))
);
prev_page.forEach((el) =>
  el.addEventListener("click", () => handlePaginationCount("prev"))
);
page_number.forEach((el) => {
  el.value = marked_page;

  el.addEventListener("change", (e) =>
    handlePaginationCount("change", e.target.value)
  );
});

function handlePaginationCount(com, value) {
  switch (com) {
    case "first":
      current_page = 1;
      break;
    case "prev":
      current_page--;
      break;
    case "next":
      current_page++;
      break;
    case "last":
      current_page = number_of_pages;
      break;
    case "change":
      current_page = value;
      break;
    default:
      break;
  }

  if (current_page < 1) {
    current_page = 1;
  }
  if (current_page > number_of_pages) {
    current_page = number_of_pages;
  }

  if (location.pathname === "/pages/genre.html") {
    getNovelByGenre(current_genre, current_page);
  }
  if (location.pathname === "/pages/latest.html") {
    getAllNovelsByClass("latest", current_page);
  }
  if (location.pathname === "/pages/hot.html") {
    getAllNovelsByClass("hot", current_page);
  }
  if (location.pathname === "/pages/completed.html") {
    getAllNovelsByClass("completed", current_page);
  }
  if (location.pathname === "/pages/search.html") {
    getSearchResults(search_keyword, current_page);
  }

  sessionStorage.setItem("page", current_page);
  page_number.forEach((el) => (el.value = current_page));

  checkButtonClickability();
}

function checkButtonClickability() {
  if (current_page <= 1) {
    first_page.forEach((el) => el.setAttribute("disabled", true));
    prev_page.forEach((el) => el.setAttribute("disabled", true));
  } else {
    first_page.forEach((el) => el.removeAttribute("disabled"));
    prev_page.forEach((el) => el.removeAttribute("disabled"));
  }
  if (current_page >= number_of_pages) {
    last_page.forEach((el) => el.setAttribute("disabled", true));
    next_page.forEach((el) => el.setAttribute("disabled", true));
  } else {
    last_page.forEach((el) => el.removeAttribute("disabled"));
    next_page.forEach((el) => el.removeAttribute("disabled"));
  }
}

function disableAllButton() {
  first_page.forEach((el) => el.setAttribute("disabled", true));
  prev_page.forEach((el) => el.setAttribute("disabled", true));
  last_page.forEach((el) => el.setAttribute("disabled", true));
  next_page.forEach((el) => el.setAttribute("disabled", true));
}

function getNovelByGenre(genre, page) {
  let url = "";
  genre = genre.replaceAll("_", "-");

  if (genre === "all") {
    url = `https://novel-scraper-290c.onrender.com/api/novel/latest/all/${page}`;
  } else {
    url = `https://novel-scraper-290c.onrender.com/api/genre/${genre}/${page}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      number_of_pages = result[0].pagination;
      setPageNumber(number_of_pages);

      removeOldPageContent();

      result.map((data, i) => {
        if (i === 0) return;

        createNewPageContent(data);
      });
    })
    .catch((err) => console.log(err));
}

function getAllNovelsByClass(mark, page) {
  let url = `https://novel-scraper-290c.onrender.com/api/novel/${mark}/all/${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      number_of_pages = result[0].pagination;
      setPageNumber(number_of_pages);

      removeOldPageContent();

      result.map((data, i) => {
        if (i === 0) return;

        createNewPageContent(data);
      });
    })
    .catch((err) => console.log(err));
}

function getSearchResults(key, page) {
  key = key.replaceAll(" ", "-");
  const url = `https://novel-scraper-290c.onrender.com/api/novel/search/${key}/${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      number_of_pages = result[0].pagination;
      if (number_of_pages === null) {
        number_of_pages = 1;
        disableAllButton();
      }
      setPageNumber(number_of_pages);

      removeOldPageContent();

      result.map((data, i) => {
        if (i === 0) return;

        createNewPageContent(data);
      });
    })
    .catch((err) => {
      disableAllButton();
      error_message.style.display = "block";
    });
}

function setPageNumber(number) {
  page_number.forEach((el) => (el.max = number));
  number_of_all_pages.forEach((el) => (el.innerText = number));
}

function removeOldPageContent() {
  if (location.pathname === "/pages/genre.html") {
    genre_content_container.innerHTML = "";
  }
  if (location.pathname === "/pages/latest.html") {
    latest_content_container.innerHTML = "";
  }
  if (location.pathname === "/pages/hot.html") {
    hottest_content_container.innerHTML = "";
  }
  if (location.pathname === "/pages/completed.html") {
    completed_content_container.innerHTML = "";
  }
  if (location.pathname === "/pages/search.html") {
    search_content_container.innerHTML = "";
  }
}

function createNewPageContent(data) {
  const { title, link, author, img, latest_chapter, latest_chapter_title } =
    data;
  const split = latest_chapter.split("/");
  const newLink =
    "https://novelsbin.novelmagic.org/book/" + split[4] + "/" + split[5];
  const div = document.createElement("div");
  div.classList.add("content_row");

  div.innerHTML = `
    <div class="wrapper_wrapper">
      <img
        src="${img}"
        alt="${title}"
        class="cover"
        data-title="${title}"
        data-link="${link}"
        onclick="getNovelInfo(this, true, false)"
      />
      <div class="wrapper">
        <span>
          <i class="fa-solid fa-book"></i>
          <a
            href="javascript:void(0)"
            class="novel_title"
            data-title="${title}"
            data-link="${link}"
            onclick="getNovelInfo(this, true, false)"
          >
            ${title}
          </a>
        </span>
        <span><i class="fa-solid fa-pen-nib"></i>${author}</span>
      </div>
    </div>
    <a href="javascript:void(0)" class="latest_chapter" data-title="${title}" data-chapter="${latest_chapter_title}" data-link="${newLink}" onclick="getChapterContent(this, true)">
        ${latest_chapter_title}
    </a>
  `;

  if (location.pathname === "/pages/genre.html") {
    genre_content_container.appendChild(div);
  }
  if (location.pathname === "/pages/latest.html") {
    latest_content_container.appendChild(div);
  }
  if (location.pathname === "/pages/hot.html") {
    hottest_content_container.appendChild(div);
  }
  if (location.pathname === "/pages/completed.html") {
    completed_content_container.appendChild(div);
  }
  if (location.pathname === "/pages/search.html") {
    search_content_container.appendChild(div);
  }
}
