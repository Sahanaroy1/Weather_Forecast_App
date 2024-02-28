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

window.onload = onLoadOfCity();

document.getElementById("weather").style.display = "none";
document.getElementById("forecast").style.display = "none";

//To make the API call on the given location.
function onClickSearch() {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var locationName = locationEl.value;
  if (locationName) {
    lookupLocation(locationName);
  } else {
    document.getElementById("weather").style.display = "none";
    document.getElementById("forecast").style.display = "none";
    alert("Please enter a city Name");
  }
}

//To find out co-ordinates for user entered city.
function lookupLocation(locationName) {
  var coordinatelookUpUrl =
    WEATHER_COORDINATES_URL +
    locationName +
    WEATHER_URL_ADDTIONAL_DATA +
    WEATHER_API_KEY;
  console.log("lookuplocation");
  retriveWeatherDetailsByCoordinates(coordinatelookUpUrl, locationName);
}

//To get the weather details based on the co-ordinates.
function retriveWeatherDetailsByCoordinates(coordinatelookUpUrl, locationName) {
  fetch(coordinatelookUpUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var latitutde = data[0].lat;
      var longitude = data[0].lon;

      var lookUpWeather =
        FORECAST_COORDINATES_URL +
        latitutde +
        "&lon=" +
        longitude +
        "&units=imperial&exclude=hourly,daily&appid=" +
        WEATHER_API_KEY;
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
        });
    });
}

//Object is made to create the HTML element dynamically.
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

//To display the received data with the help of API.
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

//To show the cities already searched in a div element.
function onLoadOfCity() {
  document.getElementById("recentLocations").innerHTML = " ";

  for (var i = 0; i < localStorage.length; i++) {
    const li = document.createElement("button");
    var cityName = localStorage.key(i);

    li.innerHTML = cityName;
    document.getElementById("recentLocations").appendChild(li);
  }
}

//To show the details of any listed city details.
function cityDetails(e) {
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  var citySelected = e.target.textContent;

  var data = localStorage.getItem(citySelected);

  display(JSON.parse(data));
}

searchEl.addEventListener("click", onClickSearch);
recentLocationsEl.addEventListener("click", cityDetails);
