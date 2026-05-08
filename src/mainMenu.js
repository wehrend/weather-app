import { getFavoriteCities, getForecastWeather } from "./api";
import { loadDetailView } from "./detailView";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import { getConditionImagePath } from "./conditions";
import { formatTemperature } from "./utils";

export async function loadMainMenu() {
  rootElement.classList.remove("show-background");
  renderLoadingScreen("Load overview...");
  await renderMainMenu();
}

export async function renderMainMenu() {
  rootElement.innerHTML = `
    <div class="main-menu">
    ${getMenuHeaderHtml()}
    ${await getCityListHtml()}
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

async function getCityListHtml() {
  const favoriteCities = getFavoriteCities();

  if (!favoriteCities || favoriteCities.length < 1) {
    return "No favorites yet stored!";
  }

  const favoriteCitiesElements = [];

  for (let city of favoriteCities) {
    const weatherData = await getForecastWeather(city, 1);
    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1,
    );
    const cityHtml = `
        <div class="city-wrapper">
          <div class="city" 
          style="--condition-image: url(${conditionImage})" 
          data-city-name="${city}">
            <div class="city__left-column">
              <h2 class="city__name">${location.name}</h2>
              <div class="city__country">${location.country}</div>
              <div class="city__condition">${current.condition.text}</div>
            </div>
            <div class="city__right-column">
              <div class="city__temperature">${formatTemperature(current.temp_c)}°</div>
              <div class="city__min-max-temperature">H:${formatTemperature(currentDay.day.maxtemp_c)}° T:
              ${formatTemperature(currentDay.day.mintemp_c)}°</div>
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
