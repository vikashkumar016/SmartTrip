const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
  };

  return weatherCodes[code] || "Unknown weather";
};

const geocodeDestination = async (destination) => {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(destination)}` +
    `&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to find destination");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Destination not found");
  }

  const location = data.results[0];

  return {
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    country: location.country,
    timezone: location.timezone,
  };
};

export const getTripWeather = async (trip) => {
  const location = await geocodeDestination(
    trip.destination
  );

  const startDate = new Date(trip.startDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const daysUntilTrip = Math.ceil(
    (startDate - today) / (1000 * 60 * 60 * 24)
  );

  // Open-Meteo forecast only goes up to 16 days
  if (daysUntilTrip > 16) {
    return {
      available: false,
      reason:
        "Weather forecast is not available yet. Check again closer to the trip.",
      location,
    };
  }

  const start = trip.startDate
    .toISOString()
    .split("T")[0];

  let end = trip.endDate
    .toISOString()
    .split("T")[0];

  const maxForecastDate = new Date(today);
  maxForecastDate.setDate(
    maxForecastDate.getDate() + 15
  );

  const tripEnd = new Date(trip.endDate);

  if (tripEnd > maxForecastDate) {
    end = maxForecastDate
      .toISOString()
      .split("T")[0];
  }

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.latitude}` +
    `&longitude=${location.longitude}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto` +
    `&start_date=${start}` +
    `&end_date=${end}`;

  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error(
      "Failed to fetch weather forecast"
    );
  }

  const data = await response.json();

  const forecast = data.daily.time.map(
    (date, index) => ({
      date,

      maxTemperature:
        data.daily.temperature_2m_max[index],

      minTemperature:
        data.daily.temperature_2m_min[index],

      rainProbability:
        data.daily
          .precipitation_probability_max[index],

      weatherCode:
        data.daily.weather_code[index],

      condition: getWeatherDescription(
        data.daily.weather_code[index]
      ),
    })
  );

  return {
    available: true,
    location,
    forecast,
  };
};