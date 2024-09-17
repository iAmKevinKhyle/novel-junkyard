const genres = [
  {
    genre: "all",
    link: "https://novelbin.me/novelbin-genres/all",
  },
  {
    genre: "ACTION",
    link: "https://novelbin.me/novelbin-genres/action",
  },
  {
    genre: "ADULT",
    link: "https://novelbin.me/novelbin-genres/adult",
  },
  {
    genre: "ADVENTURE",
    link: "https://novelbin.me/novelbin-genres/adventure",
  },
  {
    genre: "COMEDY",
    link: "https://novelbin.me/novelbin-genres/comedy",
  },
  {
    genre: "DRAMA",
    link: "https://novelbin.me/novelbin-genres/drama",
  },
  {
    genre: "EASTERN",
    link: "https://novelbin.me/novelbin-genres/eastern",
  },
  {
    genre: "ECCHI",
    link: "https://novelbin.me/novelbin-genres/ecchi",
  },
  {
    genre: "FANFICTION",
    link: "https://novelbin.me/novelbin-genres/fanfiction",
  },
  {
    genre: "FANTASY",
    link: "https://novelbin.me/novelbin-genres/fantasy",
  },
  {
    genre: "GAME",
    link: "https://novelbin.me/novelbin-genres/game",
  },
  {
    genre: "GENDER BENDER",
    link: "https://novelbin.me/novelbin-genres/gender-bender",
  },
  {
    genre: "HAREM",
    link: "https://novelbin.me/novelbin-genres/harem",
  },
  {
    genre: "HISTORICAL",
    link: "https://novelbin.me/novelbin-genres/historical",
  },
  {
    genre: "HORROR",
    link: "https://novelbin.me/novelbin-genres/horror",
  },
  {
    genre: "ISEKAI",
    link: "https://novelbin.me/novelbin-genres/isekai",
  },
  {
    genre: "JOSEI",
    link: "https://novelbin.me/novelbin-genres/josei",
  },
  {
    genre: "LGBT+",
    link: "https://novelbin.me/novelbin-genres/lgbt+",
  },
  {
    genre: "LITRPG",
    link: "https://novelbin.me/novelbin-genres/litrpg",
  },
  {
    genre: "MAGIC",
    link: "https://novelbin.me/novelbin-genres/magic",
  },
  {
    genre: "MAGICAL REALISM",
    link: "https://novelbin.me/novelbin-genres/magical-realism",
  },
  {
    genre: "MARTIAL ARTS",
    link: "https://novelbin.me/novelbin-genres/martial-arts",
  },
  {
    genre: "MATURE",
    link: "https://novelbin.me/novelbin-genres/mature",
  },
  {
    genre: "MECHA",
    link: "https://novelbin.me/novelbin-genres/mecha",
  },
  {
    genre: "MODERN LIFE",
    link: "https://novelbin.me/novelbin-genres/modern-life",
  },
  {
    genre: "MOVIES",
    link: "https://novelbin.me/novelbin-genres/movies",
  },
  {
    genre: "MYSTERY",
    link: "https://novelbin.me/novelbin-genres/mystery",
  },
  {
    genre: "OTHER",
    link: "https://novelbin.me/novelbin-genres/other",
  },
  {
    genre: "PSYCHOLOGICAL",
    link: "https://novelbin.me/novelbin-genres/psychological",
  },
  {
    genre: "REALISTIC FICTION",
    link: "https://novelbin.me/novelbin-genres/realistic-fiction",
  },
  {
    genre: "REINCARNATION",
    link: "https://novelbin.me/novelbin-genres/reincarnation",
  },
  {
    genre: "ROMANCE",
    link: "https://novelbin.me/novelbin-genres/romance",
  },
  {
    genre: "SCHOOL LIFE",
    link: "https://novelbin.me/novelbin-genres/school-life",
  },
  {
    genre: "SCI-FI",
    link: "https://novelbin.me/novelbin-genres/sci-fi",
  },
  {
    genre: "SEINEN",
    link: "https://novelbin.me/novelbin-genres/seinen",
  },
  {
    genre: "SHOUJO",
    link: "https://novelbin.me/novelbin-genres/shoujo",
  },
  {
    genre: "SHOUJO AI",
    link: "https://novelbin.me/novelbin-genres/shoujo-ai",
  },
  {
    genre: "SHOUNEN",
    link: "https://novelbin.me/novelbin-genres/shounen",
  },
  {
    genre: "SHOUNEN AI",
    link: "https://novelbin.me/novelbin-genres/shounen-ai",
  },
  {
    genre: "SLICE OF LIFE",
    link: "https://novelbin.me/novelbin-genres/slice-of-life",
  },
  {
    genre: "SMUT",
    link: "https://novelbin.me/novelbin-genres/smut",
  },
  {
    genre: "SPORTS",
    link: "https://novelbin.me/novelbin-genres/sports",
  },
  {
    genre: "SUPERNATURAL",
    link: "https://novelbin.me/novelbin-genres/supernatural",
  },
  {
    genre: "SYSTEM",
    link: "https://novelbin.me/novelbin-genres/system",
  },
  {
    genre: "TRAGEDY",
    link: "https://novelbin.me/novelbin-genres/tragedy",
  },
  {
    genre: "URBAN",
    link: "https://novelbin.me/novelbin-genres/urban",
  },
  {
    genre: "URBAN LIFE",
    link: "https://novelbin.me/novelbin-genres/urban-life",
  },
  {
    genre: "VIDEO GAMES",
    link: "https://novelbin.me/novelbin-genres/video-games",
  },
  {
    genre: "WAR",
    link: "https://novelbin.me/novelbin-genres/war",
  },
  {
    genre: "WUXIA",
    link: "https://novelbin.me/novelbin-genres/wuxia",
  },
  {
    genre: "XIANXIA",
    link: "https://novelbin.me/novelbin-genres/xianxia",
  },
  {
    genre: "XUANHUAN",
    link: "https://novelbin.me/novelbin-genres/xuanhuan",
  },
  {
    genre: "YAOI",
    link: "https://novelbin.me/novelbin-genres/yaoi",
  },
  {
    genre: "YURI",
    link: "https://novelbin.me/novelbin-genres/yuri",
  },
];

