const genres = [
  {
    genre: "All",
    link: "https://novelfull.net/genre/Action",
  },
  {
    genre: "Shounen",
    link: "https://novelfull.net/genre/Shounen",
  },
  {
    genre: "Harem",
    link: "https://novelfull.net/genre/Harem",
  },
  {
    genre: "Comedy",
    link: "https://novelfull.net/genre/Comedy",
  },
  {
    genre: "Martial Arts",
    link: "https://novelfull.net/genre/Martial+Arts",
  },
  {
    genre: "School Life",
    link: "https://novelfull.net/genre/School+Life",
  },
  {
    genre: "Mystery",
    link: "https://novelfull.net/genre/Mystery",
  },
  {
    genre: "Shoujo",
    link: "https://novelfull.net/genre/Shoujo",
  },
  {
    genre: "Romance",
    link: "https://novelfull.net/genre/Romance",
  },
  {
    genre: "Sci-fi",
    link: "https://novelfull.net/genre/Sci-fi",
  },
  {
    genre: "Gender Bender",
    link: "https://novelfull.net/genre/Gender+Bender",
  },
  {
    genre: "Mature",
    link: "https://novelfull.net/genre/Mature",
  },
  {
    genre: "Fantasy",
    link: "https://novelfull.net/genre/Fantasy",
  },
  {
    genre: "Horror",
    link: "https://novelfull.net/genre/Horror",
  },
  {
    genre: "Drama",
    link: "https://novelfull.net/genre/Drama",
  },
  {
    genre: "Tragedy",
    link: "https://novelfull.net/genre/Tragedy",
  },
  {
    genre: "Supernatural",
    link: "https://novelfull.net/genre/Supernatural",
  },
  {
    genre: "Ecchi",
    link: "https://novelfull.net/genre/Ecchi",
  },
  {
    genre: "Xuanhuan",
    link: "https://novelfull.net/genre/Xuanhuan",
  },
  {
    genre: "Adventure",
    link: "https://novelfull.net/genre/Adventure",
  },
  {
    genre: "Action",
    link: "https://novelfull.net/genre/Action",
  },
  {
    genre: "Psychological",
    link: "https://novelfull.net/genre/Psychological",
  },
  {
    genre: "Xianxia",
    link: "https://novelfull.net/genre/Xianxia",
  },
  {
    genre: "Wuxia",
    link: "https://novelfull.net/genre/Wuxia",
  },
  {
    genre: "Historical",
    link: "https://novelfull.net/genre/Historical",
  },
  {
    genre: "Slice of Life",
    link: "https://novelfull.net/genre/Slice+of+Life",
  },
  {
    genre: "Seinen",
    link: "https://novelfull.net/genre/Seinen",
  },
  {
    genre: "Lolicon",
    link: "https://novelfull.net/genre/Lolicon",
  },
  {
    genre: "Adult",
    link: "https://novelfull.net/genre/Adult",
  },
  {
    genre: "Josei",
    link: "https://novelfull.net/genre/Josei",
  },
  {
    genre: "Sports",
    link: "https://novelfull.net/genre/Sports",
  },
  {
    genre: "Smut",
    link: "https://novelfull.net/genre/Smut",
  },
  {
    genre: "Mecha",
    link: "https://novelfull.net/genre/Mecha",
  },
  {
    genre: "Yaoi",
    link: "https://novelfull.net/genre/Yaoi",
  },
  {
    genre: "Shounen Ai",
    link: "https://novelfull.net/genre/Shounen+Ai",
  },
  {
    genre: "Magical Realism",
    link: "https://novelfull.net/genre/Magical+Realism",
  },
  {
    genre: "Video Games",
    link: "https://novelfull.net/genre/Video+Games",
  },
  {
    genre: "Martial",
    link: "https://novelfull.net/genre/Martial",
  },
  {
    genre: "Game",
    link: "https://novelfull.net/genre/Game",
  },
  {
    genre: "Yuri",
    link: "https://novelfull.net/genre/Yuri",
  },
  {
    genre: "Magical",
    link: "https://novelfull.net/genre/Magical",
  },
  {
    genre: "Reincarnation",
    link: "https://novelfull.net/genre/Reincarnation",
  },
  {
    genre: "LGBT+",
    link: "https://novelfull.net/genre/LGBT%2B",
  },
  {
    genre: "Manhua",
    link: "https://novelfull.net/genre/Manhua",
  },
  {
    genre: "Traged",
    link: "https://novelfull.net/genre/Traged",
  },
  {
    genre: "Isekai",
    link: "https://novelfull.net/genre/Isekai",
  },
  {
    genre: "Magic",
    link: "https://novelfull.net/genre/Magic",
  },
  {
    genre: "Shoujo Ai",
    link: "https://novelfull.net/genre/Shoujo+Ai",
  },
  {
    genre: "LitRPG",
    link: "https://novelfull.net/genre/LitRPG",
  },
  {
    genre: "Eastern",
    link: "https://novelfull.net/genre/Eastern",
  },
  {
    genre: "System",
    link: "https://novelfull.net/genre/System",
  },
  {
    genre: "Hentai",
    link: "https://novelfull.net/genre/Hentai",
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

    select_genre_container.addEventListener("change", (e) => {
      handleSelectChanged(e);
      resetPage();
    });
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

  resetPage();
  sessionStorage.setItem(
    "sort-genre",
    JSON.stringify({ genre: el.title.replaceAll(" ", "_") })
  );

  if (
    location.pathname.includes("/index.html") ||
    location.pathname[location.pathname.length - 1] === "/"
  ) {
    location.href = "pages/genre.html";
  } else {
    location.href = "genre.html";
  }
}
