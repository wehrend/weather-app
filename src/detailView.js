import { rootElement } from "./main";
import { getForecastWeather } from "./api";
import { formatTemperature } from "./utils";
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
    ) + getTodayForecastHtml();
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

function getTodayForecastHtml() {
  return `
          <div class="detail-view__card">
          <p class="detail-view__forecastedCondition">Mild sonnig</p>
          <div class="detail-view__caroussel">
            <div class="detail-view__caroussel__hourly">
              <div class="detail-view__hour">jetzt</div>
              <img
                src="https://cdn.weatherapi.com/weather/128x128/day/116.png"
                class="detail-view__icon"
              />
              <div class="detail-view__forecasted_temperature">25°C</div>
            </div>
        </div>
      </div>
  `;
}
