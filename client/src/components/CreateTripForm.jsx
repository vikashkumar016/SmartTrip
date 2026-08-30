import { useState } from "react";
import { apiRequest } from "../utils/api";

function CreateTripForm({ onTripCreated }) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "",
    interests: [],
  });

  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const interestOptions = [
    "Beach",
    "Food",
    "Adventure",
    "Nature",
    "Culture",
    "Shopping",
  ];

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  // -------------------------
  // Input Change
  // -------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Previous feedback remove when
    // user starts editing again
    if (feedback.message) {
      setFeedback({
        type: "",
        message: "",
      });
    }
  };

  // -------------------------
  // Interest Selection
  // -------------------------

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const isSelected =
        prev.interests.includes(interest);

      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter(
              (item) => item !== interest
            )
          : [...prev.interests, interest],
      };
    });
  };

  // -------------------------
  // Submit Trip
  // -------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra client-side validation
    if (
      formData.endDate &&
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      setFeedback({
        type: "error",
        message:
          "End date must be after the start date.",
      });

      return;
    }

    try {
      setLoading(true);

      setFeedback({
        type: "",
        message: "",
      });

      const data = await apiRequest("/trips", {
        method: "POST",

        body: JSON.stringify({
          ...formData,

          budget: Number(formData.budget),

          travelers: Number(
            formData.travelers
          ),
        }),
      });

      console.log("Trip created:", data);

      setFeedback({
        type: "success",
        message:
          "Trip created successfully. You're ready to generate your itinerary!",
      });

      // Refresh dashboard
      if (onTripCreated) {
        onTripCreated(data.data);
      }

      // Reset form
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        travelers: "",
        interests: [],
      });
    } catch (error) {
      // Keep actual error for developers
      console.error(
        "Create trip error:",
        error
      );

      // Friendly message for user
      setFeedback({
        type: "error",
        message:
          "We couldn't create your trip. Please check your details and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          CREATE A NEW TRIP
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Plan Your Trip
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Tell us where you're going and what
          kind of experience you want. SmartTrip
          AI will use these details to build your
          personalized itinerary.
        </p>
      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-7"
      >

        {/* Destination */}

        <div>
          <label
            htmlFor="destination"
            className="text-sm font-semibold text-slate-800"
          >
            Destination
          </label>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Where would you like to go?
          </p>

          <input
            id="destination"
            type="text"
            name="destination"
            placeholder="e.g. Goa, Jaipur, Manali"
            value={formData.destination}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>


        {/* Travel Dates */}

        <fieldset>
          <legend className="text-sm font-semibold text-slate-800">
            Travel dates
          </legend>

          <p className="mt-1 text-sm text-slate-500">
            Choose when your trip starts and ends.
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
                value={formData.startDate}
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
                value={formData.endDate}
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


        {/* Budget + Travelers */}

        <fieldset>
          <legend className="text-sm font-semibold text-slate-800">
            Trip details
          </legend>

          <p className="mt-1 text-sm text-slate-500">
            Help the AI create a plan that fits
            your group and budget.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">

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
                  placeholder="25000"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`${inputClass} pl-8`}
                  min="0"
                  required
                />
              </div>
            </div>


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
                placeholder="2"
                value={formData.travelers}
                onChange={handleChange}
                className={inputClass}
                min="1"
                required
              />
            </div>

          </div>
        </fieldset>


        {/* Interests */}

        <fieldset>
          <legend className="text-sm font-semibold text-slate-800">
            Interests
          </legend>

          <p className="mt-1 text-sm text-slate-500">
            Select the experiences you would like
            your itinerary to focus on.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            {interestOptions.map((interest) => {
              const isSelected =
                formData.interests.includes(
                  interest
                );

              return (
                <button
                  type="button"
                  key={interest}
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleInterestChange(
                      interest
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {interest}
                </button>
              );
            })}

          </div>
        </fieldset>


        {/* Feedback */}

        {feedback.message && (
          <div
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}


        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
          )}

          {loading
            ? "Creating your trip..."
            : "Create Trip"}
        </button>

      </form>

    </div>
  );
}

export default CreateTripForm;