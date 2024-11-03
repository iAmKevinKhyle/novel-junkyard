const auth_page = document.getElementById("auth_page");
const profile_page = document.getElementById("profile_page");
const signup_button = document.querySelector(".signup_button");
const login_button = document.querySelector(".login_button");
const logout_button = document.querySelector(".logout_button");

const profile_name = document.querySelector(".profile_name");
const switch_login = document.querySelectorAll(".switch_login");
const switch_register = document.querySelectorAll(".switch_register");
const signup_section = document.querySelector(".signup_section");
const login_section = document.querySelector(".login_section");

// ? validation warning toast
const warning_login = document.querySelector(".warning_login");
const warning_name = document.querySelector(".warning_name");
const warning_password = document.querySelector(".warning_password");
const warning_cpassword = document.querySelector(".warning_cpassword");

// ? login and signup form input
const login_user_name = document.querySelector(".user_name_login");
const login_user_password = document.querySelector(".user_password_login");
const login_stay_login = document.querySelector(".stay_login_checkbox");
const signup_user_name = document.querySelector(".user_name_signup");
const signup_user_password = document.querySelector(".user_password_signup");
const signup_confirm_password = document.querySelector(
  ".confirm_password_signup"
);
const show_pass_login = document.querySelector(".show_pass_login");
const show_pass_signup = document.querySelector(".show_pass_signup");

let names = [];

// deleteCookie("session_id");
// alert(document.cookie);

login_button.addEventListener("click", () => {
  displayLoader();
  login_button.textContent = "Loading...";

  const user = {
    username: login_user_name.value.replace(/([-'"])/gm, ""),
    password: login_user_password.value,
  };

  const stay_login = login_stay_login.checked;

  if (checkB4Login(user.username, "u") || checkB4Login(user.password, "p")) {
    login_button.textContent = "Login";
    removeLoader();
    return;
  }

  //  ? api call for login and add session
  fetch(host + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      login_button.textContent = "Login";

      if (data.id === undefined) {
        setToast(data);

        removeLoader();
        location.reload();
        return;
      }

      setToast("Login Successful!");

      if (stay_login) {
        setCookie("session_id", data.id, 365);
      } else {
        setCookie("session_id", data.id, 1);
      }

      removeLoader();
      location.reload();
    })
    .catch((err) => console.log(err));
});

signup_button.addEventListener("click", (e) => {
  displayLoader();
  e.currentTarget.textContent = "Loading...";

  if (validateName() || validatePassword() || validateConfirmPassword()) {
    e.currentTarget.textContent = "Signup";
    removeLoader();
    return;
  }

  const user = {
    username: signup_user_name.value,
    password: signup_user_password.value,
  };

  //  ? api call for signup
  fetch(host + "create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      signup_button.textContent = "Signup";
      setToast(data);
      removeLoader();
      location.reload();
    })
    .catch((err) => console.log(err));
});

logout_button.addEventListener("click", () => {
  displayLoader();

  setToast("Logout Successful!");
  deleteCookie("session_id");

  setTimeout(() => {
    location.reload();
  }, 1000);
});

// ? sign up input event
signup_user_name.addEventListener("input", () => {
  handleInputNameEvent();
});

signup_user_password.addEventListener("input", () => {
  handleInputPasswordEvent();
});

function validateName() {
  const name = signup_user_name.value;

  if (name.length <= 0) {
    warning_name.textContent = `Username is required`;
    warning_name.style.display = "block";
    return true;
  } else if (checkNameChars(name)) {
    warning_name.textContent = `Username cannot contains special characters! (!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?)`;
    warning_name.style.display = "block";
    return true;
  } else if (name.length < 5) {
    warning_name.textContent = `Username should be 5 or more characters long.`;
    warning_name.style.display = "block";
    return true;
  } else if (checkNameAvailability(name)) {
    warning_name.textContent = `Username is already taken.`;
    warning_name.style.display = "block";
    return true;
  } else {
    warning_name.style.display = "none";
  }
  return false;
}

function validatePassword() {
  const password = signup_user_password.value;

  if (password === "") {
    warning_password.textContent = `Password is required`;
    warning_password.style.display = "block";
    return true;
  } else if (checkLeakedPassword(password) !== "") {
    warning_password.textContent = `Password cannot be ${password}`;
    warning_password.style.display = "block";
    return true;
  } else if (password.length < 7) {
    warning_password.textContent = `Password should be 7 or more characters long.`;
    warning_password.style.display = "block";
    return true;
  } else if (!checkUpperCaseChars(password)) {
    warning_password.textContent = `Password should contain 1 or more uppercase character.`;
    warning_password.style.display = "block";
    return true;
  } else if (password.includes(" ")) {
    warning_password.textContent = `Password cannot contain spaces.`;
    warning_password.style.display = "block";
    return true;
  } else if (!checkIntChars(password)) {
    warning_password.textContent = `Password should contain 1 or more number.`;
    warning_password.style.display = "block";
    return true;
  } else {
    warning_password.style.display = "none";
  }
  return false;
}

function validateConfirmPassword() {
  const password = signup_user_password.value;
  const confirm_password = signup_confirm_password.value;

  if (confirm_password !== password) {
    warning_cpassword.textContent = `Password does not match.`;
    warning_cpassword.style.display = "block";
    return true;
  } else {
    warning_cpassword.style.display = "none";
  }
  return false;
}

// ? functions

function checkNameAvailability(input) {
  let has = false;

  names.map((name) => {
    if (name.toLowerCase() === input.toLowerCase()) {
      has = true;
    }
  });
  return has;
}

function checkNameChars(input) {
  let regex = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
  // return input.match(regex) ? true : false;
  return regex.test(input);
}

function checkUpperCaseChars(input) {
  let has = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === char.toUpperCase()) {
      has = true;
    }
  }
  return has;
}

