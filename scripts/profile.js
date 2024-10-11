window.addEventListener("load", () => {
  if (location.pathname.includes("/pages/profile.html")) {
    for (let i = 0; i < 3; i++) {
      createBookmarkedNovelElements(i, bookmark_content);
    }
    for (let i = 0; i < 3; i++) {
      createReadingNovelElements(i, reading_content);
    }

    if (bookmark_content.children.length > 1) {
      const empty_card_alert =
        bookmark_content.querySelector(".empty_card_alert");
      bookmark_content.removeChild(empty_card_alert);
    }
    if (reading_content.children.length > 1) {
      const empty_card_alert =
        reading_content.querySelector(".empty_card_alert");
      reading_content.removeChild(empty_card_alert);
    }
  }
});

function createBookmarkedNovelElements(data, container) {
  const div = document.createElement("div");

  div.classList.add("card_wrapper");
  //   div.dataset.title = data.title;
  //   div.dataset.link = data.link;
  // div.addEventListener("click", (e) => getNovelInfo(e));
  //   div.title = data.title;

  // ! add onlick event on A tag
  div.innerHTML = `
        <img src="../images/dummy.png" alt="dummy" />
        <div class="details">
            <p class="title">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias doloribus, labore odit cupiditate impedit qui dolore velit soluta, enim fugiat, in aliquam delectus accusantium beatae minima iusto voluptatibus deleniti commodi.</p>

            <span class="last_read_title">Last Read Chapter:</span>
            <a href="javascript:void(0)" class="continue_reading" data-title="" data-link="" title="">
              <i class="fa-solid fa-caret-right"></i> Chapter 111: Lorem ipsum dolor sit amet.
            </a>
            <button class="continue_reading_btn" data-title="" data-link="" title="">
              Continue Reading
            </button>
        </div>
      `;

  container.appendChild(div);
}
function createReadingNovelElements(data, container) {
  const div = document.createElement("div");

  div.classList.add("card_wrapper");
  //   div.dataset.title = data.title;
  //   div.dataset.link = data.link;
  // div.addEventListener("click", (e) => getNovelInfo(e));
  //   div.title = data.title;
  div.style = "min-height: 300px; background-color: var(--main-bg-color-dark);";

  div.innerHTML = `
        <h1 class="background_text on_card">Novel Junkyard</h1>
        <div class="blur" style="--blur: 0px"></div>
        <div class="details full f_end">
          <p class="title clickable" data-title="" data-link="" title="">
            Lorem ipsum dolor sit.
          </p>
          <span class="last_read_title">Last Read Chapter:</span>
          <a
            href="#"
            class="continue_reading"
            data-title=""
            data-link=""
            title=""
          >
            <i class="fa-solid fa-caret-right"></i> Chapter 111: Lorem
            ipsum dolor sit amet.
          </a>
          <button
            class="continue_reading_btn"
            data-title=""
            data-link=""
            title=""
          >
            Continue Reading
          </button>
          <span class="last_read_title">reading history:</span>
          ${createReadingHistoryList()}
        </div>
      `;

  container.appendChild(div);
}

function createReadingHistoryList(data = [1, 2, 3, 4, 5]) {
  const ul = document.createElement("ul");
  ul.classList.add("reading_history_list");

  data.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("chapter");

    const a = document.createElement("a");
    a.classList.add("continue_reading");
    a.href = "javascript:void(0)";
    a.innerHTML = `<i class="fa-solid fa-caret-right"></i> Chapter 111: Lorem
                ipsum dolor sit amet.`;

    li.appendChild(a);
    ul.appendChild(li);
  });

  return ul.outerHTML;
}
