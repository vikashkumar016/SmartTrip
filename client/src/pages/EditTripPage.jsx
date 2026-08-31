import { useEffect, useState } from "react";
import {
  Link,
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

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  // =====================================
  // FETCH TRIP
  // =====================================

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          `/trips/${id}`
        );

        const trip = data.data;

        setFormData({
          destination:
            trip.destination || "",

          startDate:
            trip.startDate?.split("T")[0] ||
            "",

          endDate:
            trip.endDate?.split("T")[0] ||
            "",

          budget:
            trip.budget ?? "",

          travelers:
            trip.travelers ?? "",

          interests:
            trip.interests || [],
        });

      } catch (error) {
        console.error(
          "Fetch trip for editing error:",
          error
        );

        setError(
          "We couldn't load this trip for editing. Please return to the trip and try again."
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
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================
  // INTERESTS
  // =====================================

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
          : [
              ...prev.interests,
              interest,
            ],
      };
    });
  };

  // =====================================
  // SAVE CHANGES
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate <
        formData.startDate
    ) {
      setError(
        "End date must be after the start date."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        `/trips/${id}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            ...formData,

            budget: Number(
              formData.budget
            ),

            travelers: Number(
              formData.travelers
            ),
          }),
        }
      );

      navigate(`/trips/${id}`);

    } catch (error) {
      console.error(
        "Update trip error:",
        error
      );

      setError(
        "We couldn't save your changes. Please check the trip details and try again."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        <div className="mx-auto max-w-3xl">

          <div className="mb-6 h-5 w-24 animate-pulse rounded bg-slate-200" />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-9 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-8 space-y-5">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================
  // FETCH ERROR
  // =====================================

  if (
    error &&
    !formData.destination
  ) {
    return (
      <div className="px-4 py-16 sm:px-6">

        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <h1 className="text-xl font-bold text-red-800">
            Unable to edit trip
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>

          <Link
            to={`/trips/${id}`}
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Trip
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to={`/trips/${id}`}
          className="mb-6 inline-flex text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Trip
        </Link>


        {/* FORM CARD */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* HEADER */}

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Trip Settings
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Edit Trip
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Update your destination, travel
              dates, budget, travelers, or
              interests.
            </p>

          </div>


          {/* ITINERARY WARNING */}

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">

            <p className="font-semibold text-amber-900">
              Your itinerary may need to be
              regenerated
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              After changing your trip details,
              regenerate the AI itinerary so the
              plan matches your updated trip.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-7"
          >

            {/* DESTINATION */}

            <div>

              <label
                htmlFor="destination"
                className="text-sm font-semibold text-slate-800"
              >
                Destination
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Where are you planning to travel?
              </p>

              <input
                id="destination"
                type="text"
                name="destination"
                value={
                  formData.destination
                }
                onChange={handleChange}
                className={inputClass}
                required
              />

            </div>


            {/* DATES */}

            <fieldset>

              <legend className="text-sm font-semibold text-slate-800">
                Travel dates
              </legend>

              <p className="mt-1 text-sm text-slate-500">
                Update your trip start and end
                dates.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-slate-700"
                  >
                    Start date
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={
                      formData.startDate
                    }
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />

                </div>


                <div>

                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-slate-700"
                  >
                    End date
                  </label>

                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={
                      formData.endDate
                    }
                    onChange={handleChange}
                    min={
                      formData.startDate ||
                      undefined
                    }
                    className={inputClass}
                    required
                  />

                </div>

              </div>

            </fieldset>


            {/* BUDGET + TRAVELERS */}

            <fieldset>

              <legend className="text-sm font-semibold text-slate-800">
                Trip details
              </legend>

              <p className="mt-1 text-sm text-slate-500">
                Adjust your total budget and
                number of travelers.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* BUDGET */}

                <div>

                  <label
                    htmlFor="budget"
                    className="text-sm font-medium text-slate-700"
                  >
                    Budget
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-slate-500">
                      ₹
                    </span>

                    <input
                      id="budget"
                      type="number"
                      name="budget"
                      value={
                        formData.budget
                      }
                      onChange={
                        handleChange
                      }
                      className={`${inputClass} pl-8`}
                      min="0"
                      required
                    />

                  </div>

                </div>


                {/* TRAVELERS */}

                <div>

                  <label
                    htmlFor="travelers"
                    className="text-sm font-medium text-slate-700"
                  >
                    Travelers
                  </label>

                  <input
                    id="travelers"
                    type="number"
                    name="travelers"
                    value={
                      formData.travelers
                    }
                    onChange={handleChange}
                    className={inputClass}
                    min="1"
                    required
                  />

                </div>

              </div>

            </fieldset>


            {/* INTERESTS */}

            <fieldset>

              <legend className="text-sm font-semibold text-slate-800">
                Interests
              </legend>

              <p className="mt-1 text-sm text-slate-500">
                Choose the experiences you want
                your updated itinerary to focus
                on.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {interestOptions.map(
                  (interest) => {
                    const selected =
                      formData.interests.includes(
                        interest
                      );

                    return (
                      <button
                        type="button"
                        key={interest}
                        aria-pressed={
                          selected
                        }
                        onClick={() =>
                          handleInterestChange(
                            interest
                          )
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  }
                )}

              </div>

            </fieldset>


            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}


            {/* SAVE */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to={`/trips/${id}`}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                )}

                {saving
                  ? "Saving changes..."
                  : "Save Changes"}

              </button>

            </div>

          </form>

        </section>

      </div>

    </div>
  );
}

export default EditTripPage;