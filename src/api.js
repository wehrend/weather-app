const API_ENDPOINT = "http://api.weatherapi.com/v1";
const key = "95ec4ad84ef6491bb3b165529262504";
const requestOptions = {
  method: "GET",
  redirect: "follow",
};
export async function getForecastWeather(wheaterLocation, days = 3) {
  let requestString = `${API_ENDPOINT}/forecast.json?key=${key}&q=${wheaterLocation}&lang=de&days=${days}`;
  console.log(requestString);
  const response = await fetch(requestString, requestOptions);
  const data = await response.json();
  return data;
}
