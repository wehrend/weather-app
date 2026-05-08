import { rootElement } from "./main";
import {
  getFavoriteCities,
  getForecastWeather,
  saveCityAsFavorite,
} from "./api";
import {
  formatHourlyTime,
  formatTemperature,
  get24HoursForecastFromNow,
  getDayOfWeek,
  formatToMilitaryTime,
} from "./utils";
import { renderLoadingScreen } from "./loading";
import { getConditionImagePath } from "./conditions";
import { loadMainMenu } from "./mainMenu";

export async function loadDetailView(cityName, cityId) {
  renderLoadingScreen("Lade Wetter für " + cityName + " ...");
  const weatherData = await getForecastWeather(cityId);
  renderDetailView(weatherData, cityId);
  registerEventListeners(cityId);
}

function renderDetailView(weatherData, cityId) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];

  const conditionImage = getConditionImagePath(
    current.condition.code,
    current.is_day !== 1,
  );
  if (conditionImage) {
    rootElement.style = `--detail-condition-image: url(${conditionImage})`;
    rootElement.classList.add("show-background");
  }

  const isFavorite = getFavoriteCities().find((city) => city === cityId);

  rootElement.innerHTML =
    getActionBarHtml(!isFavorite) +
    getHeaderHtml(
      location.name,
      formatTemperature(current.temp_c),
      current.condition.text,
      formatTemperature(currentDay.day.maxtemp_c),
      formatTemperature(currentDay.day.mintemp_c),
    ) +
    getTodayForecastHtml(
      currentDay.day.condition.text,
      currentDay.day.maxwind_kph,
      forecast.forecastday,
      current.last_updated_epoch,
    ) +
    get3daysForecastHtml(forecast.forecastday) +
    getStatsHtml(
      current.humidity,
      current.feelslike_c,
      currentDay.astro.sunrise,
      currentDay.astro.sunset,
      current.precip_mm,
      current.uv,
    );
}

function getActionBarHtml(showFavoritesButton = true) {
  const backIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>`;

  const favoriteIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>`;

  return `
    <div class="action-bar">
      <div class="action-bar__back">${backIcon}</div>
      ${showFavoritesButton ? `<div class="action-bar__favorite">${favoriteIcon}</div>` : ""}
    </div>

`;
}

function getHeaderHtml(location, currentTemp, condtion, maxTemp, minTemp) {
  console.log("location: " + location + " temperature " + currentTemp);
  return `
    <div class="detail-view">
        <h2 class="detail-view__location">${location}</h2>
        <h1 class="detail-view__temperature_c">${currentTemp}°C</h1>
        <p class="detail-view__condition">${condtion}</p>
        <div class="detail-view__day_temperatures">
          <span class="detail-view__highest">H:${maxTemp}°</span>
        <span class="detail-view__lowest">T:${minTemp}°</span>
        </div>
    </div>`;
}

function getTodayForecastHtml(
  condition,
  maxWind,
  forecastDays,
  lastUpdatedEpoch,
) {
  const hourlyForecastElements = get24HoursForecastFromNow(
    forecastDays,
    lastUpdatedEpoch,
  )
    .filter((el) => el !== undefined)
    .map(
      (hour, index) => `
            <div class="detail-view__caroussel__hourly">
              <div class="detail-view__hour">${index === 0 ? "Jetzt" : formatHourlyTime(hour.time) + "Uhr"}</div>
              <img
                src="https:${hour.condition.icon}"
                class="detail-view__icon"
              />
              <div class="detail-view__forecasted_temperature">${formatTemperature(hour.temp_c)}°C</div>
            </div>
  `,
    );

  const hourlyForecstHtml = hourlyForecastElements.join("");
  return `
          <div class="detail-view__card">
          <p class="detail-view__forecastedCondition">${condition}. Wind bis zu ${maxWind} km/h.</p>
          <div class="detail-view__caroussel">
          ${hourlyForecstHtml}
          </div
      </div>
  `;
}

function get3daysForecastHtml(forecast) {
  const forecastElements = forecast.map(
    (forecastDay, index) => ` 
        <div class="detail-view__3daysForecast">
          <div class="detail-view__3daysForecast__p">${index === 0 ? "Heute" : getDayOfWeek(forecastDay.date)}</div>
          <img
            src="https:${forecastDay.day.condition.icon}"
            class="detail-view__3daysForecast__icon"
          />
          <div class="detail-view__3daysForecast__highest">H:${formatTemperature(forecastDay.day.maxtemp_c)}°C</div>
          <div class="detail-view__3daysForecast__lowest">T:${formatTemperature(forecastDay.day.mintemp_c)}°C</div>
          <div class="detail-view__3daysForecast__wind">Wind:${forecastDay.day.maxwind_kph}km/h</div>
        </div>
  `,
  );

  const forecastHtml = forecastElements.join("");

  return `
        <div class="detail-view__card">
          <p class="detail-view__3daysForecast__title">
            Vorhersage für die nächsten 3 Tage:
          </p>
            <div class="detail-view__3daysForecasts">
            ${forecastHtml}
        </div>
`;
}

function getStatsHtml(humidity, feelsLike, sunrise, sunset, precip, uvIndex) {
  return `<div class="mini-stats">
       <div class="mini-stat">
          <div class="mini-stat__title">Feuchtigkeit</div>
          <div class="mini-stat__value">${humidity}%</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stats__title">Gefühlt</div>
          <div class="mini-stats__value">${feelsLike}</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stats__title">Sonnenaufgang</div>
          <div class="mini-stats__value">${formatToMilitaryTime(sunrise)}</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stats__title">Sonnenuntergang</div>
          <div class="mini-stats__value">${formatToMilitaryTime(sunset)}</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stats__title">Niederschlag</div>
          <div class="mini-stats__value">${precip}mm</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stats__title">UV-Index</div>
          <div class="mini-stats__value">${uvIndex}</div>
        </div>
    
      </div>
  
  `;
}

function registerEventListeners(cityId) {
  const backButton = document.querySelector(".action-bar__back");

  backButton.addEventListener("click", () => {
    loadMainMenu();
  });

  const favoriteButton = document.querySelector(".action-bar__favorite");

  favoriteButton?.addEventListener("click", () => {
    saveCityAsFavorite(cityId);
    favoriteButton.remove();
  });
}
