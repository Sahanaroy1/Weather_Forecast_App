const WEATHER_COORDINATES_URL =
  "https://api.openweathermap.org/geo/1.0/direct?q=";
const WEATHER_URL_ADDTIONAL_DATA = "&limit=5&appid=";
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const MAX_DAILY_FORECAST = 5;
const FORECAST_COORDINATES_URL =
  "https://api.openweathermap.org/data/2.5/forecast?lat=";
const IMAGE_URL = "https://openweathermap.org/img/wn/";

var locationEl = document.getElementById("location");
var searchEl = document.getElementById("search");
var recentLocationsEl = document.getElementById("recentLocations");
var tempValueEl = document.getElementById("temp-value");

window.onload = loadPreviouslySearchedCities();

document.getElementById("weather").style.display = "none";
document.getElementById("forecast").style.display = "none";

//To make the API call on the given location and handle display elements.
function weatherSearchByCityName() {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var locationName = locationEl.value;
  if (locationName) {
    fetchCoordinatesByCityName(locationName);
  } else {
    document.getElementById("weather").style.display = "none";
    document.getElementById("forecast").style.display = "none";
    alert("Please enter a city Name");
  }
}

//To find out co-ordinates of city for user entered city.
function fetchCoordinatesByCityName(locationName) {
  var coordinatelookUpUrl =
    WEATHER_COORDINATES_URL +
    locationName +
    WEATHER_URL_ADDTIONAL_DATA +
    WEATHER_API_KEY;

  fetch(coordinatelookUpUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latitude = data[0].lat;
      var longitude = data[0].lon;

      retriveWeatherDetailsByCoordinates(latitude, longitude);
    });
}

//To get the weather details based on the co-ordinates.
function retriveWeatherDetailsByCoordinates(latitude, longitude) {
  var lookUpWeather =
    FORECAST_COORDINATES_URL +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&exclude=hourly,daily&lang=en&appid=" +
    WEATHER_API_KEY;

  fetch(lookUpWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var jsonData = creatingDataObject(data);

      localStorage.setItem(data.city.name, JSON.stringify(jsonData));

      display(jsonData);
      loadPreviouslySearchedCities();
    });
}

//API response is converted into an object
function creatingDataObject(data) {
  var today = dayjs();

  var weather = {
    city: data.city.name,
    date: today.format("DD-MM-YYYY"),
    temperature: data.list[0].main.temp,
    wind: data.list[0].wind.speed,
    humidity: data.list[0].main.humidity,
    image: IMAGE_URL + data.list[0].weather[0].icon + ".png",

    forecast: [],
  };
  //for looped is hoped by 8 as the data is provided on 3 hourly basis
  for (var i = 0; i < data.list.length; i = i + 8) {
    var weatherForecast = {
      date: dayjs(data.list[i].dt_txt).format("DD-MM-YYYY"),
      temperature: data.list[i].main.temp,
      wind: data.list[i].wind.speed,
      humidity: data.list[i].main.humidity,
      image: IMAGE_URL + data.list[i].weather[0].icon + ".png",
    };
    weather.forecast.push(weatherForecast);
  }
  return weather;
}

//HTML elements are dynamically created and managed
function display(data) {
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

//To show the previouly searched cities in li element.
function loadPreviouslySearchedCities() {
  document.getElementById("recentLocations").innerHTML = " ";
  var cityListLength = 10;

  if (localStorage.length < 10) {
    cityListLength = localStorage.length;
  }

  for (var i = 0; i < cityListLength; i++) {
    const li = document.createElement("button");
    var cityName = localStorage.key(i);

    li.innerHTML = cityName;
    document.getElementById("recentLocations").appendChild(li);
  }
}

//To show the weather details of any listed city.
function weatherDetailsByCities(e) {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var citySelected = e.target.textContent;

  var data = JSON.parse(localStorage.getItem(citySelected)) || [];

  display(data);
}

searchEl.addEventListener("click", weatherSearchByCityName);
recentLocationsEl.addEventListener("click", weatherDetailsByCities);
