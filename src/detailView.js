import { rootElement } from "./main";
import { getForecastWeather } from "./api";
import {
  formatHourlyTime,
  formatTemperature,
  get24HoursForecastFromNow,
  getDayOfWeek,
} from "./utils";
import { renderLoadingScreen } from "./loading";

export async function loadDetailView(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + " ...");
  const weatherData = await getForecastWeather(cityName);
  renderDetailView(weatherData);
  // add event listener
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];
  rootElement.innerHTML =
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
    get3daysForecastHtml(forecast.forecastday);
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
  ).map(
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
    (forecastDay) => ` 
        <div class="detail-view__3daysForecast">
          <div class="detail-view__3daysForecast__p">${getDayOfWeek(forecastDay.date)}</div>
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
