import { loadDetailView } from "./detailView";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";

export function loadMainMenu() {
  rootElement.classList.remove("show-background");
  renderLoadingScreen("Load overview...");
  renderMainMenu();
}

export function renderMainMenu() {
  rootElement.innerHTML = `
    <div class="main-menu">
    ${getMenuHeaderHtml()}
    ${getCityListHtml()}
    </div>
    `;

  registerEventListeners();
}

function getMenuHeaderHtml() {
  return `
    <div class="main-menu__heading">
          Weather <button class="main-menu__edit">Edit</button>
        </div>
      <div class="main-menu__search-bar">
        <input
          type="text"
          class="main-menu__search-input"
          placeholder="Search for city..."
        />
      </div>
    `;
}

function getCityListHtml() {
  const favoriteCities = ["Oslo", "Stockholm", "Helsinki"];

  const favoriteCitiesElements = [];

  for (let city of favoriteCities) {
    const cityHtml = `
        <div class="city-wrapper">
          <div class="city" data-city-name="${city}">
            <div class="city__left-column">
              <h2 class="city__name">${city}</h2>
              <div class="city__country">Norway</div>
              <div class="city__condition">sonnig</div>
            </div>
            <div class="city__right-column">
              <div class="city__temperature">20°</div>
              <div class="city__min-max-temperature">H:21° T:11°</div>
            </div>
          </div>
        </div>
    `;
    favoriteCitiesElements.push(cityHtml);
  }

  const favoriteCitiesHtml = favoriteCitiesElements.join("");

  return `
        <div class="main-menu__cities-list">
            ${favoriteCitiesHtml}
        </div>
    `;
}

function registerEventListeners() {
  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");

      loadDetailView(cityName);
    });
  });
}
