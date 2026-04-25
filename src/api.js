const API_ENDPOINT = "http://api.weatherapi.com/v1";
const key = "95ec4ad84ef6491bb3b165529262504";
const requestOptions = {
  method: "GET",
  redirect: "follow",
};
export async function getCurrentWeather(wheaterLocation) {
  let requestString = `${API_ENDPOINT}/current.json?key=${key}&q=${wheaterLocation}&lang=de`;
  console.log(requestString);
  const response = await fetch(requestString, requestOptions);
  const data = await response.json();
  return data;
}
