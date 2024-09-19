const chapter_content_container = document.querySelector(
  ".chapter_content_container"
);
const novel_title = document.querySelector(".novel_title");
const novel_chapter = document.querySelector(".novel_chapter");
const prev_chapter = document.querySelectorAll("#prev_chapter");
const next_chapter = document.querySelectorAll("#next_chapter");

// ? copy from stack overflow
const debounce = (mainFunction, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
};

const debounceScrollEvent = debounce(saveScrollY, 5000);

window.addEventListener("load", () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    // ? show loader
    displayLoader();

    // ? prevent server spin down
    preventServerSpinDown();

    const url = "https://novel-scraper-290c.onrender.com/api/novel/content";
    const url2 = "https://novel-scraper-290c.onrender.com/api/novel/navigate";
    const chapter = JSON.parse(localStorage.getItem("chapter"));
    const title = chapter.title;
    const chapter_name = chapter.chapter;
    const link = chapter.link;

    novel_title.innerText = title;
    novel_chapter.innerText = chapter_name;
    breadcrumbs_novel_title.innerText = title;
    document.title = chapter_name;

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
      .then((data) => {
        data.map((item, i) => {
          if (item.p !== undefined) {
            const p = document.createElement("p");
            p.classList.add("sentence");
            p.dataset.index = i;
            p.innerText = item.p;

            chapter_content_container.appendChild(p);
          } else if (item.ul !== undefined) {
            const ul = document.createElement("ul");
            ul.classList.add("content_list");
            ul.dataset.index = i;
            ul.innerHTML = item.ul;

            chapter_content_container.appendChild(ul);
          } else {
            const span = document.createElement("span");
            span.classList.add("others");
            span.dataset.index = i;
            span.innerHTML = item.other;

            chapter_content_container.appendChild(span);
          }
        });
      })
      .catch((err) => console.log(err));

    fetch(url2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data[0].prev_isDisabled) {
          prev_chapter.forEach((el) => {
            el.dataset.title = title;
            el.dataset.chapter = data[0].prev_title;
            el.dataset.link = data[0].prev_link;
          });
        } else {
          prev_chapter.forEach((el) => el.setAttribute("disabled", true));
        }
        if (!data[1].next_isDisabled) {
          next_chapter.forEach((el) => {
            el.dataset.title = title;
            el.dataset.chapter = data[1].next_title;
            el.dataset.link = data[1].next_link;
          });
        } else {
          next_chapter.forEach((el) => el.setAttribute("disabled", true));
        }

        // ?remove loader
        removeLoader();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setTimeout(() => {
          // ? scroll to save position
          scrollToSavePositon();
        }, 1000);
      });
  }
});

window.addEventListener("scroll", () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    debounceScrollEvent();
  }
});

function getChapterContent(el, pages = false) {
  if (el.getAttribute("disabled") === "true") {
    return;
  }

  // ? reset scroll positon
  localStorage.setItem("scroll_y", 0);

  const title = el.dataset.title.replaceAll("\n", "");
  let title_link = el.dataset.link.split("/");
  title_link.pop();
  title_link = title_link.join("/") + ".html";
  const link = el.dataset.link;
  const chapter = el.dataset.chapter.replaceAll("\n", "");

  if (link === "N/A" || chapter === "N/A") {
    return;
  }

  saveReadingHistory(title, title_link, chapter, link);
  updateBookmarkChapter();
  localStorage.setItem(
    "novel_info",
    JSON.stringify({
      title,
      link: title_link,
    })
  );

  if (pages) {
    location.href = "chapter.html";
  } else {
    location.href = "pages/chapter.html";
  }
}

function saveReadingHistory(title, title_link, chapter, link) {
  const limit = 5;
  let isEqual = false;
  const reading = localStorage.getItem("reading")
    ? JSON.parse(localStorage.getItem("reading"))
    : [];

  reading.forEach((item) => {
    if (item.title === title) {
      if (item.chapter !== chapter) {
        item.chapter = chapter;
        item.link = link;
      }
      isEqual = true;

      if (item.history.length >= limit) {
        item.history = item.history.slice(1);
      }

      const history = item.history;
      const len = history.length;

      if (history[len - 1].chapter !== chapter) {
        item.history.push({
          title,
          chapter,
          link,
        });
      }
    }
  });

  if (!isEqual) {
    reading.push({
      title,
      title_link,
      chapter,
      link,
      history: [
        {
          title,
          chapter,
          link,
        },
      ],
    });
  }

  localStorage.setItem("reading", JSON.stringify(reading));
  localStorage.setItem(
    "chapter",
    JSON.stringify({
      title,
      chapter,
      link,
    })
  );
}

function updateBookmarkChapter() {
  const bookmark = JSON.parse(localStorage.getItem("bookmark")) || [];
  const chapter = JSON.parse(localStorage.getItem("chapter")) || [];
  if (bookmark.length === 0) return;

  bookmark.map((item) => {
    if (item.title === chapter.title) {
      item.chapter_title = chapter.chapter;
      item.chapter_link = chapter.link;
    }
  });

  localStorage.setItem("bookmark", JSON.stringify(bookmark));
}

function saveScrollY() {
  localStorage.setItem("scroll_y", window.scrollY);
}

function scrollToSavePositon() {
  const pos = localStorage.getItem("scroll_y")
    ? JSON.parse(localStorage.getItem("scroll_y"))
    : 0;

  window.scroll(0, pos);
}

function preventServerSpinDown() {
  const time = Math.floor(Math.random() * (800000 - 600000) + 600000);

  if (location.pathname.includes("/pages/chapter.html")) {
    fetch("https://novel-scraper-290c.onrender.com/")
      .then((response) => response.json())
      .then((data) => {
        console.log("SDP (Spin Down Prevention) Protocol Activated!");
      })
      .catch((err) => console.log(err));
  }

  setTimeout(() => {
    preventServerSpinDown();
  }, time);
}
