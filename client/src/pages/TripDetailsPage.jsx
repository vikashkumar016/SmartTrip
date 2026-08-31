import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import TripMap from "../components/TripMap";
import WeatherForecast from "../components/WeatherForecast";
import { apiRequest } from "../utils/api";

// =====================================
// FORMAT HELPERS
// =====================================

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString(
    "en-IN"
  );
};

function TripDetailsPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FETCH SINGLE TRIP
  // =====================================

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          `/trips/${id}`
        );

        setTrip(data.data);
      } catch (error) {
        console.error(
          "Fetch trip error:",
          error
        );

        setError(
          "We couldn't load this trip. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-6 h-5 w-36 animate-pulse rounded bg-slate-200" />

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-4 h-5 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <h1 className="text-xl font-bold text-red-800">
            Unable to load trip
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  // =====================================
  // NO TRIP
  // =====================================

  if (!trip) {
    return (
      <div className="px-4 py-16 text-center">

        <h1 className="text-2xl font-bold text-slate-900">
          Trip not found
        </h1>

        <p className="mt-2 text-slate-500">
          This trip may have been removed or is
          no longer available.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Dashboard
        </Link>

      </div>
    );
  }

  const itineraryAvailable =
    trip.status === "generated" &&
    trip.itinerary;

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          to="/"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>


        {/* =====================================
            TRIP OVERVIEW
        ===================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Your Trip
                </p>

                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {trip.status}
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {trip.destination}
              </h1>

              <p className="mt-3 text-slate-500">
                {formatDate(trip.startDate)}
                {" – "}
                {formatDate(trip.endDate)}
              </p>

            </div>


            <Link
              to={`/trips/${trip._id}/edit`}
              className="inline-flex w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit Trip
            </Link>

          </div>


          {/* DETAILS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trip Budget
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                ₹{formatCurrency(trip.budget)}
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Travelers
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                {trip.travelers}
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trip Status
              </p>

              <p className="mt-2 text-xl font-bold capitalize text-slate-900">
                {trip.status}
              </p>

            </div>

          </div>


          {/* INTERESTS */}

          {trip.interests?.length > 0 && (
            <div className="mt-7">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Interests
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {trip.interests.map(
                  (interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {interest}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

        </section>


        {/* =====================================
            ITINERARY / EMPTY
        ===================================== */}

        {!itineraryAvailable ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              ✦
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Your AI itinerary is waiting
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Generate an itinerary from your
              dashboard and SmartTrip AI will
              create a personalized day-by-day
              plan for this trip.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>

          </section>
        ) : (
          <ItinerarySection trip={trip} />
        )}


        {/* =====================================
            WEATHER
        ===================================== */}

        <WeatherForecast tripId={trip._id} />


        {/* =====================================
            MAP
        ===================================== */}

        {trip.status === "generated" && (
          <TripMap trip={trip} />
        )}

      </div>
    </div>
  );
}


/* =====================================
   ITINERARY
===================================== */

function ItinerarySection({ trip }) {
  const itinerary = trip.itinerary;
  const budget = trip.budgetAnalysis;

  const utilization =
    Number(budget?.budgetUtilization) || 0;

  const remaining =
    Number(budget?.remainingBudget) || 0;

  return (
    <section className="mt-8">

      {/* =====================================
          AI SUMMARY
      ===================================== */}

      <div className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
          AI Trip Summary
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Your Personalized Itinerary
        </h2>

        <p className="mt-4 max-w-4xl leading-7 text-slate-300">
          {itinerary.summary}
        </p>


        {/* BUDGET */}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <BudgetMetric
            label="Trip Budget"
            value={`₹${formatCurrency(
              trip.budget
            )}`}
          />

          <BudgetMetric
            label="AI Estimate"
            value={`₹${formatCurrency(
              itinerary.totalEstimatedCost
            )}`}
          />

          <BudgetMetric
            label="Activity Cost"
            value={`₹${formatCurrency(
              budget?.calculatedActivityCost
            )}`}
          />

          <BudgetMetric
            label="Remaining"
            value={`₹${formatCurrency(
              budget?.remainingBudget
            )}`}
          />

        </div>


        {/* UTILIZATION */}

        {budget && (
          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between gap-4">

              <span className="text-sm text-slate-400">
                Activity Budget Usage
              </span>

              <span className="text-sm font-semibold text-white">
                {utilization}%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">

              <div
                className="h-full rounded-full bg-blue-400 transition-all"
                style={{
                  width: `${Math.min(
                    utilization,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>
        )}

      </div>


      {/* =====================================
          BUDGET STATUS
      ===================================== */}

      {budget?.overBudget ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="font-semibold text-red-800">
            This itinerary is over your activity
            budget.
          </p>

          <p className="mt-1 text-sm text-red-700">
            Estimated activities exceed your
            budget by ₹
            {formatCurrency(budget.overBy)}.
          </p>

        </div>
      ) : budget ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

          <p className="font-semibold text-emerald-800">
            {remaining === 0
              ? "Your itinerary fits the available activity budget exactly."
              : "Your planned activities are within budget."}
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            {remaining === 0
              ? "No activity budget remains."
              : `₹${formatCurrency(
                  remaining
                )} remains available.`}
          </p>

        </div>
      ) : null}


      {/* =====================================
          DAY-BY-DAY HEADING
      ===================================== */}

      <div className="mb-6 mt-10">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Day-by-day plan
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Your Itinerary
        </h2>

        <p className="mt-2 text-slate-500">
          Explore the activities SmartTrip AI
          planned for each day.
        </p>

      </div>


      {/* =====================================
          DAYS
      ===================================== */}

      <div className="space-y-6">

        {itinerary.days?.map((day) => (
          <article
            key={day.day}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >

            {/* DAY HEADER */}

            <div className="border-b border-slate-100 pb-5">

              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                Day {day.day}
              </span>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {day.title}
              </h3>

            </div>


            {/* ACTIVITIES */}

            <div className="mt-6 space-y-4">

              {day.activities?.map(
                (activity, index) => (
                  <div
                    key={`${day.day}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <p className="text-sm font-semibold text-blue-600">
                          {activity.time}
                        </p>

                        <h4 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                          {activity.place}
                        </h4>

                      </div>


                      <div className="shrink-0 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                        ₹
                        {formatCurrency(
                          activity.estimatedCost
                        )}
                      </div>

                    </div>


                    <p className="mt-4 leading-7 text-slate-600">
                      {activity.description}
                    </p>

                  </div>
                )
              )}

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}


/* =====================================
   SMALL REUSABLE METRIC
===================================== */

function BudgetMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}

export default TripDetailsPage;