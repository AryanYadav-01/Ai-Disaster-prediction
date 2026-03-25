// 🌍 CREATE MAP
let map = L.map('mapBox').setView([20, 78], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap"
}).addTo(map);

let marker;

// 🔑 YOUR WEATHER API
const API_KEY = "35ae5433618cfe3d8086df69ce5cf66c";


// 📍 SET LOCATION MARKER
function setMarker(lat, lon){

  if(marker){
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lon]).addTo(map);

  map.setView([lat, lon], 8);

  predictWeather(lat, lon);

}


// 📍 AUTO LOCATION
function autoLocate(){

  if(!navigator.geolocation){
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos)=>{

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    setMarker(lat, lon);

  });

}


// 🔎 SEARCH CITY
async function searchCity(){

  const city = document.getElementById("cityInput").value;

  if(!city){
    alert("Enter city name");
    return;
  }

  const res = await fetch(
  `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );

  const data = await res.json();

  if(data.length === 0){
    alert("City not found");
    return;
  }

  const lat = data[0].lat;
  const lon = data[0].lon;

  setMarker(lat, lon);

}


// 🌦 WEATHER + AI PREDICTION
async function predictWeather(lat, lon){

  const res = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  const weatherData = await res.json();

  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;

  const rainfall = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;

  const wind = weatherData.wind.speed * 3.6;

  // 🌪 STORM AI
  let stormRisk = "LOW";

  if(wind > 100){
    stormRisk = "SEVERE STORM ⚠";
  }
  else if(wind > 70){
    stormRisk = "STORM RISK";
  }

  // 🌊 FLOOD AI
  let floodRisk = rainfall * 2 + humidity * 0.5;

  let floodLevel = "LOW";

  if(floodRisk > 80){
    floodLevel = "HIGH ⚠";
  }
  else if(floodRisk > 40){
    floodLevel = "MODERATE";
  }

  // SHOW RESULTS
  document.getElementById("temp").innerText =
  `🌡 Temperature: ${temperature}°C`;

  document.getElementById("humidity").innerText =
  `💧 Humidity: ${humidity}%`;

  document.getElementById("rain").innerText =
  `🌧 Rainfall: ${rainfall} mm`;

  document.getElementById("river").innerText =
  `💨 Wind Speed: ${wind.toFixed(1)} km/h`;

  document.getElementById("risk").innerText =
  `🌊 Flood Risk: ${floodLevel}`;

  document.getElementById("prediction").innerText =
  `🌪 Storm Prediction: ${stormRisk}`;

}


// 🌍 EARTHQUAKE DATA
async function loadEarthquakes(){

  const res = await fetch(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  );

  const data = await res.json();

  data.features.forEach(eq => {

    const lat = eq.geometry.coordinates[1];
    const lon = eq.geometry.coordinates[0];

    const mag = eq.properties.mag;
    const place = eq.properties.place;

    L.circle([lat, lon], {
      color: "red",
      radius: mag * 20000
    })
    .addTo(map)
    .bindPopup(
    `🌍 Earthquake<br>Location: ${place}<br>Magnitude: ${mag}`
    );

  });

}


// 🚀 RUN WHEN PAGE LOADS
window.onload = function(){

  autoLocate();

  loadEarthquakes();

};