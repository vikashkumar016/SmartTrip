import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import TripMap from "../components/TripMap";
import WeatherForecast from "../components/WeatherForecast";
import { apiRequest } from "../utils/api";

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
          error.message ||
            "Failed to fetch trip"
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-xl font-medium text-slate-700">
          Loading trip...
        </p>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-xl text-red-500">
            {error}
          </p>

          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-xl text-slate-600">
          Trip not found.
        </p>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <Link
          to="/"
          className="mb-6 inline-block font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to dashboard
        </Link>


        {/* =====================================
            TRIP INFORMATION
        ===================================== */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <div className="flex flex-col justify-between gap-6 md:flex-row">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Your Trip
              </p>

              <h1 className="mt-1 text-4xl font-bold text-slate-900">
                {trip.destination} ✈️
              </h1>

              <p className="mt-3 text-slate-600">

                {new Date(
                  trip.startDate
                ).toLocaleDateString()}

                {" → "}

                {new Date(
                  trip.endDate
                ).toLocaleDateString()}

              </p>

            </div>


            <div className="space-y-3">

              <p className="text-lg text-slate-700">

                💰 Budget:{" "}

                <span className="font-semibold">
                  ₹{trip.budget}
                </span>

              </p>


              <p className="text-lg text-slate-700">

                👥 Travelers:{" "}

                <span className="font-semibold">
                  {trip.travelers}
                </span>

              </p>


              <p className="text-slate-700">

                Status:{" "}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                  {trip.status}
                </span>

              </p>

            </div>

          </div>


          {/* =====================================
              INTERESTS
          ===================================== */}

          <div className="mt-6 flex flex-wrap gap-2">

            {trip.interests?.map(
              (interest) => (

                <span
                  key={interest}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {interest}
                </span>

              )
            )}

          </div>

        </div>


        {/* =====================================
            WEATHER
        ===================================== */}

        <WeatherForecast
          tripId={trip._id}
        />


        {/* =====================================
            MAP
        ===================================== */}

        {trip.status === "generated" && (
          <TripMap trip={trip} />
        )}


        {/* =====================================
            ITINERARY
        ===================================== */}

        {trip.status !== "generated" ||
        !trip.itinerary ? (

          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">

            <h2 className="text-2xl font-bold text-slate-900">
              No itinerary generated yet
            </h2>

            <p className="mt-2 text-slate-500">
              Go back to the dashboard and generate
              your AI itinerary.
            </p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
            >
              Go to Dashboard
            </Link>

          </div>

        ) : (

          <ItinerarySection
            trip={trip}
          />

        )}

      </div>
    </div>
  );
}


/* =====================================
   ITINERARY COMPONENT
===================================== */

function ItinerarySection({ trip }) {
  const itinerary = trip.itinerary;

  const budget =
    trip.budgetAnalysis;

  return (
    <div className="mt-8">

      {/* =====================================
          SUMMARY + BUDGET
      ===================================== */}

      <div className="rounded-2xl bg-slate-900 p-8 text-white shadow">

        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          AI Trip Summary
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Your Personalized Itinerary
        </h2>

        <p className="mt-4 leading-7 text-slate-300">
          {itinerary.summary}
        </p>


        {/* =====================================
            BUDGET CARDS
        ===================================== */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Trip Budget */}

          <div className="rounded-xl bg-slate-800 p-4">

            <p className="text-sm text-slate-400">
              Trip Budget
            </p>

            <p className="mt-1 text-xl font-bold">
              ₹{trip.budget}
            </p>

          </div>


          {/* AI Estimate */}

          <div className="rounded-xl bg-slate-800 p-4">

            <p className="text-sm text-slate-400">
              AI Estimate
            </p>

            <p className="mt-1 text-xl font-bold">
              ₹{itinerary.totalEstimatedCost || 0}
            </p>

          </div>


          {/* Backend Calculated Activity Cost */}

          <div className="rounded-xl bg-slate-800 p-4">

            <p className="text-sm text-slate-400">
              Activity Cost
            </p>

            <p className="mt-1 text-xl font-bold">

              ₹
              {budget?.calculatedActivityCost ||
                0}

            </p>

          </div>


          {/* Remaining Budget */}

          <div className="rounded-xl bg-slate-800 p-4">

            <p className="text-sm text-slate-400">
              Remaining
            </p>

            <p className="mt-1 text-xl font-bold">
              ₹{budget?.remainingBudget || 0}
            </p>

          </div>

        </div>


        {/* =====================================
            BUDGET UTILIZATION
        ===================================== */}

        {budget && (
          <div className="mt-6">

            <div className="mb-2 flex justify-between">

              <span className="text-sm text-slate-400">
                Activity Budget Usage
              </span>

              <span className="font-semibold">
                {budget.budgetUtilization || 0}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-700">

              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${Math.min(
                    budget.budgetUtilization || 0,
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

      {budget?.overBudget && (

        <div className="mt-6 rounded-xl bg-red-100 p-5 text-red-700">

          <p className="font-bold">
            ⚠️ This itinerary exceeds your activity budget.
          </p>

          <p className="mt-1">
            Over budget by ₹{budget.overBy}
          </p>

        </div>

      )}


      {budget && !budget.overBudget && (

        <div className="mt-6 rounded-xl bg-green-100 p-5 text-green-700">

          <p className="font-bold">
            ✓ Your planned activities are within budget.
          </p>

          <p className="mt-1">
            ₹{budget.remainingBudget} remains available.
          </p>

        </div>

      )}


      {/* =====================================
          DAY-WISE ITINERARY
      ===================================== */}

      <div className="mt-8 space-y-8">

        {itinerary.days?.map(
          (day) => (

            <div
              key={day.day}
              className="rounded-2xl bg-white p-7 shadow"
            >

              {/* Day Heading */}

              <div className="mb-6">

                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Day {day.day}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {day.title}
                </h3>

              </div>


              {/* Activities */}

              <div className="space-y-5">

                {day.activities?.map(
                  (activity, index) => (

                    <div
                      key={`${day.day}-${index}`}
                      className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md"
                    >

                      <div className="flex flex-col justify-between gap-3 md:flex-row">

                        <div>

                          <p className="font-semibold text-slate-500">
                            🕐 {activity.time}
                          </p>

                          <h4 className="mt-1 text-xl font-bold text-slate-900">
                            {activity.place}
                          </h4>

                        </div>


                        <div className="font-semibold text-slate-700">

                          💰 ₹
                          {activity.estimatedCost}

                        </div>

                      </div>


                      <p className="mt-3 leading-7 text-slate-600">
                        {activity.description}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default TripDetailsPage;