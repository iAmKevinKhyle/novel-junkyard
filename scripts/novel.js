const clear_reading_history = document.querySelector(".clear_reading_history");
const continue_reading_container = document.querySelector(
  ".continue_reading_container"
);
const reading_history_container = document.querySelector(
  ".reading_history_container"
);
const reading_history_wrapper = document.querySelector(
  ".reading_history_container > .history_wrapper"
);
const continue_reading_a = document.querySelector(
  ".continue_reading_container > a"
);
const breadcrumbs_novel_title = document.getElementById(
  "breadcrumbs_novel_title"
);
const rating_star = document.querySelector(".rating_container > .stars_holder");
const rating_text = document.querySelector(".rating_container > .text");
const novel_cover_img = document.getElementById("novel_cover_img");
const novel_title_header = document.getElementById("novel_title_header");
const novel_info_wrapper = document.getElementById("novel_info_wrapper");
const novel_latest_chapter = document.getElementById("novel_latest_chapter");
const novel_update_time = document.getElementById("novel_update_time");
const novel_current_chapter = document.getElementById("novel_current_chapter");
const novel_start_read = document.getElementById("novel_start_read");
const novel_desc = document.getElementById("novel_desc");
const add_to_favorite = document.getElementById("add_to_favorite");

window.addEventListener("load", () => {
  // ?show loader
  displayLoader();

  const novel_info = JSON.parse(localStorage.getItem("novel_info"));

  const url = "https://novel-scraper-290c.onrender.com/api/novel/description";
  const title = novel_info?.title;
  const link = novel_info?.link;
  const chapter_title = continue_reading_a?.dataset.chapter;
  const chapter_link = continue_reading_a?.dataset.link;

  if (location.pathname.includes("/pages/novel.html")) {
    document.title = title;
    const reading = JSON.parse(localStorage.getItem("reading"));
    let bookmark = JSON.parse(localStorage.getItem("bookmark")) || [];

    clear_reading_history.addEventListener("click", () => {
      clearReadingHistory();
    });

    add_to_favorite.addEventListener("click", () => {
      if (add_to_favorite.classList.contains("bookmarked")) {
        add_to_favorite.classList.remove("bookmarked");

        bookmark = bookmark.filter((item) => {
          return item.title !== title;
        });
      } else {
        add_to_favorite.classList.add("bookmarked");

        bookmark.push({
          title,
          link,
          chapter_title,
          chapter_link,
        });
      }

      localStorage.setItem("bookmark", JSON.stringify(bookmark));
    });

    bookmark?.map((item) => {
      const item_title = item.title;

      if (title === item_title) {
        add_to_favorite.classList.add("bookmarked");
      }
    });

    reading?.map((item) => {
      const item_title = item.title;

      if (title === item_title) {
        const item_chapter = item.chapter;
        const item_link = item.link;
        continue_reading_a.innerText = item_chapter;
        continue_reading_a.dataset.title = item_title;
        continue_reading_a.dataset.chapter = item_chapter;
        continue_reading_a.dataset.link = item_link;

        for (let i = item.history.length - 1; i >= 0; i--) {
          const el = item.history[i];
          const a = document.createElement("a");
          const span = document.createElement("span");

          a.href = "javascript:void(0)";
          a.dataset.title = el.title;
          a.dataset.chapter = el.chapter;
          a.dataset.link = el.link;
          a.addEventListener("click", (e) =>
            getChapterContent(e.currentTarget, true)
          );
          a.id = "novel_history_chapter";
          a.innerText = el.chapter;

          span.appendChild(a);
          reading_history_wrapper.appendChild(span);
        }

        continue_reading_container.style.display = "block";
        reading_history_container.style.display = "block";
      }
    });

    breadcrumbs_novel_title.innerText = title;

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
      .then((result) => {
        redirectIfHasError(fetchStatus, result);

        const data = result[0];
        const q = data.rating[0];
        const w = data.rating[1];
        const e = data.rating[2];
        const rating = parseInt(q);
        let stars = "";

        // ? cover
        novel_cover_img.src = data.img;
        novel_cover_img.alt = data.title;

        // ? title
        novel_title_header.innerText = data.title;
        novel_title_header.dataset.id = data.id;

        // ? rating
        for (let i = 0; i <= rating; i++) {
          if (q < i + 1 && q > i) {
            stars += `<i class="fa-solid fa-star-half title="star-${
              q % i
            }"></i>`;
          } else {
            stars += `<i class="fa-solid fa-star star-${i + 1}" title="star-${
              i + 1
            }"></i>`;
          }
        }
        rating_star.innerHTML = stars;
        rating_text.innerText = `Rating: ${q}/${w} form ${e} ratings`;

        // ? infos
        data.attr.map((item) => {
          const li = document.createElement("li");

          if (item.label.toLowerCase() === "genre") {
            let elements = "";

            item.value.split(",").map((val) => {
              const value = val.trim();

              elements += `<a 
                  href="javascript:void(0)" 
                  title="${value.toLowerCase()}" 
                  class="genre all_genres ${value
                    .toLowerCase()
                    .replaceAll(" ", "_")}"
                  onclick="handleGenreClick(this)"
                >
                  ${value.toLowerCase()}
                </a>`;
            });
            li.innerHTML = `
              <span>${item.label}:</span>
              <span class="genre_list">${elements}</span>
            `;
          } else {
            li.innerHTML = `
              <span>${item.label}:</span>
              <span>${item.value.replaceAll(",", ", ")}</span>
            `;
          }

          novel_info_wrapper.appendChild(li);
        });

        // ? latest chapter button
        novel_latest_chapter.innerText = data.latest_chapter;
        novel_latest_chapter.dataset.title = data.title;
        novel_latest_chapter.dataset.chapter = data.latest_chapter;
        novel_latest_chapter.dataset.link = data.latest_chapter_link;

        // ? start reading button
        novel_start_read.dataset.title = data.title;
        novel_start_read.dataset.chapter = data.first_chapter_title;
        novel_start_read.dataset.link = data.first_chapter_link;

        // ? novel description
        data.description.split(/(?<=[.?])/g).map((item) => {
          novel_desc.innerHTML += `<p>${item}.</p>`;
        });

        // ? update time
        novel_update_time.innerText = data.update_time;

        // ? remove loader
        removeLoader();
      })
      .catch((err) => console.log(err));
  }
});

function getNovelInfo(e, pages = false, addEvent = true) {
  const target = addEvent ? e.currentTarget : e;

  const title = target.dataset.title;
  const link = target.dataset.link;

  localStorage.setItem(
    "novel_info",
    JSON.stringify({
      title,
      link,
    })
  );

  if (pages) {
    location.href = "novel.html";
  } else {
    location.href = "pages/novel.html";
  }
}

function clearReadingHistory() {
  let text = "Are you sure?\nEither OK or Cancel.";

  if (confirm(text) === true) {
    let reading = JSON.parse(localStorage.getItem("reading"));
    const title = JSON.parse(localStorage.getItem("novel_info")).title;

    reading = reading.filter((el) => el.title !== title);

    localStorage.setItem("reading", JSON.stringify(reading));

    location.reload();
  }
}
