import { rootElement } from "./main";
import { getForecastWeather } from "./api";
import {
  formatHourlyTime,
  formatTemperature,
  get24HoursForecastFromNow,
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
    get3daysForecastHtml("Mi", "test", "22", "15", "13.6");
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

function get3daysForecastHtml(weekday, icon, min_temp, max_temp, max_wind) {
  return `
        <div class="detail-view__card">
          <p class="detail-view__3daysForecast__title">
            Vorhersage für die nächsten 3 Tage:
          </p>
            <div class="detail-view__3daysForecast">
              <div class="detail-view__3daysForecast__p">${weekday}</div>
              <img
                src="https:${icon}"
                class="detail-view__3daysForecast__icon"
              />
              <div class="detail-view__3daysForecast__highest">H:${max_temp}°C</div>
              <div class="detail-view__3daysForecast__lowest">T:${min_temp}°C</div>
              <div class="detail-view__3daysForecast__wind">Wind:${max_wind}km/h</div>
            </div>
        </div>
`;
}
