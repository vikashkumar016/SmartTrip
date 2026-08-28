import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../utils/api";

function TripsDashboard({ refreshKey }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [generatingId, setGeneratingId] =
    useState(null);

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
      setError(error.message);
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

    alert(
      "AI itinerary generated successfully!"
    );
  } catch (error) {
    console.error(
      "Generate itinerary error:",
      error
    );

    alert(
      error.message ||
        "Failed to generate itinerary"
    );
  } finally {
    setGeneratingId(null);
  }
};
  // =========================
  // DELETE TRIP
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this trip?"
      );

    if (!confirmDelete) return;

    try {
      await apiRequest(
        `/trips/${id}`,
        {
          method: "DELETE",
        }
      );

      setTrips((prevTrips) =>
        prevTrips.filter(
          (trip) => trip._id !== id
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-slate-600">
        Loading trips...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-10 text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-14 w-full">

      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Your Trips
        </h2>

        <p className="mt-1 text-slate-500">
          {trips.length} trips planned
        </p>
      </div>

      {/* NO TRIPS */}

      {trips.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <p className="text-xl font-semibold text-slate-700">
            No trips yet ✈️
          </p>

          <p className="mt-2 text-slate-500">
            Create your first trip above.
          </p>
        </div>
      ) : (

        // =========================
        // TRIP CARDS
        // =========================

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {trips.map((trip) => (
            <div
              key={trip._id}
              className="rounded-2xl bg-white p-6 shadow-md"
            >

              {/* TOP */}

              <div className="mb-4 flex items-start justify-between">

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {trip.destination}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm capitalize text-slate-600">
                    {trip.status}
                  </span>
                </div>

                <span className="text-3xl">
                  ✈️
                </span>
              </div>

              {/* BASIC DETAILS */}

              <div className="space-y-2 text-slate-600">

                <p>
                  📅{" "}
                  {new Date(
                    trip.startDate
                  ).toLocaleDateString()}
                  {" - "}
                  {new Date(
                    trip.endDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  💰 Budget: ₹
                  {trip.budget}
                </p>

                <p>
                  👥 Travelers:{" "}
                  {trip.travelers}
                </p>

              </div>

              {/* INTERESTS */}

              <div className="mt-4 flex flex-wrap gap-2">

                {trip.interests?.map(
                  (interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                    >
                      {interest}
                    </span>
                  )
                )}

              </div>

              {/* =====================
                  AI BUTTON
              ====================== */}

              <button
                onClick={() =>
                  handleGenerate(trip._id)
                }
                disabled={
                  generatingId === trip._id
                }
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingId === trip._id
                  ? "AI is planning..."
                  : trip.status ===
                    "generated"
                  ? "Regenerate AI Itinerary ✨"
                  : "Generate AI Itinerary ✨"}
              </button>

              {/* BOTTOM BUTTONS */}

             <div className="mt-3 flex gap-2">

         <Link
    to={`/trips/${trip._id}`}
    className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center font-medium text-white">
    View
  </Link>
 
    <Link
    to={`/trips/${trip._id}/edit`}
    className="rounded-lg border border-slate-300 px-3 py-2 font-medium"
  >
    Edit
    </Link>

   <button
    onClick={() =>
      handleDelete(trip._id)
    }
    className="rounded-lg border border-red-300 px-3 py-2 font-medium text-red-600">
     Delete
     </button>

    </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default TripsDashboard;