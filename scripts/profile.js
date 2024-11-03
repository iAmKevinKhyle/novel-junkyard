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
      e.stopImmediatePropagation();
      e.preventDefault();

      getChapterContent(e.currentTarget, true);
    });
  });
}

function createReadingNovelElements(data) {
  const div = document.createElement("div");
  div.classList.add("list_row");
  div.dataset.id = data.$id;

  div.innerHTML = `
    <div class="col-1">
      <i class="fa-solid fa-caret-right"></i> ${data.title}
    </div>
    <div class="col-3">
      <a 
        href="javascript:void(0)"
        data-title="${data.title}" 
        data-chapter="${data.chapter}" 
        data-link="${data.link}" 
        title="Cultivation Online"
        onclick="getChapterContent(this, true)"
      >
        ${data.chapter}
      </a>
    </div>
  `;

  return div;
}
