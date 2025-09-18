// Get references to all the HTML elements we will be interacting with.
const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input')
const loaderEl = document.querySelector('#loader');
const errorContainerEl = document.querySelector('#error-container');
const historyContainerEl = document.querySelector('#history-container');
const cityNameEl = document.querySelector('#city-name-date');
const temperatureEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const forecastContainerEl = document.querySelector('#forecast-container');

// This function is responsible for taking the weather data object and updating the UI.
function displayCurrentWeather(data) {
    const currentDate = new Date().toLocaleDateString('en-IN');
    cityNameEl.textContent = `${data.name} (${currentDate})`;
    temperatureEl.textContent = `Temperature :-  ${Math.round(data.main.temp)} °C`;
    humidityEl.textContent = `Humidity :- ${data.main.humidity}%`;
    windSpeedEl.textContent = `Wind Speed :- ${data.wind.speed} m/s`;
}

// This function is responsible for creating and displaying the 5-day forecast cards.
function displayForecast(forecastList) {
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

        //Append all the newly created child elements to the parent `card` div.
        card.append(dateEl, iconEl, tempEl, humidityEl);
        forecastContainerEl.append(card);
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
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
}

//API Key
const API_KEY = 'API_KEY';

async function fetchWeather(city) {
    try {
        errorContainerEl.classList.add('hidden');
        cityNameEl.textContent = '';
        temperatureEl.textContent = '';
        humidityEl.textContent = '';
        windSpeedEl.textContent = '';
        forecastContainerEl.innerHTML = '';
        loaderEl.classList.remove('hidden');
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

        saveCityToHistory(currentWeather.name);

    } catch (error) {
        console.error('Failed to fetch weather data:',error);
        errorContainerEl.textContent = 'Sorry, the city could not be found. Please check your spelling and try again';
        errorContainerEl.classList.remove('hidden');
    } finally {
        loaderEl.classList.add('hidden');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        errorContainerEl.classList.add('hidden');
        cityNameEl.textContent = '';
        temperatureEl.textContent = '';
        humidityEl.textContent = '';
        windSpeedEl.textContent = '';
        forecastContainerEl.innerHTML = '';
        loaderEl.classList.remove('hidden');
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
        loaderEl.classList.add('hidden');
    }
}

searchFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = searchInputEl.value.trim();
    if (city) {
        fetchWeather(city);
        searchInputEl.value = '';
    } else {
        alert('Not a valid city');
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