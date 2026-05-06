export function formatTemperature(temperature) {
  return Math.floor(temperature);
}

export function formatHourlyTime(time) {
  return time.split(" ")[1].split(":")[0];
}

export function get24HoursForecastFromNow(forecast, lastUpdatedEpoch) {
  console.log(forecast, lastUpdatedEpoch);

  const todaysForecast = forecast[0].hour;
  const tommorowsForecast = forecast[1].hour;

  const newForecast = [];

  const firstFutureTimeIndex = todaysForecast.findIndex(
    (hour) => hour.time_epoch > lastUpdatedEpoch,
  );

  console.log(firstFutureTimeIndex);

  for (let i = firstFutureTimeIndex - 1; i < todaysForecast.length; i++) {
    newForecast.push(todaysForecast[i]);
  }

  let tommorowIndex = 0;

  while (newForecast.length < 24) {
    newForecast.push(tommorowsForecast[tommorowIndex]);
    tommorowIndex++;
  }

  return newForecast;
}

export function getDayOfWeek(date) {
  const dateObj = new Date(date);

  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return days[dateObj.getDay()];
}
