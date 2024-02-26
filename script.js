const WEATHER_API_BASE_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1'
const MAX_DAILY_FORECAST = 5;

var locationEl = document.getElementById('location')
var searchEl = document.getElementById('search')
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var tempValueEl = document.getElementById('temp-value')
function onClickSearch(){
   
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
    var latLon = getApi(lookUpUrl);

   console.log(latLon);
    
}

function getApi(lookUpUrl) {

    fetch(lookUpUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
   
    var latitutde = data[0].lat;
    var longitude = data[0].lon;
   

    var lookUpWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitutde + '&lon=' + longitude + '&appid=f23ee9deb4e1a7450f3157c44ed020e1'
    console.log(lookUpWeather);

    fetch(lookUpWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data.list[0].weather[0].description);
    });
  });
  }



searchEl.addEventListener('click',onClickSearch);