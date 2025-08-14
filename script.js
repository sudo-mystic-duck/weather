const container = document.getElementById("container");
const weather = document.getElementById("weather");

let latitude;
let longitude;

function getUserLocation() {
  const btnLocation = document.createElement("button");
  btnLocation.innerHTML = "Get Location";
  container.appendChild(btnLocation);

  btnLocation.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const [weatherData, location] = await Promise.all([
        getWeather(latitude, longitude),
        getLocationInfo(latitude, longitude)
      ]);

      weather.innerHTML = `
        <h2>Wetter an deinem Standort</h2>
        <p>Land: ${location.country}</p>
        <p>Bundesland: ${location.state}</p>
        <p>Stadt: ${location.city}</p>
        <p>Temperatur: ${weatherData.current_weather.temperature}°C</p>
        <p>Windgeschwindigkeit: ${weatherData.current_weather.windspeed} km/h</p>
      `;
    }, (error) => {
      alert("Position konnte nicht ermittelt werden: " + error.message);
    });
  });
}

async function getWeather(lat, lon) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
  const data = await response.json();
  return data;
}

async function getLocationInfo(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await response.json();

  const city = data.address.city || data.address.town || data.address.village || "Unbekannt";
  const country = data.address.country || "Unbekannt";
  const state = data.address.state || "Unbekannt";

  return { city, country, state };
}

getUserLocation();
