import { useState } from "react";

import CreateTripForm from "../components/CreateTripForm";
import TripsDashboard from "../components/TripsDashboard";

import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [refreshKey, setRefreshKey] =
    useState(0);

  const { user } = useAuth();

  // Trip create hone ke baad
  // dashboard refresh hoga
  const handleTripCreated = () => {
    setRefreshKey(
      (prev) => prev + 1
    );
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page Introduction */}

        <section className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            AI-powered travel planning
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back,{" "}
            {user?.name || "Traveler"}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Plan smarter trips with AI.
            Create personalized itineraries
            based on your destination,
            budget, dates, and interests.
          </p>

        </section>


        {/* Create Trip */}

        <section
          id="create-trip"
          className="scroll-mt-24"
        >
          <div className="flex justify-center">
            <CreateTripForm
              onTripCreated={
                handleTripCreated
              }
            />
          </div>
        </section>


        {/* Saved Trips */}

        <section
          id="trips"
          className="scroll-mt-24"
        >
          <TripsDashboard
            refreshKey={refreshKey}
          />
        </section>

      </div>
    </div>
  );
}

export default HomePage;