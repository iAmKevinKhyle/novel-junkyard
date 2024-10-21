const chapter_content_container = document.querySelector(
  ".chapter_content_container"
);
const novel_title = document.querySelector(".novel_title");
const novel_chapter = document.querySelector(".novel_chapter");
const prev_chapter = document.querySelectorAll("#prev_chapter");
const next_chapter = document.querySelectorAll("#next_chapter");
const loading_text = document.querySelector(".loading_text");

let fetching = true;
let protocol;
let clicked = false;

window.addEventListener("load", async () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    // ? show loader
    displayLoader();

    // ? prevent server spin down
    protocol = await preventServerSpinDown();

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
      .then((response) => {
        fetchStatus = response.status;
        return response.json();
      })
      .then((data) => {
        redirectIfHasError(fetchStatus, data);
        loading_text.style.display = "none";

        data.map((item, i) => {
          if (item.p !== undefined) {
            const p = document.createElement("p");
            p.classList.add("sentence");
            p.innerHTML = item.p.replace(/NovelFull.Net/gi, "Novel Junkyard.");

            chapter_content_container.appendChild(p);
          } else if (item.ul !== undefined) {
            const ul = document.createElement("ul");
            ul.classList.add("content_list");
            ul.innerHTML = item.ul.replace(
              /NovelFull.Net/gi,
              "Novel Junkyard."
            );

            chapter_content_container.appendChild(ul);
          } else {
            const span = document.createElement("span");
            span.classList.add("others");
            span.innerHTML = item.other
              .replaceAll("<u>", "<span>")
              .replaceAll("</u>", "</span>")
              .replace(/NovelFull.Net/gi, "Novel Junkyard.");

            chapter_content_container.appendChild(span);
          }
        });

        const iframes = chapter_content_container.querySelectorAll("iframe");

        iframes.forEach((frame) => {
          frame.remove();
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
      .then((response) => {
        fetchStatus = response.status;
        return response.json();
      })
      .then((data) => {
        redirectIfHasError(fetchStatus, data);

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
        const clicked =
          JSON.parse(localStorage.getItem("clicked_this")) || false;
        fetching = false;

        setTimeout(() => {
          if (!clicked) {
            // ? scroll to save position
            scrollToSavePositon();
          } else {
            localStorage.setItem("scroll_y", 0);
          }
          localStorage.removeItem("clicked_this");
        }, 1000);
      });
  }
});

window.addEventListener("beforeunload", () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    saveScrollY();
  }
});

window.addEventListener("visibilitychange", () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    saveScrollY();

    if (document.visibilityState === "visible") {
      // ? prevent server spin down
      preventServerSpinDown();
    }
  }
});

window.addEventListener("blur", () => {
  if (location.pathname.includes("/pages/chapter.html")) {
    saveScrollY();
  }
});

// window.addEventListener("scroll", () => {
//   if (location.pathname.includes("/pages/chapter.html")) {
//     handleScrollEvent();
//   }
// });

async function getChapterContent(el, pages = false) {
  const prevButtonContent = el.innerHTML;

  if (clicked) {
    return;
  }

  if (el.getAttribute("disabled") === "true") {
    return;
  }

  clicked = true;
  el.innerHTML = `<span class="mini-loader"></span>`;

  // ? set clicked to true so prevent scroll
  localStorage.setItem("clicked_this", true);

  const title = el.dataset.title.replaceAll("\n", "");
  let title_link = el.dataset.link.split("/");
  title_link.pop();
  title_link = title_link.join("/") + ".html";
  const link = el.dataset.link;
  const chapter = el.dataset.chapter.replaceAll("\n", "");
  const session_id = getCookie("session_id") || "";

  const obj = [
    {
      chapter_title: chapter,
      chapter_link: link,
    },
    2,
  ];

  if (link === "N/A" || chapter === "N/A") {
    clicked = false;
    el.innerHTML = prevButtonContent;

    setToast("No URL Found!");
    displayToast();
    return;
  }

  await saveReadingHistory(title, title_link, chapter, link);
  await updateBookmarkChapter(session_id, title, obj);
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

async function saveReadingHistory(title, title_link, chapter, link) {
  const session_id = getCookie("session_id") || "";
  let reading_id;

  localStorage.setItem(
    "chapter",
    JSON.stringify({
      title,
      chapter,
      link,
    })
  );

  if (session_id === "") {
    return;
  }

  const data = {
    title,
    title_link,
    chapter,
    link,
  };

  // ? Update/Create Reading Document
  await fetch(host + "reading", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      user_id: session_id,
      novel_title: title,
      data,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      reading_id = data.id;
    })
    .catch((err) => console.log(err));

  const history = {
    title,
    chapter,
    link,
  };

  // ? Update Chapter History
  await fetch(host + "reading/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      reading_id,
      history,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
}

// ?  UPDATE BOOKMARK LAST READ CHAPTER
async function updateBookmarkChapter(user_id, novel_title, data) {
  if (user_id === "") {
    return;
  }

  await fetch(host + "bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      user_id,
      novel_title,
      data,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
}

function saveScrollY() {
  if (fetching) return;

  localStorage.setItem("scroll_y", window.scrollY);
}

function scrollToSavePositon() {
  const pos = localStorage.getItem("scroll_y")
    ? JSON.parse(localStorage.getItem("scroll_y"))
    : 0;

  window.scroll(0, pos);
}

async function preventServerSpinDown() {
  if (protocol) {
    clearTimeout(protocol);
  }

  const time = Math.floor(Math.random() * (550000 - 500000) + 500000);

  if (location.pathname.includes("/pages/chapter.html")) {
    await fetch("https://novel-scraper-290c.onrender.com/")
      .then((response) => response.json())
      .then((data) => {
        console.log("SDP (Spin Down Prevention) Protocol Activated!");
      })
      .catch((err) => console.log(err));
  }

  protocol = setTimeout(() => {
    preventServerSpinDown();
  }, time);
}

function debounce(callback, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
}

const handleScrollEvent = debounce(saveScrollY, 500);
