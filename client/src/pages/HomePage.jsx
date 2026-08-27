import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateTripForm from "../components/CreateTripForm";
import TripsDashboard from "../components/TripsDashboard";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();

  // Trip create hone ke baad dashboard refresh hoga
  const handleTripCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* ========================
            HEADER
        ======================== */}

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              SmartTrip AI ✈️
            </h1>

            <p className="mt-2 text-slate-600">
              Welcome, {user?.name || "Traveler"}
            </p>

            <p className="text-sm text-slate-500">
              Plan smarter. Travel better.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        {/* ========================
            CREATE TRIP FORM
        ======================== */}

        <div className="flex justify-center">
          <CreateTripForm
            onTripCreated={handleTripCreated}
          />
        </div>

        {/* ========================
            SAVED TRIPS
        ======================== */}

        <TripsDashboard
          refreshKey={refreshKey}
        />

      </div>
    </div>
  );
}

export default HomePage;