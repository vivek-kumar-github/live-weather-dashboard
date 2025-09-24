# **Live Weather Dashboard**

A clean, modern, and fully responsive web application that provides real-time weather data and a 5-day forecast for any city in the world. This full-stack project features a secure Node.js backend proxy to protect the API key and a dynamic, interactive frontend built with vanilla JavaScript.

[//]: # (### **\[Live Demo Link\]   •   \[Video Walkthrough\]**)
[//]: # (THis is comment but can be used for live demo link)
## **✨ Features**

* **Real-Time Weather Data:** Get up-to-the-minute information including temperature, "feels like" temperature, humidity, wind speed, and more.  
* **5-Day Forecast:** Plan ahead with a detailed forecast that updates with each search.  
* **Geolocation:** Automatically fetches weather for the user's current location on startup.  
* **Search History:** Uses localStorage to save recent searches, allowing for quick access to frequently viewed cities.  
* **Secure Backend Proxy:** A Node.js and Express server protects the OpenWeatherMap API key, preventing it from being exposed on the frontend.  
* **Fully Responsive Design:** A mobile-first approach ensures a seamless experience on any device, from small phones to large desktops.  
* **Dynamic UI with Smooth Transitions:** The interface updates gracefully with elegant fade-in and slide-up animations.

## **🛠️ Tech Stack**

This project is built with a modern, full-stack JavaScript architecture.

* **Frontend:** HTML5, CSS3 (Flexbox, Grid), Vanilla JavaScript (ES6+, async/await, Fetch API)  
* **Backend:** Node.js, Express.js  
* **API:** [OpenWeatherMap API](https://openweathermap.org/api) for all weather data.  
* **Security:** dotenv for secure management of environment variables (API key).

## **🚀 Local Setup and Installation**

To run this project on your local machine, follow these simple steps:

#### **1\. Clone the Repository**

Open your terminal and clone this repository.

git clone [https://github.com/vivek-kumar-github/weather-dashboard.git](https://github.com/your-username/weather-dashboard.git)

cd weather-dashboard

#### **2\. Install Dependencies**

This project uses npm (Node Package Manager) to manage its backend dependencies.

npm install

#### **3\. Set Up Environment Variables**

This is a crucial step for accessing the weather API.

* Create a new file in the root of the project named .env.  
* Open the .env file and add your secret API key from [OpenWeatherMap](https://openweathermap.org/appid) in the following format:  
  API\_KEY=your\_secret\_api\_key\_here

#### **4\. Start the Server**

Once the dependencies are installed and your API key is set, you can start the server.

node server.js

#### **5\. View in Browser**

Your application is now running\! Open your favorite web browser and navigate to:  
http://localhost:3001

## **📄 License**

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).