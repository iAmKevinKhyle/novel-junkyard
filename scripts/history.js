const reading_container = document.getElementById("reading_container");
const bookmark_container = document.getElementById("bookmark_container");
const reading_content_container = document.getElementById(
  "reading_content_container"
);
const bookmark_content_container = document.getElementById(
  "bookmark_content_container"
);

window.addEventListener("load", () => {
  const reading = JSON.parse(localStorage.getItem("reading")) || [];
  const bookmark = JSON.parse(localStorage.getItem("bookmark")) || [];

  if (reading.length === 0) {
    reading_container.style.display = "none";
  }
  if (bookmark.length === 0) {
    bookmark_container.style.display = "none";
  }

  bookmark.map((item) => {
    const { title, link, chapter_title, chapter_link } = item;
    createNewElement(
      title,
      link.replaceAll(":", "").replaceAll("https", "https:"),
      chapter_title,
      chapter_link,
      bookmark_content_container
    );
  });

  reading.map((item) => {
    const { title, title_link, chapter, link } = item;
    createNewElement(
      title,
      title_link.replaceAll(":", "").replaceAll("https", "https:"),
      chapter,
      link,
      reading_content_container
    );
  });
});

function createNewElement(title, link, chapter_title, chapter_link, container) {
  const div = document.createElement("div");
  div.classList.add("home_content_row");

  if (chapter_title === "") {
    chapter_title = "N/A";
  }
  if (chapter_link === "") {
    chapter_link = "N/A";
  }

  div.innerHTML = `
        <a 
            href="javascript:void(0)" 
            class="novel_title"
            data-title="${title}" 
            data-link="${link}" 
            onclick="getNovelInfo(this, false, false)"
        >
            <i class="fa-solid fa-caret-right"></i>
            <span>
                ${title}
            </span>
        </a>
        <a 
            href="javascript:void(0)" 
            class="novel_chapter"
            data-title="${title}" 
            data-chapter="${chapter_title}" 
            data-link="${chapter_link}" 
            onclick="getChapterContent(this)"
        >
            ${chapter_title}
        </a>
    `;

  container.appendChild(div);
}
