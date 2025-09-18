// Get references to all the HTML elements we will be interacting with.
const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input')
const loaderEl = document.querySelector('#loader');
const errorContainerEl = document.querySelector('#error-container');
const historyContainerEl = document.querySelector('#history-container');

const currentWeatherEl = document.querySelector('#current-weather');
const forecastSectionEl = document.querySelector('#forecast');
const cityNameEl = document.querySelector('#city-name-date');
const weatherDescriptionEl = document.querySelector('#weather-description');
const currentWeatherIconEl = document.querySelector('#current-weather-icon');
const temperatureEl = document.querySelector('#temperature');
const feelsLikeEl = document.querySelector('#feels-like');
const tempMinEl = document.querySelector('#temp-min');
const tempMaxEl = document.querySelector('#temp-max');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const cloudsEl = document.querySelector('#clouds');
const sunriseEl = document.querySelector('#sunrise');
const sunsetEl = document.querySelector('#sunset');

const forecastContainerEl = document.querySelector('#forecast-container');

// Converts a UNIX timestamp to a readable time (e.g., "06:16 AM")
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Capitalizes the first letter of each word in a string (e.g., "moderate rain")
function capitalizeDescription(description) {
    return description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function clearUI() {
    cityNameEl.textContent = '';
    currentWeatherIconEl.style.display = 'none';
    weatherDescriptionEl.textContent = '';
    temperatureEl.textContent = '';
    humidityEl.textContent = '';
    windSpeedEl.textContent = '';
    forecastContainerEl.innerHTML = '';
    errorContainerEl.classList.add('hidden');
    currentWeatherEl.classList.remove('visible');
    forecastSectionEl.classList.remove('visible');
}

function showLoader() {
    loaderEl.classList.remove('hidden');
}

function hideLoader() {
    loaderEl.classList.add('hidden');
}


// This function is responsible for taking the weather data object and updating the UI.
function displayCurrentWeather(data) {
    // Get the icon code from the API response
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Set the icon's src and alt text for accessibility
    currentWeatherIconEl.setAttribute('src', iconUrl);
    currentWeatherIconEl.setAttribute('alt', data.weather[0].description);
    currentWeatherIconEl.style.display = 'block'; // Make the icon visible

    // Main Header Info
    cityNameEl.textContent = `${data.name} (${new Date().toLocaleDateString('en-IN')})`;
    weatherDescriptionEl.textContent = capitalizeDescription(data.weather[0].description);

    // Main Temperature Display
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLikeEl.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    // Details Grid
    tempMinEl.textContent = `${Math.round(data.main.temp_min)}°C`;
    tempMaxEl.textContent = `${Math.round(data.main.temp_max)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${data.wind.speed} m/s`;
    cloudsEl.textContent = `${data.clouds.all}%`;

    // Sun Times
    sunriseEl.textContent = formatTime(data.sys.sunrise);
    sunsetEl.textContent = formatTime(data.sys.sunset);
    currentWeatherEl.classList.add('visible');
}

// This function is responsible for creating and displaying the 5-day forecast cards.
function displayForecast(forecastList) {
    forecastContainerEl.innerHTML = '';
    forecastSectionEl.classList.add('visible');
    let cardIndex = 0;
    for (let i = 0; i < forecastList.length; i += 8) {
        const dailyForecast = forecastList[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');

        //Create the date element (h3).
        const date = new Date(dailyForecast.dt_txt);
        const dateEl = document.createElement('h3');
        dateEl.textContent = date.toLocaleDateString('en-IN');

        //Create the weather icon element (img).
        const iconCode = dailyForecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const iconEl = document.createElement('img');
        iconEl.setAttribute('src', iconUrl);
        iconEl.setAttribute('alt', dailyForecast.weather[0].description);

        //Create the temperature element (p).
        const tempEl = document.createElement('p');
        tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} °C`;

        //Create the humidity element (p).
        const humidityEl = document.createElement('p');
        humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;

        // Create the rain element (p)
        const rainLast3Hours = dailyForecast.rain?.['3h'] || 0;
        const rainEl = document.createElement('p');
        rainEl.textContent = `Rain: ${rainLast3Hours.toFixed(2)} mm`;

        //Append all the newly created child elements to the parent `card` div.
        card.append(dateEl, iconEl, tempEl, humidityEl, rainEl);
        forecastContainerEl.append(card);

        setTimeout(() => {
            card.classList.add('visible');
        }, cardIndex * 100);

        cardIndex++;
    }
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    historyContainerEl.innerHTML = '';
    for (const city of history) {
        const historyBtn = document.createElement('button');
        historyBtn.textContent = city;
        historyBtn.classList.add('history-btn');
        historyBtn.setAttribute('data-city', city);
        historyContainerEl.append(historyBtn);
    }
}
function saveCityToHistory(city) {
    const historyString = localStorage.getItem('weatherHistory') || '[]';
    let history = JSON.parse(historyString);
    history = history.filter(existingCity => existingCity.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    if (history.length > 6) {
        history = history.slice(0, 6);
    }
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
}

//API Key
const API_KEY = '5743a47209025420a4383bf8eb3a30ce';

async function fetchWeather(city) {
    clearUI();
    showLoader();
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

        const responses = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        for (const response of responses) {
            if (!response.ok) {
                // Check for specific error codes
                if (response.status === 404) {
                    throw new Error('City not found. Please check your spelling.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API Key. Please contact the administrator.');
                } else {
                    throw new Error(`API error: ${response.statusText} (${response.status})`);
                }
            }
        }

        const [currentWeather, forecast] = await Promise.all(
            responses.map(response => response.json())
        );

        displayCurrentWeather(currentWeather);

        displayForecast(forecast.list);

        saveCityToHistory(currentWeather.name);

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        errorContainerEl.textContent = error.message;
        errorContainerEl.classList.remove('hidden');
    } finally {
        hideLoader();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    clearUI();
    showLoader();
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const responses = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);
        for (const response of responses) {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data by coordinates');
            }
        }
        const [currentWeather, forecast] = await Promise.all(
            responses.map(response => response.json())
        );
        displayCurrentWeather(currentWeather);
        displayForecast(forecast.list);
        saveCityToHistory(currentWeather.name);
    }
    catch (error) {
        console.error('Failed to fetch weather data', error);
        errorContainerEl.textContent = 'Could not fetch weather for your location. Please try searching for a city manually.';
        errorContainerEl.classList.remove('hidden');
    }
    finally {
        hideLoader();
    }
}

searchFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = searchInputEl.value.trim();
    if (city) {
        fetchWeather(city);
        searchInputEl.value = '';
    } else {
        errorContainerEl.textContent = 'Please enter a city name.';
        errorContainerEl.classList.remove('hidden');
    }
});

historyContainerEl.addEventListener('click', (event) => {
    if (event.target.matches('.history-btn')) {
        const city = event.target.dataset.city;
        fetchWeather(city);
    }
});

renderHistory();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            console.error('Error getting user location:', error.message);
        }
    );
} else {
    console.log('Geolocation is not supported');
}