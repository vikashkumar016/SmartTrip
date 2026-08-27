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
  const [message, setMessage] = useState("");

  const interestOptions = [
    "Beach",
    "Food",
    "Adventure",
    "Nature",
    "Culture",
    "Shopping",
  ];

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Interest selection
  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);

      return {
        ...prev,

        interests: exists
          ? prev.interests.filter(
              (item) => item !== interest
            )
          : [...prev.interests, interest],
      };
    });
  };

  // Submit trip
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const data = await apiRequest(
        "/trips",
        {
          method: "POST",

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

      console.log(
        "Trip created:",
        data
      );

      setMessage(
        "Trip created successfully!"
      );

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
      console.error(
        "Create trip error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to create trip"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold text-slate-900">
        Plan Your Trip
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Destination */}

        <input
          type="text"
          name="destination"
          placeholder="Destination e.g. Goa"
          value={formData.destination}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />


        {/* Dates */}

        <div className="grid grid-cols-2 gap-4">

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />

        </div>


        {/* Budget + Travelers */}

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="rounded-lg border p-3"
            min="0"
            required
          />

          <input
            type="number"
            name="travelers"
            placeholder="Travelers"
            value={formData.travelers}
            onChange={handleChange}
            className="rounded-lg border p-3"
            min="1"
            required
          />

        </div>


        {/* Interests */}

        <div>

          <p className="mb-3 font-semibold">
            What are you interested in?
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
                      : "bg-white text-slate-800"
                  }`}
                >
                  {interest}
                </button>

              )
            )}

          </div>

        </div>


        {/* Submit */}

        <button
          type="submit"
          disabled={loading}

          className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Creating Trip..."
            : "Create Trip"}
        </button>


        {/* Message */}

        {message && (
          <p className="text-center font-medium">
            {message}
          </p>
        )}

      </form>

    </div>
  );
}

export default CreateTripForm;