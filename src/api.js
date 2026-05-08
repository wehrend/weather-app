const FAVORITE_CITIES_KEY = "favorite-cities";

export async function getForecastWeather(wheaterLocation, days = 3) {
  const API_ENDPOINT = "https://api.weatherapi.com/v1";
  const key = "95ec4ad84ef6491bb3b165529262504";
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  let requestString = `${API_ENDPOINT}/forecast.json?key=${key}&q=${wheaterLocation}&lang=de&days=${days}`;
  console.log(requestString);
  const response = await fetch(requestString, requestOptions);
  const data = await response.json();
  return data;
}

export function getFavoriteCities() {
  return JSON.parse(localStorage.getItem(FAVORITE_CITIES_KEY)) || [];
}

export function saveCityAsFavorite(city) {
  const favorites = getFavoriteCities();

  if (favorites.find((favorite) => favorite === city)) {
    alert(city + " is already added to the favorites!");
    return;
  }

  favorites.push(city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
}

export function removeCityFromFavorites(city) {
  const favorites = getFavoriteCities();

  const filteredFavorites = favorites.filter((favorite) => favorite !== city);
  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(filteredFavorites));
}
