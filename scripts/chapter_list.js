const chapter_list_wrapper = document.getElementById("chapter_list_wrapper");
const span = show_more_chapter.children[0];
const loader = show_more_chapter.children[1];
let chapter_list = [];

let chapter_limit = 10;
let chapter_add = 25;

window.addEventListener("load", () => {
  if (location.pathname === "/pages/novel.html") {
    const result = loadSavedChapterList();

    if (!result || chapter_list.length === 0) {
      sessionStorage.removeItem("first_link");
      setTimeout(() => {
        const link = sessionStorage.getItem("first_link");
        getChapterOneByOne(link);
        showLoader(span, loader);
      }, 1000);
    }
    if (chapter_list.length >= 10) {
      chapter_limit = chapter_list.length;
    }
  }
});

function showMoreChapter(e) {
  const link = e.dataset.link;

  showLoader(span, loader);

  chapter_limit += chapter_add;

  getChapterOneByOne(link);
}

function getChapterOneByOne(link) {
  if (link === "" || chapter_list.length >= chapter_limit) {
    const start_index = chapter_list_wrapper.children.length;

    chapter_list.map((el, i) => {
      if (i >= start_index) {
        createChapterListContent(el.title, el.chapter, el.link);
      }
    });
    saveLoadedChapterList();
    removeLoader(span, loader);
    return;
  }

  const url = `http://192.168.18.32:8080/api/novel/navigate`;
  const title = JSON.parse(localStorage.getItem("novel_info")).title;

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
      if (result[1].next_link !== "") {
        chapter_list.push({
          title,
          chapter: result[1].next_title,
          link: result[1].next_link,
        });
      }

      setTimeout(() => {
        getChapterOneByOne(result[1].next_link);
      }, 250);
    })
    .catch((err) => console.log(err));
}

function saveLoadedChapterList() {
  const bookmark = JSON.parse(localStorage.getItem("bookmark"));
  const current_novel = JSON.parse(localStorage.getItem("novel_info")).title;

  bookmark?.map((item) => {
    if (item.title === current_novel) {
      item.chapter_list = chapter_list;
    }
  });

  localStorage.setItem("bookmark", JSON.stringify(bookmark));
}

function loadSavedChapterList() {
  const bookmark = JSON.parse(localStorage.getItem("bookmark"));
  const current_novel = JSON.parse(localStorage.getItem("novel_info")).title;
  let result = false;

  bookmark?.map((item) => {
    if (item.title === current_novel) {
      item.chapter_list?.map((el) => {
        createChapterListContent(el.title, el.chapter, el.link);
      });

      if (item.chapter_list !== undefined) {
        chapter_list = item.chapter_list;
      }

      localStorage.setItem("bookmark", JSON.stringify(bookmark));
      result = true;
    }
  });

  return result;
}

function createChapterListContent(title, chapter, link) {
  show_more_chapter.dataset.link = link;

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

function showLoader(span, loader) {
  span.style.display = "none";
  loader.style.display = "block";
}

function removeLoader(span, loader) {
  span.style.display = "block";
  loader.style.display = "none";
}
