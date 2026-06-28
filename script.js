// --------DOM ELEMENTS------------
const started = document.querySelector(".start");
const inputCity = document.querySelector("#inputfield");
const search = document.querySelector("#searchIcon");
const description = document.querySelector("#desc");
const temperature = document.querySelector("#temp");
const cityName = document.querySelector("#city");
const wind = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidityper");
const home = document.querySelector(".homeBtn");
const weatherIcons = document.querySelector("#icon");
const startPage = document.querySelector(".startBox");
const MiddlePage = document.querySelector(".descBox");
const LastPage = document.querySelector(".errorBox");

// Events
started.addEventListener("click", () => {
  startPage.classList.add("inactive");
  MiddlePage.classList.remove("inactive");
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
});

home.addEventListener("click", () => {
  LastPage.classList.add("inactive");
  startPage.classList.remove("inactive");
  inputCity.value = "";
});

search.addEventListener("click", () => {
  if (inputCity.value.trim() === "") {
    alert("Please Enter the City name!!..");
    inputCity.value = "";
    return;
  }
  getWeatherData(inputCity.value);
});

inputCity.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (inputCity.value.trim() === "") {
      alert("Please Enter the City name!!..");
      inputCity.value = "";
      return;
    }
    getWeatherData(inputCity.value);
  }
});

// Changes Icon Function

function changeIcon(weatherMain) {
  const icons = {
    Clear: "./images/clear.png",
    Clouds: "./images/clouds.png",
    Drizzle: "./images/drizzle.png",
    Haze: "./images/haze.png",
    Mist: "./images/mist.png",
    Rain: "./images/rain.png",
    Snow: "./images/snow.png",
  };
  weatherIcons.src = icons[weatherMain] || "./images/clear.png";
}
// Api Calling
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "1511feebb89e40ecb8049ce952353c0b";

async function getWeatherData(city) {
  let weatherData;
  try {
    const finalUrl = `${BASE_URL}q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(finalUrl);
    weatherData = await response.json();
    console.log(weatherData);
  } catch (error) {
    alert("Network Error!...");
    return;
  }

  // 404 Error
  if (weatherData.cod === "404" || weatherData.cod === 404) {
    MiddlePage.classList.add("inactive");
    LastPage.classList.remove("inactive");
    successCallback(position);
    return;
  }

  // changes element
  MiddlePage.classList.remove("inactive");
  LastPage.classList.add("inactive");
  description.textContent = weatherData.weather[0].description;
  temperature.textContent = Math.round(weatherData.main.temp) + "°c";
  cityName.textContent = weatherData.name;
  wind.textContent = Math.round(weatherData.wind.speed * 3.6) + " km/h";
  humidity.textContent = weatherData.main.humidity + " %";

  changeIcon(weatherData.weather[0].main);
}

// Get User location
const url = "https://api.openweathermap.org/data/2.5/weather?";
async function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const final_url = `${url}lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  const response = await fetch(final_url);
  const UserLocation = await response.json();
  console.log(UserLocation);

  //Change Elements According to User Location
  description.textContent = UserLocation.weather[0].description;
  temperature.textContent = Math.round(UserLocation.main.temp - 273.15) + "°c";
  cityName.textContent = UserLocation.name;
  wind.textContent = Math.round(UserLocation.wind.speed * 3.6) + " km/h";
  humidity.textContent = UserLocation.main.humidity + " %";
}
function errorCallback(error) {
  alert("User location denied!!");
  return;
}