const genre_container = document.querySelector(".genre-container");
const select_genre_container = document.getElementById("select-genre");
const genre_selected = document.querySelector(".genre-selected");
let all_genres;
let all_options;

window.addEventListener("load", () => {
  createElementForGenre();

  all_genres = document.querySelectorAll(".all_genres");

  const genre = sessionStorage.getItem("sort-genre")
    ? JSON.parse(sessionStorage.getItem("sort-genre")).genre
    : "all";

  if (location.pathname.includes("/pages/genre.html")) {
    genre_selected.innerText = genre.replaceAll("_", " ");

    all_options = document.querySelectorAll(".genre_option");

    all_options.forEach((item) => {
      const name = item.value;

      if (name === genre.replaceAll("_", " ")) {
        item.setAttribute("selected", true);
      }
    });

    select_genre_container.addEventListener("change", (e) =>
      handleSelectChanged(e)
    );
  }

  all_genres.forEach((el) => {
    el.classList.remove("active");

    if (el.classList.contains(genre)) {
      el.classList.add("active");
    }

    el.addEventListener("click", (e) => {
      e.preventDefault();
      handleGenreClick(e);
    });
  });
});

function handleSelectChanged(e) {
  const genre = e.target.value.toLowerCase().replaceAll(" ", "_");

  // ! this line?
  sessionStorage.setItem("page", 1);
  sessionStorage.setItem("sort-genre", JSON.stringify({ genre }));
  location.reload();
}

function createElementForGenre() {
  const ul = document.createElement("ul");

  genres.map((item) => {
    const li = document.createElement("li");

    li.innerHTML = `<a href="#" title="${item.genre.toLocaleLowerCase()}" class="genre all_genres ${item.genre
      .toLowerCase()
      .replaceAll(" ", "_")}" data-link="${
      item.link
    }">${item.genre.toLocaleLowerCase()}</a>`;

    if (location.pathname.includes("/pages/genre.html")) {
      const option = document.createElement("option");

      option.value = item.genre.toLocaleLowerCase();
      option.innerText = item.genre.toLocaleLowerCase();
      option.dataset.link = item.link;
      option.classList.add("genre_option");

      select_genre_container.appendChild(option);
    }

    ul.appendChild(li);
  });

  genre_container.appendChild(ul);
}

function handleGenreClick(e) {
  const el = e.currentTarget || e;

  sessionStorage.setItem("page", 1);
  sessionStorage.setItem(
    "sort-genre",
    JSON.stringify({ genre: el.title.replaceAll(" ", "_") })
  );

  if (location.pathname.includes("/index.html")) {
    location.href = "pages/genre.html";
  } else {
    location.href = "genre.html";
  }
}
