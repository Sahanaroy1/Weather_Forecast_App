const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1'
const MAX_DAILY_FORECAST = 5;

var locationEl = document.getElementById('location')
var searchEl = document.getElementById('search')
var recentLocationsEl = document.getElementById('recentLocations')
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var tempValueEl = document.getElementById('temp-value')



window.onload = onLoadOfCity();

document.getElementById("weather").style.display = "none";
document.getElementById("forecast").style.display = "none";

function onClickSearch(){
  document.getElementById("weather").style.display = "block";
  document.getElementById("forecast").style.display = "block";

  
//console.log(today.format(" D MMMM, YYYY,"));

  
    console.log('search button clicked');

    var locationName = locationEl.value;
    if(locationName){
        lookupLocation(locationName);
    }else{
        console.log('no location name');
    }
}

function lookupLocation(locationName){
    var lookUpUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=5&appid=f23ee9deb4e1a7450f3157c44ed020e1'
    console.log('lookuplocation');
    var latLon = getApi(lookUpUrl, locationName);

   console.log(latLon);
    
}

function getApi(lookUpUrl, locationName) {

    fetch(lookUpUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
   
    var latitutde = data[0].lat;
    var longitude = data[0].lon;
   

    var lookUpWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitutde + '&lon=' + longitude + '&units=imperial&exclude=hourly,daily&appid=f23ee9deb4e1a7450f3157c44ed020e1'
    console.log(lookUpWeather);

    fetch(lookUpWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);

        display(data);   
        localStorage.setItem(data.city.name, data);
      
      return data;  
    });
  }) 
  }
  
  function display(data){

    var today = dayjs();
    
        //document.getElementById("location-name").textContent = `${data.city}`;
        document.getElementById("location-name").textContent = 
        `${data.city.name} (${today.format("DD-MM-YYYY")})`;
       
        //document.getElementById("weatherImg").textContent = `${data.list[0].weather[0].icon}`
        document.getElementById("temp-value").textContent = `${data.list[0].main.temp}  \u00B0F`;
        document.getElementById("wind-value").textContent = `${data.list[0].wind.speed} MPH`;
        document.getElementById("humidity-value").textContent = `${data.list[0].main.humidity} %`;

      for(var i = 0; i < 40; i++){
        i = i + 6;
        console.log('dailyForecast');
        const dailyForecast = data[i];
        

        const listItem = document.createElement('li');
        listItem.classList.add('forecastItem');

        
       
        listItem.innerHTML = `
        <div class="forecast-date">  ${data.list[i].dt_txt}  </div>
        <div class="forecast-temp">Temp - ${data.list[i].main.temp} &#8457 </div>
        <div class="forecast-wind">Wind - ${data.list[i].wind.speed} MPH</div>
        <div class="forecast-humidity">Humidity - ${data.list[i].main.humidity} %</div>`;
        

        document.getElementById("forecastItem").appendChild(listItem);
        
      } 
  }

  function onLoadOfCity(){

    for (var i = 0; i < localStorage.length; i++) {
      const li = document.createElement("button");
      var cityName = localStorage.key(i);
     // var details = localStorage.getItem(localStorage.key(i));
      li.innerHTML = cityName;
      document.getElementById("recentLocations").appendChild(li);
    }
  }

  function cityDetails(e){
    var citySelected = e.target.textContent;
    console.log(citySelected);

    //localStorage.get(citySelected);
    console.log(localStorage.getItem(citySelected));

    

    display(localStorage.getItem(citySelected));
  }

searchEl.addEventListener('click',onClickSearch);
recentLocationsEl.addEventListener("click", cityDetails);