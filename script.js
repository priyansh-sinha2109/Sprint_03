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
const icons = document.querySelector("#icon");
let startPage = document.querySelector(".startBox");
let MiddlePage = document.querySelector(".descBox");
let LastPage = document.querySelector(".errorBox");

// Events
started.addEventListener("click", () => {
  startPage.classList.add("inactive");
  MiddlePage.classList.remove("inactive");
});

home.addEventListener("click", () => {
  LastPage.classList.add("inactive");
  startPage.classList.remove("inactive");
});

search.addEventListener("click", () => {
  getWeatherData(inputCity.value);
});

inputCity.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    getWeatherData(inputCity.value);
  }
});

// Changes Icon Function

function changeIcon(weatherMain) {
  let iconss = {
    Clear: "./images/clear.png",
    Clouds: "./images/clouds.png",
    Drizzle: "./images/drizzle.png",
    Haze: "./images/haze.png",
    Humidity: "./images/humididty.png",
    Mist: "./images/mist.png",
    Rain: "./images/rain.png",
    Search: "./images/search.png",
    Snow: "./images/snow.png",
    Wind: "./images/wind.png",
  };
  icons.src = iconss[weatherMain] || "./images/clear.png";
}
// Api Calling
const url = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "1511feebb89e40ecb8049ce952353c0b";

async function getWeatherData(city) {
  let finalUrl = `${url}q=${city}&appid=${apiKey}&units=metric`;
  let weatherData = await fetch(finalUrl).then((res) => res.json());
  console.log(weatherData);

  // 404 Error
  if (weatherData.cod == 404) {
    MiddlePage.classList.add("inactive");
    LastPage.classList.remove("inactive");
    return;
  }

  // changes element
  description.innerHTML = weatherData.weather[0].description;
  temperature.innerHTML = Math.round(weatherData.main.temp) + "°c";
  cityName.innerHTML = weatherData.name;
  wind.innerHTML = weatherData.wind.speed;
  humidity.innerHTML = weatherData.main.humidity;

  changeIcon(weatherData.weather[0].main);
}
