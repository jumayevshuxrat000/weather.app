const BASE_URL = "https://api.weatherapi.com/v1/forecast.json?key=56b5e13e2b72469bbc6145510242512";

async function fetchWeather(city = "Toshkent") {
    try {
        const response = await fetch(`${BASE_URL}&q=${city}&days=7&aqi=yes&alerts=yes`);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        updateMainHeader(data); 
        updateUI(data); 
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".main").innerHTML = "<p>Error fetching data. Please try again.</p>";
    }
}

function updateMainHeader(data) {
    const locationContent = document.querySelector(".content__location");
    const headerTemp = document.querySelector(".header h1:last-child"); 
    const rainChance = document.querySelector(".header p");

    locationContent.textContent = data.location.name;
    headerTemp.innerHTML = `${data.current.temp_c}&deg;`; 
    rainChance.textContent = `Chance of rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
}

function updateUI(data) {
    const forecastContainer = document.querySelector(".forecast");
    const conditionsContainer = document.querySelector(".conditions");
    const weekForecastContainer = document.querySelector(".week-forecast");

    forecastContainer.innerHTML = data.forecast.forecastday[0].hour
        .map((hour) => `
            <div class="hour">
                <p>${hour.time.split(" ")[1]}</p>
                <img src="${hour.condition.icon}" alt="${hour.condition.text}" width="50">
                <span>${hour.temp_c}&deg;C</span>
            </div>
        `)
        .join("");

    conditionsContainer.innerHTML = `
        <div>
            <p>Real Feel</p>
            <h2>${data.current.feelslike_c}&deg;C</h2>
        </div>
        <div>
            <p>Wind</p>
            <h2>${data.current.wind_kph} km/h</h2>
        </div>
        <div>
            <p>UV Index</p>
            <h2>${data.current.uv}</h2>
        </div>
    `;

    weekForecastContainer.innerHTML = data.forecast.forecastday
        .map((day) => `
            <div class="day">
                <span>${new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span>${day.day.condition.text} <strong>${day.day.maxtemp_c}/${day.day.mintemp_c}</strong></span>
            </div>
        `)
        .join("");
}

window.onload = () => {
    fetchWeather(); 
};
