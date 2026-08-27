import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { apiRequest } from "../utils/api";

function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "",
    interests: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = [
    "Beach",
    "Food",
    "Adventure",
    "Nature",
    "Culture",
    "Shopping",
    "Nightlife",
  ];

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await apiRequest(
          `/trips/${id}`
        );

        const trip = data.data;

        setFormData({
          destination: trip.destination,

          startDate: trip.startDate
            .split("T")[0],

          endDate: trip.endDate
            .split("T")[0],

          budget: trip.budget,

          travelers: trip.travelers,

          interests: trip.interests || [],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const selected =
        prev.interests.includes(interest);

      return {
        ...prev,

        interests: selected
          ? prev.interests.filter(
              (item) => item !== interest
            )
          : [...prev.interests, interest],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await apiRequest(`/trips/${id}`, {
        method: "PATCH",

        body: JSON.stringify({
          ...formData,

          budget: Number(formData.budget),

          travelers: Number(
            formData.travelers
          ),
        }),
      });

      navigate(`/trips/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading trip...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 font-medium text-slate-600"
        >
          ← Back
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Trip ✏️
          </h1>

          <p className="mt-2 text-slate-500">
            Updating the trip will require
            regenerating your AI itinerary.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Destination */}

            <div>
              <label className="mb-2 block font-semibold">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            {/* Dates */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                  required
                />
              </div>

            </div>

            {/* Budget + Travelers */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Budget
                </label>

                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Travelers
                </label>

                <input
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                  min="1"
                  required
                />
              </div>

            </div>

            {/* Interests */}

            <div>
              <p className="mb-3 font-semibold">
                Interests
              </p>

              <div className="flex flex-wrap gap-3">

                {interestOptions.map(
                  (interest) => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() =>
                        handleInterestChange(
                          interest
                        )
                      }
                      className={`rounded-full border px-4 py-2 ${
                        formData.interests.includes(
                          interest
                        )
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      {interest}
                    </button>
                  )
                )}

              </div>
            </div>

            {error && (
              <p className="text-red-500">
                {error}
              </p>
            )}

            <button
              disabled={saving}
              className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTripPage;