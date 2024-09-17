const chapter_content_container = document.querySelector(
  ".chapter_content_container"
);
const novel_title = document.querySelector(".novel_title");
const novel_chapter = document.querySelector(".novel_chapter");
const prev_chapter = document.querySelectorAll("#prev_chapter");
const next_chapter = document.querySelectorAll("#next_chapter");

window.addEventListener("load", () => {
  if (location.pathname === "/pages/chapter.html") {
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
          const p = document.createElement("p");
          p.classList.add("sentence");
          p.dataset.index = i;
          p.innerText = item.p;

          chapter_content_container.appendChild(p);
        });
      });

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
      });
  }
});

function getChapterContent(el, pages = false) {
  const title = el.dataset.title.replaceAll("\n", "");
  const title_link =
    "https://novelbin.me/novel-book/" +
    el.dataset.title.toLowerCase().replaceAll("\n", "").replaceAll(" ", "-");
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
      link: link.split("/").slice(0, 5).join("/"),
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
