const WEATHER_API_BASE_URL = "https://api.openweathermap.org";
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const MAX_DAILY_FORECAST = 5;

var locationEl = document.getElementById("location");
var searchEl = document.getElementById("search");
var recentLocationsEl = document.getElementById("recentLocations");
var tempValueEl = document.getElementById("temp-value");

window.onload = onLoadOfCity();

document.getElementById("weather").style.display = "none";
document.getElementById("forecast").style.display = "none";

function onClickSearch() {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var locationName = locationEl.value;
  if (locationName) {
    lookupLocation(locationName);
  } else {
    console.log("no location name");
  }
}

function lookupLocation(locationName) {
  var lookUpUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    locationName +
    "&limit=5&appid=f23ee9deb4e1a7450f3157c44ed020e1";
  console.log("lookuplocation");
  var latLon = retriveWeatherDetailsByCoordinates(lookUpUrl, locationName);

  console.log(latLon);
}

function retriveWeatherDetailsByCoordinates(lookUpUrl, locationName) {
  fetch(lookUpUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latitutde = data[0].lat;
      var longitude = data[0].lon;

      var lookUpWeather =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitutde +
        "&lon=" +
        longitude +
        "&units=imperial&exclude=hourly,daily&appid=f23ee9deb4e1a7450f3157c44ed020e1";
      console.log(lookUpWeather);

      fetch(lookUpWeather)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var jsonData = creatingDataObject(data);

          localStorage.setItem(data.city.name, JSON.stringify(jsonData));

          display(jsonData);
          onLoadOfCity();

          return data;
        });
    });
}

function creatingDataObject(data) {
  var today = dayjs();

  var weather = {
    city: data.city.name,
    date: today.format("DD-MM-YYYY"),
    temperature: data.list[0].main.temp,
    wind: data.list[0].wind.speed,
    humidity: data.list[0].main.humidity,
    image:
      "https://openweathermap.org/img/wn/" +
      data.list[0].weather[0].icon +
      ".png",

    forecast: [],
  };

  for (var i = 0; i < 40; i = i + 8) {
    var weatherForecast = {
      date: dayjs(data.list[i].dt_txt).format("DD-MM-YYYY"),
      temperature: data.list[i].main.temp,
      wind: data.list[i].wind.speed,
      humidity: data.list[i].main.humidity,
      image:
        "https://openweathermap.org/img/wn/" +
        data.list[i].weather[0].icon +
        ".png",
    };
    weather.forecast.push(weatherForecast);
  }
  return weather;
}

function display(data) {
  console.log(data.image);

  document.getElementById(
    "location-name"
  ).textContent = `${data.city} (${data.date})`;
  document.getElementById("imgWeather").src = `${data.image}`;
  document.getElementById(
    "temp-value"
  ).textContent = `${data.temperature}  \u00B0F`;
  document.getElementById("wind-value").textContent = `${data.wind} MPH`;
  document.getElementById("humidity-value").textContent = `${data.humidity} %`;

  document.getElementById("forecastItem").textContent = "";
  for (var i = 0; i < MAX_DAILY_FORECAST; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("forecastItem");

    listItem.innerHTML = `
        <div class="forecast-date">${data.forecast[i].date}</div>
        <div class="forecast-img"><img id="imgForecast" src="${data.forecast[i].image}"</div>
        <div class="forecast-temp">Temp - ${data.forecast[i].temperature} &#8457 </div>
        <div class="forecast-wind">Wind - ${data.forecast[i].wind} MPH</div>
        <div class="forecast-humidity">Humidity - ${data.forecast[i].humidity} %</div>`;

    document.getElementById("forecastItem").appendChild(listItem);
  }
}

function onLoadOfCity() {
  document.getElementById("recentLocations").innerHTML = " ";

  for (var i = 0; i < localStorage.length; i++) {
    const li = document.createElement("button");
    var cityName = localStorage.key(i);

    li.innerHTML = cityName;
    document.getElementById("recentLocations").appendChild(li);
  }
}

function cityDetails(e) {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var citySelected = e.target.textContent;

  var data = localStorage.getItem(citySelected);

  display(JSON.parse(data));
}

searchEl.addEventListener("click", onClickSearch);
recentLocationsEl.addEventListener("click", cityDetails);
