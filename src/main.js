import { getCurrentWeather } from "./api";

const detailViewCity = document.querySelector(".detail-view__city");

const detailViewTemp = document.querySelector(".detail-view__temperature_c");

const detailViewCond = document.querySelector(".detail-view__condition");

const detailViewHigh = document.querySelector(".detail-view__highest");
const detailViewLow = document.querySelector(".detail-view__lowest");

console.log("Hallo");
let data = await getCurrentWeather("Berlin");
console.log(data);
console.log("location object: " + data["location"]);
detailViewCity.innerHTML = data["location"]["name"];
detailViewTemp.innerHTML = data["current"]["temp_c"];
detailViewCond.innerHTML = data["current"]["condition"]["text"];
