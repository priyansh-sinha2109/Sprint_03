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

// Background layer elements
const bgLayers = {
  Clear: document.getElementById("bgClear"),
  Rain: document.getElementById("bgRain"),
  Drizzle: document.getElementById("bgRain"), // reuse rain layer
  Clouds: document.getElementById("bgClouds"),
  Snow: document.getElementById("bgSnow"),
  Haze: document.getElementById("bgHaze"),
  Mist: document.getElementById("bgHaze"), // reuse haze layer
  Fog: document.getElementById("bgHaze"),
  Smoke: document.getElementById("bgHaze"),
  Dust: document.getElementById("bgHaze"),
  Sand: document.getElementById("bgHaze"),
  Ash: document.getElementById("bgHaze"),
  Squall: document.getElementById("bgRain"),
  Tornado: document.getElementById("bgThunder"),
  Thunderstorm: document.getElementById("bgThunder"),
  default: document.getElementById("bgDefault"),
};

// All unique layer elements (for deactivating)
const allUniqueLayers = [
  document.getElementById("bgClear"),
  document.getElementById("bgRain"),
  document.getElementById("bgClouds"),
  document.getElementById("bgSnow"),
  document.getElementById("bgHaze"),
  document.getElementById("bgThunder"),
  document.getElementById("bgDefault"),
];

// Card theme class mapping
const themeMap = {
  Clear: "theme-clear",
  Rain: "theme-rain",
  Drizzle: "theme-rain",
  Clouds: "theme-clouds",
  Snow: "theme-snow",
  Haze: "theme-haze",
  Mist: "theme-haze",
  Fog: "theme-haze",
  Thunderstorm: "theme-thunder",
  Tornado: "theme-thunder",
};

// ========== PARTICLE CANVAS ==========
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];
let particleMode = "none"; // "rain" | "snow" | "none"

function spawnParticles(mode) {
  particleMode = mode;
  particles = [];

  if (mode === "rain") {
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: Math.random() * 20 + 10,
        speed: Math.random() * 8 + 10,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
  } else if (mode === "snow") {
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        drift: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particleMode === "rain") {
    particles.forEach((p) => {
      ctx.save();
      ctx.strokeStyle = `rgba(160, 200, 255, ${p.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len * 0.2, p.y + p.len);
      ctx.stroke();
      ctx.restore();

      p.y += p.speed;
      p.x -= p.speed * 0.2;
      if (p.y > canvas.height) {
        p.y = -p.len;
        p.x = Math.random() * canvas.width;
      }
    });
  } else if (particleMode === "snow") {
    particles.forEach((p) => {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.speed;
      p.x += p.drift;
      if (p.y > canvas.height) {
        p.y = -p.r;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();

// ========== SWITCH BACKGROUND ==========
function switchBackground(weatherMain) {
  // Deactivate all layers
  allUniqueLayers.forEach((el) => el.classList.remove("active"));

  // Activate the right layer
  const target = bgLayers[weatherMain] || bgLayers["default"];
  target.classList.add("active");

  // Apply card theme
  const allThemes = [
    "theme-clear",
    "theme-rain",
    "theme-clouds",
    "theme-snow",
    "theme-haze",
    "theme-thunder",
  ];
  allThemes.forEach((t) => {
    MiddlePage.classList.remove(t);
    startPage.classList.remove(t);
  });
  const theme = themeMap[weatherMain];
  if (theme) MiddlePage.classList.add(theme);

  // Particles
  if (
    weatherMain === "Rain" ||
    weatherMain === "Drizzle" ||
    weatherMain === "Thunderstorm" ||
    weatherMain === "Squall"
  ) {
    spawnParticles("rain");
  } else if (weatherMain === "Snow") {
    spawnParticles("snow");
  } else {
    spawnParticles("none");
  }
}

// ========== ICON MAP ==========
function changeIcon(weatherMain) {
  const icons = {
    Clear: "./images/clear.png",
    Clouds: "./images/clouds.png",
    Drizzle: "./images/drizzle.png",
    Haze: "./images/haze.png",
    Mist: "./images/mist.png",
    Fog: "./images/mist.png",
    Rain: "./images/rain.png",
    Snow: "./images/snow.png",
    Thunderstorm: "./images/rain.png",
  };
  weatherIcons.src = icons[weatherMain] || "./images/clear.png";
}

// ========== DISPLAY WEATHER DATA ==========
function displayWeather(data) {
  const weatherMain = data.weather[0].main;

  // Fix: round temp to 1 decimal, no more ugly decimals
  const tempC = Math.round(data.main.temp * 10) / 10;

  // Fix: m/s → km/h, rounded to 1 decimal
  const windKmh = Math.round(data.wind.speed * 3.6 * 10) / 10;

  // Humidity is already a whole number %
  const hum = data.main.humidity;

  description.textContent = data.weather[0].description;
  temperature.textContent = tempC + "°C";
  cityName.textContent = data.name;
  wind.textContent = windKmh + " km/h";
  humidity.textContent = hum + "%";

  changeIcon(weatherMain);
  switchBackground(weatherMain);
}

// ========== API ==========
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "1511feebb89e40ecb8049ce952353c0b";

async function getWeatherData(city) {
  let weatherData;
  try {
    const finalUrl = `${BASE_URL}q=${city}&appid=${apiKey}&units=metric`;
    const savedData = localStorage.getItem(city);

    if (savedData == null) {
      const response = await fetch(finalUrl);
      weatherData = await response.json();
    } else {
      const cache = JSON.parse(savedData);
      const currentTime = Date.now();
      const age = currentTime - cache.timestamp;
      if (age < 600000) {
        weatherData = cache.data;
      } else {
        const response = await fetch(finalUrl);
        weatherData = await response.json();
      }
    }
    console.log(weatherData);
  } catch (error) {
    alert("Network Error!...");
    return;
  }

  // 404 Error
  if (weatherData.cod === "404" || weatherData.cod === 404) {
    MiddlePage.classList.add("inactive");
    LastPage.classList.remove("inactive");
    return;
  }

  // Show weather
  MiddlePage.classList.remove("inactive");
  LastPage.classList.add("inactive");
  displayWeather(weatherData);

  // Cache it
  const cache = { data: weatherData, timestamp: Date.now() };
  localStorage.setItem(city, JSON.stringify(cache));
}

// ========== GEOLOCATION ==========
const geoUrl = "https://api.openweathermap.org/data/2.5/weather?";

async function successCallback(position) {
  let UserLocation;
  try {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const finalUrl = `${geoUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(finalUrl);
    UserLocation = await response.json();
    console.log(UserLocation);
  } catch (error) {
    alert("Error finding User Location!!");
    return;
  }
  displayWeather(UserLocation);
}

function errorCallback(error) {
  alert("User location denied!!");
}

// ========== EVENTS ==========
started.addEventListener("click", () => {
  startPage.classList.add("inactive");
  MiddlePage.classList.remove("inactive");
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
});

home.addEventListener("click", () => {
  LastPage.classList.add("inactive");
  startPage.classList.remove("inactive");
  inputCity.value = "";
  // Reset background
  allUniqueLayers.forEach((el) => el.classList.remove("active"));
  document.getElementById("bgDefault").classList.add("active");
  spawnParticles("none");
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
