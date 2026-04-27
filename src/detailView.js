import { rootElement } from "./main";
import { getForecastWeather } from "./api";

export async function loadDetailView() {
  //loading screen
  //test
  const weatherData = await getForecastWeather("Berlin");
  renderDetailView(weatherData);
  // add event listener
}

function renderDetailView(weatherData) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];
  rootElement.innerHTML = getHeaderHtml(
    location.name,
    current.temp_c,
    current.condition.text,
    currentDay.day.maxTemp,
    currentDay.day.minTemp,
  );
}

function getHeaderHtml(location, currentTemp, condtion, maxTemp, minTemp) {
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
