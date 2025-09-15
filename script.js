// Get references to all the HTML elements we will be interacting with.
const cityNameEl = document.querySelector('#city-name');
const temperatureEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const forecastContainerEl = document.querySelector('#forecast-container');

// This function is responsible for taking the weather data object and updating the UI.
function displayCurrentWeather(data) {
    const currentDate = new Date().toLocaleDateString();
    cityNameEl.textContent = `${data.name} (${currentDate})`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}`;
    humidityEl.textContent = `${data.main.humidity}`;
    windSpeedEl.textContent = `${data.wind.speed}`;
}

// This function is responsible for creating and displaying the 5-day forecast cards.
function displayForecast(forecastList) {
    for (let i = 0; i < forecastList.length; i += 8) {
        const dailyForecast = forecastList[i];
        console.log('Daily forecast data:', dailyForecast);
    }
}
const API_KEY = 'API_KEY';
async function fetchWeather(city) {
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const responses = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        for (const response of responses) {
            if (!response.ok) {
                throw new Error('City not found or API error.');
            }
        }

        const [currentWeather, forecast] = await Promise.all(
            responses.map(response => response.json())
        );

        displayCurrentWeather(currentWeather);

        displayForecast(forecast.list);

    } catch (error) {
        console.error('Failed to fetch weather data:',error);
    }
}
fetchWeather('London');