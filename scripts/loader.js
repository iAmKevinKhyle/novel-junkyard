const loader = document.createElement("div");
loader.classList.add("loader-container");
loader.innerHTML = `<div class="global-loader"></div>`;

function displayLoader() {
  document.body.style.overflow = "hidden";
  document.body.appendChild(loader);
}

function removeLoader() {
  document.body.style.overflow = "auto";
  document.body.removeChild(loader);
}
