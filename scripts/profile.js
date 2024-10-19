function createBookmarkedNovelElements(data, container) {
  const div = document.createElement("div");

  div.classList.add("card_wrapper");
  div.dataset.title = data.title;
  div.dataset.link = data.link;
  div.addEventListener("click", (e) => getNovelInfo(e, true));
  div.title = data.title;

  div.innerHTML = `
        <img src="${data.cover}" alt="${data.title}" />
        <div class="details half">
            <p class="title">${data.title}</p>

            <span class="last_read_title">Last Read Chapter:</span>
            <a href="javascript:void(0)" class="continue_reading stopPropagationBookmarkEvent" data-title="${data.title}" data-chapter="${data.chapter_title}" data-link="${data.chapter_link}" title="${data.title}">
              <i class="fa-solid fa-caret-right"></i> ${data.chapter_title}
            </a>
            <button class="continue_reading_btn stopPropagationBookmarkEvent" data-title="${data.title}" data-chapter="${data.chapter_title}" data-link="${data.chapter_link}" title="${data.title}">
              Continue Reading
            </button>
        </div>
      `;

  container.appendChild(div);

  const stopPropagationEvent = document.querySelectorAll(
    ".stopPropagationBookmarkEvent"
  );

  stopPropagationEvent.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      getChapterContent(e.currentTarget, true);
    });
  });
}
function createReadingNovelElements(data, container) {
  const div = document.createElement("div");

  div.classList.add("card_wrapper");
  div.dataset.title = data.title;
  div.dataset.link = data.title_link;
  div.addEventListener("click", (e) => {
    getNovelInfo(e, true);
  });
  div.title = data.title;

  div.style = "min-height: 325px; background-color: var(--main-bg-color-dark);";

  div.innerHTML = `
        <h1 class="background_text on_card">${data.title}</h1>
        <div class="blur" style="--blur: 0px"></div>
        <div class="details full f_end">
          <p class="title clickable" data-title="${data.title}" data-link="${
    data.title_link
  }" title="${data.title}" onclick="getNovelInfo(this)">
            ${data.title}
          </p>
          <span class="last_read_title">Last Read Chapter:</span>
          <a
            href="javascript:void(0)"
            class="continue_reading stopPropagationReadingEvent"
            data-title="${data.title}" data-chapter="${
    data.chapter
  }" data-link="${data.link}" title="${data.title}"
          >
            <i class="fa-solid fa-caret-right"></i> ${data.chapter}
          </a>
          <button
            class="continue_reading_btn stopPropagationReadingEvent"
            data-title="${data.title}" data-chapter="${
    data.chapter
  }" data-link="${data.link}" title="${data.title}"
          >
            Continue Reading
          </button>
          <span class="last_read_title">reading history:</span>
          ${createReadingHistoryList(data.history)}
        </div>
      `;

  container.appendChild(div);

  const stopPropagation = document.querySelectorAll(
    ".stopPropagationReadingEvent"
  );

  stopPropagation.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      getChapterContent(e.currentTarget, true);
    });
  });
}
function createReadingHistoryList(data = []) {
  let limit = 0;
  const ul = document.createElement("ul");
  ul.classList.add("reading_history_list");

  for (let i = data.length - 1; i >= 0; i--) {
    limit++;

    if (limit > 5) {
      break;
    }

    const item = data[i];

    const li = document.createElement("li");
    li.classList.add("chapter");

    const a = document.createElement("a");
    a.classList.add("continue_reading", "stopPropagationReadingEvent");
    a.dataset.title = item.title;
    a.dataset.chapter = item.chapter;
    a.dataset.link = item.link;
    a.title = item.title;
    a.href = "javascript:void(0)";
    a.innerHTML = `<i class="fa-solid fa-caret-right"></i> ${item.chapter}`;

    li.appendChild(a);
    ul.appendChild(li);
  }

  return ul.outerHTML;
}
