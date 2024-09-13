const voices_select = document.getElementById("voices_select");
const play_button = document.getElementById("play_button");
const stop_button = document.getElementById("stop_button");
const pause_button = document.getElementById("pause_button");
const forward_button = document.getElementById("forward_button");
const backward_button = document.getElementById("backward_button");

const control_toggle_button = document.querySelector(".control_toggle_button");
const wrapper = document.querySelector(".speak_control_container___wrapper");
const dec_rate = document.querySelector("#dec_rate");
const inc_rate = document.querySelector("#inc_rate");
const rate_con = document.querySelector(".rate");

const speech = new SpeechSynthesisUtterance();
const reader = window.speechSynthesis;

let sentences;
let voices = [];
let selected_voice = localStorage.getItem("voice") || 0;
let rate = localStorage.getItem("rate") || 1;
let control = localStorage.getItem("control") || "open";
let is_speaking = false;
let is_paused = false;
let len;
let index = 0;

window.addEventListener("load", () => {
  toggleControl(control);
  rate_con.innerHTML = rate;
});

control_toggle_button.addEventListener("click", (e) => {
  e.preventDefault();

  if (control === "open") {
    control = "close";
  } else {
    control = "open";
  }
  toggleControl(control);
  localStorage.setItem("control", control);
});

dec_rate.addEventListener("click", () => controlRate(false));
inc_rate.addEventListener("click", () => controlRate(true));

function controlRate(act) {
  rate = act ? parseFloat(rate) + 0.25 : parseFloat(rate) - 0.25;

  if (rate <= 0.25) rate = 0.25;
  if (rate >= 10) rate = 10;

  rate_con.innerHTML = rate;
  localStorage.setItem("rate", rate);
}

// todo: ###########################

reader.onvoiceschanged = () => {
  voices = reader.getVoices();
  speech.voice = voices[selected_voice];

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = voice.name;

    if (i === parseInt(selected_voice)) {
      option.selected = true;
    }

    voices_select.appendChild(option);
  });
};
voices_select.addEventListener("change", () => {
  speech.voice = voices[voices_select.value];
  localStorage.setItem("voice", voices_select.value);
});

play_button.addEventListener("click", () => {
  if (is_paused) {
    reader.resume();
    is_paused = false;
    is_speaking = true;
    playToPause();
    return;
  }

  sentences = document.querySelectorAll(".sentence");
  len = sentences.length;

  readContent(index, sentences, len);
  playToPause();
});

stop_button.addEventListener("click", () => {
  removeFollower(sentences);
  if (is_speaking) {
    reader.resume();
    reader.cancel();
  }
  is_paused = false;
  is_speaking = false;
  index = 0;
  pauseToPlay();
});
pause_button.addEventListener("click", () => {
  if (is_speaking) {
    reader.pause();
    is_paused = true;
    is_speaking = false;
    pauseToPlay();
  }
});
forward_button.addEventListener("click", () => {});
backward_button.addEventListener("click", () => {});

function followSentence(sentence) {
  sentence.style.backgroundColor = "rgb(29, 29, 29)";
  sentence.style.color = "rgb(204, 193, 193)";

  const sen = sentence.getBoundingClientRect();
  const height = window.innerHeight;

  if (sen.top < 0 || sen.bottom > height) {
    window.scroll(0, sentence.offsetTop - 100);
  }
}

function removeFollower(sentences) {
  sentences.forEach((el) => {
    el.style.backgroundColor = "transparent";
    el.style.color = "black";
  });
}

function toggleControl(con) {
  if (con === "close") {
    wrapper.style.bottom = -wrapper.offsetHeight + "px";
    control_toggle_button.innerHTML = `<i class="fa-solid fa-angle-up"></i>`;
  } else {
    wrapper.style.bottom = 0;
    control_toggle_button.innerHTML = `<i class="fa-solid fa-angle-down"></i>`;
  }
}

function readContent(i, sentences, length) {
  const text = sentences[i].innerText;

  speech.rate = rate;
  speech.text = text;
  reader.speak(speech);

  is_speaking = true;
  // index = i;

  // removeFollower(sentences);
  // followSentence(sentences[i]);
  console.log(text);

  speech.addEventListener("end", () => {
    i++;
    if (i < length) {
      readContent(i, sentences, length);
    }
  });
}

function playToPause() {
  play_button.style.display = "none";
  pause_button.style.display = "block";
}
function pauseToPlay() {
  play_button.style.display = "block";
  pause_button.style.display = "none";
}
