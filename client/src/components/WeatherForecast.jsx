import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function WeatherForecast({ tripId }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          `/trips/${tripId}/weather`
        );

        setWeather(data.data);

      } catch (error) {
        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchWeather();
    }

  }, [tripId]);

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        Loading weather...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-2xl bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!weather?.available) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold">
          🌦 Weather
        </h2>

        <p className="mt-3 text-slate-600">
          {weather?.reason}
        </p>

      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl bg-white p-7 shadow">

      <div>

        <h2 className="text-2xl font-bold text-slate-900">
          🌦 Weather Forecast
        </h2>

        <p className="mt-1 text-slate-500">
          {weather.location.name},{" "}
          {weather.location.country}
        </p>

      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {weather.forecast.map((day) => (

          <div
            key={day.date}
            className="rounded-xl bg-slate-100 p-5"
          >

            <p className="font-semibold">
              {new Date(
                day.date
              ).toLocaleDateString()}
            </p>

            <p className="mt-3 text-lg font-bold">
              {day.condition}
            </p>

            <p className="mt-3 text-slate-600">
              🌡 {day.minTemperature}°C –{" "}
              {day.maxTemperature}°C
            </p>

            <p className="mt-1 text-slate-600">
              🌧 Rain: {day.rainProbability}%
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default WeatherForecast;