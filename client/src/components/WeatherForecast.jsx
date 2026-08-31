import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

function WeatherForecast({ tripId }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/trips/${tripId}/weather`
      );

      setWeather(data.data);
    } catch (error) {
      console.error(
        "Weather fetch error:",
        error
      );

      setError(
        "We couldn't load the weather forecast right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [tripId]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-8 w-52 animate-pulse rounded bg-slate-200" />

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl bg-slate-100"
              />
            )
          )}
        </div>

      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Weather unavailable
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          We couldn't load the forecast
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchWeather}
          className="mt-5 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
        >
          Try Again
        </button>

      </section>
    );
  }

  // =========================
  // WEATHER NOT AVAILABLE
  // =========================

  if (!weather?.available) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Weather
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Forecast not available yet
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {weather?.reason ||
            "Weather information isn't available for this trip yet."}
        </p>

      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {/* HEADER */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Trip Weather
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Weather Forecast
        </h2>

        <p className="mt-2 text-slate-500">
          {weather.location.name},{" "}
          {weather.location.country}
        </p>

      </div>


      {/* FORECAST */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        {weather.forecast.map((day) => (
          <article
            key={day.date}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5"
          >

            <p className="text-sm font-semibold text-blue-600">
              {formatDate(day.date)}
            </p>

            <h3 className="mt-3 min-h-12 text-lg font-bold text-slate-900">
              {day.condition}
            </h3>

            <div className="mt-4 border-t border-slate-200 pt-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Temperature
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {day.minTemperature}°C
                {" – "}
                {day.maxTemperature}°C
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rain chance
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {day.rainProbability}%
              </p>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default WeatherForecast;