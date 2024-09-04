var weatherAPI = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".tempreture span");

const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = currentDate.getDate() + ", " + monthName;

const weatherIcons = {
    "clear sky": "wi-day-sunny",
    "few clouds": "wi-day-cloudy",
    "scattered clouds": "wi-day-cloudy",
    "broken clouds": "wi-day-cloudy",
    "shower rain": "wi-day-showers",
    "rain": "wi-day-rain",
    "thunderstorm": "wi-day-thunderstorm",
    "snow": "wi-day-snow",
    "mist": "wi-day-fog",
    // Add more mappings as needed
};

// Geolocation Code
if ("geolocation" in navigator) {
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            console.log("Fetching city from coordinates:", apiUrl);

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("Geolocation data received:", data);
                    const address = data.address || {};
                    const city = address.city || address.town || address.village || address.locality || "Unknown location";
                    console.log("City derived from address:", city);

                    showData(city);
                })
                .catch(error => {
                    console.log("Error fetching geolocation data:", error);
                });
        },
        function (error) {
            console.log("Geolocation error:", error.message);
            locationElement.textContent = "Unable to retrieve location.";
        }
    );
} else {
    console.log("Geolocation is not available on this browser.");
}

// Weather Form Submission
weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted with city:", search.value); // Debugging log

    locationElement.textContent = "Loading...";
    weatherIcon.className = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "";

    showData(search.value);
});

function showData(city) {
    getWeatherData(city, (result) => {
        console.log("Weather data received:", result); // Debugging log

        if (result.cod == 200) {
            const weatherDescription = result.weather[0].description;
            const iconClass = weatherIcons[weatherDescription] || "wi-day-cloudy";

            weatherIcon.className = `wi ${iconClass}`;
            locationElement.textContent = result?.name;
            tempElement.textContent =
                (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176);
            weatherCondition.textContent = weatherDescription.toUpperCase();
        } else {
            locationElement.textContent = "City not found";
        }
    });
}

function getWeatherData(city, callback) {
    const locationApi = weatherAPI + "?address=" + city;
    console.log("Fetching weather data from:", locationApi); // Debugging log

    fetch(locationApi).then((response) => {
        response.json().then((response) => {
            callback(response);
        });
    });
}
