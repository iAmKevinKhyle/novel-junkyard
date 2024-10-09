const hot_novels_home_container = document.getElementById(
  "hot_novels_home_container"
);
const latest_novels_home_container = document.getElementById(
  "latest_novels_home_container"
);
const completed_novels_home_container = document.getElementById(
  "completed_novels_home_container"
);
const hot_novels = "https://novel-scraper-290c.onrender.com/api/novel/hot";
const latest_novels =
  "https://novel-scraper-290c.onrender.com/api/novel/latest";
const completed_novels =
  "https://novel-scraper-290c.onrender.com/api/novel/completed";

window.addEventListener("load", () => {
  // ? add loader
  displayLoader();

  // ? FETCH HOT NOVELS
  fetch(hot_novels)
    .then((response) => {
      fetchStatus = response.status;
      return response.json();
    })
    .then((json) => {
      redirectIfHasError(fetchStatus, json);

      hot_novels_home_container.innerHTML = "";
      json.forEach((item) => {
        createHomeHotNovelElements(item);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // ? FETCH LATEST NOVELS
  fetch(latest_novels)
    .then((response) => {
      fetchStatus = response.status;
      return response.json();
    })
    .then((json) => {
      redirectIfHasError(fetchStatus, json);

      latest_novels_home_container.innerHTML = "";
      json.forEach((item) => {
        createHomeLatestNovelElements(item);
      });
    })
    .catch((err) => console.log(err));

  // ? FETCH COMPLETED NOVELS
  fetch(completed_novels)
    .then((response) => {
      fetchStatus = response.status;
      return response.json();
    })
    .then((json) => {
      redirectIfHasError(fetchStatus, json);

      completed_novels_home_container.innerHTML = "";
      json.forEach((item) => {
        createHomeCompletedNovelElements(item);
      });
      removeLoader();
    })
    .catch((err) => console.log(err));
});

function createHomeHotNovelElements(data) {
  const div = document.createElement("div");

  div.classList.add("card");
  div.dataset.title = data.title;
  div.dataset.link = data.link;
  div.addEventListener("click", (e) => getNovelInfo(e));
  div.title = data.title;

  div.innerHTML = `
        <img
            class="card_image"
            src="${data.img}"
            alt="${data.title}"
        />
        <span class="card_title">
            ${data.title}
        </span>
    `;

  hot_novels_home_container.appendChild(div);
}
function createHomeLatestNovelElements(data) {
  const div = document.createElement("div");
  const chapter_link = data.latest_chapter_link;

  const genres = data.genres.split(",");

  let elements = "";

  genres.map((res) => {
    const item = res.replaceAll("\n", "").trim();

    elements += `
      <a 
        href="javascript:void(0)" 
        title="${item.toLowerCase()}" 
        class="genre all_genres ${item.toLowerCase().replaceAll(" ", "_")}"
        onclick="handleGenreClick(this)"
      >
        ${item.toLowerCase()}
      </a>`;
  });

  div.classList.add("row");

  div.innerHTML = `
        <i class="fa-solid fa-caret-right"></i>
        <div class="link_holder">
          <a href="javascript:void(0)" class="novel-title" data-title="${
            data.title
          }" data-link="${
    data.link
  }" onclick="getNovelInfo(this, false, false)">
              ${data.title}

          </a>
          <span class="label_container">
            ${createLabelTitle(data.label_hot, data.label_full, data.label_new)}
          </span>
        </div>

        <span class="novel-genres">${elements}</span>
        
        <a href="javascript:void(0)" class="novel-latest-chapter" data-title="${
          data.title
        }" data-chapter="${
    data.latest_chapter
  }" data-link="${chapter_link}" onclick="getChapterContent(this)">
            ${data.latest_chapter}
        </a>
        <span class="novel-update-time">${data.update_time}</span>
    `;

  latest_novels_home_container.appendChild(div);
}
function createHomeCompletedNovelElements(data) {
  const div = document.createElement("div");

  div.classList.add("completed_card");
  div.dataset.title = data.title;
  div.dataset.link = data.link;
  div.addEventListener("click", (e) => getNovelInfo(e));
  div.title = data.title;

  div.innerHTML = `
        <img
            class="completed_novel_cover"
            src="${data.img}"
            alt="A${data.title}"
        />
        <span class="completed_novel_title">
            ${data.title}
        </span>
        <span class="completed_novel_detail">
            ${data.count}
        </span>
    `;

  completed_novels_home_container.appendChild(div);
}
function createLabelTitle(hot, full, bNew) {
  let elem = ``;
  if (hot) {
    elem += `<span class="label_title label_hot">hot</span>`;
  }
  if (full) {
    elem += `<span class="label_title label_full">full</span>`;
  }
  if (bNew) {
    elem += `<span class="label_title label_new">new</span>`;
  }

  return elem;
}
