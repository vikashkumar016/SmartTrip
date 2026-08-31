import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../utils/api";

function TripsDashboard({ refreshKey }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [generatingId, setGeneratingId] =
    useState(null);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  // =========================
  // HELPERS
  // =========================

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

  const getStatusClass = (status) => {
    if (status === "generated") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
  };

  // =========================
  // FETCH TRIPS
  // =========================

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/trips");

      setTrips(data.data);
    } catch (error) {
      console.error(
        "Fetch trips error:",
        error
      );

      setError(
        "We couldn't load your trips. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [refreshKey]);

  // =========================
  // GENERATE AI ITINERARY
  // =========================

  const handleGenerate = async (id) => {
    try {
      setGeneratingId(id);

      setFeedback({
        type: "",
        message: "",
      });

      const data = await apiRequest(
        `/trips/${id}/generate`,
        {
          method: "POST",
        }
      );

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === id
            ? data.data
            : trip
        )
      );

      setFeedback({
        type: "success",
        message:
          "Your AI itinerary was generated successfully.",
      });
    } catch (error) {
      console.error(
        "Generate itinerary error:",
        error
      );

      setFeedback({
        type: "error",
        message:
          "We couldn't generate the itinerary. Please try again.",
      });
    } finally {
      setGeneratingId(null);
    }
  };

  // =========================
  // DELETE TRIP
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {
      setFeedback({
        type: "",
        message: "",
      });

      await apiRequest(`/trips/${id}`, {
        method: "DELETE",
      });

      setTrips((prevTrips) =>
        prevTrips.filter(
          (trip) => trip._id !== id
        )
      );

      setFeedback({
        type: "success",
        message:
          "Trip deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete trip error:",
        error
      );

      setFeedback({
        type: "error",
        message:
          "We couldn't delete this trip. Please try again.",
      });
    }
  };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <section className="mt-16">
        <div className="mb-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (error) {
    return (
      <section className="mt-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            Unable to load trips
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchTrips}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 w-full">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your adventures
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Your Trips
          </h2>

          <p className="mt-2 text-slate-500">
            {trips.length === 1
              ? "1 trip planned"
              : `${trips.length} trips planned`}
          </p>
        </div>

        {trips.length > 0 && (
          <a
            href="#create-trip"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            + Plan another trip
          </a>
        )}

      </div>

      {/* =========================
          FEEDBACK
      ========================= */}

      {feedback.message && (
        <div
          role="status"
          className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            ✈
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            Your adventure starts here
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You haven't planned any trips yet.
            Create your first trip and let
            SmartTrip AI build a personalized
            itinerary for you.
          </p>

          <a
            href="#create-trip"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Plan Your First Trip
          </a>

        </div>
      ) : (

        /* =========================
            TRIP CARDS
        ========================= */

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {trips.map((trip) => {
            const visibleInterests =
              trip.interests?.slice(0, 3) || [];

            const remainingInterests =
              Math.max(
                (trip.interests?.length || 0) - 3,
                0
              );

            const isGenerating =
              generatingId === trip._id;

            return (
              <article
                key={trip._id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                      {trip.destination}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {formatDate(
                        trip.startDate
                      )}
                      {" – "}
                      {formatDate(
                        trip.endDate
                      )}
                    </p>

                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClass(
                      trip.status
                    )}`}
                  >
                    {trip.status}
                  </span>

                </div>

                {/* METADATA */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Budget
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      ₹
                      {formatCurrency(
                        trip.budget
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Travelers
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {trip.travelers}
                    </p>
                  </div>

                </div>

                {/* INTERESTS */}

                {trip.interests?.length >
                  0 && (
                      <div className="mt-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Interests
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {visibleInterests.map(
                        (interest) => (
                          <span
                            key={interest}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                          >
                            {interest}
                          </span>
                        )
                      )}

                      {remainingInterests >
                        0 && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          +
                          {
                            remainingInterests
                          }
                        </span>
                      )}

                    </div>

                  </div>
                )}

                {/* PUSH ACTIONS DOWN */}

                <div className="mt-auto pt-6">

                  {/* PRIMARY */}

                  <Link
                    to={`/trips/${trip._id}`}
                    className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    View Trip
                  </Link>


                  {/* SECONDARY ACTIONS */}

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <Link
                      to={`/trips/${trip._id}/edit`}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleGenerate(
                          trip._id
                        )
                      }
                      disabled={isGenerating}
                      className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGenerating
                        ? "Planning..."
                        : trip.status ===
                            "generated"
                          ? "Regenerate"
                          : "Generate AI"}
                    </button>

                  </div>


                  {/* DESTRUCTIVE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        trip._id
                      )
                    }
                    className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete trip
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default TripsDashboard;