function checkIntChars(input) {
  let has = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (parseInt(char)) {
      has = true;
    }
  }
  return has;
}

function checkLeakedPassword(input) {
  const passwordList = [
    "password",
    "pass",
    "Password123",
    "qwerty",
    "qwertyuiop",
    "1234567890",
    "qwerty123",
    "superman",
    "batman",
  ];

  for (let i = 0; i < passwordList.length; i++) {
    const pass = passwordList[i];

    if (pass.toLocaleLowerCase() === input.toLocaleLowerCase()) {
      return input;
    }
  }

  return "";
}

function checkB4Login(input, ev) {
  if (input.trim() === "" || input === null || input === undefined) {
    warning_login.textContent = `Username and Password are both required`;
    warning_login.style.display = "block";
    return true;
  } else if (
    (input.length < 5 && ev === "u") ||
    (input.length < 7 && ev === "p")
  ) {
    warning_login.textContent = `Username or Password length is questionable.`;
    warning_login.style.display = "block";
    return true;
  } else {
    warning_login.style.display = "none";
  }
  return false;
}

async function getUser() {
  // ? find if there is a session if there is none goto login page
  let session_id = getCookie("session_id");

  if (session_id != "") {
    renderProfilePage(session_id);
  } else {
    renderAuthPage();
  }
}

function renderAuthPage() {
  if (auth_page.classList.contains("hide")) {
    auth_page.classList.remove("hide");
  }
  profile_page.classList.add("hide");
}

async function renderProfilePage(session_id) {
  displayLoader();

  // ? get user using session id // api call
  let user;
  let readings;
  const user_gmail = document.querySelector(".user_gmail");
  const user_name = document.querySelector(".user_name");

  await fetch(host + session_id)
    .then((res) => res.json())
    .then((data) => {
      user = data;
    })
    .catch((err) => console.log(err));

  await fetch(host + "reading/history/" + session_id)
    .then((res) => res.json())
    .then((data) => {
      readings = data.reading;
    })
    .catch((err) => console.log(err));

  const bookmarks = user.bookmark;

  bookmarks.forEach((bookmark) => {
    createBookmarkedNovelElements(bookmark, bookmark_content);
  });

  const div = document.createElement("div");
  div.classList.add("reading_history_grid");

  readings.forEach((reading, i) => {
    div.appendChild(createReadingNovelElements(reading));
  });

  reading_content.appendChild(div);

  user_name.textContent = user.username;
  user_gmail.textContent = user.username + "#" + removeLetter(user.id);
  document.title = user.username.toUpperCase();
  profile_name.textContent = user.username.toUpperCase();
  profile_name.href = "#" + user.username;

  if (bookmark_content.children.length > 1) {
    const empty_card_alert =
      bookmark_content.querySelector(".empty_card_alert");
    bookmark_content.removeChild(empty_card_alert);
  }
  if (reading_content.children.length > 1) {
    const empty_card_alert = reading_content.querySelector(".empty_card_alert");
    reading_content.removeChild(empty_card_alert);
  }

  removeLoader();

  if (profile_page.classList.contains("hide")) {
    profile_page.classList.remove("hide");
  }
  auth_page.classList.add("hide");
}

function removeLetter(str) {
  let newLetter = "";

  for (let i = 0; i < str.length; i++) {
    const letter = str[i];

    if (!isNaN(parseInt(letter))) {
      newLetter += letter;
    }
  }

  return newLetter;
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

const handleInputNameEvent = debounce(validateName, 750);
const handleInputPasswordEvent = debounce(validatePassword, 750);

switch_login.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.title = "Login";

    if (login_section.classList.contains("hide")) {
      login_section.classList.remove("hide");
    }
    if (!signup_section.classList.contains("hide")) {
      signup_section.classList.add("hide");
    }
  });
});
switch_register.forEach((btn) => {
  btn.addEventListener("click", async () => {
    document.title = "Signup";
    displayLoader();

    await fetch(host + "all")
      .then((res) => res.json())
      .then((data) => {
        names = data;
        removeLoader();
      })
      .catch((err) => console.log(err));
    if (signup_section.classList.contains("hide")) {
      signup_section.classList.remove("hide");
    }
    if (!login_section.classList.contains("hide")) {
      login_section.classList.add("hide");
    }
  });
});
show_pass_login.addEventListener("click", (e) => {
  if (e.currentTarget.checked) {
    login_user_password.type = "text";
  } else {
    login_user_password.type = "password";
  }
});
show_pass_signup.addEventListener("click", (e) => {
  if (e.currentTarget.checked) {
    signup_user_password.type = "text";
    signup_confirm_password.type = "text";
  } else {
    signup_user_password.type = "password";
    signup_confirm_password.type = "password";
  }
});

getUser();
displayToast();
